import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, ShieldCheck, Activity, UserPlus, FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ icon: Icon, label, value, color, description }) => (
    <div className="bg-white rounded-2xl p-6 shadow-premium border border-brand-border hover:border-brand-accent/30 transition-all group">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${color} text-white shadow-sm group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">{description}</span>
        </div>
        <div className="space-y-1">
            <h3 className="text-3xl font-extrabold text-slate-800">{value}</h3>
            <p className="text-sm font-medium text-slate-500 tracking-tight">{label}</p>
        </div>
    </div>
);

const ActivityItem = ({ title, subtitle, time, icon: Icon, color }) => (
    <div className="flex items-center justify-between py-4 group">
        <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-lg ${color} text-white group-hover:rotate-6 transition-transform`}>
                <Icon size={18} />
            </div>
            <div>
                <p className="text-sm font-bold text-slate-800 tracking-tight">{title}</p>
                <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
            </div>
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase">{time}</span>
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-brand-header tracking-tight">
                        Welcome back, {user?.first_name || 'Admin'}!
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Here's what's happening in your system today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/employees/new')}
                        className="btn-primary flex items-center gap-2"
                    >
                        <UserPlus size={18} />
                        Add Employee
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    icon={Users}
                    label="Total Employees"
                    value="1,284"
                    color="bg-brand-header"
                    description="Active Roster"
                />
                <StatCard
                    icon={ShieldCheck}
                    label="Active Permissions"
                    value="24"
                    color="bg-brand-accent text-brand-header"
                    description="System Integrity"
                />
                <StatCard
                    icon={Activity}
                    label="Audited Actions"
                    value="982"
                    color="bg-emerald-600"
                    description="Security Log"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-premium border border-brand-border overflow-hidden">
                        <div className="px-6 py-5 border-b border-brand-border flex items-center justify-between bg-brand-tableHeader/30">
                            <h3 className="font-bold text-brand-header tracking-tight">Recent Activity</h3>
                            <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group">
                                View Full Audit Log
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                        <div className="p-6 divide-y divide-brand-border/60">
                            <ActivityItem
                                title="Permission Assigned"
                                subtitle="Admin granted VIEW_EMPLOYEE to John Doe"
                                time="2 mins ago"
                                icon={ShieldCheck}
                                color="bg-brand-header"
                            />
                            <ActivityItem
                                title="New Employee Onboarded"
                                subtitle="Jane Smith joined the Engineering team"
                                time="15 mins ago"
                                icon={UserPlus}
                                color="bg-brand-accent"
                            />
                            <ActivityItem
                                title="System Policy Updated"
                                subtitle="Modified password complexity requirements"
                                time="1 hour ago"
                                icon={FileText}
                                color="bg-slate-700"
                            />
                            <ActivityItem
                                title="Unauthorized Access Blocked"
                                subtitle="Failed login attempt from ip 192.168.1.5"
                                time="3 hours ago"
                                icon={Activity}
                                color="bg-red-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-brand-header rounded-2xl shadow-premium border border-white/10 p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <h3 className="text-xl font-bold mb-2 relative z-10">Quick Permissions</h3>
                        <p className="text-white/70 text-sm mb-6 relative z-10">Quickly assign standard access sets to existing staff.</p>
                        <div className="space-y-3 relative z-10">
                            {['View Only', 'Support Staff', 'Manager Plus'].map(role => (
                                <button key={role} className="w-full bg-white/10 hover:bg-white/20 px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all border border-white/5">
                                    {role}
                                </button>
                            ))}
                            <button
                                onClick={() => navigate('/permissions')}
                                className="w-full mt-4 flex items-center justify-center gap-2 text-brand-accent text-sm font-bold opacity-90 hover:opacity-100 transition-opacity"
                            >
                                Custom Configuration
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
