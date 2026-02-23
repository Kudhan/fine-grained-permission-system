import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Search, History, ChevronLeft, ChevronRight, Hash } from 'lucide-react';
import apiClient from '../api/client';
import { format } from 'date-fns';

const AuditLogPage = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 10;

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/audit/logs/', {
                params: {
                    page: page,
                    search: searchTerm,
                    page_size: pageSize
                }
            });
            // Handle both paginated and non-paginated responses for safety
            if (response.data.data.results) {
                setLogs(response.data.data.results);
                setTotalCount(response.data.data.count);
            } else {
                setLogs(response.data.data);
                setTotalCount(response.data.data.length);
            }
        } catch (err) {
            console.error("Failed to fetch audit logs", err);
        } finally {
            setLoading(false);
        }
    }, [page, searchTerm]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchLogs();
        }, 500); // Debounce search
        return () => clearTimeout(timeoutId);
    }, [fetchLogs]);

    const totalPages = Math.ceil(totalCount / pageSize);

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
                            placeholder="Search by user, action or code..." 
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(1); // Reset to first page on search
                            }}
                        />
                    </div>
                </div>
            </div>

            <Card className="border-border/50 shadow-xl overflow-hidden">
                <CardHeader className="bg-muted/30 border-b border-border/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <History size={20} className="text-primary" />
                            <div>
                                <CardTitle className="text-lg">Event History</CardTitle>
                                <CardDescription>Cryptographically traceable administrative events</CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                            <Hash size={14} className="text-primary" />
                            <span className="text-xs font-bold text-primary">Total Events: {totalCount}</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {/* Desktop View */}
                    <div className="hidden md:block overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/20">
                                    <TableHead className="w-[180px]">Action</TableHead>
                                    <TableHead>Target User</TableHead>
                                    <TableHead>Permission</TableHead>
                                    <TableHead>Agent</TableHead>
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
                                ) : logs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic">
                                            No audit events found matching your criteria.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    logs.map((log) => (
                                        <TableRow key={log.id} className="hover:bg-muted/10 transition-colors">
                                            <TableCell>
                                                <Badge className={getActionColor(log.action)} variant="outline">
                                                    {log.action_display}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center overflow-hidden border border-border/50">
                                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${log.target_user_email}`} alt="avatar" />
                                                    </div>
                                                    <span className="font-semibold text-xs truncate max-w-[150px]">{log.target_user_email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <code className="text-[10px] px-1.5 py-0.5 bg-muted rounded border border-border font-mono font-bold text-foreground">
                                                    {log.permission_code}
                                                </code>
                                            </TableCell>
                                            <TableCell className="text-xs font-bold text-muted-foreground truncate max-w-[120px]">
                                                {log.performed_by_email || 'SYSTEM'}
                                            </TableCell>
                                            <TableCell className="text-right text-[10px] font-bold text-muted-foreground/60">
                                                {format(new Date(log.timestamp), 'MMM dd, HH:mm:ss')}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden divide-y divide-border/20">
                        {loading ? (
                            Array(3).fill(0).map((_, i) => (
                                <div key={i} className="p-4 space-y-3">
                                    <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                                    <div className="h-3 w-48 bg-muted animate-pulse rounded" />
                                </div>
                            ))
                        ) : logs.length === 0 ? (
                            <div className="p-10 text-center text-xs text-muted-foreground italic">
                                No logs found.
                            </div>
                        ) : (
                            logs.map((log) => (
                                <div key={log.id} className="p-4 space-y-3 hover:bg-muted/5 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <Badge className={`${getActionColor(log.action)} text-[9px] px-2 py-0`} variant="outline">
                                            {log.action_display}
                                        </Badge>
                                        <span className="text-[9px] font-bold text-muted-foreground/50">
                                            {format(new Date(log.timestamp), 'HH:mm:ss')}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 rounded-full bg-secondary overflow-hidden border border-border/50">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${log.target_user_email}`} alt="avatar" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[11px] font-bold truncate leading-none">{log.target_user_email}</p>
                                            <p className="text-[9px] text-muted-foreground mt-1 truncate">
                                                Agent: <span className="font-bold text-foreground/70">{log.performed_by_email || 'SYSTEM'}</span>
                                            </p>
                                        </div>
                                        <code className="text-[9px] px-1.5 py-0.5 bg-muted rounded border border-border font-mono font-bold">
                                            {log.permission_code}
                                        </code>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination Footer */}
                    {!loading && totalCount > pageSize && (
                        <div className="flex items-center justify-between px-6 py-4 bg-muted/20 border-t border-border/50">
                            <div className="text-xs text-muted-foreground font-medium">
                                Showing <span className="text-foreground">{(page - 1) * pageSize + 1}</span> to <span className="text-foreground">{Math.min(page * pageSize, totalCount)}</span> of <span className="text-foreground">{totalCount}</span> events
                            </div>
                            <div className="flex items-center gap-2">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="h-8 w-8 p-0"
                                >
                                    <ChevronLeft size={16} />
                                </Button>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        // Simple pagination logic to show current +/- 2 pages
                                        let pageNum;
                                        if (totalPages <= 5) pageNum = i + 1;
                                        else if (page <= 3) pageNum = i + 1;
                                        else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                                        else pageNum = page - 2 + i;

                                        return (
                                            <Button
                                                key={pageNum}
                                                variant={page === pageNum ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setPage(pageNum)}
                                                className="h-8 w-8 p-0 text-xs font-bold"
                                            >
                                                {pageNum}
                                            </Button>
                                        );
                                    })}
                                </div>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="h-8 w-8 p-0"
                                >
                                    <ChevronRight size={16} />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AuditLogPage;
