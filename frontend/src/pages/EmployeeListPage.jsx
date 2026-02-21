import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import apiClient from '../api/client';
import { PermissionGate } from '../hooks/usePermission';

const EmployeeListPage = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    const fetchEmployees = async (p = 1) => {
        setLoading(true);
        try {
            const response = await apiClient.get(`/employees/?page=${p}`);
            if (response.data.success) {
                setEmployees(response.data.data.results);
                // Calculate total pages based on count (drf default)
                setTotalPages(Math.ceil(response.data.data.count / 10));
            }
        } catch (error) {
            console.error('Failed to fetch employees', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees(page);
    }, [page]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await apiClient.delete(`/employees/${id}/`);
                fetchEmployees(page);
            } catch (error) {
                alert('Failed to delete employee');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
                    <p className="text-gray-600">Manage your workforce and their details.</p>
                </div>
                <PermissionGate permission="CREATE_EMPLOYEE">
                    <button
                        onClick={() => navigate('/employees/new')}
                        className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
                    >
                        <Plus size={18} />
                        Add Employee
                    </button>
                </PermissionGate>
            </div>

            <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600 font-medium">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Department</th>
                                <th className="px-6 py-4">Designation</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">Loading employees...</td>
                                </tr>
                            ) : employees.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">No employees found.</td>
                                </tr>
                            ) : (
                                employees.map((emp) => (
                                    <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {emp.first_name} {emp.last_name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{emp.email}</td>
                                        <td className="px-6 py-4 text-gray-600">{emp.department}</td>
                                        <td className="px-6 py-4 text-gray-600">{emp.designation}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <PermissionGate permission="EDIT_EMPLOYEE">
                                                    <button
                                                        onClick={() => navigate(`/employees/edit/${emp.id}`)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                </PermissionGate>
                                                <PermissionGate permission="DELETE_EMPLOYEE">
                                                    <button
                                                        onClick={() => handleDelete(emp.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </PermissionGate>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-100 bg-white px-6 py-4">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg disabled:opacity-50 transition-colors"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg disabled:opacity-50 transition-colors"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                        <p className="text-sm text-gray-600">
                            Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeeListPage;
