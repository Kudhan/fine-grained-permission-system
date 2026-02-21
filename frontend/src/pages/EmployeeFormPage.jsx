import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, User, Mail, Briefcase, Calendar, Phone, Globe, Shield } from 'lucide-react';
import apiClient from '../api/client';

const FormInput = ({ label, icon: Icon, ...props }) => (
    <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{label}</label>
        <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-accent transition-colors">
                <Icon size={18} />
            </div>
            <input
                {...props}
                className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-brand-border rounded-xl focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent focus:bg-white outline-none transition-all font-medium text-slate-700 shadow-sm"
            />
        </div>
    </div>
);

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
        date_joined: new Date().toISOString().split('T')[0],
    });

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);

    useEffect(() => {
        if (isEdit) {
            const fetchEmployee = async () => {
                try {
                    const res = await apiClient.get(`/employees/${id}/`);
                    if (res.data.success) {
                        setFormData(res.data.data);
                    }
                } catch (error) {
                    console.error(error);
                    alert('Failed to fetch employee details');
                    navigate('/employees');
                } finally {
                    setFetching(false);
                }
            };
            fetchEmployee();
        }
    }, [id, isEdit, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEdit) {
                await apiClient.put(`/employees/${id}/`, formData);
            } else {
                await apiClient.post('/employees/', formData);
            }
            navigate('/employees');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to save employee');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (fetching) return (
        <div className="flex h-screen items-center justify-center -mt-20">
            <Loader2 className="animate-spin text-brand-accent" size={48} />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        to="/employees"
                        className="p-3 bg-white rounded-2xl shadow-premium border border-brand-border text-slate-400 hover:text-brand-header hover:border-brand-accent transition-all group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-extrabold text-brand-header tracking-tight">
                            {isEdit ? 'Refine Personnel' : 'Onboard Employee'}
                        </h1>
                        <p className="text-slate-500 font-medium">Configure individual data and system associations.</p>
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn-primary flex items-center gap-2 h-14 px-10 shadow-lg shadow-brand-accent/20"
                >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save size={20} />}
                    {isEdit ? 'Sync Changes' : 'Initialize Profile'}
                </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2 bg-white rounded-[2.5rem] shadow-premium border border-brand-border p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-header/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 relative z-10">
                        <FormInput
                            label="First Name"
                            name="first_name"
                            icon={User}
                            value={formData.first_name}
                            onChange={handleChange}
                            placeholder="e.g. Lennert"
                            required
                        />
                        <FormInput
                            label="Last Name"
                            name="last_name"
                            icon={User}
                            value={formData.last_name}
                            onChange={handleChange}
                            placeholder="e.g. Nijenbijvank"
                            required
                        />
                        <FormInput
                            label="Professional Email"
                            name="email"
                            type="email"
                            icon={Mail}
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="lennert@dashee.com"
                            required
                        />
                        <FormInput
                            label="Contact Phone"
                            name="phone"
                            icon={Phone}
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+1 (555) 000-0000"
                        />
                        <FormInput
                            label="Department"
                            name="department"
                            icon={Globe}
                            value={formData.department}
                            onChange={handleChange}
                            placeholder="e.g. Engineering"
                            required
                        />
                        <FormInput
                            label="Designation"
                            name="designation"
                            icon={Briefcase}
                            value={formData.designation}
                            onChange={handleChange}
                            placeholder="e.g. Senior Architect"
                            required
                        />
                        <FormInput
                            label="Date Joined"
                            name="date_joined"
                            type="date"
                            icon={Calendar}
                            value={formData.date_joined}
                            onChange={handleChange}
                            required
                        />

                        <div className="md:col-span-2 mt-4 p-6 bg-brand-header/5 rounded-3xl border border-brand-header/10 flex items-start gap-4">
                            <div className="bg-brand-header p-3 rounded-xl text-brand-accent shadow-md">
                                <Shield size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-brand-header">Security Note</h4>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                                    Employee records are strictly audited. Creating or updating personnel will trigger a system-wide security log entry. Ensure all data conforms to corporate compliance standards.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EmployeeFormPage;
