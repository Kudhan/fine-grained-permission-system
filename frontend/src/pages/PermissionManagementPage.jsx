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
import axios from 'axios';
import { toast } from 'sonner';

// This is the functional component for managing permissions
function PermissionManagementPage() {
    // These are from our auth store
    const auth = useAuthStore();
    
    // State for users list
    const [usersList, setUsersList] = useState([]);
    
    // State for all permissions we have in the system
    const [allPerms, setAllPerms] = useState([
        { code: 'CREATE_EMPLOYEE', name: 'Create Employee', description: 'Can add new personnel to the system' },
        { code: 'EDIT_EMPLOYEE', name: 'Edit Employee', description: 'Can modify existing personnel details' },
        { code: 'DELETE_EMPLOYEE', name: 'Delete Employee', description: 'Can remove personnel from the system' },
        { code: 'VIEW_EMPLOYEE', name: 'View Employees', description: 'Can view the organization chart and lists' },
        { code: 'VIEW_SELF', name: 'View Self', description: 'Standard access to personal record' },
        { code: 'ASSIGN_PERMISSION', name: 'Assign Permission', description: 'Admin right to manage user functions' }
    ]);
    
    // State for page loading
    const [isPageLoading, setIsPageLoading] = useState(true);
    // State for the search box
    const [searchText, setSearchText] = useState('');
    // Current page number
    const [pageNumber, setPageNumber] = useState(1);
    // Total users found
    const [totalUsers, setTotalUsers] = useState(0);
    // The user we clicked on
    const [currentUserSelected, setCurrentUserSelected] = useState(null);
    // When we are updating a permission
    const [isUpdatingNow, setIsUpdatingNow] = useState(false);
    
    const pageSizeValue = 5;

    // This function fetches users from the API
    const loadUsersData = async () => {
        setIsPageLoading(true);
        const token = localStorage.getItem('access_token');
        
        try {
            // Build the URL with query params manually
            const url = 'http://localhost:8000/auth/users/?page=' + pageNumber + '&search=' + searchText;
            
            const response = await axios.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
            
            // Check if response is successful
            if (response.data && response.data.results) {
                setUsersList(response.data.results);
                setTotalUsers(response.data.count);
            } else if (response.data && response.data.data) {
                // Sometimes the structure is different based on our view
                if (response.data.data.results) {
                      setUsersList(response.data.data.results);
                      setTotalUsers(response.data.data.count);
                } else {
                      setUsersList(response.data.data);
                      setTotalUsers(response.data.data.length);
                }
            }
        } catch (error) {
            console.log("Error loading users:", error);
            toast.error("Failed to load users");
        }
        
        setIsPageLoading(false);
    }

    // When the page number changes, reload
    useEffect(() => {
        loadUsersData();
    }, [pageNumber]);

    // When search text changes, wait a bit then reload
    useEffect(() => {
        const typingTimer = setTimeout(() => {
            setPageNumber(1);
            loadUsersData();
        }, 800);
        
        return () => {
            clearTimeout(typingTimer);
        }
    }, [searchText]);

    // This function adds or removes a permission for a user
    const handlePermissionChange = async (userToChange, permissionToToggle) => {
        // First check if logged in user is admin
        const canAssign = auth.hasPermission('ASSIGN_PERMISSION');
        if (canAssign === false) {
            toast.error("You are not allowed to do this!");
            return;
        }

        // See if the user already has this permission
        let userHasIt = false;
        const userPermissions = userToChange.permissions;
        for (let i = 0; i < userPermissions.length; i++) {
            if (userPermissions[i] === permissionToToggle) {
                userHasIt = true;
                break;
            }
        }

        // Decide which API to call
        let apiLink = 'http://localhost:8000/permissions/assign/';
        if (userHasIt === true) {
            apiLink = 'http://localhost:8000/permissions/remove/';
        }
        
        setIsUpdatingNow(true);
        const tokenForApi = localStorage.getItem('access_token');

        try {
            await axios.post(apiLink, {
                user_id: userToChange.id,
                permission_codes: [permissionToToggle]
            }, {
                headers: {
                    'Authorization': 'Bearer ' + tokenForApi
                }
            });
            
            if (userHasIt === true) {
                toast.success("Permission removed");
            } else {
                toast.success("Permission granted");
            }
            
            // Refresh everything after success
            loadUsersData();
            
            // Also update the selected user side view if we are looking at them
            if (currentUserSelected && currentUserSelected.id === userToChange.id) {
                // Deep copy to trigger state update
                const newUser = JSON.parse(JSON.stringify(userToChange));
                if (userHasIt === true) {
                    newUser.permissions = newUser.permissions.filter(p => p !== permissionToToggle);
                } else {
                    newUser.permissions.push(permissionToToggle);
                }
                setCurrentUserSelected(newUser);
            }
        } catch (e) {
            console.log("Permission update error:", e);
            toast.error("Failed to update");
        }
        
        setIsUpdatingNow(false);
    }

    // Calculate how many pages we have
    const totalPagesCount = Math.ceil(totalUsers / pageSizeValue);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Access Control</h1>
                <p className="text-muted-foreground mt-1">Manage granular functions and user permissions.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <Card className="lg:col-span-1 border-border/50 shadow-sm h-fit">
                    <CardHeader>
                        <CardTitle className="text-lg">User Directory</CardTitle>
                        <CardDescription>Select a user to manage their rights</CardDescription>
                        <div className="relative mt-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                            <Input 
                                placeholder="Search users..." 
                                className="pl-9 h-9 text-xs"
                                value={searchText}
                                onChange={function(e) { setSearchText(e.target.value); }}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="px-2 pt-0 max-h-[500px] overflow-y-auto">
                        {isPageLoading === true ? (
                             <div className="p-4 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>
                        ) : null}

                        {isPageLoading === false && usersList.length === 0 ? (
                            <div className="py-10 text-center flex flex-col items-center justify-center">
                                <User size={32} className="text-muted-foreground/20 mb-2" />
                                <p className="text-xs text-muted-foreground font-medium">No users found</p>
                            </div>
                        ) : null}

                        {usersList.map(function(u) {
                            return (
                                <div 
                                    key={u.id}
                                    onClick={function() { setCurrentUserSelected(u); }}
                                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                                        currentUserSelected && currentUserSelected.id === u.id 
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
                                    <ChevronRight size={16} className={`${currentUserSelected && currentUserSelected.id === u.id ? 'text-primary' : 'text-muted-foreground/30'}`} />
                                </div>
                            );
                        })}

                        {isPageLoading === false && totalPagesCount > 1 ? (
                            <div className="flex items-center justify-between mt-4 pb-2 px-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    disabled={pageNumber === 1 || isPageLoading}
                                    onClick={function() { setPageNumber(pageNumber - 1); }}
                                >
                                    <ChevronLeft size={16} />
                                </Button>
                                <span className="text-[10px] font-medium text-muted-foreground">
                                    {pageNumber} / {totalPagesCount}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    disabled={pageNumber === totalPagesCount || isPageLoading}
                                    onClick={function() { setPageNumber(pageNumber + 1); }}
                                >
                                    <ChevronRight size={16} />
                                </Button>
                            </div>
                        ) : null}
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2 border-border/50 shadow-xl min-h-[500px]">
                    <CardHeader className="border-b border-border/50 bg-muted/5">
                        {currentUserSelected !== null ? (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">{currentUserSelected.first_name}'s Permissions</CardTitle>
                                        <CardDescription>Configure access for this user</CardDescription>
                                    </div>
                                </div>
                                {isUpdatingNow === true ? <Loader2 className="animate-spin text-primary h-5 w-5" /> : null}
                            </div>
                        ) : (
                            <div className="py-10 text-center flex flex-col items-center">
                                <ShieldAlert size={48} className="text-muted-foreground/20 mb-4" />
                                <p className="text-muted-foreground">Please select a user to see permissions</p>
                            </div>
                        )}
                    </CardHeader>
                    
                    {currentUserSelected !== null ? (
                        <CardContent className="p-0">
                            <div className="divide-y divide-border/50">
                                {allPerms.map(function(perm) {
                                    // Check if user has this permission code in their list
                                    let isThisAssigned = false;
                                    for (let k = 0; k < currentUserSelected.permissions.length; k++) {
                                        if (currentUserSelected.permissions[k] === perm.code) {
                                            isThisAssigned = true;
                                            break;
                                        }
                                    }

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
                                                variant={isThisAssigned ? "outline" : "default"}
                                                size="sm"
                                                disabled={isUpdatingNow === true}
                                                onClick={function() { handlePermissionChange(currentUserSelected, perm.code); }}
                                                className={`min-w-[100px] h-9 transition-all ${
                                                    isThisAssigned 
                                                        ? 'border-destructive/20 text-destructive hover:bg-destructive/10 hover:border-destructive/50' 
                                                        : 'shadow-lg shadow-primary/20'
                                                }`}
                                            >
                                                {isThisAssigned === true ? (
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
                    ) : null}
                    
                    {currentUserSelected !== null ? (
                        <div className="p-6 bg-muted/20 border-t border-border/50 text-xs text-muted-foreground flex items-center gap-2">
                            <ShieldAlert size={14} />
                            Every change is recorded in our security audit log.
                        </div>
                    ) : null}
                </Card>
            </div>
        </div>
    );
}

export default PermissionManagementPage;
