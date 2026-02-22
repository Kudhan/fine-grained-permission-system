import React, { useState } from 'react';
import { useAuthStore } from '../../hooks/useAuthStore';
import { 
    LogOut, 
    Bell, 
    Search, 
    ChevronDown,
    Menu,
    X,
    LayoutDashboard,
    Users,
    ShieldAlert,
    History,
    Settings,
    HelpCircle,
    UserCircle,
    Sparkles
} from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

const Navbar = () => {
    const { user, logout, hasPermission } = useAuthStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const menuItems = [
        { 
            label: 'Overview', 
            items: [
                { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, show: true },
                { to: '/profile', label: 'My Profile', icon: UserCircle, show: hasPermission('VIEW_SELF') },
            ]
        },
        { 
            label: 'Management', 
            items: [
                { to: '/employees', label: 'Employees', icon: Users, show: hasPermission('VIEW_EMPLOYEE') },
                { to: '/permissions', label: 'Permissions', icon: ShieldAlert, show: hasPermission('ASSIGN_PERMISSION') },
                { to: '/audit-logs', label: 'Audit Logs', icon: History, show: hasPermission('ASSIGN_PERMISSION') },
            ]
        },
        {
            label: 'System',
            items: [
                { to: '/settings', label: 'Settings', icon: Settings, show: true },
                { to: '/help', label: 'Help & Docs', icon: HelpCircle, show: true },
            ]
        }
    ];

    return (
        <header className="h-16 bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b border-border px-4 md:px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
                {/* Mobile Menu Toggle */}
                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="lg:hidden p-2 hover:bg-secondary rounded-lg text-muted-foreground transition-colors"
                >
                    {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                {/* Logo - Mobile Only */}
                <Link to="/" className="lg:hidden flex items-center gap-2">
                    <div className="bg-primary p-1.5 rounded-lg text-primary-foreground">
                        <Sparkles size={16} className="fill-current" />
                    </div>
                </Link>

                <div className="relative max-w-md w-full hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search anything..." 
                        className="w-full bg-muted/50 border-transparent focus:bg-background focus:border-border transition-all rounded-lg pl-10 pr-4 py-2 text-sm outline-none"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                <button className="p-2 text-muted-foreground hover:bg-secondary rounded-lg transition-colors relative">
                    <Bell size={18} />
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-destructive rounded-full border border-background" />
                </button>

                <div className="hidden sm:block h-8 w-[1px] bg-border mx-1" />

                <Link to="/profile" className="flex items-center gap-2 md:gap-3 pl-1 group cursor-pointer leading-tight">
                    <div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-secondary flex items-center justify-center overflow-hidden ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'admin'}`}
                            alt="avatar"
                        />
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-xs md:text-sm font-semibold text-foreground leading-none">{user?.first_name}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider font-bold">
                            {user?.permissions?.length > 0 ? 'Agent' : 'Guest'}
                        </p>
                    </div>
                </Link>

                <div className="h-8 w-[1px] bg-border mx-1" />
                
                <button
                    onClick={logout}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg transition-all"
                    title="Logout"
                >
                    <LogOut size={18} />
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden mt-16 animate-in fade-in duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <div 
                        className="w-72 h-[calc(100vh-4rem)] bg-card border-r border-border p-6 space-y-8 overflow-y-auto animate-in slide-in-from-left duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {menuItems.map((group, idx) => (
                            <div key={idx} className="space-y-1">
                                <h3 className="px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
                                    {group.label}
                                </h3>
                                <div className="space-y-1">
                                    {group.items.filter(item => item.show).map((item) => (
                                        <NavLink
                                            key={item.to}
                                            to={item.to}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={({ isActive }) => cn(
                                                "flex items-center gap-4 px-4 py-3 text-sm font-bold rounded-xl transition-all",
                                                isActive 
                                                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                                                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                                            )}
                                        >
                                            <item.icon size={18} />
                                            {item.label}
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
                        ))}
                        
                        <div className="pt-8 border-t border-border">
                            <div className="bg-muted/30 rounded-2xl p-4 border border-border/50">
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-2">Authenticated User</p>
                                <p className="text-[11px] font-bold text-foreground truncate">{user?.email}</p>
                                <button 
                                    onClick={logout}
                                    className="w-full mt-4 flex items-center justify-center gap-2 py-2 text-[10px] font-black uppercase tracking-widest bg-destructive/10 text-destructive rounded-lg hover:bg-destructive hover:text-white transition-all"
                                >
                                    <LogOut size={14} /> Terminate Session
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
