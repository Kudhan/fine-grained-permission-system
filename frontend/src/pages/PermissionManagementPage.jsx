import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../hooks/useAuthStore';
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle, 
    CardDescription 
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
    Search, 
    ShieldCheck, 
    ShieldAlert, 
    User, 
    ChevronRight,
    ChevronLeft,
    Loader2,
    Check,
    X
} from 'lucide-react';
import apiClient from '../api/client';
import { toast } from 'sonner';

const PermissionManagementPage = () => {
    const { hasPermission } = useAuthStore();
    const [users, setUsers] = useState([]);
    const [permissions, setPermissions] = useState([
        { code: 'CREATE_EMPLOYEE', name: 'Create Employee', description: 'Can add new personnel to the system' },
        { code: 'EDIT_EMPLOYEE', name: 'Edit Employee', description: 'Can modify existing personnel details' },
        { code: 'DELETE_EMPLOYEE', name: 'Delete Employee', description: 'Can remove personnel from the system' },
        { code: 'VIEW_EMPLOYEE', name: 'View Employees', description: 'Can view the organization chart and lists' },
        { code: 'VIEW_SELF', name: 'View Self', description: 'Standard access to personal record' },
        { code: 'ASSIGN_PERMISSION', name: 'Assign Permission', description: 'Admin right to manage user functions' }
    ]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [selectedUser, setSelectedUser] = useState(null);
    const [updating, setUpdating] = useState(false);
    const pageSize = 5;

    const fetchUsers = async (page = 1, searchQuery = search) => {
        setLoading(true);
        try {
            const response = await apiClient.get(`/auth/users/?page=${page}&search=${searchQuery}`);
            if (response.data.data.results) {
                setUsers(response.data.data.results);
                setTotalCount(response.data.data.count);
            } else {
                setUsers(response.data.data);
                setTotalCount(response.data.data.length);
            }
        } catch (err) {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers(1, search);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        fetchUsers(currentPage, search);
    }, [currentPage]);

    const togglePermission = async (user, permCode) => {
        if (!hasPermission('ASSIGN_PERMISSION')) {
            toast.error("Unauthorized to assign permissions");
            return;
        }

        const isAssigned = user.permissions.includes(permCode);
        const endpoint = isAssigned ? '/permissions/remove/' : '/permissions/assign/';
        
        setUpdating(true);
        try {
            await apiClient.post(endpoint, {
                user_id: user.id,
                permission_codes: [permCode]
            });
            toast.success(isAssigned ? "Permission revoked" : "Permission granted");
            
            // Refresh the current page to get updated user data
            await fetchUsers(currentPage, search);
            
            // Update selected user local state if necessary
            if (selectedUser?.id === user.id) {
                const updatedUser = { ...user };
                if (isAssigned) {
                    updatedUser.permissions = updatedUser.permissions.filter(p => p !== permCode);
                } else {
                    updatedUser.permissions = [...updatedUser.permissions, permCode];
                }
                setSelectedUser(updatedUser);
            }
        } catch (err) {
            toast.error("Update failed");
        } finally {
            setUpdating(false);
        }
    };

    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Access Control</h1>
                <p className="text-muted-foreground mt-1">Manage granular functions and user permissions.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* User List */}
                <Card className="lg:col-span-1 border-border/50 shadow-sm sticky top-24">
                    <CardHeader>
                        <CardTitle className="text-lg">User Directory</CardTitle>
                        <CardDescription>Select a user to manage their rights</CardDescription>
                        <div className="relative mt-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                            <Input 
                                placeholder="Search users..." 
                                className="pl-9 h-9 text-xs"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="px-2 pt-0 max-h-[500px] overflow-y-auto">
                        {loading ? (
                            <div className="p-4 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>
                        ) : users.length === 0 ? (
                            <div className="py-10 text-center flex flex-col items-center justify-center">
                                <User size={32} className="text-muted-foreground/20 mb-2" />
                                <p className="text-xs text-muted-foreground font-medium">No users found</p>
                            </div>
                        ) : users.map(u => (
                            <div 
                                key={u.id}
                                onClick={() => setSelectedUser(u)}
                                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                                    selectedUser?.id === u.id 
                                        ? 'bg-primary/10 border-primary/20 border ring-1 ring-primary/20' 
                                        : 'hover:bg-muted/50 border border-transparent'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">
                                        {u.first_name[0]}{u.last_name[0]}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold truncate">{u.first_name} {u.last_name}</p>
                                        <p className="text-[10px] text-muted-foreground truncate">{u.email}</p>
                                    </div>
                                </div>
                            <ChevronRight size={16} className={`${selectedUser?.id === u.id ? 'text-primary' : 'text-muted-foreground/30'}`} />
                        </div>
                    ))}
                    {!loading && totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4 pb-2 px-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                disabled={currentPage === 1 || loading}
                                onClick={() => setCurrentPage(p => p - 1)}
                            >
                                <ChevronLeft size={16} />
                            </Button>
                            <span className="text-[10px] font-medium text-muted-foreground">
                                {currentPage} / {totalPages}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                disabled={currentPage === totalPages || loading}
                                onClick={() => setCurrentPage(p => p + 1)}
                            >
                                <ChevronRight size={16} />
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

                {/* Permission Matrix */}
                <Card className="lg:col-span-2 border-border/50 shadow-xl min-h-[500px]">
                    <CardHeader className="border-b border-border/50 bg-muted/5">
                        {selectedUser ? (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">{selectedUser.first_name}'s Permissions</CardTitle>
                                        <CardDescription>Configure granular access functions for this user</CardDescription>
                                    </div>
                                </div>
                                {updating && <Loader2 className="animate-spin text-primary h-5 w-5" />}
                            </div>
                        ) : (
                            <div className="py-10 text-center flex flex-col items-center">
                                <ShieldAlert size={48} className="text-muted-foreground/20 mb-4" />
                                <p className="text-muted-foreground">Select a user to view and edit permissions</p>
                            </div>
                        )}
                    </CardHeader>
                    {selectedUser && (
                        <CardContent className="p-0">
                            <div className="divide-y divide-border/50">
                                {permissions.map((perm) => {
                                    const isAssigned = selectedUser.permissions.includes(perm.code);
                                    return (
                                        <div key={perm.code} className="p-6 flex items-start justify-between gap-6 hover:bg-muted/30 transition-colors">
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-sm tracking-tight">{perm.name}</h4>
                                                    <Badge variant="outline" className="text-[10px] py-0 h-4 bg-muted/50">{perm.code}</Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground leading-relaxed italic">
                                                    {perm.description}
                                                </p>
                                            </div>
                                            <Button 
                                                variant={isAssigned ? "outline" : "default"}
                                                size="sm"
                                                disabled={updating || !hasPermission('ASSIGN_PERMISSION')}
                                                onClick={() => togglePermission(selectedUser, perm.code)}
                                                className={`min-w-[100px] h-9 transition-all ${
                                                    isAssigned 
                                                        ? 'border-destructive/20 text-destructive hover:bg-destructive/10 hover:border-destructive/50' 
                                                        : 'shadow-lg shadow-primary/20'
                                                }`}
                                            >
                                                {isAssigned ? (
                                                    <><X size={14} className="mr-2" /> Revoke</>
                                                ) : (
                                                    <><Check size={14} className="mr-2" /> Assign</>
                                                )}
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    )}
                    {selectedUser && (
                        <div className="p-6 bg-muted/20 border-t border-border/50 text-xs text-muted-foreground flex items-center gap-2">
                            <ShieldAlert size={14} />
                            Changes are audited and effective immediately upon assignment.
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default PermissionManagementPage;
