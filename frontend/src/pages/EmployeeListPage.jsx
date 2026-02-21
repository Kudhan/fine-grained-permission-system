import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, ChevronLeft, ChevronRight, Settings, UserMinus, User, Sparkles } from 'lucide-react';
import apiClient from '../api/client';
import { PermissionGate } from '../hooks/usePermission';

const StatusBadge = ({ label, type }) => {
    const colors = {
        manager: 'bg-shubakar-accent text-shubakar-text',
        admin: 'bg-shubakar-secondary text-white',
        auditor: 'bg-shubakar-primary text-white',
    };
    return (
        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm ${colors[type.toLowerCase()] || 'bg-slate-200'}`}>
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
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees(page);
    }, [page]);

    const handleDelete = async (id) => {
        if (window.confirm('Strike user from active personnel?')) {
            try {
                await apiClient.delete(`/employees/${id}/`);
                fetchEmployees(page);
            } catch (error) {
                alert('Failed to delete');
            }
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-1000">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-1 bg-shubakar-primary rounded-full"></div>
                    <span className="text-[11px] font-black text-shubakar-primary uppercase tracking-[0.3em]">Personnel Registry</span>
                </div>
                <h1 className="text-4xl font-black text-shubakar-text tracking-tighter">Squad Management</h1>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="relative w-full max-w-lg">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-shubakar-muted" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] border-2 border-transparent bg-white shadow-soft focus:outline-none focus:border-shubakar-secondary/30 transition-all font-bold text-shubakar-text"
                    />
                </div>
                <PermissionGate permission="CREATE_EMPLOYEE">
                    <button
                        onClick={() => navigate('/employees/new')}
                        className="btn-vibrant flex items-center gap-2 min-w-[180px] justify-center"
                    >
                        <Plus size={20} />
                        Add Recruit
                    </button>
                </PermissionGate>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-soft border border-shubakar-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-shubakar-softBg/50 text-shubakar-muted border-b border-shubakar-border">
                            <tr>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-center w-20">Seq</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Name & Digital Identity</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Access Tiers</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-center">Protocol Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-shubakar-border">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-12 h-12 border-4 border-shubakar-primary border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-[10px] font-black text-shubakar-muted uppercase tracking-widest">Syncing Data...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : employees.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-24 text-center text-shubakar-muted font-bold italic">No active personnel found.</td>
                                </tr>
                            ) : (
                                employees.map((emp, idx) => (
                                    <tr key={emp.id} className="hover:bg-shubakar-softBg/30 transition-colors group">
                                        <td className="px-8 py-6 text-center">
                                            <span className="text-xs font-black text-shubakar-muted opacity-30">{(page - 1) * 10 + idx + 1}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-shubakar-softBg to-white p-1 border border-shubakar-border shadow-sm group-hover:scale-110 transition-transform">
                                                    <img
                                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.email}`}
                                                        className="rounded-xl"
                                                        alt="avatar"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-extrabold text-shubakar-text tracking-tight group-hover:text-shubakar-primary transition-colors">{emp.first_name} {emp.last_name}</p>
                                                    <p className="text-[10px] font-bold text-shubakar-muted opacity-70 tracking-tight">{emp.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <StatusBadge label="Manager" type="manager" />
                                                <StatusBadge label="Admin" type="admin" />
                                                <StatusBadge label="Auditor" type="auditor" />
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-center gap-5">
                                                <PermissionGate permission="EDIT_EMPLOYEE">
                                                    <button
                                                        onClick={() => navigate(`/employees/edit/${emp.id}`)}
                                                        className="p-3 bg-shubakar-softBg text-shubakar-secondary rounded-2xl hover:bg-shubakar-secondary hover:text-white transition-all shadow-sm"
                                                        title="Edit Profile"
                                                    >
                                                        <Settings size={18} />
                                                    </button>
                                                </PermissionGate>
                                                <PermissionGate permission="DELETE_EMPLOYEE">
                                                    <button
                                                        onClick={() => handleDelete(emp.id)}
                                                        className="p-3 bg-red-50 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                        title="Remove Member"
                                                    >
                                                        <UserMinus size={18} />
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

                <div className="px-8 py-6 bg-shubakar-softBg/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(1)}
                            className="px-4 py-2 rounded-xl bg-white border border-shubakar-border text-[10px] font-black uppercase tracking-widest hover:bg-shubakar-bg transition-colors"
                            disabled={page === 1}
                        >
                            First
                        </button>
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className="p-2 rounded-xl bg-white border border-shubakar-border text-shubakar-muted hover:text-shubakar-primary disabled:opacity-30 transition-all font-bold"
                            disabled={page === 1}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <div className="flex items-center px-4">
                            <span className="text-[11px] font-black text-shubakar-text">
                                PAGE <span className="text-shubakar-primary">{page}</span> OF {totalPages}
                            </span>
                        </div>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            className="p-2 rounded-xl bg-white border border-shubakar-border text-shubakar-muted hover:text-shubakar-primary disabled:opacity-30 transition-all font-bold"
                            disabled={page === totalPages}
                        >
                            <ChevronRight size={16} />
                        </button>
                        <button
                            onClick={() => setPage(totalPages)}
                            className="px-4 py-2 rounded-xl bg-white border border-shubakar-border text-[10px] font-black uppercase tracking-widest hover:bg-shubakar-bg transition-colors"
                            disabled={page === totalPages}
                        >
                            Last
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="h-6 w-1 bg-shubakar-secondary rounded-full"></div>
                        <p className="text-[10px] font-black text-shubakar-muted uppercase tracking-[0.2em]">
                            {totalCount} REGISTRY ENTRIES
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeListPage;
