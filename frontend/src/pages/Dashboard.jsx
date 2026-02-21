import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../hooks/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
    Users, 
    ShieldCheck, 
    History, 
    ArrowUpRight, 
    Plus,
    Activity,
    UserCircle,
    UserPlus,
    Cpu,
    Lock,
    Command,
    Zap,
    Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { user, hasPermission } = useAuthStore();
    const [stats, setStats] = useState({
        totalEmployees: 0,
        totalPermissions: 0,
        recentActions: []
    });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                let totalEmployees = 0;
                let recentActions = [];

                if (hasPermission('VIEW_EMPLOYEE')) {
                    try {
                        const empRes = await apiClient.get('/employees/');
                        totalEmployees = empRes.data.data.count || empRes.data.data.length || 0;
                    } catch (e) { console.warn("Employee fetch failed"); }
                }
                
                if (hasPermission('ASSIGN_PERMISSION')) {
                    try {
                        const auditRes = await apiClient.get('/audit/logs/');
                        recentActions = auditRes.data.data.slice(0, 8);
                    } catch (e) { console.warn("Audit log fetch failed"); }
                }
                
                setStats({
                    totalEmployees,
                    totalPermissions: user?.permissions?.length || 0,
                    recentActions
                });
            } catch (err) {
                console.error("Dashboard fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [user, hasPermission]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8 pb-12"
        >
            {/* Intelligence Hero Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-[#09090b] text-white p-8 md:p-12 shadow-2xl border border-white/5">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full -mr-64 -mt-64 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/10 blur-[100px] rounded-full -ml-32 -mb-32" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="space-y-6 max-w-xl text-center md:text-left">
                        <Badge className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-colors uppercase tracking-widest text-[10px] py-1 px-3">
                            Executive Intelligence Dashboard
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight italic">
                            PROTECTING YOUR <span className="text-primary underline decoration-primary/30">CORE.</span>
                        </h1>
                        <p className="text-white/60 text-lg md:text-xl font-medium leading-relaxed">
                            Welcome, {user?.first_name}. Your organization is currently operating with <span className="text-white font-bold">{stats.totalPermissions} active protocols</span> across all nodes.
                        </p>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <Link to="/audit-logs">
                                <Button className="h-12 px-8 bg-white text-black hover:bg-primary hover:text-white transition-all duration-300 font-bold rounded-2xl gap-2 shadow-xl shadow-white/5">
                                    <Zap size={18} fill="currentColor" />
                                    Security Audit
                                </Button>
                            </Link>
                            <Link to="/audit-logs">
                                <Button variant="outline" className="h-12 px-8 border-white/20 text-white hover:bg-white/10 transition-all font-bold rounded-2xl gap-2 backdrop-blur-md">
                                    <Command size={18} />
                                    View Reports
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="relative shrink-0 hidden lg:block">
                        {/* Custom SVG Health Visualization */}
                        <div className="relative h-64 w-64 flex items-center justify-center">
                            <svg className="h-full w-full rotate-[-90deg]">
                                <circle
                                    cx="128"
                                    cy="128"
                                    r="110"
                                    fill="transparent"
                                    stroke="rgba(255,255,255,0.05)"
                                    strokeWidth="12"
                                />
                                <motion.circle
                                    cx="128"
                                    cy="128"
                                    r="110"
                                    fill="transparent"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth="12"
                                    strokeDasharray="690"
                                    initial={{ strokeDashoffset: 690 }}
                                    animate={{ strokeDashoffset: 690 - (690 * 0.85) }}
                                    transition={{ duration: 2, ease: "easeOut" }}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                <span className="text-5xl font-black italic tracking-tighter">85%</span>
                                <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 mt-1">Health Score</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Active Nodes", value: stats.totalEmployees, icon: Users, color: "text-blue-400", bg: "bg-blue-400/5", desc: "+12.5% vs last month" },
                    { label: "Security Depth", value: stats.totalPermissions, icon: ShieldCheck, color: "text-purple-400", bg: "bg-purple-400/5", desc: "Granular control active" },
                    { label: "System Uptime", value: "99.9%", icon: Activity, color: "text-green-400", bg: "bg-green-400/5", desc: "No critical failures" },
                    { label: "Core Latency", value: "24ms", icon: Cpu, color: "text-orange-400", bg: "bg-orange-400/5", desc: "Real-time sync active" }
                ].map((stat, i) => (
                    <motion.div variants={itemVariants} key={i}>
                        <Card className="group relative border-border/40 bg-card/30 backdrop-blur-xl hover:bg-card/50 transition-all duration-500 overflow-hidden shadow-sm">
                            <div className={`absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform ${stat.color}`}>
                                <stat.icon size={64} />
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{stat.label}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black tracking-tighter">{stat.value}</div>
                                <div className="flex items-center gap-1.5 mt-2">
                                    <div className="h-4 w-4 rounded-full bg-secondary flex items-center justify-center">
                                        <div className={`h-1.5 w-1.5 rounded-full ${stat.color.replace('text', 'bg')}`} />
                                    </div>
                                    <span className="text-[10px] font-bold text-muted-foreground">{stat.desc}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Central Intelligence Hub */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-8">
                    {/* Access Command Center */}
                    <motion.div variants={itemVariants}>
                        <Card className="border-border/40 bg-card/30 backdrop-blur-xl overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 px-8 py-6">
                                <div>
                                    <CardTitle className="text-xl font-bold italic tracking-tight uppercase">Administrative Console</CardTitle>
                                    <CardDescription className="text-xs font-medium">L-9 Encrypted Session Active</CardDescription>
                                </div>
                                <div className="h-10 w-10 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground border border-border/50">
                                    <Command size={18} />
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {hasPermission('CREATE_EMPLOYEE') && (
                                    <Link to="/employees/new">
                                        <div className="group relative p-6 rounded-[2rem] border border-border/40 bg-background/50 hover:bg-primary hover:border-primary transition-all duration-500 cursor-pointer shadow-sm overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:translate-x-2 transition-transform">
                                                <UserPlus size={80} />
                                            </div>
                                            <div className="relative z-10 flex flex-col gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-colors">
                                                    <UserPlus size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-lg tracking-tight group-hover:text-white transition-colors uppercase">Onboard Node</h4>
                                                    <p className="text-xs text-muted-foreground group-hover:text-white/70 transition-colors mt-1 font-medium italic">Initialize new personnel security context.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )}
                                {hasPermission('ASSIGN_PERMISSION') && (
                                    <Link to="/permissions">
                                        <div className="group relative p-6 rounded-[2rem] border border-border/40 bg-background/50 hover:bg-purple-600 hover:border-purple-600 transition-all duration-500 cursor-pointer shadow-sm overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:translate-x-2 transition-transform text-purple-600 group-hover:text-white">
                                                <Lock size={80} />
                                            </div>
                                            <div className="relative z-10 flex flex-col gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center group-hover:bg-white group-hover:text-purple-600 transition-colors">
                                                    <Lock size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-lg tracking-tight group-hover:text-white transition-colors uppercase">Access Control</h4>
                                                    <p className="text-xs text-muted-foreground group-hover:text-white/70 transition-colors mt-1 font-medium italic">Execute granular permission reassignments.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Transaction Log Analysis */}
                    <motion.div variants={itemVariants}>
                        <Card className="border-border/40 shadow-2xl overflow-hidden bg-card/30 backdrop-blur-xl">
                            <CardHeader className="flex flex-row items-center justify-between px-8 py-6 border-b border-border/40">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                        <CardTitle className="text-xl font-black italic tracking-tighter uppercase shrink-0">Security Live Feed</CardTitle>
                                    </div>
                                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Monitored Transactions (UTC)</CardDescription>
                                </div>
                                <div className="flex bg-muted/50 p-1 rounded-xl border border-border/50">
                                    <button onClick={() => setActiveTab('all')} className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'all' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>All</button>
                                    <button onClick={() => setActiveTab('security')} className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'security' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>Security</button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-border/20">
                                    {loading ? (
                                        Array(6).fill(0).map((_, i) => (
                                            <div key={i} className="px-8 py-5 h-20 bg-muted/5 animate-pulse" />
                                        ))
                                    ) : stats.recentActions.length === 0 ? (
                                        <div className="p-20 text-center flex flex-col items-center">
                                            <History size={48} className="text-muted-foreground/10 mb-4" />
                                            <p className="text-sm font-bold text-muted-foreground/40 italic uppercase tracking-widest">Digital Silence</p>
                                        </div>
                                    ) : (
                                        stats.recentActions.map((log) => (
                                            <div key={log.id} className="group px-8 py-5 flex items-center gap-6 hover:bg-muted/30 transition-all cursor-pointer border-l-4 border-transparent hover:border-primary">
                                                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 border border-border/50 group-hover:scale-105 transition-transform ${log.action === 'PERMISSION_ASSIGNED' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                    {log.action === 'PERMISSION_ASSIGNED' ? <Zap size={20} /> : <Lock size={20} />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-black text-xs text-foreground uppercase tracking-tight leading-none">{log.action_display}</p>
                                                        <Badge variant="outline" className="text-[8px] py-0 h-4 border-border/50">{log.permission_code}</Badge>
                                                    </div>
                                                    <p className="text-[10px] font-medium text-muted-foreground mt-2 truncate italic">
                                                        TARGET: <span className="text-foreground/80 font-bold">{log.target_user_email}</span> • AGENT: {log.performed_by_email}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[10px] font-black font-mono text-muted-foreground/40 tracking-tighter group-hover:text-primary">
                                                        {format(new Date(log.timestamp), 'HH:mm:ss')}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="p-6 bg-muted/5 border-t border-border/40 flex justify-center">
                                    <Link to="/audit-logs" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:gap-4 transition-all">
                                        View Master Archive
                                        <ArrowUpRight size={14} />
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Profile Intelligence Panel */}
                <motion.div variants={itemVariants} className="space-y-8 h-full sticky top-24">
                    <Card className="border-border/40 bg-card/30 backdrop-blur-xl shadow-2xl h-full flex flex-col overflow-hidden">
                        <div className="h-32 bg-gradient-to-br from-primary via-purple-600 to-black relative">
                            <div className="absolute inset-0 bg-black/20" />
                        </div>
                        <CardContent className="relative px-8 -mt-16 flex-1 flex flex-col">
                            <div className="flex flex-col items-center mb-8">
                                <div className="h-32 w-32 rounded-[2.5rem] bg-card p-1 shadow-2xl mb-6 ring-4 ring-background">
                                    <div className="h-full w-full rounded-[2.2rem] bg-secondary overflow-hidden">
                                         <img
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                                            alt="avatar"
                                            className="h-full w-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                        />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black tracking-tighter italic">{user?.first_name} {user?.last_name}</h3>
                                <Badge variant="outline" className="mt-2 border-primary/30 text-primary bg-primary/5 uppercase font-black text-[9px] tracking-widest px-3">Master Principal</Badge>
                            </div>
                            
                            <div className="space-y-8 flex-1">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b border-border/50 pb-2">
                                        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground">Authorized Matrix</span>
                                        <span className="text-[9px] font-black text-primary uppercase">{user?.permissions?.length || 0} Modules</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {user?.permissions?.map((p, i) => (
                                            <span key={i} className="px-2.5 py-1 bg-secondary/80 text-foreground text-[9px] font-black uppercase rounded-lg border border-border/50 hover:border-primary/50 transition-colors shadow-sm">
                                                {p}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-6 rounded-[2rem] bg-[#09090b] text-white space-y-4 border border-white/5 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center">
                                                <ShieldCheck size={16} className="text-primary" />
                                            </div>
                                            <h5 className="text-[10px] font-black uppercase tracking-[0.2em]">Compliance Score</h5>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-xs font-bold italic">
                                                <span className="text-white/40">Encryption Verified</span>
                                                <span className="text-primary">100%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "85%" }}
                                                    transition={{ duration: 1.5, ease: "easeOut", delay: 1 }}
                                                    className="h-full bg-primary" 
                                                />
                                            </div>
                                        </div>
                                        <p className="text-[8px] text-white/30 mt-4 leading-relaxed font-bold tracking-wider italic uppercase">
                                            Account is shielded with Zero-Trust multi-layered biometric hashing protocols.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Link to="/settings" className="w-full">
                                <Button variant="ghost" className="mt-8 mb-4 w-full h-12 rounded-2xl border border-transparent hover:border-border hover:bg-secondary/50 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">
                                    <Settings size={14} className="mr-2" /> Security Settings
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
