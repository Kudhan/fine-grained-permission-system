import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, ShieldCheck, UserCircle, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PermissionGate } from '../../hooks/usePermission';

const NavItem = ({ to, icon: Icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${isActive
                ? 'bg-primary-600 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`
        }
    >
        <Icon size={20} />
        {label}
    </NavLink>
);

const Sidebar = () => {
    const { logout, user } = useAuth();

    return (
        <div className="flex w-64 flex-col bg-gray-900 text-white">
            <div className="flex h-16 items-center justify-center border-b border-gray-800 px-6">
                <h1 className="text-xl font-bold text-primary-500">SaaS Permissions</h1>
            </div>

            <nav className="flex-1 space-y-1 py-4">
                <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />

                <PermissionGate permission="VIEW_EMPLOYEE">
                    <NavItem to="/employees" icon={Users} label="Employees" />
                </PermissionGate>

                <PermissionGate permission="ASSIGN_PERMISSION">
                    <NavItem to="/permissions" icon={ShieldCheck} label="Permissions" />
                </PermissionGate>

                <PermissionGate permission="VIEW_SELF">
                    <NavItem to="/profile" icon={UserCircle} label="My Profile" />
                </PermissionGate>
            </nav>

            <div className="border-t border-gray-800 p-4">
                <div className="mb-4 px-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">User</p>
                    <p className="truncate text-sm font-medium text-gray-200">{user?.email}</p>
                </div>
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-red-600 hover:text-white"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
