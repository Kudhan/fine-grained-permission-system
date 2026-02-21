import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, ChevronLeft, ChevronRight, Settings, UserMinus } from 'lucide-react';
import apiClient from '../api/client';
import { PermissionGate } from '../hooks/usePermission';

const StatusBadge = ({ label, type }) => {
    const colors = {
        manager: 'bg-status-manager',
        admin: 'bg-status-admin',
        auditor: 'bg-status-auditor',
    };
    return (
        <span className={`status-badge ${colors[type.toLowerCase()] || 'bg-slate-400'}`}>
            {label}
        </span>
    );
};

const EmployeeListPage = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const navigate = useNavigate();

    const fetchEmployees = async (p = 1) => {
        setLoading(true);
        try {
            const response = await apiClient.get(`/employees/?page=${p}`);
            if (response.data.success) {
                setEmployees(response.data.data.results);
                setTotalCount(response.data.data.count);
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
        if (window.confirm('Are you sure you want to remove this user?')) {
            try {
                await apiClient.delete(`/employees/${id}/`);
                fetchEmployees(page);
            } catch (error) {
                alert('Failed to delete employee');
            }
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <span>Home</span>
                    <span>&gt;</span>
                    <span>Permissions & Accounts</span>
                    <span>&gt;</span>
                    <span className="text-slate-400">User Management</span>
                </div>
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search User"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-brand-border bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all"
                    />
                </div>
                <PermissionGate permission="CREATE_EMPLOYEE">
                    <button
                        onClick={() => navigate('/employees/new')}
                        className="btn-primary flex items-center gap-2"
                    >
                        Add User
                    </button>
                </PermissionGate>
            </div>

            <div className="table-container">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead className="bg-brand-tableHeader text-slate-500 font-semibold border-b border-brand-border uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 w-10">
                                    <input type="checkbox" className="rounded border-slate-300 text-brand-accent focus:ring-brand-accent" />
                                </th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">User Role</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border">
                            <tr className="bg-slate-50/50">
                                <td colSpan="4" className="px-6 py-2 text-[11px] text-slate-400 font-medium italic">
                                    Showing {employees.length} of {totalCount} total Users
                                </td>
                            </tr>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-20 text-center">
                                        <div className="flex justify-center flex-col items-center gap-2">
                                            <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-slate-400 font-medium tracking-wide">Fetching Data...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : employees.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-20 text-center text-slate-400 font-medium">No users match your criteria.</td>
                                </tr>
                            ) : (
                                employees.map((emp) => (
                                    <tr key={emp.id} className="hover:bg-brand-bg transition-colors duration-150">
                                        <td className="px-6 py-4">
                                            <input type="checkbox" className="rounded border-slate-300 text-brand-accent focus:ring-brand-accent" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-slate-100 flex-shrink-0">
                                                    <img
                                                        src={`https://ui-avatars.com/api/?name=${emp.first_name}+${emp.last_name}&background=random&color=fff`}
                                                        className="rounded-full shadow-sm border border-brand-border"
                                                        alt="avatar"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900 leading-tight">{emp.first_name} {emp.last_name}</p>
                                                    <p className="text-xs text-slate-400">{emp.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {/* Simulated roles for visual match, actual logic stays behind the scenes or uses groups if added */}
                                                <StatusBadge label="Manager" type="manager" />
                                                <StatusBadge label="Admin" type="admin" />
                                                <StatusBadge label="Auditor" type="auditor" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-6">
                                                <PermissionGate permission="EDIT_EMPLOYEE">
                                                    <button
                                                        onClick={() => navigate(`/employees/edit/${emp.id}`)}
                                                        className="flex items-center gap-1.5 text-slate-500 hover:text-brand-header font-medium transition-colors group"
                                                    >
                                                        <Settings size={16} className="group-hover:rotate-45 transition-transform duration-300" />
                                                        <span className="text-[11px]">Modify Roles</span>
                                                    </button>
                                                </PermissionGate>
                                                <PermissionGate permission="DELETE_EMPLOYEE">
                                                    <button
                                                        onClick={() => handleDelete(emp.id)}
                                                        className="flex items-center gap-1.5 text-slate-500 hover:text-red-600 font-medium transition-colors"
                                                    >
                                                        <UserMinus size={16} />
                                                        <span className="text-[11px]">Remove User</span>
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

                {/* Improved Pagination Footer */}
                <div className="flex items-center justify-between border-t border-brand-border bg-brand-tableHeader/30 px-6 py-4">
                    <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-xs font-medium uppercase tracking-widest mr-2">displaying page</span>
                        <button className="px-3 py-1.5 rounded border border-brand-border bg-white text-xs font-semibold hover:bg-slate-50 transition-colors">First</button>
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className="p-1 px-2 rounded border border-brand-border bg-white text-slate-400 hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
                            disabled={page === 1}
                        >
                            <ChevronLeft size={14} />
                        </button>
                        <div className="flex items-center gap-1">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setPage(i + 1)}
                                    className={`w-8 h-8 flex items-center justify-center rounded text-xs font-bold transition-all ${page === i + 1 ? 'bg-slate-200 text-slate-900 border border-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            className="p-1 px-2 rounded border border-brand-border bg-white text-slate-400 hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
                            disabled={page === totalPages}
                        >
                            <ChevronRight size={14} />
                        </button>
                        <button className="px-3 py-1.5 rounded border border-brand-border bg-white text-xs font-semibold hover:bg-slate-50 transition-colors">Last</button>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 tracking-tight uppercase">
                            {employees.length} entries shown
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeListPage;
