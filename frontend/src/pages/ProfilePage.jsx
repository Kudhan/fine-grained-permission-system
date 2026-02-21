import React, { useEffect, useState } from 'react';
import { User, Mail, Briefcase, Calendar, Phone, ShieldCheck, MapPin, Edit3, Sparkles, Zap, Star } from 'lucide-react';
import apiClient from '../api/client';

const ProfileInfo = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-5 p-6 rounded-3xl bg-white border border-shubakar-border hover:border-shubakar-secondary/30 hover:scale-[1.02] transition-all group">
        <div className="bg-shubakar-softBg p-3 rounded-2xl text-shubakar-secondary group-hover:bg-shubakar-secondary group-hover:text-white transition-all shadow-sm">
            <Icon size={20} />
        </div>
        <div>
            <p className="text-[9px] font-black text-shubakar-muted uppercase tracking-[0.2em] mb-1 leading-none">{label}</p>
            <p className="text-sm font-black text-shubakar-text truncate leading-tight">{value || 'UNSPECIFIED'}</p>
        </div>
    </div>
);

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await apiClient.get('/auth/me/');
                if (res.data.success) {
                    setProfile(res.data.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return (
        <div className="flex h-screen items-center justify-center -mt-20">
            <div className="w-14 h-14 border-4 border-shubakar-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in zoom-in-95 duration-1000 pb-20">
            <div className="flex items-center gap-3 mb-4">
                <Star size={16} className="text-shubakar-accent fill-shubakar-accent" />
                <span className="text-[11px] font-black text-shubakar-text uppercase tracking-[0.4em]">Personal Identity Portfolio</span>
            </div>

            <div className="flex flex-col lg:flex-row gap-12 items-start">
                {/* Left Aspect: Identity Prism */}
                <div className="w-full lg:w-80 space-y-8 sticky top-32">
                    <div className="bg-white rounded-[3rem] shadow-soft border border-shubakar-border p-8 relative overflow-hidden text-center group">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-shubakar-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>

                        <div className="relative z-10">
                            <div className="mx-auto h-40 w-40 rounded-[2.5rem] p-1.5 bg-gradient-to-br from-shubakar-primary via-shubakar-accent to-shubakar-secondary shadow-xl mb-8 group-hover:rotate-3 transition-transform duration-500">
                                <div className="h-full w-full rounded-[2.2rem] bg-white overflow-hidden p-1">
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.email || 'user'}&backgroundColor=F0F9F9`}
                                        alt="profile"
                                        className="scale-110"
                                    />
                                </div>
                            </div>
                            <h2 className="text-3xl font-black text-shubakar-text tracking-tighter leading-none">{profile?.first_name} {profile?.last_name}</h2>
                            <p className="text-shubakar-primary font-black text-[10px] uppercase tracking-[0.2em] mt-3">Verified Principal</p>

                            <div className="mt-8 flex justify-center gap-3">
                                <span className="px-4 py-1.5 bg-shubakar-softBg rounded-full text-[9px] font-black text-shubakar-secondary uppercase tracking-widest border border-shubakar-secondary/10 shadow-sm">
                                    ADMIN
                                </span>
                                <span className="px-4 py-1.5 bg-shubakar-primary/5 rounded-full text-[9px] font-black text-shubakar-primary uppercase tracking-widest border border-shubakar-primary/10 shadow-sm">
                                    SECURED
                                </span>
                            </div>

                            <button className="w-full mt-10 btn-vibrant h-14 tracking-widest uppercase text-xs">
                                <Edit3 size={16} className="inline mr-2" />
                                Refine Bio
                            </button>
                        </div>
                    </div>

                    <div className="bg-shubakar-text rounded-[2.5rem] shadow-soft p-8 text-white relative overflow-hidden group">
                        <div className="absolute bottom-0 right-0 opacity-10 m-4 group-hover:scale-110 transition-transform">
                            <ShieldCheck size={80} />
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-4 block">ACTIVE PROTOCOLS</h4>
                        <div className="flex flex-wrap gap-2">
                            {profile?.permissions?.map(code => (
                                <span key={code} className="text-[8px] font-black bg-white/10 hover:bg-white/20 border border-white/10 px-2.5 py-1.5 rounded-lg text-white uppercase tracking-tighter transition-colors">
                                    {code}
                                </span>
                            ))}
                            {!profile?.permissions?.length && (
                                <p className="text-xs font-bold opacity-40">Zero functional codes assigned.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Aspect: Operational Metrics */}
                <div className="flex-1 space-y-10 w-full">
                    <div className="glass-card p-10 md:p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-shubakar-secondary/5 rounded-full blur-[100px] -mr-48 -mt-48"></div>

                        <div className="space-y-12 relative z-10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-3xl font-black text-shubakar-text tracking-tighter italic">Metric Portfolio</h3>
                                    <p className="text-shubakar-muted font-bold text-sm mt-1">Deep analysis of your operational digital shadow.</p>
                                </div>
                                <div className="bg-shubakar-softBg p-4 rounded-3xl">
                                    <Zap className="text-shubakar-secondary animate-bounce" size={24} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ProfileInfo icon={User} label="Legal Designation" value={`${profile?.first_name} ${profile?.last_name}`} />
                                <ProfileInfo icon={Mail} label="Secure Comms" value={profile?.email} />
                                <ProfileInfo icon={Briefcase} label="Division" value="Global Administration" />
                                <ProfileInfo icon={ShieldCheck} label="Access Tier" value="Master System Keyholder" />
                                <ProfileInfo icon={Calendar} label="Activation Date" value="JAN 12, 2024" />
                                <ProfileInfo icon={MapPin} label="Operational Hub" value="Cloud / Decentralized" />
                                <ProfileInfo icon={Phone} label="Direct Link" value="+91 9999-001-001" />
                                <ProfileInfo icon={Sparkles} label="Style Guide" value="Shubakar Vibrant" />
                            </div>

                            <div className="pt-10 border-t border-shubakar-border">
                                <div className="flex items-center gap-6 p-8 bg-shubakar-softBg/50 rounded-[2rem] border-2 border-dashed border-shubakar-secondary/20 group">
                                    <div className="bg-white p-5 rounded-3xl text-shubakar-secondary shadow-lg group-hover:rotate-12 transition-transform">
                                        <ShieldCheck size={32} />
                                    </div>
                                    <div>
                                        <p className="text-lg font-black text-shubakar-text tracking-tight uppercase italic leading-none">Global Identity Guard Active</p>
                                        <p className="text-xs text-shubakar-muted font-bold leading-relaxed mt-2 opacity-80">
                                            Your identity is backed by Shubakar's 256-bit rotating biometric sync. Last audit trace: <span className="text-shubakar-secondary">CLEAN</span>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
