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

const ProfilePage = () => {
    const { user, updateProfile } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        department: '',
        designation: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                phone: user.employee_details?.phone || '',
                department: user.employee_details?.department || '',
                designation: user.employee_details?.designation || ''
            });
        }
    }, [user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await updateProfile(formData);
        if (result.success) {
            toast.success("Profile updated successfully");
            setIsEditing(false);
        } else {
            toast.error(result.message || "Failed to update profile");
        }
        setLoading(false);
    };

    const sections = [
        {
            title: "Security & Keys",
            description: "Manage your authentication tokens and security settings.",
            icon: Shield,
            items: [
                { label: "Account Email", value: user?.email, icon: Mail },
                { label: "Phone Number", value: user?.employee_details?.phone || "Not Set", icon: Smartphone },
                { label: "Created At", value: user?.created_at ? new Date(user?.created_at).toLocaleDateString() : 'N/A', icon: Calendar },
            ]
        },
        {
            title: "Employment Context",
            description: "Details related to your organizational role.",
            icon: Building2,
            items: [
                { label: "Department", value: user?.employee_details?.department || "Not Assigned", icon: MapPin },
                { label: "Designation", value: user?.employee_details?.designation || "No Title", icon: Briefcase },
            ]
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-primary to-purple-600 p-0.5 shadow-2xl">
                        <div className="h-full w-full rounded-[22px] bg-card flex items-center justify-center overflow-hidden">
                            <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                                alt="avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">{user?.first_name} {user?.last_name}</h1>
                        <p className="text-muted-foreground flex items-center gap-2 mt-1 font-medium">
                            <Badge variant="success" className="h-5">Active Principal</Badge>
                            • {user?.email}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2">
                        <Bell size={16} /> Notification Settings
                    </Button>
                    <Button 
                        onClick={() => setIsEditing(true)}
                        className="gap-2 shadow-lg shadow-primary/20"
                    >
                        <Settings size={16} /> Edit Profile
                    </Button>
                </div>
            </div>

            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-2xl border-border/50 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
                        <form onSubmit={handleUpdate}>
                            <CardHeader className="bg-muted/10 border-b border-border/50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                            <Settings size={20} />
                                        </div>
                                        <div>
                                            <CardTitle>Edit Profile Details</CardTitle>
                                            <CardDescription>Update your personal and professional information.</CardDescription>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" type="button" onClick={() => setIsEditing(false)}>
                                        <X size={18} />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-primary">Personal Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold">First Name</label>
                                            <Input 
                                                value={formData.first_name}
                                                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                                                placeholder="First Name"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold">Last Name</label>
                                            <Input 
                                                value={formData.last_name}
                                                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                                                placeholder="Last Name"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold">Email Address</label>
                                            <Input 
                                                type="email"
                                                value={formData.email}
                                                disabled
                                                className="bg-muted"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold">Phone Number</label>
                                            <Input 
                                                value={formData.phone}
                                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-border/50">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-primary">Employment Context</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold">Department</label>
                                            <Input 
                                                value={formData.department}
                                                onChange={(e) => setFormData({...formData, department: e.target.value})}
                                                placeholder="e.g. Engineering"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold">Designation</label>
                                            <Input 
                                                value={formData.designation}
                                                onChange={(e) => setFormData({...formData, designation: e.target.value})}
                                                placeholder="e.g. Software Engineer"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-muted/10 border-t border-border/50 p-6 gap-3 justify-end">
                                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                                <Button type="submit" disabled={loading} className="gap-2 shadow-lg shadow-primary/20">
                                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    Save Changes
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {sections.map((section, idx) => (
                        <Card key={idx} className="border-border/50 shadow-sm overflow-hidden">
                            <CardHeader className="bg-muted/10 border-b border-border/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-background rounded-lg border border-border shadow-sm">
                                        <section.icon size={18} className="text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{section.title}</CardTitle>
                                        <CardDescription>{section.description}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {section.items.map((item, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="p-2.5 rounded-xl bg-secondary/50 text-muted-foreground">
                                            <item.icon size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{item.label}</p>
                                            <p className="text-sm font-semibold text-foreground mt-0.5">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="space-y-8">
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Key size={18} className="text-primary" /> Active Permissions
                            </CardTitle>
                            <CardDescription>Your current granular access rights</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {user?.permissions?.map((p, i) => (
                                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 border border-border/50">
                                    <span className="text-xs font-bold tracking-tight">{p}</span>
                                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                </div>
                            ))}
                            {(!user?.permissions || user.permissions.length === 0) && (
                                <p className="text-sm text-muted-foreground italic text-center py-4">No active permissions.</p>
                            )}
                        </CardContent>
                        <CardFooter className="pt-0">
                            <p className="text-[10px] text-muted-foreground italic">
                                Rights are managed by administrators via your security policy.
                            </p>
                        </CardFooter>
                    </Card>

                    <Card className="bg-primary text-primary-foreground border-none overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Shield size={120} />
                        </div>
                        <CardHeader>
                            <CardTitle>Security Check</CardTitle>
                            <CardDescription className="text-primary-foreground/70">Last checked: Today</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm font-medium">Your account is secured with end-to-end JWT encryption and multi-factor authorization logic.</p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="secondary" className="w-full font-bold">Verify Identity</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
