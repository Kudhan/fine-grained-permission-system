import React, { useEffect, useState } from 'react';
import { Shield, Loader2, Save, User as UserIcon, CheckCircle, Info } from 'lucide-react';
import apiClient from '../api/client';

const PermissionManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userPermissions, setUserPermissions] = useState([]);

    const allPermissions = [
        { code: 'CREATE_EMPLOYEE', name: 'Create Employee', desc: 'Allows adding new members to the roster' },
        { code: 'EDIT_EMPLOYEE', name: 'Edit Employee', desc: 'Modify existing personnel details' },
        { code: 'DELETE_EMPLOYEE', name: 'Delete Employee', desc: 'Permanent removal of user records' },
        { code: 'VIEW_EMPLOYEE', name: 'View Employee', desc: 'Access to browse the personnel database' },
        { code: 'VIEW_SELF', name: 'View Self', desc: 'Access to own profile and data' },
        { code: 'ASSIGN_PERMISSION', name: 'Assign Permission', desc: 'Modify system access levels for others' },
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
                    user_id: selectedUser.id, // Ensure we use the correct user id
                    permission_codes: added
                });
            }
            if (removed.length > 0) {
                await apiClient.post('/permissions/remove/', {
                    user_id: selectedUser.id,
                    permission_codes: removed
                });
            }
            alert('Permissions synchronized successfully');
            // Refresh local user state
            setSelectedUser({ ...selectedUser, permissions: userPermissions });
        } catch (err) {
            alert('Failed to update permissions. Check if target user ID is valid for current role.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-extrabold text-brand-header tracking-tight">Access Control Engine</h1>
                <p className="text-slate-500 font-medium">Manage granular security protocols for your administrative staff.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* User List Pane */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="bg-white rounded-[1.5rem] shadow-premium border border-brand-border overflow-hidden">
                        <div className="p-5 bg-brand-tableHeader/50 border-b border-brand-border">
                            <h3 className="font-bold text-brand-header flex items-center gap-2 tracking-tight">
                                <UserIcon size={18} className="text-brand-accent" />
                                System Users
                            </h3>
                        </div>
                        <div className="divide-y divide-brand-border/60 max-h-[600px] overflow-y-auto custom-scrollbar">
                            {loading ? (
                                <div className="p-12 text-center">
                                    <Loader2 className="animate-spin text-brand-accent mx-auto" size={24} />
                                </div>
                            ) : users.map(user => (
                                <button
                                    key={user.id}
                                    onClick={() => handleUserSelect(user)}
                                    className={`w-full text-left px-5 py-4 flex items-center gap-3 transition-all ${selectedUser?.id === user.id
                                            ? 'bg-brand-header text-white ring-1 ring-inset ring-brand-header shadow-lg translate-x-1'
                                            : 'hover:bg-brand-bg text-slate-700'
                                        }`}
                                >
                                    <div className={`h-10 w-10 rounded-full flex-shrink-0 border-2 ${selectedUser?.id === user.id ? 'border-brand-accent/50' : 'border-slate-100'}`}>
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=random&color=fff`}
                                            className="rounded-full"
                                            alt="avatar"
                                        />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-bold truncate leading-none">{user.first_name} {user.last_name}</p>
                                        <p className={`text-[11px] truncate mt-1 ${selectedUser?.id === user.id ? 'text-white/60' : 'text-slate-400'}`}>{user.email}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Permission Plane */}
                <div className="lg:col-span-8">
                    {selectedUser ? (
                        <div className="bg-white rounded-[2rem] shadow-premium border border-brand-border p-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="bg-brand-header p-4 rounded-2xl text-brand-accent shadow-lg shadow-brand-header/20">
                                        <Shield size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-extrabold text-brand-header tracking-tight">Permissions Sync</h3>
                                        <p className="text-slate-500 font-medium text-sm">Target: <span className="text-brand-header font-bold">{selectedUser.first_name} {selectedUser.last_name}</span></p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="btn-primary flex items-center justify-center gap-2 h-12 px-8 min-w-[160px]"
                                >
                                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={18} />}
                                    Sync Protocols
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                                {allPermissions.map((perm) => (
                                    <label
                                        key={perm.code}
                                        className={`group flex items-start gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer ${userPermissions.includes(perm.code)
                                                ? 'bg-brand-bg border-brand-header/20 ring-1 ring-brand-header/10'
                                                : 'bg-white border-transparent hover:border-slate-100 hover:bg-slate-50/50'
                                            }`}
                                    >
                                        <div className="pt-0.5">
                                            <div className={`h-6 w-6 rounded-md border-2 flex items-center justify-center transition-colors ${userPermissions.includes(perm.code)
                                                    ? 'bg-brand-header border-brand-header text-brand-accent'
                                                    : 'bg-white border-slate-300'
                                                }`}>
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={userPermissions.includes(perm.code)}
                                                    onChange={() => togglePermission(perm.code)}
                                                />
                                                {userPermissions.includes(perm.code) && <CheckCircle size={14} strokeWidth={3} />}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-bold text-slate-800 leading-tight group-hover:text-brand-header transition-colors">{perm.name}</p>
                                            <p className="text-xs text-slate-400 font-medium leading-normal">{perm.desc}</p>
                                            <code className="inline-block text-[9px] font-bold font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-500 uppercase mt-1 tracking-wider opacity-60">
                                                {perm.code}
                                            </code>
                                        </div>
                                    </label>
                                ))}
                            </div>

                            <div className="mt-8 p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-3 relative z-10">
                                <Info className="text-emerald-600 flex-shrink-0 mt-0.5" size={18} />
                                <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                                    Changes in this panel are high-impact security updates. Ensure you have proper authorization before synchronizing protocols.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-brand-bg rounded-[2rem] border-2 border-dashed border-slate-200 h-[500px] flex flex-col items-center justify-center text-slate-400 space-y-4">
                            <div className="bg-white p-6 rounded-full shadow-premium border border-slate-100 scale-125">
                                <Shield size={48} className="opacity-20 text-brand-header" />
                            </div>
                            <div className="text-center">
                                <p className="font-extrabold text-slate-600 tracking-tight">Security Engine Idle</p>
                                <p className="text-sm font-medium">Select a security principal from the left to begin configuration</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PermissionManagementPage;
