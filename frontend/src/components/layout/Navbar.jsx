import React from 'react';
import { useAuthStore } from '../../hooks/useAuthStore';
import { 
    LogOut, 
    Bell, 
    Search, 
    ChevronDown,
} from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuthStore();

    return (
        <header className="h-16 bg-background/80 backdrop-blur-md sticky top-0 z-40 border-b border-border px-6 flex items-center justify-between">
            <div className="flex-1 flex items-center gap-4">
                <div className="relative max-w-md w-full hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search anything..." 
                        className="w-full bg-muted/50 border-transparent focus:bg-background focus:border-border transition-all rounded-lg pl-10 pr-4 py-2 text-sm outline-none"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 text-muted-foreground hover:bg-secondary rounded-lg transition-colors relative">
                    <Bell size={18} />
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-destructive rounded-full border border-background" />
                </button>

                <div className="h-8 w-[1px] bg-border mx-2" />

                <div className="flex items-center gap-3 pl-2 group cursor-pointer">
                    <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center overflow-hidden ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'admin'}`}
                            alt="avatar"
                        />
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-semibold text-foreground leading-none">{user?.first_name} {user?.last_name}</p>
                        <p className="text-[11px] text-muted-foreground mt-1 uppercase tracking-wider font-bold">
                            {user?.permissions?.length > 0 ? 'Verified Agent' : 'Guest'}
                        </p>
                    </div>
                    <ChevronDown size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>

                <div className="h-8 w-[1px] bg-border mx-2" />
                
                <button
                    onClick={logout}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg transition-all"
                >
                    <LogOut size={16} />
                    <span className="hidden md:inline">Logout</span>
                </button>
            </div>
        </header>
    );
};

export default Navbar;
