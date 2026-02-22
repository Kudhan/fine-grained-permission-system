import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuthStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';

// This is the functional component for the login screen
const LoginPage = () => {
    // These states store what the user types
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // We get tools from our authentication store
    const authStore = useAuthStore();
    
    // For moving between pages
    const navigate = useNavigate();

    // This runs when the form is submitted
    const handleLoginSubmit = async (event) => {
        // Stop the page from reloading
        event.preventDefault();
        
        console.log("Attempting login for:", email);
        
        // Call the login function from the store
        const loginResponse = await authStore.login(email, password);
        
        // If login was a success
        if (loginResponse.success === true) {
            console.log("Login success! Redirecting...");
            navigate('/dashboard');
        } else {
            console.log("Login failed!");
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
            {/* These are just pretty background blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />

            <div className="w-full max-w-md p-4 relative z-10 animate-in fade-in zoom-in duration-500">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-primary p-3 rounded-2xl text-primary-foreground shadow-xl shadow-primary/20 mb-4">
                        <Sparkles size={32} className="fill-current" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Fine-Grained PS</h1>
                    <p className="text-muted-foreground mt-2">Advanced Permission System</p>
                </div>

                <Card className="border-border/50 shadow-2xl backdrop-blur-sm bg-card/80">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
                        <CardDescription className="text-center">
                            Enter your credentials to access your dashboard
                        </CardDescription>
                    </CardHeader>
                    
                    <form onSubmit={handleLoginSubmit}>
                        <CardContent className="space-y-4">
                            {/* Show error if there is one */}
                            {authStore.error !== null ? (
                                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg flex items-center gap-2 border border-destructive/20 animate-in slide-in-from-top-2">
                                    <AlertCircle size={16} />
                                    {authStore.error}
                                </div>
                            ) : null}

                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Email Address
                                </label>
                                <Input 
                                    type="email" 
                                    placeholder="name@example.com" 
                                    value={email}
                                    onChange={function(e) { setEmail(e.target.value); }}
                                    required
                                    className="bg-background/50 border-border focus:ring-primary h-11"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">
                                        Password
                                    </label>
                                    <button type="button" className="text-xs text-primary hover:underline">
                                        Forgot password?
                                    </button>
                                </div>
                                <Input 
                                    type="password" 
                                    placeholder="••••••••" 
                                    value={password}
                                    onChange={function(e) { setPassword(e.target.value); }}
                                    required
                                    className="bg-background/50 border-border focus:ring-primary h-11"
                                />
                            </div>
                        </CardContent>
                        
                        <CardFooter className="flex flex-col space-y-4">
                            <Button type="submit" className="w-full h-11 font-semibold text-base transition-all active:scale-[0.98]" disabled={authStore.loading}>
                                {authStore.loading === true ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>
                            <p className="text-sm text-center text-muted-foreground">
                                Don't have an account?{' '}
                                <Link to="/signup" className="text-primary font-semibold hover:underline">
                                    Create one
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                </Card>

                <div className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground">
                    <span className="hover:text-foreground cursor-pointer transition-colors">Privacy Policy</span>
                    <span className="hover:text-foreground cursor-pointer transition-colors">Terms of Service</span>
                    <span className="hover:text-foreground cursor-pointer transition-colors">Contact Support</span>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
