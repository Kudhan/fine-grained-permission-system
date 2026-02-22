import React, { useState } from 'react';
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle, 
    CardDescription 
} from '../components/ui/card';
import { 
    Settings as SettingsIcon, 
    Shield, 
    Bell, 
    Moon, 
    Sun, 
    Lock, 
    Eye, 
    EyeOff,
    Loader2,
    CheckCircle2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { useAuthStore } from '../hooks/useAuthStore';
import { toast } from 'sonner';
import apiClient from '../api/client';

const SettingsPage = () => {
    const { theme, setTheme } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    // Change Password State
    const [passwords, setPasswords] = useState({
        old_password: '',
        new_password: '',
        confirm_password: ''
    });

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwords.new_password !== passwords.confirm_password) {
            toast.error("New passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const response = await apiClient.patch('/auth/change-password/', passwords);
            toast.success("Password updated successfully");
            setPasswords({ old_password: '', new_password: '', confirm_password: '' });
        } catch (err) {
            const errorData = err.response?.data?.errors;
            if (errorData) {
                Object.values(errorData).flat().forEach(msg => toast.error(msg));
            } else {
                toast.error(err.response?.data?.message || "Failed to update password");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-1">
                <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Settings
                </h1>
                <p className="text-muted-foreground">Customize your security, appearance, and alerts.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column - Forms */}
                <div className="lg:col-span-12 space-y-8">
                    
                    {/* Appearance */}
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Sun className="dark:hidden" size={20} />
                                    <Moon className="hidden dark:block" size={20} />
                                </div>
                                <div>
                                    <CardTitle className="text-xl">Appearance</CardTitle>
                                    <CardDescription>Choose how the system looks for you</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button 
                                onClick={() => setTheme('light')}
                                className={`flex items-center gap-3 md:gap-4 p-4 rounded-2xl border-2 transition-all ${
                                    theme === 'light' 
                                        ? 'border-primary bg-primary/5 ring-4 ring-primary/10' 
                                        : 'border-border/50 hover:border-border bg-muted/30'
                                }`}
                            >
                                <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-white shadow-sm flex items-center justify-center border border-border shrink-0">
                                    <Sun size={20} className="text-orange-500 md:w-6 md:h-6" />
                                </div>
                                <div className="text-left min-w-0">
                                    <p className="font-bold text-sm md:text-base text-foreground truncate">Light Mode</p>
                                    <p className="text-[10px] md:text-xs text-muted-foreground lowercase truncate">Clean & Pro</p>
                                </div>
                                {theme === 'light' && <CheckCircle2 className="ml-auto text-primary shrink-0" size={18} />}
                            </button>

                            <button 
                                onClick={() => setTheme('dark')}
                                className={`flex items-center gap-3 md:gap-4 p-4 rounded-2xl border-2 transition-all ${
                                    theme === 'dark' 
                                        ? 'border-primary bg-primary/5 ring-4 ring-primary/10' 
                                        : 'border-border/50 hover:border-border bg-muted/30'
                                }`}
                            >
                                <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-slate-900 shadow-sm flex items-center justify-center border border-white/10 shrink-0">
                                    <Moon size={20} className="text-indigo-400 md:w-6 md:h-6" />
                                </div>
                                <div className="text-left min-w-0">
                                    <p className="font-bold text-sm md:text-base text-foreground truncate">Dark Mode</p>
                                    <p className="text-[10px] md:text-xs text-muted-foreground lowercase truncate">Eye Strain Fix</p>
                                </div>
                                {theme === 'dark' && <CheckCircle2 className="ml-auto text-primary shrink-0" size={18} />}
                            </button>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Security */}
                        <Card className="border-border/50 overflow-hidden relative">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                                        <Lock size={20} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">Security</CardTitle>
                                        <CardDescription>Update your authorization credentials</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handlePasswordChange} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">Current Password</label>
                                        <div className="relative">
                                            <Input 
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                className="bg-muted/30 border-none h-11"
                                                value={passwords.old_password}
                                                onChange={(e) => setPasswords({...passwords, old_password: e.target.value})}
                                                required
                                            />
                                            <button 
                                                type="button"
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">New Password</label>
                                        <Input 
                                            type="password" 
                                            placeholder="••••••••"
                                            className="bg-muted/30 border-none h-11"
                                            value={passwords.new_password}
                                            onChange={(e) => setPasswords({...passwords, new_password: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">Confirm New Password</label>
                                        <Input 
                                            type="password" 
                                            placeholder="••••••••"
                                            className="bg-muted/30 border-none h-11"
                                            value={passwords.confirm_password}
                                            onChange={(e) => setPasswords({...passwords, confirm_password: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <Button 
                                        type="submit" 
                                        className="w-full h-11 shadow-lg shadow-primary/20 mt-2"
                                        disabled={loading}
                                    >
                                        {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : <Shield className="mr-2" size={18} />}
                                        Update Password
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Notifications */}
                        <Card className="border-border/50 overflow-hidden relative grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all cursor-not-allowed group">
                            <div className="absolute inset-0 z-10 bg-background/50 backdrop-blur-[1px] flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                <Badge variant="secondary" className="px-4 py-2 text-sm shadow-xl font-bold bg-background/90 border-border">Coming Soon</Badge>
                            </div>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                        <Bell size={20} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">Notifications</CardTitle>
                                        <CardDescription>Configure how you get alerted</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50">
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-bold">Email Alerts</p>
                                        <p className="text-xs text-muted-foreground">Receive updates on permission changes</p>
                                    </div>
                                    <div className="h-6 w-11 rounded-full bg-primary/20 relative cursor-pointer">
                                        <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-primary shadow-sm" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50">
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-bold">Desktop Notifications</p>
                                        <p className="text-xs text-muted-foreground">Real-time alerts in your browser</p>
                                    </div>
                                    <div className="h-6 w-11 rounded-full bg-muted relative">
                                        <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50">
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-bold">Audit Reports</p>
                                        <p className="text-xs text-muted-foreground">Weekly security summary via email</p>
                                    </div>
                                    <div className="h-6 w-11 rounded-full bg-muted relative">
                                        <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
