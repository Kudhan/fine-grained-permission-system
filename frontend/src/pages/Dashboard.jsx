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
    Settings,
    Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

// This is the dashboard page for our application
const Dashboard = () => {
    // Get user and hasPermission tool from the auth store
    const authObject = useAuthStore();
    const user = authObject.user;
    
    // State to hold our statistics numbers
    const [employeeCount, setEmployeeCount] = useState(0);
    const [permCount, setPermCount] = useState(0);
    const [logActions, setLogActions] = useState([]);
    
    // Loading state for things on dashboard
    const [isDataLoading, setIsDataLoading] = useState(true);
    // Tab state
    const [tabName, setTabName] = useState('all');

    // Fetch data for the dashboard when the component starts
    const getDashboardInfo = async () => {
        setIsDataLoading(true);
        const myToken = localStorage.getItem('access_token');
        
        try {
            // 1. Fetch employee count if we are allowed
            const canSeeEmployees = authObject.hasPermission('VIEW_EMPLOYEE');
            if (canSeeEmployees === true) {
                try {
                    const empResponse = await axios.get('http://localhost:8000/employees/', {
                        headers: { 'Authorization': 'Bearer ' + myToken }
                    });
                    // We check common response structures
                    if (empResponse.data && empResponse.data.data) {
                        const count = empResponse.data.data.count || empResponse.data.data.length || 0;
                        setEmployeeCount(count);
                    }
                } catch (e1) {
                    console.warn("Could not load employees for dashboard stats");
                }
            }
            
            // 2. Fetch logs if we are admin
            const isManager = authObject.hasPermission('ASSIGN_PERMISSION');
            if (isManager === true) {
                try {
                    const auditResponse = await axios.get('http://localhost:8000/audit/logs/', {
                        headers: { 'Authorization': 'Bearer ' + myToken }
                    });
                    if (auditResponse.data && auditResponse.data.data) {
                        const firstEight = auditResponse.data.data.slice(0, 8);
                        setLogActions(firstEight);
                    }
                } catch (e2) {
                    console.warn("Could not load audit logs for dashboard");
                }
            }
            
            // 3. Set permission count from our local user object
            if (user && user.permissions) {
                setPermCount(user.permissions.length);
            } else {
                setPermCount(0);
            }
            
        } catch (error) {
            console.error("Critical error fetching dashboard:", error);
        }
        
        // Always stop loading at the end
        setIsDataLoading(false);
    }

    // Call the function when user changes or page loads
    useEffect(() => {
        getDashboardInfo();
    }, [user]);

    // These are for the entrance animations
    const mainBoxVariant = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const smallBoxVariant = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={mainBoxVariant}
            className="space-y-8 pb-12"
        >
            {/* The big header banner */}
            <div className="relative overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] bg-[#09090b] text-white p-6 md:p-12 shadow-2xl border border-white/5">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full -mr-64 -mt-64 opacity-50" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start lg:items-center justify-between gap-8 md:gap-12">
                    <div className="space-y-4 md:space-y-6 max-w-xl text-center md:text-left">
                        <Badge className="bg-white/10 text-white border-white/20 uppercase tracking-widest text-[8px] md:text-[10px] py-1 px-3">
                            Executive Intelligence Dashboard
                        </Badge>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-tight italic">
                            PROTECTING YOUR <span className="text-primary underline decoration-primary/30">CORE.</span>
                        </h1>
                        <p className="text-white/60 text-base md:text-lg lg:text-xl font-medium leading-relaxed">
                            Hello, {user ? user.first_name : 'User'}. You have <span className="text-white font-bold">{permCount} permissions</span> active.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-2">
                            <Link to="/audit-logs" className="w-full sm:w-auto">
                                <Button className="w-full sm:w-auto h-11 md:h-12 px-8 bg-white text-black hover:bg-primary hover:text-white transition-all duration-300 font-bold rounded-xl md:rounded-2xl gap-2 shadow-xl shadow-white/5">
                                    <Zap size={18} fill="currentColor" />
                                    Security Audit
                                </Button>
                            </Link>
                            <Link to="/audit-logs" className="w-full sm:w-auto">
                                <Button variant="outline" className="w-full sm:w-auto h-11 md:h-12 px-8 border-white/20 text-blue hover:bg-white/10 transition-all font-bold rounded-xl md:rounded-2xl gap-2 backdrop-blur-md">
                                    <Command size={18} />
                                    Reports
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="relative shrink-0 hidden lg:block">
                        <div className="relative h-48 w-48 md:h-64 md:w-64 flex items-center justify-center">
                            <svg className="h-full w-full rotate-[-90deg]">
                                <circle cx="128" cy="128" r="110" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                                <motion.circle
                                    cx="128" cy="128" r="110" fill="transparent" stroke="hsl(var(--primary))" strokeWidth="12" strokeDasharray="690"
                                    initial={{ strokeDashoffset: 690 }}
                                    animate={{ strokeDashoffset: 690 - (690 * 0.85) }}
                                    transition={{ duration: 2, ease: "easeOut" }}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                <span className="text-4xl md:text-5xl font-black italic tracking-tighter">85%</span>
                                <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 mt-1">Health Score</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Individual stat boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Employees Stat */}
                <motion.div variants={smallBoxVariant}>
                    <Card className="group relative border-border/40 bg-card/30 backdrop-blur-xl hover:bg-card/50 transition-all duration-500 overflow-hidden shadow-sm">
                        <div className="absolute top-0 right-0 p-6 opacity-5 text-blue-400"><Users size={64} /></div>
                        <CardHeader className="pb-2"><CardTitle className="text-[10px] font-black uppercase text-muted-foreground/60">Active Nodes</CardTitle></CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black tracking-tighter">{employeeCount}</div>
                            <p className="text-[10px] font-bold text-muted-foreground mt-2">Active personnel listed</p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Permissions Stat */}
                <motion.div variants={smallBoxVariant}>
                    <Card className="group relative border-border/40 bg-card/30 backdrop-blur-xl hover:bg-card/50 transition-all duration-500 overflow-hidden shadow-sm">
                        <div className="absolute top-0 right-0 p-6 opacity-5 text-purple-400"><ShieldCheck size={64} /></div>
                        <CardHeader className="pb-2"><CardTitle className="text-[10px] font-black uppercase text-muted-foreground/60">Security Depth</CardTitle></CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black tracking-tighter">{permCount}</div>
                            <p className="text-[10px] font-bold text-muted-foreground mt-2">Your current access level</p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Uptime Stat */}
                <motion.div variants={smallBoxVariant}>
                    <Card className="group relative border-border/40 bg-card/30 backdrop-blur-xl hover:bg-card/50 transition-all duration-500 overflow-hidden shadow-sm">
                        <div className="absolute top-0 right-0 p-6 opacity-5 text-green-400"><Activity size={64} /></div>
                        <CardHeader className="pb-2"><CardTitle className="text-[10px] font-black uppercase text-muted-foreground/60">System Uptime</CardTitle></CardHeader>
                        <CardContent><div className="text-3xl font-black tracking-tighter">99.9%</div><p className="text-[10px] font-bold text-muted-foreground mt-2">Operational stability</p></CardContent>
                    </Card>
                </motion.div>

                {/* Latency Stat */}
                <motion.div variants={smallBoxVariant}>
                    <Card className="group relative border-border/40 bg-card/30 backdrop-blur-xl hover:bg-card/50 transition-all duration-500 overflow-hidden shadow-sm">
                        <div className="absolute top-0 right-0 p-6 opacity-5 text-orange-400"><Cpu size={64} /></div>
                        <CardHeader className="pb-2"><CardTitle className="text-[10px] font-black uppercase text-muted-foreground/60">Core Latency</CardTitle></CardHeader>
                        <CardContent><div className="text-3xl font-black tracking-tighter">24ms</div><p className="text-[10px] font-bold text-muted-foreground mt-2">Network response speed</p></CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Main center section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-8">
                    {/* Console links */}
                    <motion.div variants={smallBoxVariant}>
                        <Card className="border-border/40 bg-card/30 backdrop-blur-xl overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 px-8 py-6">
                                <div>
                                    <CardTitle className="text-xl font-bold italic uppercase tracking-tight">Administrative Console</CardTitle>
                                    <CardDescription className="text-xs font-medium">Manage organization functions</CardDescription>
                                </div>
                                <div className="h-10 w-10 rounded-2xl bg-secondary flex items-center justify-center border border-border/50"><Command size={18} /></div>
                            </CardHeader>
                            <CardContent className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {authObject.hasPermission('CREATE_EMPLOYEE') === true ? (
                                    <Link to="/employees/new">
                                        <div className="group relative p-6 rounded-[2rem] border border-border/40 bg-background/50 hover:bg-primary transition-all duration-500 cursor-pointer overflow-hidden shadow-sm">
                                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:translate-x-2 transition-transform"><UserPlus size={80} /></div>
                                            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-white transition-colors"><UserPlus size={24} /></div>
                                            <h4 className="font-bold text-lg mt-4 group-hover:text-white transition-colors uppercase">Onboard Node</h4>
                                        </div>
                                    </Link>
                                ) : null}
                                {authObject.hasPermission('ASSIGN_PERMISSION') === true ? (
                                    <Link to="/permissions">
                                        <div className="group relative p-6 rounded-[2rem] border border-border/40 bg-background/50 hover:bg-purple-600 transition-all duration-500 cursor-pointer overflow-hidden shadow-sm">
                                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:translate-x-2 transition-transform text-white"><Lock size={80} /></div>
                                            <div className="h-12 w-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center group-hover:bg-white transition-colors"><Lock size={24} /></div>
                                            <h4 className="font-bold text-lg mt-4 group-hover:text-white transition-colors uppercase">Access Control</h4>
                                        </div>
                                    </Link>
                                ) : null}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* The Live log list */}
                    <motion.div variants={smallBoxVariant}>
                        <Card className="border-border/40 shadow-2xl overflow-hidden bg-card/30 backdrop-blur-xl">
                            <CardHeader className="flex flex-row items-center justify-between px-8 py-6 border-b border-border/40">
                                <CardTitle className="text-xl font-black italic tracking-tighter uppercase shrink-0">Security Live Feed</CardTitle>
                                <div className="flex bg-muted/50 p-1 rounded-xl border border-border/50">
                                    <button onClick={() => setTabName('all')} className={`px-3 py-1 text-[10px] font-bold uppercase rounded-lg ${tabName === 'all' ? 'bg-background text-primary' : 'text-muted-foreground'}`}>All</button>
                                    <button onClick={() => setTabName('security')} className={`px-3 py-1 text-[10px] font-bold uppercase rounded-lg ${tabName === 'security' ? 'bg-background text-primary' : 'text-muted-foreground'}`}>Security</button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-border/20">
                                    {isDataLoading === true ? (
                                        <div className="p-10 text-center flex justify-center"><Loader2 className="animate-spin text-primary" /></div>
                                    ) : logActions.length === 0 ? (
                                        <div className="p-10 text-center"><p className="text-sm font-bold text-muted-foreground/40 italic uppercase">Digital Silence</p></div>
                                    ) : (
                                        logActions.map(function(item) {
                                            return (
                                                <div key={item.id} className="group px-8 py-5 flex items-center gap-6 hover:bg-muted/30 transition-all cursor-pointer border-l-4 border-transparent hover:border-primary">
                                                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 border border-border/50 group-hover:scale-105 transition-transform ${item.action === 'PERMISSION_ASSIGNED' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                        {item.action === 'PERMISSION_ASSIGNED' ? <Zap size={20} /> : <Lock size={20} />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-black text-xs text-foreground uppercase truncate">{item.action_display}</p>
                                                            <Badge variant="outline" className="text-[8px] h-4">{item.permission_code}</Badge>
                                                        </div>
                                                        <p className="text-[10px] font-medium text-muted-foreground mt-1 truncate italic">TARGET: {item.target_user_email}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-[10px] font-black font-mono text-muted-foreground/40">{format(new Date(item.timestamp), 'HH:mm')}</span>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Profile side box */}
                <motion.div variants={smallBoxVariant} className="space-y-8">
                    <Card className="border-border/40 bg-card/30 backdrop-blur-xl shadow-2xl overflow-hidden">
                        <div className="h-32 bg-gradient-to-br from-primary via-purple-600 to-black relative" />
                        <CardContent className="relative px-8 -mt-16 flex flex-col items-center">
                            <Link to="/profile" className="flex flex-col items-center mb-8 group/profile">
                                <div className="h-32 w-32 rounded-[2.5rem] bg-card p-1 shadow-2xl mb-6 ring-4 ring-background group-hover/profile:ring-primary/20 transition-all">
                                    <div className="h-full w-full rounded-[2.2rem] bg-secondary overflow-hidden">
                                         <img
                                            src={user && user.avatar_seed && user.avatar_seed.includes('-')
                                                ? "https://api.dicebear.com/7.x/" + user.avatar_seed.split('-')[0] + "/svg?seed=" + user.avatar_seed.split('-')[1]
                                                : "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (user ? user.email : 'default')
                                            }
                                            alt="user avatar"
                                            className="h-full w-full object-cover grayscale group-hover/profile:grayscale-0 transition-all duration-700"
                                        />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black tracking-tighter italic">{user ? user.first_name : ''} {user ? user.last_name : ''}</h3>
                                <Badge variant="outline" className="mt-2 border-primary/30 text-primary uppercase font-black text-[9px]">Master Principal</Badge>
                            </Link>
                            
                            <div className="w-full space-y-6">
                                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                                    <span className="text-[9px] font-black uppercase text-muted-foreground">My Matrix</span>
                                    <span className="text-[9px] font-black text-primary uppercase">{permCount} Modules</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {user && user.permissions ? user.permissions.map(function(p, i) {
                                        return (
                                            <span key={i} className="px-2.5 py-1 bg-secondary/80 text-foreground text-[9px] font-black uppercase rounded-lg border border-border/50">
                                                {p}
                                            </span>
                                        );
                                    }) : null}
                                </div>
                                
                                <div className="p-6 rounded-[2rem] bg-[#09090b] text-white space-y-4 border border-white/5 relative overflow-hidden group">
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-2">
                                            <ShieldCheck size={16} className="text-primary" />
                                            <h5 className="text-[10px] font-black uppercase">Compliance</h5>
                                        </div>
                                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary" style={{ width: '85%' }} />
                                        </div>
                                        <p className="text-[8px] text-white/30 mt-4 leading-relaxed font-bold italic uppercase tracking-wider">
                                            Protected with Zero-Trust hashing.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <Link to="/settings" className="w-full">
                                <Button variant="ghost" className="mt-8 mb-4 w-full h-12 rounded-2xl text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground">
                                    <Settings size={14} className="mr-2" /> Settings
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
