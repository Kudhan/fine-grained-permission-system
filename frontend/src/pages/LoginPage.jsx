import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Loader2, Box, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);
        if (!result.success) {
            setError(result.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
            <div className="max-w-md w-full animate-in zoom-in duration-500">
                <div className="bg-white rounded-[2rem] shadow-premium border border-brand-border p-10 relative overflow-hidden">
                    {/* Decorative element */}
                    <div className="absolute -top-12 -right-12 w-40 h-40 bg-brand-accent/5 rounded-full blur-2xl"></div>
                    <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-brand-header/5 rounded-full blur-2xl"></div>

                    <div className="relative z-10">
                        <div className="flex flex-col items-center mb-10">
                            <div className="bg-brand-header p-4 rounded-2xl shadow-lg mb-4 ring-4 ring-brand-header/10">
                                <Box className="text-brand-accent" size={32} />
                            </div>
                            <h2 className="text-3xl font-extrabold text-brand-header tracking-tight">Dashee</h2>
                            <p className="text-slate-400 font-medium mt-1">Sign in to your admin portal</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg text-red-700 text-sm font-medium animate-in slide-in-from-top-2 duration-300">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-accent transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-brand-border rounded-xl focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent focus:bg-white outline-none transition-all font-medium text-slate-700 shadow-sm"
                                        placeholder="admin@saas.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-1 leading-none">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                                    <button type="button" className="text-[10px] font-bold text-brand-accent uppercase tracking-widest hover:text-brand-header transition-colors">Forgot Password?</button>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-accent transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-brand-border rounded-xl focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent focus:bg-white outline-none transition-all font-medium text-slate-700 shadow-sm"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary h-14 text-base font-bold tracking-tight shadow-md flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Log In to Dashboard'}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-xs text-slate-400 font-medium">
                                Testing? Use <span className="text-slate-600 font-bold">Admin123!</span>
                            </p>
                        </div>
                    </div>
                </div>

                <p className="mt-8 text-center text-sm text-slate-400 font-medium">
                    &copy; 2024 Dashee Inc. Built with AI Excellence.
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
