import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuthStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Sparkles, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import apiClient from '../api/client';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: ''
    });
    const { login, loading, error } = useAuthStore();
    const [localError, setLocalError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');
        
        try {
            const response = await apiClient.post('auth/register/', formData);
            if (response.status === 201) {
                setSuccess(true);
                setTimeout(async () => {
                    const result = await login(formData.email, formData.password);
                    if (result.success) navigate('/dashboard');
                }, 1500);
            }
        } catch (err) {
            console.error("Registration error:", err);
            const data = err.response?.data;
            if (data) {
                // If it's a field error (like email already exists)
                const fieldErrors = Object.entries(data)
                    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                    .join(' | ');
                setLocalError(fieldErrors || 'Registration failed');
            } else if (err.request) {
                // Request was made but no response received (Network Error)
                setLocalError('Network error: Cannot reach the security server. Please check if the backend is running.');
            } else {
                setLocalError('An unexpected error occurred during registration.');
            }
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />

            <div className="w-full max-w-lg p-4 relative z-10 animate-in fade-in zoom-in duration-500">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-primary p-3 rounded-2xl text-primary-foreground shadow-xl shadow-primary/20 mb-4">
                        <Sparkles size={32} className="fill-current" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Fine-Grained PS</h1>
                    <p className="text-muted-foreground mt-2">Join the next generation of access control</p>
                </div>

                <Card className="border-border/50 shadow-2xl backdrop-blur-sm bg-card/80">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center">Create account</CardTitle>
                        <CardDescription className="text-center">
                            Enter your details to get started with Fine-Grained PS
                        </CardDescription>
                    </CardHeader>
                    {success ? (
                        <CardContent className="py-10 text-center flex flex-col items-center">
                            <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle2 size={32} />
                            </div>
                            <h2 className="text-xl font-bold">Registration Successful!</h2>
                            <p className="text-muted-foreground mt-2">Setting up your profile and redirecting...</p>
                        </CardContent>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-4">
                                {(localError || error) && (
                                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg flex items-center gap-2 border border-destructive/20">
                                        <AlertCircle size={16} />
                                        {localError || error}
                                    </div>
                                )}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">First Name</label>
                                        <Input 
                                            name="first_name"
                                            placeholder="John" 
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            required
                                            className="bg-background/50 h-10"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Last Name</label>
                                        <Input 
                                            name="last_name"
                                            placeholder="Doe" 
                                            value={formData.last_name}
                                            onChange={handleChange}
                                            required
                                            className="bg-background/50 h-10"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email Address</label>
                                    <Input 
                                        name="email"
                                        type="email" 
                                        placeholder="john@example.com" 
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="bg-background/50 h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Password</label>
                                    <Input 
                                        name="password"
                                        type="password" 
                                        placeholder="••••••••" 
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="bg-background/50 h-10"
                                    />
                                    <p className="text-[10px] text-muted-foreground">
                                        Must be at least 8 characters long with numbers and letters.
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col space-y-4">
                                <Button type="submit" className="w-full h-11 font-semibold text-base" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Joining...
                                        </>
                                    ) : (
                                        'Create Account'
                                    )}
                                </Button>
                                <p className="text-sm text-center text-muted-foreground">
                                    Already have an account?{' '}
                                    <Link to="/login" className="text-primary font-semibold hover:underline">
                                        Sign in
                                    </Link>
                                </p>
                            </CardFooter>
                        </form>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default SignupPage;
