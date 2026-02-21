import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Search, History, Filter, User } from 'lucide-react';
import apiClient from '../api/client';
import { format } from 'date-fns';

const AuditLogPage = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await apiClient.get('/audit/logs/');
                setLogs(response.data.data);
            } catch (err) {
                console.error("Failed to fetch audit logs", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log => 
        log.target_user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action_display.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.permission_code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getActionColor = (action) => {
        switch (action) {
            case 'PERMISSION_ASSIGNED': return 'bg-green-500/10 text-green-600 border-green-200';
            case 'PERMISSION_REMOVED': return 'bg-red-500/10 text-red-600 border-red-200';
            default: return 'bg-blue-500/10 text-blue-600 border-blue-200';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Security Audit Logs</h1>
                    <p className="text-muted-foreground mt-1">
                        Track every administrative action and permission change across the system.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input 
                            placeholder="Filter by user or action..." 
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <Card className="border-border/50 shadow-xl overflow-hidden">
                <CardHeader className="bg-muted/30 border-b border-border/50">
                    <div className="flex items-center gap-2">
                        <History size={20} className="text-primary" />
                        <div>
                            <CardTitle className="text-lg">Event History</CardTitle>
                            <CardDescription>Cryptographically traceable administrative events</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/20">
                                    <TableHead className="w-[200px]">Action</TableHead>
                                    <TableHead>Target User</TableHead>
                                    <TableHead>Permission</TableHead>
                                    <TableHead>Performed By</TableHead>
                                    <TableHead className="text-right">Timestamp</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array(5).fill(0).map((_, i) => (
                                        <TableRow key={i}>
                                            {Array(5).fill(0).map((_, j) => (
                                                <TableCell key={j}><div className="h-4 bg-muted animate-pulse rounded" /></TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : filteredLogs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                            No audit events found matching your criteria.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredLogs.map((log) => (
                                        <TableRow key={log.id} className="hover:bg-muted/10 transition-colors">
                                            <TableCell>
                                                <Badge className={getActionColor(log.action)} variant="outline">
                                                    {log.action_display}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${log.target_user_email}`} alt="avatar" />
                                                    </div>
                                                    <span className="font-medium text-sm">{log.target_user_email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <code className="text-[11px] px-1.5 py-0.5 bg-muted rounded border border-border font-mono text-foreground">
                                                    {log.permission_code}
                                                </code>
                                            </TableCell>
                                            <TableCell className="text-sm font-medium">
                                                {log.performed_by_email || 'System'}
                                            </TableCell>
                                            <TableCell className="text-right text-xs text-muted-foreground">
                                                {format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AuditLogPage;
