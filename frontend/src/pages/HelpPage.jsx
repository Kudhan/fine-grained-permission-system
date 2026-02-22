import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { 
    HelpCircle, 
    BookOpen, 
    ShieldCheck, 
    Terminal, 
    Activity, 
    Search,
    ChevronRight,
    Lock,
    Users,
    Zap,
    Cpu,
    ArrowRight,
    Code2,
    Database,
    Fingerprint
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const HelpPage = () => {
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BookOpen },
        { id: 'permissions', label: 'Permission Matrix', icon: Lock },
        { id: 'security', label: 'Security Protocols', icon: ShieldCheck },
        { id: 'api', label: 'API Reference', icon: Terminal },
    ];

    const containerVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <div className="space-y-10 pb-20 overflow-hidden">
            {/* Glossy Header */}
            <div className="relative p-8 md:p-12 rounded-[2.5rem] bg-[#09090b] text-white border border-white/5 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/20 blur-[120px] rounded-full -mr-48 -mt-48" />
                <div className="relative z-10 space-y-4 max-w-2xl">
                    <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10 uppercase tracking-[0.2em] text-[10px] py-1 px-4">
                        Knowledge Repository v2.0
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic">
                        SYSTEM <span className="text-primary">INTELLIGENCE</span> DOCS
                    </h1>
                    <p className="text-white/50 text-lg md:text-xl font-medium leading-relaxed italic">
                        Deep-dive into the fine-grained permission architecture and security protocols governing your organization.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Navigation Sidebar */}
                <Card className="lg:col-span-3 border-border/40 bg-card/30 backdrop-blur-xl sticky top-24">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Documentation Hub</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2 space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black transition-all duration-300 ${
                                    activeTab === tab.id 
                                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]' 
                                    : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                                }`}
                            >
                                <tab.icon size={18} />
                                <span className="uppercase tracking-tight">{tab.label}</span>
                                {activeTab === tab.id && <ChevronRight size={16} className="ml-auto" />}
                            </button>
                        ))}
                    </CardContent>
                </Card>

                {/* Content Area */}
                <div className="lg:col-span-9">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === 'overview' && (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Card className="border-border/40 bg-card/30 backdrop-blur-xl transition-all hover:border-primary/50 group">
                                            <CardContent className="pt-6">
                                                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                                    <Cpu size={24} />
                                                </div>
                                                <h3 className="text-xl font-black italic uppercase tracking-tight mb-2">Architecture</h3>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    Built on a Decoupled **React 18** and **Django REST Framework** foundation, utilizing **PostgreSQL** for high-integrity data persistence.
                                                </p>
                                            </CardContent>
                                        </Card>
                                        <Card className="border-border/40 bg-card/30 backdrop-blur-xl transition-all hover:border-blue-500/50 group">
                                            <CardContent className="pt-6">
                                                <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                                    <Fingerprint size={24} />
                                                </div>
                                                <h3 className="text-xl font-black italic uppercase tracking-tight mb-2">Security Hub</h3>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    Stateless **JWT Authentication** paired with multi-layered RBAC for granular access control at the object level.
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <Card className="border-border/40 bg-[#09090b] text-white overflow-hidden group">
                                        <CardHeader className="border-b border-white/5 pb-6">
                                            <CardTitle className="text-2xl font-black italic uppercase tracking-tighter">Getting Started</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-8 space-y-6">
                                            <div className="flex gap-6 items-start">
                                                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center font-bold italic shrink-0">01</div>
                                                <div className="space-y-2">
                                                    <h4 className="font-black uppercase tracking-tight text-primary">Identity Initialization</h4>
                                                    <p className="text-sm text-white/50 leading-relaxed italic">Register a new identity through the portal. Your initial configuration inherits default personnel traits.</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-6 items-start">
                                                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center font-bold italic shrink-0">02</div>
                                                <div className="space-y-2">
                                                    <h4 className="font-black uppercase tracking-tight text-primary">Permission Evaluation</h4>
                                                    <p className="text-sm text-white/50 leading-relaxed italic">Access the Management Matrix to view your assigned modules. Permissions are evaluated in real-time during every system transaction.</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-6 items-start">
                                                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center font-bold italic shrink-0">03</div>
                                                <div className="space-y-2">
                                                    <h4 className="font-black uppercase tracking-tight text-primary">Resource Management</h4>
                                                    <p className="text-sm text-white/50 leading-relaxed italic">Interact with nodes, audits, and settings depending on your current security clearance level (L1 - L4).</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {activeTab === 'permissions' && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-black italic uppercase tracking-tight">Active Function Matrix</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { code: 'VIEW_EMPLOYEE', desc: 'Read-only access to personnel database.' },
                                            { code: 'CREATE_EMPLOYEE', desc: 'Initialize new employee records.' },
                                            { code: 'EDIT_EMPLOYEE', desc: 'Modify existing personnel metadata.' },
                                            { code: 'DELETE_EMPLOYEE', desc: 'Permanent retrieval of personnel nodes.', danger: true },
                                            { code: 'ASSIGN_PERMISSION', desc: 'Execute management of the security matrix for other users.', admin: true },
                                            { code: 'VIEW_SELF', desc: 'Access to personal identity and configuration.' },
                                        ].map((perm, i) => (
                                            <Card key={i} className={`border-border/40 bg-card/30 backdrop-blur-xl hover:scale-[1.02] transition-all cursor-default ${perm.danger ? 'hover:border-red-500/50' : perm.admin ? 'hover:border-purple-500/50' : 'hover:border-primary/50'}`}>
                                                <CardContent className="pt-6">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <Badge className={`${perm.danger ? 'bg-red-500' : perm.admin ? 'bg-purple-600' : 'bg-primary'} text-white font-black text-[10px] tracking-widest`}>
                                                            {perm.code}
                                                        </Badge>
                                                        {perm.admin && <Lock size={14} className="text-muted-foreground/40" />}
                                                    </div>
                                                    <p className="text-xs font-bold text-muted-foreground italic leading-relaxed">{perm.desc}</p>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                    <div className="p-6 rounded-2xl bg-secondary/30 border border-border/50">
                                        <p className="text-xs text-muted-foreground italic font-medium">
                                            **Note:** Permissions are additive. If a user has both `EDIT_EMPLOYEE` and `VIEW_EMPLOYEE`, they possess full modification capabilities alongside list visibility.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <Card className="border-border/40 bg-card/30 backdrop-blur-xl">
                                    <CardHeader className="bg-muted/10 pb-6 border-b border-border/40">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center">
                                                <Activity size={24} />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl font-black italic uppercase">Audit Protocol X-RAY</CardTitle>
                                                <CardDescription className="text-xs font-medium">Monitoring every pulse of the system</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-8 space-y-8">
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-black uppercase tracking-widest text-primary">Immutable Logging</h4>
                                            <p className="text-sm text-muted-foreground leading-relaxed italic">
                                                All sensitive actions, especially **Permission Assignments**, are captured in our immutable audit trail. This log includes the Actor ID, Target ID, Timestamp (UTC), and a hashed trace of the action.
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <div className="text-2xl font-black italic">0.02ms</div>
                                                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Log Latency</div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="text-2xl font-black italic">AES-256</div>
                                                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Data Shieling</div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="text-2xl font-black italic">365 Days</div>
                                                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Retention Period</div>
                                            </div>
                                        </div>
                                        <div className="p-6 rounded-2xl bg-[#09090b] border border-white/5">
                                            <div className="flex items-center gap-3 mb-4">
                                                <Users size={16} className="text-primary" />
                                                <h5 className="text-[10px] font-black uppercase text-white tracking-widest">Live Surveillance Active</h5>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div 
                                                        animate={{ x: ["-100%", "100%"] }}
                                                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                                        className="h-full w-1/3 bg-primary"
                                                    />
                                                </div>
                                                <p className="text-[9px] text-white/30 font-bold italic uppercase tracking-wider">
                                                    Real-time synchronization with the master audit vault...
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {activeTab === 'api' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Card className="border-border/40 bg-[#09090b] overflow-hidden">
                                            <CardHeader className="border-b border-white/5 flex flex-row items-center justify-between py-6 px-8">
                                                <div>
                                                    <CardTitle className="text-xl font-black italic text-white uppercase tracking-tighter">Terminal Ref</CardTitle>
                                                    <CardDescription className="text-white/40 text-[10px] font-bold uppercase tracking-widest">DRF Backend Endpoints</CardDescription>
                                                </div>
                                                <Code2 className="text-primary" size={20} />
                                            </CardHeader>
                                            <CardContent className="p-0">
                                                <div className="divide-y divide-white/5">
                                                    {[
                                                        { method: 'POST', path: '/auth/login/', desc: 'JWT Generation.' },
                                                        { method: 'GET', path: '/auth/me/', desc: 'Identity Profile.' },
                                                        { method: 'PATCH', path: '/auth/change-password/', desc: 'Credential Rotation.' },
                                                        { method: 'GET', path: '/employees/', desc: 'Personnel Nodes.' },
                                                        { method: 'POST', path: '/permissions/assign/', desc: 'Matrix Reassignment.' },
                                                        { method: 'GET', path: '/audit/logs/', desc: 'Audit Archive.' },
                                                    ].map((api, i) => (
                                                        <div key={i} className="px-6 py-4 group hover:bg-white/5 transition-colors cursor-crosshair">
                                                            <div className="flex items-center gap-3">
                                                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded leading-none ${api.method === 'GET' ? 'bg-blue-500/20 text-blue-400' : api.method === 'POST' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                                                    {api.method}
                                                                </span>
                                                                <code className="text-[11px] font-mono text-white/80 group-hover:text-primary transition-colors">{api.path}</code>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="border-border/40 bg-card/30 backdrop-blur-xl">
                                            <CardHeader className="pb-4">
                                                <CardTitle className="text-lg font-black italic uppercase tracking-tight">Management Utils</CardTitle>
                                                <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Strategic CLI Operations</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Seed Security Groups</p>
                                                    <div className="bg-black/50 p-4 rounded-xl border border-border/50 group hover:border-primary/50 transition-all font-mono text-[10px] text-primary">
                                                        python manage.py seed_permissions
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Create Core Admin</p>
                                                    <div className="bg-black/50 p-4 rounded-xl border border-border/50 group hover:border-primary/50 transition-all font-mono text-[10px] text-primary">
                                                        python manage.py createsuperuser
                                                    </div>
                                                </div>
                                                <div className="pt-2">
                                                    <Button variant="outline" className="w-full text-[10px] font-black uppercase tracking-widest h-10 border-border/40 hover:bg-primary hover:text-primary-foreground transition-all gap-2">
                                                        <Database size={14} /> Full Schema Guide
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Terminal size={14} className="text-primary" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Required Auth Header</span>
                                        </div>
                                        <code className="text-[11px] font-mono text-foreground/80 bg-background/50 p-4 rounded-xl block border border-border/50">
                                            Authorization: Bearer {'<access_token>'}
                                        </code>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Support Footer - Coming Soon Implementation */}
            <div className="relative group overflow-hidden rounded-[2.5rem] border border-dashed border-border/60 p-1">
                <div className="absolute inset-0 z-20 bg-background/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center pointer-events-none">
                    <Badge className="px-6 py-2 bg-primary text-white font-black uppercase tracking-[0.2em] shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-500">
                        Protocol Coming Soon
                    </Badge>
                </div>
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 md:p-10 grayscale-[0.8] group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all duration-700">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl border border-border/50 flex items-center justify-center text-muted-foreground bg-card">
                            <HelpCircle size={24} />
                        </div>
                        <div className="text-center md:text-left">
                            <h4 className="font-black italic uppercase tracking-tight">Need Support?</h4>
                            <p className="text-xs text-muted-foreground font-medium italic">Direct strategic counseling module is in development.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 pointer-events-none">
                        <Button variant="secondary" className="px-6 rounded-xl font-black uppercase text-[10px] tracking-widest h-11 border border-border/50">
                            Open Ticket
                        </Button>
                        <Button className="px-8 rounded-xl font-black uppercase text-[10px] tracking-widest h-11 shadow-lg shadow-primary/20">
                            Live Sync
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpPage;
