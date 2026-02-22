import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuthStore } from '../../hooks/useAuthStore';
import { 
    LayoutDashboard, 
    Users, 
    ShieldAlert, 
    UserCircle, 
    Fingerprint,
    Settings,
    HelpCircle,
    History
} from 'lucide-react';
import { cn } from '../../lib/utils';

const Sidebar = () => {
    const { user, hasPermission } = useAuthStore();

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
        <aside className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0 hidden lg:flex">
            <div className="p-6">
                <div className="flex items-center gap-2.5 px-2">
                    <div className="bg-primary p-2 rounded-xl text-primary-foreground shadow-lg shadow-primary/20">
                        <Fingerprint size={20} className="fill-current" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Fine-Grained PS</span>
                </div>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-8 overflow-y-auto">
                {menuItems.map((group, idx) => (
                    <div key={idx} className="space-y-1">
                        <h3 className="px-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            {group.label}
                        </h3>
                        <div className="space-y-1">
                            {group.items.filter(item => item.show).map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    className={({ isActive }) => cn(
                                        "flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                                        isActive 
                                            ? "bg-secondary text-foreground shadow-sm" 
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
            </nav>

            <div className="p-4 border-t border-border">
                <Link to="/profile" className="block bg-muted/50 hover:bg-muted rounded-xl p-4 transition-colors cursor-pointer group">
                    <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">{user?.email}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Free Plan</p>
                    <div className="mt-3 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-2/3 rounded-full" />
                    </div>
                </Link>
            </div>
        </aside>
    );
};

export default Sidebar;
