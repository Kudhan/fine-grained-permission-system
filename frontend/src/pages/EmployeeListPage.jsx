import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../hooks/useAuthStore';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { 
    Plus, 
    Search, 
    MoreHorizontal, 
    Edit, 
    Trash2, 
    Download,
    Mail,
    Phone,
    Building2,
    Briefcase,
    Users,
    ChevronLeft,
    ChevronRight,
    Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import { toast } from 'sonner';

const EmployeeListPage = () => {
    const { hasPermission } = useAuthStore();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [isExporting, setIsExporting] = useState(false);
    const navigate = useNavigate();
    const pageSize = 10;

    const fetchEmployees = async (page = 1, searchQuery = search) => {
        setLoading(true);
        try {
            const response = await apiClient.get(`/employees/?page=${page}&search=${searchQuery}`);
            if (response.data.data.results) {
                setEmployees(response.data.data.results);
                setTotalCount(response.data.data.count);
            } else {
                setEmployees(response.data.data);
                setTotalCount(response.data.data.length);
            }
        } catch (err) {
            toast.error("Failed to fetch employees");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchEmployees(1, search);
            setCurrentPage(1);
        }, 500); // Debounce search

        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        fetchEmployees(currentPage, search);
    }, [currentPage]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            try {
                await apiClient.delete(`/employees/${id}/`);
                toast.success("Employee deleted successfully");
                fetchEmployees(currentPage, search);
            } catch (err) {
                toast.error("Delete failed");
            }
        }
    };

    const handleExport = async () => {
        setIsExporting(true);
        try {
            // Fetch all matching employees for export (no pagination)
            // Note: If the backend doesn't support disabling pagination, we might need to send a large page_size
            const response = await apiClient.get(`/employees/?search=${search}&page_size=10000`);
            const allEmployees = response.data.data.results || response.data.data;

            if (allEmployees.length === 0) {
                toast.error("No employees to export");
                return;
            }

            const headers = ["ID", "First Name", "Last Name", "Email", "Phone", "Department", "Designation", "Date Joined"];
            const csvRows = [
                headers.join(","),
                ...allEmployees.map(emp => [
                    emp.id,
                    `"${emp.first_name.replace(/"/g, '""')}"`,
                    `"${emp.last_name.replace(/"/g, '""')}"`,
                    `"${emp.email}"`,
                    `"${emp.phone || 'N/A'}"`,
                    `"${emp.department.replace(/"/g, '""')}"`,
                    `"${emp.designation.replace(/"/g, '""')}"`,
                    `"${new Date(emp.date_joined).toLocaleDateString()}"`
                ].join(","))
            ];

            const csvContent = csvRows.join("\n");
            const BOM = '\uFEFF';
            const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `employees_export_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success("Employees exported successfully");
        } catch (err) {
            toast.error("Export failed");
        } finally {
            setIsExporting(false);
        }
    };

    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
                    <p className="text-muted-foreground mt-1">Manage and monitor organization personnel.</p>
                </div>
                {hasPermission('CREATE_EMPLOYEE') && (
                    <Button onClick={() => navigate('/employees/new')} className="gap-2 shadow-lg shadow-primary/20">
                        <Plus size={18} />
                        Add Employee
                    </Button>
                )}
            </div>

            <Card className="border-border/50 shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative max-w-sm w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <Input 
                                placeholder="Search employees..." 
                                className="pl-9 bg-background"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="gap-2"
                                onClick={handleExport}
                                disabled={isExporting}
                            >
                                {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                                {isExporting ? 'Exporting...' : 'Export'}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {/* Desktop View */}
                    <div className="hidden md:block">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/20 hover:bg-muted/20">
                                    <TableHead className="w-[250px] py-4">Employee</TableHead>
                                    <TableHead>Role & Dept</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><div className="h-10 bg-muted animate-pulse rounded-lg w-full" /></TableCell>
                                            <TableCell><div className="h-10 bg-muted animate-pulse rounded-lg w-full" /></TableCell>
                                            <TableCell><div className="h-10 bg-muted animate-pulse rounded-lg w-full" /></TableCell>
                                            <TableCell><div className="h-10 bg-muted animate-pulse rounded-lg w-full" /></TableCell>
                                            <TableCell><div className="h-10 bg-muted animate-pulse rounded-lg w-full" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    employees.map((emp) => (
                                        <TableRow key={emp.id} className="group transition-colors">
                                            <TableCell className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-secondary-foreground font-bold">
                                                        {emp.first_name[0]}{emp.last_name[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-foreground">{emp.first_name} {emp.last_name}</p>
                                                        <p className="text-xs text-muted-foreground">Joined {new Date(emp.date_joined).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                                                        <Briefcase size={12} className="text-muted-foreground" />
                                                        {emp.designation}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                                        <Building2 size={12} />
                                                        {emp.department}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1.5 text-xs">
                                                        <Mail size={12} className="text-muted-foreground" />
                                                        {emp.email}
                                                    </div>
                                                    {emp.phone && (
                                                        <div className="flex items-center gap-1.5 text-[11px]">
                                                            <Phone size={12} className="text-muted-foreground" />
                                                            {emp.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="success">Active</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {hasPermission('EDIT_EMPLOYEE') && (
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => navigate(`/employees/edit/${emp.id}`)}>
                                                            <Edit size={16} />
                                                        </Button>
                                                    )}
                                                    {hasPermission('DELETE_EMPLOYEE') && (
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(emp.id)}>
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    )}
                                                </div>
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
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="p-4 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-muted animate-pulse rounded-lg" />
                                        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                                    </div>
                                    <div className="h-3 w-48 bg-muted animate-pulse rounded" />
                                </div>
                            ))
                        ) : employees.length === 0 ? (
                            <div className="p-10 text-center text-muted-foreground italic text-sm">
                                No employees found.
                            </div>
                        ) : (
                            employees.map((emp) => (
                                <div key={emp.id} className="p-4 space-y-4 hover:bg-muted/5 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                                                {emp.first_name[0]}{emp.last_name[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">{emp.first_name} {emp.last_name}</p>
                                                <p className="text-[10px] text-muted-foreground capitalize">{emp.department} • {emp.designation}</p>
                                            </div>
                                        </div>
                                        <Badge variant="success" className="text-[9px] px-1.5 py-0">Active</Badge>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 gap-2 bg-muted/30 rounded-lg p-3">
                                        <div className="flex items-center gap-2 text-[10px]">
                                            <Mail size={12} className="text-muted-foreground" />
                                            <span className="truncate">{emp.email}</span>
                                        </div>
                                        {emp.phone && (
                                            <div className="flex items-center gap-2 text-[10px]">
                                                <Phone size={12} className="text-muted-foreground" />
                                                <span>{emp.phone}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-end gap-2 pt-1">
                                        {hasPermission('EDIT_EMPLOYEE') && (
                                            <Button variant="secondary" size="sm" className="h-7 text-[10px] px-3 font-bold" onClick={() => navigate(`/employees/edit/${emp.id}`)}>
                                                <Edit size={12} className="mr-1.5" /> Edit
                                            </Button>
                                        )}
                                        {hasPermission('DELETE_EMPLOYEE') && (
                                            <Button variant="ghost" size="sm" className="h-7 text-[10px] px-3 font-bold text-destructive hover:bg-destructive/10" onClick={() => handleDelete(emp.id)}>
                                                <Trash2 size={12} className="mr-1.5" /> Delete
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
                {totalPages > 1 && (
                    <div className="bg-muted/30 border-t border-border/50 px-6 py-4 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing <span className="font-semibold text-foreground">{((currentPage - 1) * pageSize) + 1}</span> to <span className="font-semibold text-foreground">{Math.min(currentPage * pageSize, totalCount)}</span> of <span className="font-semibold text-foreground">{totalCount}</span> results
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === 1 || loading}
                                onClick={() => setCurrentPage(p => p - 1)}
                                className="h-8"
                            >
                                <ChevronLeft size={16} className="mr-1" /> Previous
                            </Button>
                            <div className="flex items-center gap-1 px-4">
                                <span className="text-sm font-medium">Page {currentPage} of {totalPages}</span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === totalPages || loading}
                                onClick={() => setCurrentPage(p => p + 1)}
                                className="h-8"
                            >
                                Next <ChevronRight size={16} className="ml-1" />
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default EmployeeListPage;
