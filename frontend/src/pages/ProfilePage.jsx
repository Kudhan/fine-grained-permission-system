import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../hooks/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { 
    User, 
    Mail, 
    Shield, 
    Calendar, 
    Key, 
    Smartphone,
    MapPin,
    Building2,
    Briefcase,
    Settings,
    Bell,
    Save,
    X,
    Loader2
} from 'lucide-react';
import { toast } from 'sonner';

// This page shows the personal profile of the user
const ProfilePage = () => {
    // Get user and update function from our global state
    const auth = useAuthStore();
    const user = auth.user;
    
    // State to toggle the edit modal
    const [showEditPopup, setShowEditPopup] = useState(false);
    // State to show a spinner during save
    const [isSaving, setIsSaving] = useState(false);
    
    // Individual states for the form (more like a beginner)
    const [inputFirstName, setInputFirstName] = useState('');
    const [inputLastName, setInputLastName] = useState('');
    const [inputEmail, setInputEmail] = useState('');
    const [inputPhone, setInputPhone] = useState('');
    const [inputDepartment, setInputDepartment] = useState('');
    const [inputDesignation, setInputDesignation] = useState('');
    const [inputAvatarSeed, setInputAvatarSeed] = useState('');

    // Avatar list
    const myAvatars = [
        { id: 'avataaars', name: 'Human' },
        { id: 'bottts', name: 'Robot' },
        { id: 'pixel-art', name: 'Pixel' },
        { id: 'identicon', name: 'Abstract' },
        { id: 'micah', name: 'Artistic' }
    ];

    // Load user data into the form when user changes or modal opens
    useEffect(() => {
        if (user) {
            setInputFirstName(user.first_name || '');
            setInputLastName(user.last_name || '');
            setInputEmail(user.email || '');
            
            // Check nested employee details
            if (user.employee_details) {
                setInputPhone(user.employee_details.phone || '');
                setInputDepartment(user.employee_details.department || '');
                setInputDesignation(user.employee_details.designation || '');
            } else {
                setInputPhone('');
                setInputDepartment('');
                setInputDesignation('');
            }
            
            // Set the avatar seed
            if (user.avatar_seed) {
                setInputAvatarSeed(user.avatar_seed);
            } else {
                setInputAvatarSeed(user.email || '');
            }
        }
    }, [user, showEditPopup]);

    // Function that runs when saving profile
    const onSaveProfile = async (event) => {
        // Prevent page from refreshing
        event.preventDefault();
        setIsSaving(true);
        
        // Put all data into one object
        const updatedInfo = {
            first_name: inputFirstName,
            last_name: inputLastName,
            email: inputEmail,
            phone: inputPhone,
            department: inputDepartment,
            designation: inputDesignation,
            avatar_seed: inputAvatarSeed
        };
        
        // Call the update function
        const updateResult = await auth.updateProfile(updatedInfo);
        
        if (updateResult.success === true) {
            toast.success("Profile saved!");
            setShowEditPopup(false);
        } else {
            toast.error("Profile save failed");
        }
        
        setIsSaving(false);
    };

    // This handles picking an avatar style
    const pickAvatar = function(styleId) {
        // We create a seed by combining style and email
        const newSeed = styleId + '-' + inputEmail;
        setInputAvatarSeed(newSeed);
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-primary to-purple-600 p-0.5 shadow-2xl">
                        <div className="h-full w-full rounded-[22px] bg-card flex items-center justify-center overflow-hidden">
                            <img
                                src={
                                    user && user.avatar_seed && user.avatar_seed.indexOf('-') !== -1
                                        ? "https://api.dicebear.com/7.x/" + user.avatar_seed.split('-')[0] + "/svg?seed=" + user.avatar_seed.split('-')[1]
                                        : "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (user ? user.email : 'default')
                                }
                                alt="profile avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">{user ? user.first_name : ''} {user ? user.last_name : ''}</h1>
                        <p className="text-muted-foreground flex items-center gap-2 mt-1 font-medium">
                            <Badge variant="success" className="h-5">Active Principal</Badge>
                            • {user ? user.email : ''}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2">
                        <Bell size={16} /> Notifications
                    </Button>
                    <Button 
                        onClick={() => setShowEditPopup(true)}
                        className="gap-2 shadow-lg shadow-primary/20"
                    >
                        <Settings size={16} /> Edit Profile
                    </Button>
                </div>
            </div>

            {/* The Edit Profile Modal */}
            {showEditPopup === true ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-2xl border-border/50 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
                        <form onSubmit={onSaveProfile}>
                            <CardHeader className="bg-muted/10 border-b border-border/50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                            <Settings size={20} />
                                        </div>
                                        <div>
                                            <CardTitle>Edit Profile Details</CardTitle>
                                            <CardDescription>Update your personal info here</CardDescription>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" type="button" onClick={function() { setShowEditPopup(false); }}>
                                        <X size={18} />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-primary">Choose Avatar Style</h3>
                                    <div className="grid grid-cols-5 gap-3">
                                        {myAvatars.map(function(item) {
                                            // Check if this avatar is selected
                                            let isThisOneActive = inputAvatarSeed.indexOf(item.id) === 0;

                                            return (
                                                <div 
                                                    key={item.id}
                                                    onClick={function() { pickAvatar(item.id); }}
                                                    className={`cursor-pointer group relative rounded-2xl border-2 transition-all overflow-hidden aspect-square flex items-center justify-center ${
                                                        isThisOneActive === true 
                                                            ? 'border-primary bg-primary/5 ring-4 ring-primary/10' 
                                                            : 'border-border/50 hover:border-border bg-muted/30'
                                                    }`}
                                                >
                                                    <img 
                                                        src={"https://api.dicebear.com/7.x/" + item.id + "/svg?seed=" + (user ? user.email : 'anon')} 
                                                        alt={item.name}
                                                        className={`w-full h-full object-cover p-1 transition-transform group-hover:scale-110 ${isThisOneActive === true ? '' : 'grayscale opacity-70'}`}
                                                    />
                                                    <div className="absolute inset-x-0 bottom-0 bg-black/60 py-0.5 text-[8px] text-center text-white font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {item.name}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-border/50">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-primary">Personal Details</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold">First Name</label>
                                            <Input 
                                                value={inputFirstName}
                                                onChange={function(e) { setInputFirstName(e.target.value); }}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold">Last Name</label>
                                            <Input 
                                                value={inputLastName}
                                                onChange={function(e) { setInputLastName(e.target.value); }}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold">Email (Cannot change)</label>
                                            <Input 
                                                value={inputEmail}
                                                disabled
                                                className="bg-muted"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold">Phone</label>
                                            <Input 
                                                value={inputPhone}
                                                onChange={function(e) { setInputPhone(e.target.value); }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-border/50">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-primary">Work Details</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold">Dept</label>
                                            <Input 
                                                value={inputDepartment}
                                                onChange={function(e) { setInputDepartment(e.target.value); }}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold">Role</label>
                                            <Input 
                                                value={inputDesignation}
                                                onChange={function(e) { setInputDesignation(e.target.value); }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-muted/10 border-t border-border/50 p-6 gap-3 justify-end">
                                <Button type="button" variant="outline" onClick={function() { setShowEditPopup(false); }}>Cancel</Button>
                                <Button type="submit" disabled={isSaving === true} className="gap-2 shadow-lg shadow-primary/20">
                                    {isSaving === true ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    Save
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            ) : null}

            {/* Sections display */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Security Info Card */}
                    <Card className="border-border/50 shadow-sm overflow-hidden">
                        <CardHeader className="bg-muted/10 border-b border-border/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-background rounded-lg border border-border shadow-sm">
                                    <Shield size={18} className="text-primary" />
                                </div>
                                <CardTitle className="text-lg">Security & Keys</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 rounded-xl bg-secondary/50 text-muted-foreground"><Mail size={16} /></div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Account Email</p>
                                    <p className="text-sm font-semibold text-foreground mt-0.5">{user ? user.email : ''}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 rounded-xl bg-secondary/50 text-muted-foreground"><Smartphone size={16} /></div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Phone</p>
                                    <p className="text-sm font-semibold text-foreground mt-0.5">{user && user.employee_details ? user.employee_details.phone : 'Not Set'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Employment Card */}
                    <Card className="border-border/50 shadow-sm overflow-hidden">
                        <CardHeader className="bg-muted/10 border-b border-border/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-background rounded-lg border border-border shadow-sm">
                                    <Building2 size={18} className="text-primary" />
                                </div>
                                <CardTitle className="text-lg">Employment Context</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 rounded-xl bg-secondary/50 text-muted-foreground"><MapPin size={16} /></div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Department</p>
                                    <p className="text-sm font-semibold text-foreground mt-0.5">{user && user.employee_details ? user.employee_details.department : 'None'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 rounded-xl bg-secondary/50 text-muted-foreground"><Briefcase size={16} /></div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Designation</p>
                                    <p className="text-sm font-semibold text-foreground mt-0.5">{user && user.employee_details ? user.employee_details.designation : 'None'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    {/* Active Permissions Card */}
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Key size={18} className="text-primary" /> Active Permissions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {user && user.permissions ? user.permissions.map(function(perm, index) {
                                return (
                                    <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 border border-border/50">
                                        <span className="text-xs font-bold tracking-tight">{perm}</span>
                                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                    </div>
                                );
                            }) : null}
                            
                            {(!user || !user.permissions || user.permissions.length === 0) ? (
                                <p className="text-sm text-muted-foreground italic text-center py-4">No permissions.</p>
                            ) : null}
                        </CardContent>
                    </Card>

                    {/* Security Check Card */}
                    <Card className="bg-primary text-primary-foreground border-none overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><Shield size={120} /></div>
                        <CardHeader><CardTitle>Security Check</CardTitle></CardHeader>
                        <CardContent>
                            <p className="text-sm font-medium">Your account is safe with us.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
