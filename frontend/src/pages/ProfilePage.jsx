import React from 'react';
import { useAuthStore } from '../hooks/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
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
    Bell
} from 'lucide-react';

const ProfilePage = () => {
    const { user } = useAuthStore();

    const sections = [
        {
            title: "Security & Keys",
            description: "Manage your authentication tokens and security settings.",
            icon: Shield,
            items: [
                { label: "Account Email", value: user?.email, icon: Mail },
                { label: "Phone Number", value: "+1 (555) 123-4567", icon: Smartphone },
                { label: "Created At", value: new Date(user?.created_at).toLocaleDateString(), icon: Calendar },
            ]
        },
        {
            title: "Employment Context",
            description: "Details related to your organizational role.",
            icon: Building2,
            items: [
                { label: "Department", value: "Strategic Operations", icon: MapPin },
                { label: "Designation", value: "Senior System Analyst", icon: Briefcase },
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
                    <Button className="gap-2 shadow-lg shadow-primary/20">
                        <Settings size={16} /> Edit Profile
                    </Button>
                </div>
            </div>

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
