import React, { useEffect, useState } from 'react';
import { User, Mail, Briefcase, Calendar, Phone, Shield, MapPin, Edit3 } from 'lucide-react';
import apiClient from '../api/client';

const ProfileInfo = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:bg-white hover:border-brand-accent/20 hover:shadow-sm transition-all">
        <div className="bg-white p-2.5 rounded-xl text-slate-400 group-hover:text-brand-accent transition-colors shadow-sm">
            <Icon size={18} />
        </div>
        <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
            <p className="text-sm font-bold text-slate-700">{value || 'Not specified'}</p>
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
            <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-700">
            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Left Side: Identity Card */}
                <div className="w-full md:w-1/3 space-y-6">
                    <div className="bg-brand-header rounded-[2.5rem] shadow-premium p-8 text-white relative overflow-hidden text-center">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

                        <div className="relative z-10">
                            <div className="mx-auto h-32 w-32 rounded-[2rem] border-4 border-white/20 bg-gray-600 overflow-hidden shadow-2xl mb-6">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${profile?.first_name}+${profile?.last_name}&background=6366f1&color=fff&size=512`}
                                    alt="profile"
                                />
                            </div>
                            <h2 className="text-2xl font-extrabold tracking-tight">{profile?.first_name} {profile?.last_name}</h2>
                            <p className="text-brand-accent font-bold text-xs uppercase tracking-widest mt-1 opacity-90">{profile?.email}</p>

                            <div className="mt-8 flex justify-center gap-2">
                                {['Admin', 'Verified'].map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/5">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <button className="w-full mt-8 bg-brand-accent hover:bg-brand-accentHover text-brand-header py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2">
                                <Edit3 size={16} />
                                Edit Profile
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-premium border border-brand-border p-6">
                        <h4 className="font-bold text-brand-header mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <Shield size={16} className="text-brand-accent" />
                            Permissions Set
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {profile?.permissions?.map(code => (
                                <code key={code} className="text-[9px] font-mono font-bold bg-slate-50 border border-slate-100 px-2 py-1 rounded text-slate-500 uppercase tracking-tighter">
                                    {code}
                                </code>
                            ))}
                            {!profile?.permissions?.length && (
                                <p className="text-xs text-slate-400 italic">No special permissions assigned.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Side: Detailed Stats */}
                <div className="flex-1 space-y-8 w-full">
                    <div className="bg-white rounded-[2.5rem] shadow-premium border border-brand-border p-10 relative overflow-hidden">
                        <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl -mr-24 -mb-24"></div>

                        <div className="space-y-8 relative z-10">
                            <div>
                                <h3 className="text-xl font-extrabold text-brand-header tracking-tight">Personal Portfolio</h3>
                                <p className="text-slate-500 font-medium text-sm">Detailed professional records and contact associations.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ProfileInfo icon={User} label="Full Legal Name" value={`${profile?.first_name} ${profile?.last_name}`} />
                                <ProfileInfo icon={Mail} label="Corporate Email" value={profile?.email} />
                                <ProfileInfo icon={Briefcase} label="Department" value="Administration" />
                                <ProfileInfo icon={Shield} label="Access Level" value="System Administrator" />
                                <ProfileInfo icon={Calendar} label="Date Registered" value="Jan 12, 2024" />
                                <ProfileInfo icon={MapPin} label="Work Location" value="Remote / Global" />
                                <ProfileInfo icon={Phone} label="Contact Line" value="+1 (555) 782-9901" />
                                <ProfileInfo icon={Calendar} label="Last Login" value="2 hours ago" />
                            </div>

                            <div className="pt-6 border-t border-brand-border">
                                <h4 className="font-bold text-brand-header text-sm mb-4">Account Integrity</h4>
                                <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                    <div className="bg-white p-2.5 rounded-xl text-emerald-600 shadow-sm border border-emerald-50">
                                        <Shield size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-emerald-900 tracking-tight">Two-Factor Authentication is Active</p>
                                        <p className="text-xs text-emerald-700 font-medium opacity-80 leading-relaxed mt-0.5">Your identity is secured by multi-layered verification protocols. Last audit was clean.</p>
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
