import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Settings as SettingsIcon, Shield, Bell, Globe } from 'lucide-react';

const SettingsPage = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-1">Configure your Fine-Grained PS workspace and preferences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-border/50">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="text-primary" size={20} />
                            <CardTitle>Security Preferences</CardTitle>
                        </div>
                        <CardDescription>Manage MfA and session timeouts</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 opacity-50">
                        <p className="text-sm italic">Security configurations coming soon in the next update.</p>
                    </CardContent>
                </Card>

                <Card className="border-border/50">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Bell className="text-blue-500" size={20} />
                            <CardTitle>Notification Center</CardTitle>
                        </div>
                        <CardDescription>Stay updated on permission changes</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 opacity-50">
                        <p className="text-sm italic">Email alerts and webhooks are under development.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SettingsPage;
