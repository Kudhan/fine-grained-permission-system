import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuthStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { 
    ArrowLeft, 
    Save, 
    Loader2, 
    User, 
    Mail, 
    Phone, 
    Building2, 
    Briefcase,
    Calendar
} from 'lucide-react';
import apiClient from '../api/client';
import { toast } from 'sonner';

const EmployeeFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;
    
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        department: '',
        designation: '',
        date_joined: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);

    useEffect(() => {
        if (isEdit) {
            const fetchEmployee = async () => {
                try {
                    const response = await apiClient.get(`/employees/${id}/`);
                    setFormData(response.data.data);
                } catch (err) {
                    toast.error("Failed to load employee details");
                    navigate('/employees');
                } finally {
                    setFetching(false);
                }
            };
            fetchEmployee();
        }
    }, [id, isEdit, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEdit) {
                await apiClient.put(`/employees/${id}/`, formData);
                toast.success("Employee updated successfully");
            } else {
                await apiClient.post('/employees/', formData);
                toast.success("Employee created successfully");
            }
            navigate('/employees');
        } catch (err) {
            toast.error(err.response?.data?.message || "Operation failed");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return (
        <div className="flex h-[60vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <Button 
                variant="ghost" 
                onClick={() => navigate('/employees')}
                className="gap-2 text-muted-foreground hover:text-foreground mb-2"
            >
                <ArrowLeft size={16} />
                Back to Employees
            </Button>

            <div className="">
                <h1 className="text-3xl font-bold tracking-tight">{isEdit ? 'Edit Employee' : 'Add New Employee'}</h1>
                <p className="text-muted-foreground mt-1">
                    {isEdit ? `Update profile for ${formData.first_name} ${formData.last_name}` : 'Create a new profile in your organization.'}
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="border-border/50 shadow-xl overflow-hidden">
                    <CardHeader className="bg-muted/10 border-b border-border/50">
                        <CardTitle className="text-lg">Personnel Details</CardTitle>
                        <CardDescription>All fields marked with an asterisk are required.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        {/* Personal Info */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                <User size={14} /> Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">First Name *</label>
                                    <Input 
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        placeholder="Enter first name"
                                        required
                                        className="h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Last Name *</label>
                                    <Input 
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        placeholder="Enter last name"
                                        required
                                        className="h-10"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                <Mail size={14} /> Contact Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email Address *</label>
                                    <Input 
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="name@company.com"
                                        required
                                        className="h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Phone Number</label>
                                    <Input 
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+1 (555) 000-0000"
                                        className="h-10"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Professional Info */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                <Briefcase size={14} /> Employment Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Department *</label>
                                    <Input 
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        placeholder="e.g. Engineering"
                                        required
                                        className="h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Designation *</label>
                                    <Input 
                                        name="designation"
                                        value={formData.designation}
                                        onChange={handleChange}
                                        placeholder="e.g. Senior Software Engineer"
                                        required
                                        className="h-10"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 sm:max-w-xs">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Calendar size={14} className="text-muted-foreground" /> 
                                    Date Joined *
                                </label>
                                <Input 
                                    name="date_joined"
                                    type="date"
                                    value={formData.date_joined}
                                    onChange={handleChange}
                                    required
                                    className="h-10"
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-muted/10 border-t border-border/50 p-6 flex justify-end gap-3">
                        <Button variant="outline" type="button" onClick={() => navigate('/employees')} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" className="gap-2 shadow-lg shadow-primary/20" disabled={loading}>
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            {isEdit ? 'Update Employee' : 'Save Employee'}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
};

export default EmployeeFormPage;
