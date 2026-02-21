import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import apiClient from '../api/client'

export const useAuthStore = create()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,
      
      login: async (email, password) => {
        set({ loading: true, error: null })
        try {
          const response = await apiClient.post('/auth/login/', { email, password })
          localStorage.setItem('access_token', response.data.access)
          localStorage.setItem('refresh_token', response.data.refresh)
          
          await get().fetchMe()
          return { success: true }
        } catch (error) {
          const message = error.response?.data?.detail || 'Invalid credentials'
          set({ error: message, loading: false })
          return { success: false, message }
        }
      },
      
      fetchMe: async () => {
        set({ loading: true })
        try {
          const response = await apiClient.get('/auth/me/')
          if (response.data.success) {
            set({ user: response.data.data, loading: false })
          } else {
            set({ user: null, loading: false })
          }
        } catch (error) {
          set({ user: null, loading: false })
        }
      },
      
      logout: () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        set({ user: null })
      },
      
      hasPermission: (code) => {
        const user = get().user
        return user?.permissions?.includes(code)
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
)
