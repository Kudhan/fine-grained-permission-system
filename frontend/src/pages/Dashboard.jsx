import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, ShieldCheck, Activity } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
            <div className={`rounded-lg p-3 ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.first_name}!</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    icon={Users}
                    label="Total Employees"
                    value="-- "
                    color="bg-blue-500"
                />
                <StatCard
                    icon={ShieldCheck}
                    label="Your Permissions"
                    value={user?.permissions?.length || 0}
                    color="bg-purple-500"
                />
                <StatCard
                    icon={Activity}
                    label="System Status"
                    value="Healthy"
                    color="bg-green-500"
                />
            </div>

            <div className="rounded-xl bg-white p-8 shadow-sm border border-gray-100">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Your Current Permissions</h3>
                <div className="flex flex-wrap gap-2">
                    {user?.permissions?.map((perm) => (
                        <span
                            key={perm}
                            className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 border border-primary-100"
                        >
                            {perm}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
