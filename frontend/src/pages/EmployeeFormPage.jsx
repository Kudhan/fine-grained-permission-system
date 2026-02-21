import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, User, Mail, Briefcase, Calendar, Phone, Globe, ShieldCheck, Zap } from 'lucide-react';
import apiClient from '../api/client';

const FormInput = ({ label, icon: Icon, ...props }) => (
    <div className="space-y-1.5">
        <label className="text-[10px] font-black text-shubakar-muted uppercase tracking-[0.2em] ml-2">{label}</label>
        <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-shubakar-muted group-focus-within:text-shubakar-primary transition-colors">
                <Icon size={18} />
            </div>
            <input
                {...props}
                className="block w-full pl-14 pr-6 py-4 bg-shubakar-softBg/50 border-2 border-transparent rounded-2xl focus:border-shubakar-primary/20 focus:bg-white outline-none transition-all font-bold text-shubakar-text placeholder:text-shubakar-muted/40"
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
            alert(error.response?.data?.message || 'Update Failed');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (fetching) return (
        <div className="flex h-screen items-center justify-center -mt-20">
            <Loader2 className="animate-spin text-shubakar-primary" size={48} />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <Link
                        to="/employees"
                        className="w-14 h-14 bg-white rounded-2xl shadow-soft border border-shubakar-border flex items-center justify-center text-shubakar-muted hover:text-shubakar-primary hover:border-shubakar-primary/30 hover:-translate-x-1 transition-all"
                    >
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Zap size={14} className="text-shubakar-accent fill-shubakar-accent" />
                            <span className="text-[11px] font-black text-shubakar-primary uppercase tracking-[0.3em]">{isEdit ? 'PROFILE ADJUSTMENT' : 'PERSONNEL ORIGINATION'}</span>
                        </div>
                        <h1 className="text-4xl font-black text-shubakar-text tracking-tighter leading-none italic">
                            {isEdit ? 'Refine Record' : 'Onboard Recruit'}
                        </h1>
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn-vibrant h-16 px-12 group"
                >
                    {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <div className="flex items-center gap-2">
                            <Save size={22} className="group-hover:rotate-12 transition-transform" />
                            <span className="text-lg">Finalize Protocol</span>
                        </div>
                    )}
                </button>
            </div>

            <form onSubmit={handleSubmit} className="glass-card p-1 md:p-1 relative overflow-hidden overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-shubakar-secondary/5 rounded-full blur-[100px] -mr-48 -mt-48"></div>

                <div className="p-10 md:p-12 space-y-10 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                        <FormInput
                            label="First Identity"
                            name="first_name"
                            icon={User}
                            value={formData.first_name}
                            onChange={handleChange}
                            placeholder="e.g. Lennert"
                            required
                        />
                        <FormInput
                            label="Secondary Identity"
                            name="last_name"
                            icon={User}
                            value={formData.last_name}
                            onChange={handleChange}
                            placeholder="e.g. Nijenbijvank"
                            required
                        />
                        <FormInput
                            label="Credential Email"
                            name="email"
                            type="email"
                            icon={Mail}
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="recruit@shubakar.com"
                            required
                        />
                        <FormInput
                            label="Comms Frequency"
                            name="phone"
                            icon={Phone}
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+91 000-000-0000"
                        />
                        <FormInput
                            label="Operational Dept"
                            name="department"
                            icon={Globe}
                            value={formData.department}
                            onChange={handleChange}
                            placeholder="e.g. Celebrations Ops"
                            required
                        />
                        <FormInput
                            label="Strategic Title"
                            name="designation"
                            icon={Briefcase}
                            value={formData.designation}
                            onChange={handleChange}
                            placeholder="e.g. Logistics Maestro"
                            required
                        />
                        <FormInput
                            label="Origination Date"
                            name="date_joined"
                            type="date"
                            icon={Calendar}
                            value={formData.date_joined}
                            onChange={handleChange}
                            required
                        />

                        <div className="md:col-span-2 mt-4 p-8 bg-shubakar-softBg/50 border-2 border-dashed border-shubakar-border rounded-[2rem] flex items-center gap-6">
                            <div className="bg-shubakar-secondary p-4 rounded-2xl text-white shadow-lg">
                                <ShieldCheck size={28} />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-shubakar-text tracking-tight uppercase">Security Clearance Notice</h4>
                                <p className="text-xs text-shubakar-muted font-bold leading-relaxed mt-1 italic">
                                    All recruitment data is synchronized via the Shubakar Secure Cloud. Unauthorized modifications are logged to the global audit feed.
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
