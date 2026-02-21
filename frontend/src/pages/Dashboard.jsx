import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Users, ShieldCheck, Activity, UserPlus, ArrowRight, Zap, Star, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
    <div className={`bg-white rounded-[2rem] p-8 shadow-soft border border-shubakar-border hover:scale-[1.02] transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 delay-${delay}`}>
        <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white mb-6 shadow-lg`}>
            <Icon size={28} />
        </div>
        <p className="text-[10px] font-black text-shubakar-muted uppercase tracking-[0.2em] mb-1">{label}</p>
        <h3 className="text-3xl font-black text-shubakar-text tracking-tighter">{value}</h3>
    </div>
);

const ActivityItem = ({ title, subtitle, time, icon: Icon, color }) => (
    <div className="flex items-center justify-between py-5 group border-b border-shubakar-border/50 last:border-0">
        <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl ${color} text-white flex items-center justify-center shadow-sm`}>
                <Icon size={18} />
            </div>
            <div>
                <p className="text-sm font-black text-shubakar-text leading-none">{title}</p>
                <p className="text-xs text-shubakar-muted font-bold mt-1">{subtitle}</p>
            </div>
        </div>
        <span className="text-[10px] font-black text-shubakar-muted uppercase opacity-40">{time}</span>
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="space-y-10 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="animate-in fade-in slide-in-from-left-5 duration-700">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap size={16} className="text-shubakar-primary animate-pulse" />
                        <span className="text-[11px] font-black text-shubakar-primary uppercase tracking-[0.3em]">Operational Pulse</span>
                    </div>
                    <h1 className="text-4xl font-black text-shubakar-text tracking-tighter leading-none">
                        Welcome back, <span className="shubakar-gradient-text italic">{user?.first_name || 'Partner'}</span>!
                    </h1>
                    <p className="text-shubakar-muted font-bold mt-2">Managing your perfect celebration engine today.</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/employees/new')}
                        className="btn-vibrant flex items-center gap-2 pr-8"
                    >
                        <UserPlus size={18} />
                        Add Member
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatCard icon={Users} label="Total Personnel" value="1,240" color="bg-shubakar-secondary" delay="0" />
                <StatCard icon={ShieldCheck} label="Secured Nodes" value="48" color="bg-shubakar-primary" delay="75" />
                <StatCard icon={Activity} label="System Events" value="9.2k" color="bg-shubakar-accent text-shubakar-text" delay="150" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white rounded-[2.5rem] shadow-soft border border-shubakar-border overflow-hidden p-1">
                        <div className="px-8 py-6 flex items-center justify-between">
                            <h3 className="text-lg font-black text-shubakar-text tracking-tight flex items-center gap-2">
                                <Star size={20} className="text-shubakar-accent fill-shubakar-accent" />
                                Global Audit Feed
                            </h3>
                            <button className="text-[10px] font-black text-shubakar-secondary hover:text-shubakar-primary uppercase tracking-widest transition-colors flex items-center gap-1 group">
                                Full History
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                        <div className="px-8 pb-4">
                            <ActivityItem
                                title="Access Protocol Adjusted"
                                subtitle="System granted Full View to Sarah Mitchell"
                                time="JUST NOW"
                                icon={ShieldCheck}
                                color="bg-shubakar-secondary"
                            />
                            <ActivityItem
                                title="New Member Registered"
                                subtitle="David Chen joined the Event Logistic team"
                                time="12 MINS AGO"
                                icon={UserPlus}
                                color="bg-shubakar-primary"
                            />
                            <ActivityItem
                                title="Audit Log Exported"
                                subtitle="Monthly security wrap-up delivered to compliance"
                                time="45 MINS AGO"
                                icon={Zap}
                                color="bg-shubakar-text"
                            />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 flex">
                    <div className="w-full bg-gradient-to-br from-shubakar-primary to-shubakar-secondary rounded-[2.5rem] p-10 text-white relative overflow-hidden flex flex-col justify-between shadow-soft">
                        <div className="absolute top-0 right-0 p-8 opacity-20 rotate-12">
                            <Sparkles size={120} />
                        </div>

                        <div className="relative z-10">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2 block">System Alert</span>
                            <h3 className="text-2xl font-black tracking-tight leading-tight">Your permissions define the legacy.</h3>
                            <p className="text-white/70 text-sm font-bold mt-4 leading-relaxed">
                                Manage granular access to ensure Shubakar remains the world's most trusted event engine.
                            </p>
                        </div>

                        <div className="relative z-10 pt-10">
                            <button
                                onClick={() => navigate('/permissions')}
                                className="bg-white text-shubakar-primary px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform"
                            >
                                Configure Access
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
