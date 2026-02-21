import React, { useEffect, useState } from 'react';
import { ShieldAlert, Loader2, Save, User as UserIcon, CheckCircle2, Info, Lock } from 'lucide-react';
import apiClient from '../api/client';

const PermissionManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userPermissions, setUserPermissions] = useState([]);

    const allPermissions = [
        { code: 'CREATE_EMPLOYEE', name: 'Registry Creation', desc: 'Onboard new personnel to the platform' },
        { code: 'EDIT_EMPLOYEE', name: 'Registry Modification', desc: 'Update existing staff specifications' },
        { code: 'DELETE_EMPLOYEE', name: 'Registry Deletion', desc: 'Strike inactive members from the database' },
        { code: 'VIEW_EMPLOYEE', name: 'Registry Inspection', desc: 'Full read access to the personnel registry' },
        { code: 'VIEW_SELF', name: 'Personal Inspection', desc: 'View own metadata and performance stats' },
        { code: 'ASSIGN_PERMISSION', name: 'Protocol Assignment', desc: 'Modify system-wide access permissions' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await apiClient.get('/employees/');
                setUsers(res.data.data.results);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setUserPermissions(user.permissions || []);
    };

    const togglePermission = (code) => {
        setUserPermissions(prev =>
            prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
        );
    };

    const handleSave = async () => {
        if (!selectedUser) return;
        setSaving(true);
        try {
            const original = selectedUser.permissions || [];
            const added = userPermissions.filter(p => !original.includes(p));
            const removed = original.filter(p => !userPermissions.includes(p));

            if (added.length > 0) {
                await apiClient.post('/permissions/assign/', {
                    user_id: selectedUser.id,
                    permission_codes: added
                });
            }
            if (removed.length > 0) {
                await apiClient.post('/permissions/remove/', {
                    user_id: selectedUser.id,
                    permission_codes: removed
                });
            }
            alert('Security Protocols Synchronized');
            setSelectedUser({ ...selectedUser, permissions: userPermissions });
        } catch (err) {
            alert('Authorization Sync Failed');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-1000">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-1 bg-shubakar-secondary rounded-full"></div>
                    <span className="text-[11px] font-black text-shubakar-secondary uppercase tracking-[0.3em]">Access Engine</span>
                </div>
                <h1 className="text-4xl font-black text-shubakar-text tracking-tighter italic">Protocol Control</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* User Selector Pane */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-[2.5rem] shadow-soft border border-shubakar-border overflow-hidden p-2">
                        <div className="p-6">
                            <h3 className="text-xs font-black text-shubakar-muted uppercase tracking-widest flex items-center gap-2">
                                <UserIcon size={16} className="text-shubakar-primary" />
                                Active Principals
                            </h3>
                        </div>
                        <div className="space-y-1 max-h-[600px] overflow-y-auto px-2 pb-2 custom-scrollbar">
                            {loading ? (
                                <div className="p-10 text-center">
                                    <Loader2 className="animate-spin text-shubakar-primary mx-auto" size={24} />
                                </div>
                            ) : users.map(user => (
                                <button
                                    key={user.id}
                                    onClick={() => handleUserSelect(user)}
                                    className={`w-full text-left p-4 flex items-center gap-4 rounded-2xl transition-all group ${selectedUser?.id === user.id
                                            ? 'bg-shubakar-softBg shadow-inner ring-1 ring-shubakar-secondary/20'
                                            : 'hover:bg-slate-50'
                                        }`}
                                >
                                    <div className={`h-10 w-10 rounded-xl overflow-hidden shadow-sm transition-transform ${selectedUser?.id === user.id ? 'scale-110' : 'group-hover:scale-105'}`}>
                                        <img
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                                            alt="avatar"
                                        />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className={`text-sm font-black truncate leading-none ${selectedUser?.id === user.id ? 'text-shubakar-secondary' : 'text-shubakar-text'}`}>
                                            {user.first_name} {user.last_name}
                                        </p>
                                        <p className="text-[10px] font-bold text-shubakar-muted truncate mt-1">{user.email}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Permission Editor Pane */}
                <div className="lg:col-span-8">
                    {selectedUser ? (
                        <div className="glass-card p-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-shubakar-primary/5 rounded-full blur-3xl -mr-40 -mt-40"></div>

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 relative z-10">
                                <div className="flex items-center gap-5">
                                    <div className="bg-shubakar-primary p-4 rounded-3xl text-white shadow-vibrant">
                                        <ShieldAlert size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-shubakar-text tracking-tighter leading-none">Security Sync</h3>
                                        <p className="text-xs font-bold text-shubakar-muted mt-2">Targeting Agent: <span className="text-shubakar-secondary">{selectedUser.first_name} {selectedUser.last_name}</span></p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="btn-vibrant min-w-[200px] h-14 flex items-center justify-center gap-2"
                                >
                                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={20} />}
                                    Sync Protocols
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                                {allPermissions.map((perm) => (
                                    <label
                                        key={perm.code}
                                        className={`group flex items-start gap-4 p-6 rounded-3xl border-2 transition-all cursor-pointer ${userPermissions.includes(perm.code)
                                                ? 'bg-shubakar-softBg/50 border-shubakar-primary/20 shadow-inner'
                                                : 'bg-white border-transparent hover:border-shubakar-softBg hover:bg-shubakar-softBg/20'
                                            }`}
                                    >
                                        <div className="pt-1">
                                            <div className={`h-7 w-7 rounded-xl border-2 flex items-center justify-center transition-all ${userPermissions.includes(perm.code)
                                                    ? 'bg-shubakar-primary border-shubakar-primary text-white scale-110 shadow-vibrant'
                                                    : 'bg-white border-shubakar-border'
                                                }`}>
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={userPermissions.includes(perm.code)}
                                                    onChange={() => togglePermission(perm.code)}
                                                />
                                                {userPermissions.includes(perm.code) && <CheckCircle2 size={16} strokeWidth={3} />}
                                            </div>
                                        </div>
                                        <div className="space-y-1.5 flex-1">
                                            <p className="text-sm font-black text-shubakar-text tracking-tight group-hover:text-shubakar-primary transition-colors">{perm.name}</p>
                                            <p className="text-[11px] text-shubakar-muted font-bold leading-relaxed">{perm.desc}</p>
                                            <div className="flex items-center gap-1.5 mt-2 opacity-40 group-hover:opacity-100 transition-opacity">
                                                <Lock size={10} className="text-shubakar-primary" />
                                                <code className="text-[9px] font-black font-mono tracking-widest text-shubakar-primary uppercase">{perm.code}</code>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>

                            <div className="mt-10 p-5 bg-shubakar-primary/5 rounded-2xl border-2 border-dashed border-shubakar-primary/20 flex items-start gap-4 relative z-10">
                                <Info className="text-shubakar-primary flex-shrink-0 mt-0.5" size={20} />
                                <p className="text-[11px] text-shubakar-text font-bold leading-relaxed">
                                    Note: Authorization changes are instantaneous across the Shubakar network. Exercise extreme caution.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-[500px] bg-white rounded-[2.5rem] border-2 border-dashed border-shubakar-border flex flex-col items-center justify-center text-shubakar-muted space-y-6">
                            <div className="w-24 h-24 bg-shubakar-softBg rounded-full flex items-center justify-center text-shubakar-secondary/20 scale-150 grayscale">
                                <ShieldAlert size={48} />
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-black text-shubakar-text tracking-tight uppercase italic opacity-30">Security Cloud Offline</p>
                                <p className="text-xs font-bold mt-2">Activate a security principal to begin protocol sync</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PermissionManagementPage;
