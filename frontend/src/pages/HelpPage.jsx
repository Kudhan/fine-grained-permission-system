import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { HelpCircle, BookOpen, MessageSquare, LifeBuoy } from 'lucide-react';

const HelpPage = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Help & Documentation</h1>
                <p className="text-muted-foreground mt-1">Learn how to master the Fine-Grained Permission OS.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-border/50 hover:border-primary/50 transition-colors cursor-pointer group">
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2 group-hover:scale-110 transition-transform">
                            <BookOpen className="text-primary" />
                        </div>
                        <CardTitle>Documentation</CardTitle>
                        <CardDescription>Read the detailed API and architecture guides.</CardDescription>
                    </CardHeader>
                </Card>

                <Card className="border-border/50 hover:border-blue-500/50 transition-colors cursor-pointer group">
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-blue-500/10 p-3 rounded-full w-fit mb-2 group-hover:scale-110 transition-transform">
                            <MessageSquare className="text-blue-600" />
                        </div>
                        <CardTitle>Support Community</CardTitle>
                        <CardDescription>Connect with other security engineers.</CardDescription>
                    </CardHeader>
                </Card>

                <Card className="border-border/50 hover:border-purple-500/50 transition-colors cursor-pointer group">
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-purple-500/10 p-3 rounded-full w-fit mb-2 group-hover:scale-110 transition-transform">
                            <LifeBuoy className="text-purple-600" />
                        </div>
                        <CardTitle>Direct Contact</CardTitle>
                        <CardDescription>Open a priority ticket with our experts.</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
};

export default HelpPage;
