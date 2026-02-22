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
    Users
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import { toast } from 'sonner';

const EmployeeListPage = () => {
    const { hasPermission } = useAuthStore();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/employees/');
            setEmployees(response.data.data.results || response.data.data);
        } catch (err) {
            toast.error("Failed to fetch employees");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            try {
                await apiClient.delete(`/employees/${id}/`);
                toast.success("Employee deleted successfully");
                fetchEmployees();
            } catch (err) {
                toast.error("Delete failed");
            }
        }
    };

    const filteredEmployees = employees.filter(emp => 
        `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase()) ||
        emp.department.toLowerCase().includes(search.toLowerCase())
    );

    const handleExport = () => {
        if (employees.length === 0) {
            toast.error("No employees to export");
            return;
        }

        const headers = ["ID", "First Name", "Last Name", "Email", "Phone", "Department", "Designation", "Date Joined"];
        const csvContent = [
            headers.join(","),
            ...employees.map(emp => [
                emp.id,
                `"${emp.first_name}"`,
                `"${emp.last_name}"`,
                emp.email,
                emp.phone || "N/A",
                `"${emp.department}"`,
                `"${emp.designation}"`,
                emp.date_joined
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `employees_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Employees exported successfully");
    };

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
                            >
                                <Download size={14} />
                                Export
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
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
                            ) : filteredEmployees.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-2">
                                            <Users size={48} className="text-muted-foreground/30" />
                                            <p className="text-muted-foreground">No employees found.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredEmployees.map((emp) => (
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
                </CardContent>
            </Card>
        </div>
    );
};

export default EmployeeListPage;
