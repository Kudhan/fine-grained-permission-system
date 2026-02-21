import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import apiClient from '../api/client';

const EmployeeFormPage = () => {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(isEdit);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        department: '',
        designation: '',
        date_joined: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        if (isEdit) {
            const fetchEmployee = async () => {
                try {
                    const response = await apiClient.get(`/employees/${id}/`);
                    if (response.data.success) {
                        setFormData(response.data.data);
                    }
                } catch (error) {
                    console.error('Failed to fetch employee', error);
                    navigate('/employees');
                } finally {
                    setLoading(false);
                }
            };
            fetchEmployee();
        }
    }, [id, isEdit, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});

        try {
            const url = isEdit ? `/employees/${id}/` : '/employees/';
            const method = isEdit ? 'put' : 'post';
            const response = await apiClient[method](url, formData);

            if (response.data.success) {
                navigate('/employees');
            }
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                alert(error.response?.data?.message || 'Something went wrong');
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex h-64 items-center justify-center">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/employees')} className="p-2 hover:bg-white rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">
                    {isEdit ? 'Edit Employee' : 'New Employee'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">First Name</label>
                        <input
                            type="text"
                            name="first_name"
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
                            value={formData.first_name}
                            onChange={handleChange}
                        />
                        {errors.first_name && <p className="text-xs text-red-600">{errors.first_name}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Last Name</label>
                        <input
                            type="text"
                            name="last_name"
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
                            value={formData.last_name}
                            onChange={handleChange}
                        />
                        {errors.last_name && <p className="text-xs text-red-600">{errors.last_name}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                            type="text"
                            name="phone"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Department</label>
                        <input
                            type="text"
                            name="department"
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
                            value={formData.department}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Designation</label>
                        <input
                            type="text"
                            name="designation"
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
                            value={formData.designation}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Date Joined</label>
                        <input
                            type="date"
                            name="date_joined"
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
                            value={formData.date_joined}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4 border-t border-gray-100 pt-6">
                    <button
                        type="button"
                        onClick={() => navigate('/employees')}
                        className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex items-center gap-2 bg-primary-600 px-8 py-2.5 text-sm font-medium text-white hover:bg-primary-700 rounded-lg shadow-sm transition-colors disabled:bg-primary-400"
                    >
                        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={18} />}
                        {isEdit ? 'Update Employee' : 'Create Employee'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EmployeeFormPage;
