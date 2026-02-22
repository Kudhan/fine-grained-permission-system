import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
    Fingerprint, 
    ShieldCheck, 
    Zap, 
    ChevronRight,
    Lock,
    Globe,
    Activity,
    Command,
    ArrowUpRight,
    ShieldAlert,
    Cpu,
    Eye,
    Server,
    Layers
} from 'lucide-react';
import { motion } from 'framer-motion';

/** 
 * PREMIUM LANDING PAGE - "THE LIGHT PROTOCOL"
 * This page is designed to be the "Apple/Stripe" of Security Systems.
 * It matches the "Executive" vibe of the dashboard but executed in a stunning light theme.
 * High-end animations, bento-grid layouts, and glassmorphism components.
 */
const LandingPage = () => {

    // Animation presets for consistency (Junior-friendly naming)
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
        }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.1 }
        }
    };

    return (
        <div className="light min-h-screen bg-[#fcfcfd] text-[#09090b] selection:bg-primary/10 selection:text-primary overflow-x-hidden font-sans">
            
            {/* 1. ULTRA-SLEEK NAVIGATION */}
            <nav className="fixed top-0 w-full z-[100] px-4 py-6">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white/70 backdrop-blur-2xl border border-slate-200/50 rounded-2xl md:rounded-3xl px-6 py-4 flex items-center justify-between shadow-2xl shadow-slate-200/30">
                        <div className="flex items-center gap-2.5">
                            <div className="bg-primary p-2 rounded-xl text-primary-foreground shadow-lg shadow-primary/20">
                                <Fingerprint size={18} className="fill-current" />
                            </div>
                            <span className="text-lg font-black tracking-tight italic uppercase">Fine-Grained PS</span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <Link to="/login">
                                <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 px-4">
                                    Sign In
                                </Button>
                            </Link>
                            <Link to="/signup">
                                <Button className="bg-slate-900 text-white hover:bg-primary transition-all duration-500 font-bold rounded-xl px-6 h-10 uppercase text-[10px] tracking-widest shadow-xl shadow-slate-200">
                                    Join Protocol
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 md:px-12 pt-40 pb-32">
                
                {/* 2. THE HERO SECTION - "THE CORE BANNER" */}
                <motion.section 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="relative"
                >
                    {/* Atmospheric Glows */}
                    <div className="absolute -top-40 -left-20 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
                    <div className="absolute top-20 -right-20 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

                    <div className="flex flex-col items-center text-center space-y-12">
                        <motion.div variants={fadeUp} className="space-y-6 max-w-4xl pt-10">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm mb-4">
                                <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                                Operational Identity Engine
                            </div>
                            
                            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] text-slate-900 uppercase">
                                ABSOLUTE <br />
                                <span className="text-primary italic">AUTHORITY</span>
                            </h1>
                            
                            <p className="text-slate-500 text-lg md:text-xl lg:text-2xl font-medium leading-relaxed max-w-2xl mx-auto pt-4 italic">
                                The gold standard for granular permission management. <br className="hidden md:block"/>
                                Built for precision. Validated for absolute security.
                            </p>
                        </motion.div>

                        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-6">
                            <Link to="/signup">
                                <Button size="lg" className="h-20 px-12 bg-slate-900 text-white hover:bg-primary transition-all duration-700 font-black rounded-full text-xl shadow-3xl shadow-slate-400 group relative overflow-hidden">
                                    <span className="relative z-10 flex items-center gap-3">
                                        INITIALIZE NOW <ChevronRight size={24} />
                                    </span>
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="ghost" size="lg" className="h-20 px-12 text-slate-500 hover:text-slate-900 font-black text-xl hover:bg-white/50 rounded-full transition-all">
                                    ENTER PORTAL
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </motion.section>

                {/* 3. THE BENTO GRID FEATURES */}
                <section className="mt-40 grid grid-cols-1 md:grid-cols-12 gap-6">
                    
                    {/* Feature 1: Large Banner (Mirroring Dashboard) */}
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeUp}
                        className="md:col-span-8 relative overflow-hidden rounded-[3rem] bg-[#09090b] text-white p-10 md:p-16 border border-white/5 shadow-3xl group"
                    >
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/20 blur-[100px] rounded-full -mr-32 -mt-32 opacity-50 group-hover:opacity-70 transition-opacity duration-1000" />
                        
                        <div className="relative z-10 h-full flex flex-col justify-between space-y-12">
                            <Badge className="w-fit bg-white/5 text-white border-white/10 text-[10px] font-black tracking-widest py-1.5 px-4 uppercase">Executive Vision</Badge>
                            
                            <div className="space-y-6">
                                <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-none">THE CORE ENGINE.</h2>
                                <p className="text-white/40 text-lg md:text-xl font-medium max-w-md italic">
                                    Every permission is a cryptographic contract. Total visibility, zero compromise.
                                </p>
                            </div>
                            
                            <div className="flex gap-10">
                                <div className="space-y-1">
                                    <p className="text-3xl font-black italic text-primary tracking-tighter">0.02ms</p>
                                    <p className="text-[10px] uppercase font-black text-white/20 tracking-widest">Logic Speed</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-3xl font-black italic text-white tracking-tighter">99.9%</p>
                                    <p className="text-[10px] uppercase font-black text-white/20 tracking-widest">Reliability</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Feature 2: Small Box */}
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeUp}
                        className="md:col-span-4 rounded-[3rem] bg-white border border-slate-200 p-10 flex flex-col justify-between shadow-xl shadow-slate-200/50 hover:border-primary/30 transition-all duration-500"
                    >
                        <div className="h-16 w-16 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 mb-8">
                            <Layers size={32} />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-3xl font-black italic tracking-tighter uppercase">Granular.</h3>
                            <p className="text-slate-400 text-sm font-bold italic uppercase tracking-wider leading-relaxed">
                                From API endpoints to UI buttons, control everything at an atomic level.
                            </p>
                        </div>
                    </motion.div>

                    {/* Feature 3: Small Box */}
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeUp}
                        className="md:col-span-4 rounded-[3rem] bg-white border border-slate-200 p-10 flex flex-col justify-between shadow-xl shadow-slate-200/50 hover:border-primary/30 transition-all duration-500"
                    >
                        <div className="h-16 w-16 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 mb-8">
                            <Server size={32} />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-3xl font-black italic tracking-tighter uppercase">Deployed.</h3>
                            <p className="text-slate-400 text-sm font-bold italic uppercase tracking-wider leading-relaxed">
                                Ready for Kubernetes, Docker, or Serverless. Your infrastructure, our rules.
                            </p>
                        </div>
                    </motion.div>

                    {/* Feature 4: Long Box */}
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeUp}
                        className="md:col-span-8 rounded-[3rem] bg-white border border-slate-200 p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 shadow-xl shadow-slate-200/50"
                    >
                        <div className="space-y-6 text-center md:text-left">
                            <h3 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase">Identity Vault.</h3>
                            <p className="text-slate-400 text-lg font-bold italic uppercase tracking-wider max-w-sm">
                                Secure storage for biometric seeds and principle credentials.
                            </p>
                        </div>
                        <div className="h-40 w-40 bg-slate-50 rounded-full border border-dashed border-slate-300 flex items-center justify-center">
                            <Fingerprint size={64} className="text-slate-200 animate-pulse" />
                        </div>
                    </motion.div>
                </section>

                {/* 4. THE LIVE AUDIT BANNER */}
                <section className="mt-40">
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        className="relative p-12 md:p-24 rounded-[4rem] bg-primary text-primary-foreground overflow-hidden shadow-3xl shadow-primary/20"
                    >
                        <div className="absolute top-0 left-0 w-full h-full bg-black/5 pointer-events-none" />
                        <div className="relative z-10 flex flex-col items-center text-center space-y-8">
                            <div className="h-20 w-20 rounded-[2rem] bg-white/10 flex items-center justify-center backdrop-blur-md">
                                <Activity size={40} className="animate-pulse" />
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none uppercase">THE SYSTEM IS WATCHING.</h2>
                            <p className="text-primary-foreground/70 text-lg md:text-xl font-bold italic uppercase tracking-widest max-w-2xl">
                                Real-time behavioral analysis and audit streams for every organizational movement. No shadow operations allowed.
                            </p>
                            <Link to="/signup">
                                <Button size="lg" className="h-20 px-12 bg-white text-primary hover:bg-slate-900 hover:text-white transition-all duration-500 font-black rounded-3xl text-xl shadow-2xl shadow-black/5">
                                    INITIALIZE GENESIS
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </section>
            </main>

            {/* 5. MINIMALIST FOOTER */}
            <footer className="py-32 px-6 border-t border-slate-100 bg-white">
                <div className="max-w-7xl mx-auto flex flex-col items-center space-y-12">
                    <div className="flex items-center gap-2.5">
                        <div className="bg-slate-100 p-3 rounded-2xl text-slate-300">
                            <Fingerprint size={24} />
                        </div>
                        <span className="text-xl font-black tracking-tighter italic uppercase text-slate-300">Fine-Grained PS</span>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-12">
                        {['Security', 'Architecture', 'Integrations', 'Portal', 'Genesis'].map((link) => (
                            <span key={link} className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 hover:text-primary transition-colors cursor-pointer">
                                {link}
                            </span>
                        ))}
                    </div>
                    
                    <p className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-200 italic">
                        &copy; 2026 Fine-Grained Permission System. All Rights Reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
