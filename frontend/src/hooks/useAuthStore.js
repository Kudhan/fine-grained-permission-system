import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

// We define our store for authentication here
export const useAuthStore = create()(
  persist(
    (set, get) => ({
      // This holds the user data
      user: null,
      // This is for the loading spinner
      loading: false,
      // This is for showing errors
      error: null,
      // Current theme
      theme: 'dark',
      
      // Function to login
      login: async (email, password) => {
        // Start loading
        set({ loading: true });
        set({ error: null });
        
        try {
          // We call the login API
          const response = await axios.post('http://localhost:8000/auth/login/', { 
            email: email, 
            password: password 
          });
          
          // If okay, we get tokens
          const accessToken = response.data.access;
          const refreshToken = response.data.refresh;
          
          // Store them in local storage
          localStorage.setItem('access_token', accessToken);
          localStorage.setItem('refresh_token', refreshToken);
          
          // Now fetch the user data
          const meResponse = await axios.get('http://localhost:8000/auth/me/', {
            headers: {
              'Authorization': 'Bearer ' + accessToken
            }
          });
          
          // Save user to state
          if (meResponse.data.success === true) {
            set({ user: meResponse.data.data });
          }
          
          set({ loading: false });
          return { success: true };
          
        } catch (err) {
          // If error happens
          console.log("Login error visible in console:", err);
          let errorMsg = "Invalid credentials";
          if (err.response && err.response.data && err.response.data.detail) {
            errorMsg = err.response.data.detail;
          }
          set({ error: errorMsg, loading: false });
          return { success: false, message: errorMsg };
        }
      },
      
      // Function to get current user data
      fetchMe: async () => {
        set({ loading: true });
        const token = localStorage.getItem('access_token');
        
        if (!token) {
          set({ user: null, loading: false });
          return;
        }
        
        try {
          const response = await axios.get('http://localhost:8000/auth/me/', {
            headers: {
              'Authorization': 'Bearer ' + token
            }
          });
          
          if (response.data.success === true) {
            set({ user: response.data.data, loading: false });
          } else {
            set({ user: null, loading: false });
          }
        } catch (error) {
          console.log("Fetch user error:", error);
          set({ user: null, loading: false });
        }
      },
      
      // Function for logout
      logout: () => {
        // Clear everything
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        set({ user: null });
      },
      
      // Function for updating profile
      updateProfile: async (data) => {
        set({ loading: true });
        const token = localStorage.getItem('access_token');
        
        try {
          const response = await axios.patch('http://localhost:8000/auth/me/', data, {
            headers: {
              'Authorization': 'Bearer ' + token
            }
          });
          
          if (response.data.success === true) {
            // Updated successfully, now refresh the data
            const refreshResponse = await axios.get('http://localhost:8000/auth/me/', {
              headers: {
                'Authorization': 'Bearer ' + token
              }
            });
            set({ user: refreshResponse.data.data, loading: false });
            return { success: true };
          } else {
            set({ loading: false });
            return { success: false, message: response.data.message };
          }
        } catch (error) {
          set({ loading: false });
          return { success: false, message: "Update failed" };
        }
      },
      
      // Change the theme
      setTheme: (newTheme) => {
        set({ theme: newTheme });
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      
      // Helper to check if user has a permission
      hasPermission: (permCode) => {
        const currentUser = get().user;
        if (!currentUser) {
          return false;
        }
        
        const perms = currentUser.permissions;
        if (!perms) {
          return false;
        }
        
        // Loop through permissions to find the code
        for (let i = 0; i < perms.length; i++) {
          if (perms[i] === permCode) {
            return true;
          }
        }
        return false;
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        theme: state.theme 
      }),
    }
  )
)
