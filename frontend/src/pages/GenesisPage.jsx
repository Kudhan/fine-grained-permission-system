import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { ShieldAlert, Zap, Lock, Terminal, Loader2, Sparkles, Database } from 'lucide-react';
import apiClient from '../api/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const GenesisPage = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: ''
    });
    const navigate = useNavigate();

    const handleGenesis = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await apiClient.post('/auth/genesis/', formData);
            toast.success(response.data.message);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            toast.error(err.response?.data?.message || "Genesis protocol failed. System might already be initialized.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="light min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-6 selection:bg-primary/10">
            {/* Soft Background Pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:30px_30px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full" />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-lg relative z-10"
            >
                <div className="mb-10 text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                        <ShieldAlert size={14} className="text-primary" /> Initial System Provisioning
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight text-slate-900">
                        System <span className="text-primary">Genesis</span>
                    </h1>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                        Master principal identity establishment
                    </p>
                </div>

                <Card className="bg-white border-slate-200 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden border-t-4 border-t-primary">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl font-black uppercase tracking-tight text-slate-800">Root Authority</CardTitle>
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-black text-[9px] px-3">L-9 ACCESS</Badge>
                        </div>
                        <CardDescription className="text-xs font-medium text-slate-400 mt-1">
                            Granting comprehensive structural authority.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="p-8">
                        <form onSubmit={handleGenesis} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">First Name</label>
                                    <Input 
                                        placeholder="Principal"
                                        className="bg-slate-50 border-slate-200 h-12 focus:border-primary focus:ring-4 focus:ring-primary/5 text-sm font-bold transition-all rounded-xl"
                                        value={formData.first_name}
                                        onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Last Name</label>
                                    <Input 
                                        placeholder="Authority"
                                        className="bg-slate-50 border-slate-200 h-12 focus:border-primary focus:ring-4 focus:ring-primary/5 text-sm font-bold transition-all rounded-xl"
                                        value={formData.last_name}
                                        onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Root Email</label>
                                <div className="relative">
                                    <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <Input 
                                        type="email"
                                        placeholder="admin@system.io"
                                        className="bg-slate-50 border-slate-200 h-12 pl-12 focus:border-primary focus:ring-4 focus:ring-primary/5 text-sm font-bold transition-all rounded-xl"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Authority Key</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <Input 
                                        type="password"
                                        placeholder="••••••••••••"
                                        className="bg-slate-50 border-slate-200 h-12 pl-12 focus:border-primary focus:ring-4 focus:ring-primary/5 text-sm font-bold transition-all rounded-xl"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button 
                                    className="w-full h-14 bg-primary text-white hover:bg-slate-900 transition-all duration-300 font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20 rounded-2xl md:rounded-[2rem] gap-3"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>
                                            <Zap size={18} fill="currentColor" />
                                            Initialize Core
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>

                    <div className="bg-slate-50/80 border-t border-slate-100 p-6 flex items-center justify-center gap-8">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Vault Ready</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Schema Valid</span>
                        </div>
                    </div>
                </Card>

                <p className="text-center mt-8 text-slate-400 text-[10px] font-bold uppercase tracking-[0.1em] italic">
                    Security Policy: This route will be permanently locked after first usage.
                </p>
            </motion.div>
        </div>
    );
};

export default GenesisPage;
