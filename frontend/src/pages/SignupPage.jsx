import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, Loader2, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await register(
            formData.email,
            formData.password,
            formData.first_name,
            formData.last_name
        );

        if (!result.success) {
            setError(result.message);
            setLoading(false);
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-shubakar-secondary/5 rounded-full blur-[100px] -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-shubakar-primary/5 rounded-full blur-[100px] -ml-48 -mb-48"></div>

            <div className="max-w-md w-full animate-in zoom-in duration-700 relative z-10">
                <div className="glass-card p-10 md:p-12">
                    <div className="flex flex-col items-center mb-10 text-center">
                        <div className="bg-shubakar-primary p-4 rounded-[1.5rem] shadow-vibrant mb-6 ring-8 ring-shubakar-primary/10">
                            <Sparkles className="text-white" size={32} />
                        </div>
                        <h2 className="text-4xl font-black text-shubakar-text tracking-tighter italic">JOIN SHUBAKAR</h2>
                        <p className="text-shubakar-muted font-bold text-sm uppercase tracking-widest mt-2">Create Your Legacy Account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-50 border-2 border-red-100 p-4 rounded-2xl text-red-600 text-xs font-bold">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-shubakar-muted uppercase tracking-widest ml-2">First Name</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    className="block w-full px-5 py-4 bg-shubakar-softBg/50 border-2 border-transparent rounded-2xl focus:border-shubakar-primary/20 focus:bg-white outline-none transition-all font-bold text-shubakar-text text-sm"
                                    placeholder="John"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-shubakar-muted uppercase tracking-widest ml-2">Last Name</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    className="block w-full px-5 py-4 bg-shubakar-softBg/50 border-2 border-transparent rounded-2xl focus:border-shubakar-primary/20 focus:bg-white outline-none transition-all font-bold text-shubakar-text text-sm"
                                    placeholder="Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-shubakar-muted uppercase tracking-widest ml-2">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-shubakar-muted group-focus-within:text-shubakar-primary transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full pl-12 pr-4 py-4 bg-shubakar-softBg/50 border-2 border-transparent rounded-2xl focus:border-shubakar-primary/20 focus:bg-white outline-none transition-all font-bold text-shubakar-text"
                                    placeholder="you@shubakar.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-shubakar-muted uppercase tracking-widest ml-2">Password Choice</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-shubakar-muted group-focus-within:text-shubakar-primary transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full pl-12 pr-12 py-4 bg-shubakar-softBg/50 border-2 border-transparent rounded-2xl focus:border-shubakar-primary/20 focus:bg-white outline-none transition-all font-bold text-shubakar-text"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-shubakar-muted hover:text-shubakar-primary"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-vibrant py-4 text-base tracking-tight flex items-center justify-center gap-2 group mt-4"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    Initialize Principal Identity
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-xs font-bold text-shubakar-muted">
                            Already a verified principal?
                            <Link to="/login" className="text-shubakar-secondary ml-2 font-black hover:text-shubakar-primary transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
