import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Box, User as UserIcon, LogOut, ChevronDown } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <header className="h-16 bg-brand-header text-white px-8 flex items-center justify-between shadow-md sticky top-0 z-50">
            <div className="flex items-center gap-2">
                <div className="bg-white/10 p-1.5 rounded-lg">
                    <Box className="text-brand-accent" size={24} />
                </div>
                <span className="text-xl font-bold tracking-tight">Dashee</span>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-sm font-semibold opacity-90">{user?.first_name} {user?.last_name || 'Hashim Briscam'}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gray-600 border-2 border-white/20 overflow-hidden">
                        <img
                            src={`https://ui-avatars.com/api/?name=${user?.first_name}+${user?.last_name}&background=6366f1&color=fff`}
                            alt="avatar"
                        />
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
                    title="Logout"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </header>
    );
};

export default Navbar;
