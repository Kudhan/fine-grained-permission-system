import React, { useEffect, useState } from 'react';
import { Shield, Loader2, Save, User as UserIcon } from 'lucide-react';
import apiClient from '../api/client';

const PermissionManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userPermissions, setUserPermissions] = useState([]);

    const allPermissions = [
        { code: 'CREATE_EMPLOYEE', name: 'Create Employee' },
        { code: 'EDIT_EMPLOYEE', name: 'Edit Employee' },
        { code: 'DELETE_EMPLOYEE', name: 'Delete Employee' },
        { code: 'VIEW_EMPLOYEE', name: 'View Employee' },
        { code: 'VIEW_SELF', name: 'View Self' },
        { code: 'ASSIGN_PERMISSION', name: 'Assign Permission' },
    ];

    useEffect(() => {
        // Assuming we have an endpoint for users, or we use the employees list since auth follows email
        // For this prototype, we'll fetch from the auth/me endpoint metadata or similar.
        // In a real app, you'd have a /users/ list. Let's fetch from /employees/ for now as a proxy.
        const fetchData = async () => {
            try {
                const res = await apiClient.get('/employees/');
                // In this system, we manage permissions by user_id. 
                // We'll map employees to their user_id if exposed.
                // For simplicity in this demo, we'll use a hardcoded selected user flow or fetch all.
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
        // In our backend, UserSerializer returns permissions code list
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
            // In this system, we use POST /permissions/assign/ and POST /permissions/remove/
            // or we can implement a sync endpoint. Our backend has assign/remove.
            // We'll perform a sync: find added, find removed.

            const original = selectedUser.permissions || [];
            const added = userPermissions.filter(p => !original.includes(p));
            const removed = original.filter(p => !userPermissions.includes(p));

            if (added.length > 0) {
                await apiClient.post('/permissions/assign/', {
                    user_id: selectedUser.created_by, // This is a limitation of the current view, ideally we have user_id
                    permission_codes: added
                });
            }
            if (removed.length > 0) {
                await apiClient.post('/permissions/remove/', {
                    user_id: selectedUser.created_by,
                    permission_codes: removed
                });
            }
            alert('Permissions updated successfully');
        } catch (err) {
            alert('Failed to update permissions');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Permission Management</h1>
                <p className="text-gray-600">Admin tool to manage granular user access.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-700">Select User</h3>
                    </div>
                    <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                        {loading ? (
                            <div className="p-8 text-center text-gray-400">Loading...</div>
                        ) : users.map(user => (
                            <button
                                key={user.id}
                                onClick={() => handleUserSelect(user)}
                                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${selectedUser?.id === user.id ? 'bg-primary-50 border-r-4 border-primary-600' : 'hover:bg-gray-50'
                                    }`}
                            >
                                <div className="bg-gray-100 p-2 rounded-lg text-gray-500">
                                    <UserIcon size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{user.first_name} {user.last_name}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Permission Grid */}
                <div className="lg:col-span-2 space-y-6">
                    {selectedUser ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
                                        <Shield size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Managing Permissions for</h3>
                                        <p className="text-gray-600">{selectedUser.first_name} {selectedUser.last_name} ({selectedUser.email})</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-2 bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700 rounded-lg transition-colors shadow-sm disabled:bg-primary-400"
                                >
                                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={18} />}
                                    Save Changes
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {allPermissions.map((perm) => (
                                    <label
                                        key={perm.code}
                                        className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${userPermissions.includes(perm.code)
                                            ? 'bg-primary-50 border-primary-200 ring-1 ring-primary-200'
                                            : 'bg-white border-gray-200 hover:border-primary-100'
                                            }`}
                                    >
                                        <div className="pt-0.5">
                                            <input
                                                type="checkbox"
                                                className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                                checked={userPermissions.includes(perm.code)}
                                                onChange={() => togglePermission(perm.code)}
                                            />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{perm.name}</p>
                                            <code className="text-[10px] font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600">{perm.code}</code>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 h-96 flex flex-col items-center justify-center text-gray-400 space-y-2">
                            <Shield size={48} className="opacity-20" />
                            <p>Select a user from the list to manage their permissions</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PermissionManagementPage;
