import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, LogOut, LayoutDashboard, Users, ShieldAlert, UserCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useAuth();

    const navItems = [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/employees', label: 'Employees', icon: Users },
        { to: '/permissions', label: 'Permissions', icon: ShieldAlert },
        { to: '/profile', label: 'Profile', icon: UserCircle },
    ];

    return (
        <nav className="h-20 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-shubakar-border px-8 flex items-center justify-between">
            <div className="flex items-center gap-10">
                <div className="flex items-center gap-2">
                    <div className="bg-shubakar-primary p-2 rounded-xl text-white shadow-vibrant">
                        <Sparkles size={24} />
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-shubakar-text">SHUBAKAR</span>
                </div>

                <div className="hidden md:flex items-center gap-6">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex items-center gap-2 text-sm font-bold transition-all px-4 py-2 rounded-full ${isActive
                                    ? 'bg-shubakar-softBg text-shubakar-secondary shadow-sm'
                                    : 'text-shubakar-muted hover:text-shubakar-primary hover:bg-shubakar-softBg/50'
                                }`
                            }
                        >
                            <item.icon size={18} />
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 pr-6 border-r border-shubakar-border">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-black text-shubakar-text leading-none">{user?.first_name} {user?.last_name || 'Admin'}</p>
                        <p className="text-[10px] font-bold text-shubakar-primary uppercase tracking-widest mt-0.5">Verified Principal</p>
                    </div>
                    <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-shubakar-primary to-shubakar-secondary p-0.5 shadow-soft">
                        <div className="h-full w-full rounded-[14px] bg-white overflow-hidden">
                            <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'admin'}`}
                                alt="avatar"
                            />
                        </div>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="p-3 text-shubakar-muted hover:text-shubakar-primary hover:bg-red-50 rounded-2xl transition-all"
                    title="Logout"
                >
                    <LogOut size={22} />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
