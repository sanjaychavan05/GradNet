import React, { useState } from 'react';
import { useAuth } from '/src/context/AuthContext.jsx';
import { useLocation, Link } from 'react-router-dom';
import logo from "../../assets/icons/gradnet-logo.png"
import {
    House, Database, NotepadTextDashed, MessageSquareText,
    MessageCircleCode, BookmarkCheck, User, Search, Settings,
    Sun, Moon, GraduationCap, UserCheck, LayoutDashboard,
    Settings2
} from "lucide-react"

function LeftSidebar({ closeMobile }) {
    const { user } = useAuth();
    const { pathname } = useLocation();
    const date = new Date();

    const [isDarkMode, setIsDarkMode] = useState(
        document.documentElement.classList.contains('dark')
    );

    const toggleTheme = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDarkMode(true);
        }
    };

    const iconSize = 22;

    const isActive = (path) => pathname === path;

    const linkClasses = (path) => `
        flex items-center gap-4 px-4 py-2.5 rounded-xl transition-all duration-200 group
        ${isActive(path)
            ? 'bg-primary/10 text-primary font-semibold shadow-[inset_0px_0px_0px_1px_rgba(var(--primary),0.05)]'
            : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground font-medium'
        }
    `;

    const navItems = [
        { label: 'Home', path: '/home', icon: House },
        { label: 'Jobs', path: '/jobs', icon: NotepadTextDashed },
        { label: 'Messages', path: '/messages', icon: MessageCircleCode },
        { label: 'Bookmarks', path: '/bookmarks', icon: BookmarkCheck },
        { label: 'Forums', path: '/forums', icon: MessageSquareText },
        { label: 'Search', path: '/search', icon: Search },
        { label: 'Profile', path: '/profile', icon: User },
        { label: 'Mentorship', path: '/mentorships', icon: GraduationCap},
        { label: 'My Mentors', path: '/my-mentorships', icon: LayoutDashboard}
    ];

    return (
        <div className="flex flex-col justify-between h-full bg-background">
            <div className="overflow-y-auto no-scrollbar">
                {/* Logo Section */}
                <Link to="/home" className="flex items-center px-6 py-6 group" onClick={closeMobile}>
                    <img src={logo} alt="Logo" className="h-8 w-8 transition-transform group-hover:scale-105" />
                    <h1 className="text-2xl font-semibold text-foreground tracking-tight">
                        radNet
                    </h1>
                </Link>

                <ul className="flex flex-col space-y-1 px-3">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <Link to={item.path} className={linkClasses(item.path)} onClick={closeMobile}>
                                <item.icon size={iconSize} />
                                <span className="text-xl tracking-wide">{item.label}</span>
                            </Link>
                        </li>
                    ))}
{/* 
                    {user && (user?.role === "current_student") && (
                        <li>
                                <Link to="/my-mentorships" className={linkClasses('/my-mentorships')} onClick={closeMobile}>
                                    <LayoutDashboard size={iconSize} />
                                    <span className="text-xl">My Mentors</span>
                                </Link>
                            </li>
                    )} */}
                    
                    {user && (user?.role === "admin" || user?.role === "faculty") && (
                        <>
                            <li>
                                <Link to="/mentorship-dashboard" className={linkClasses('/mentorship-dashboard')} onClick={closeMobile}>
                                    <LayoutDashboard size={iconSize} />
                                    <span className="text-xl">Mentor dashboard</span>
                                </Link>
                            </li>
                             <li>
                                <Link to="/alumni-list" className={linkClasses('/alumni-list')} onClick={closeMobile}>
                                    <Database size={iconSize} />
                                    <span className="text-xl">Alumni List</span>
                                </Link>
                            </li>
                        </>
                    )}
                    {user && (user?.role === "admin") && (
                        <>
                        <li>
                            <Link to="/admin" className={linkClasses('/admin')} onClick={closeMobile}>
                                <Settings2 size={iconSize} />
                                <span className="text-xl">Admin</span>
                            </Link>
                        </li>
                        </>
                    )}
                </ul>
            </div>

            {/* Bottom Footer Section */}
            <div className="p-4 mt-auto">
                <div className="flex items-end justify-between px-2 pt-4 border-t border-border/40">
                    <div className="flex flex-col gap-1">
                        <div className="flex gap-2 text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">
                            <Link to="/terms" className="hover:text-primary cursor-pointer transition-colors">Terms of Service</Link>
                        </div>
                        <p className="text-[11px] text-muted-foreground/60">
                            © {date.getFullYear()} GradNet
                        </p>
                    </div>

                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-xl border border-border/50 bg-card hover:bg-muted transition-all text-foreground shadow-sm active:scale-95 group"
                        aria-label="Toggle Theme"
                    >
                        {isDarkMode
                            ? <Sun size={18} className="text-yellow-500" />
                            : <Moon size={18} className="text-blue-400" />
                        }
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LeftSidebar;