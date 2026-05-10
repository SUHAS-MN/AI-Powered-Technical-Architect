import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { LogOut, Terminal, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${
            scrolled ? 'py-4' : 'py-8'
        }`}>
            <div className="max-w-7xl mx-auto px-2 md:px-6">
                <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={`glass-panel px-3 md:px-8 py-3 md:py-4 flex items-center justify-between border-white/5 transition-all duration-700 ${
                        scrolled ? 'bg-black/80 shadow-[0_20px_50px_rgba(0,0,0,1)] border-cyan-500/20' : 'bg-white/5'
                    }`}
                >
                    {/* Brand */}
                    <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-3 md:gap-4 group">
                        <div className="p-2 md:p-2.5 bg-cyan-500/10 rounded-xl group-hover:bg-cyan-500/20 transition-all border border-cyan-500/30">
                            <Terminal className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div className="hidden sm:flex flex-col">
                            <span className="text-xl font-black tracking-tighter text-white uppercase">TechArch</span>
                            <span className="text-[8px] font-black uppercase tracking-[0.5em] text-cyan-400/40 -mt-1">AI Architect</span>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <div className="flex items-center gap-3 md:gap-10">
                        {user ? (
                            <>
                                <Link 
                                    to="/dashboard" 
                                    className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${
                                        location.pathname === '/dashboard' ? 'text-cyan-400' : 'text-white/40 hover:text-white'
                                    }`}
                                >
                                    Dashboard
                                    {location.pathname === '/dashboard' && (
                                        <motion.div layoutId="nav-pill" className="absolute -bottom-2 left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_10px_#00f2ff]" />
                                    )}
                                </Link>
                                <div className="hidden md:block h-6 w-[1px] bg-white/10" />
                                <div className="flex items-center gap-3 md:gap-6">
                                    <div className="hidden md:flex flex-col items-end">
                                        <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">{user.name}</span>
                                        <span className="text-[8px] font-bold text-cyan-400/40 uppercase tracking-widest">Architect</span>
                                    </div>
                                    <button 
                                        onClick={handleLogout}
                                        className="p-2 md:p-3 rounded-xl bg-white/5 text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all border border-white/5"
                                    >
                                        <LogOut className="w-4 h-4 md:w-5 md:h-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white transition-colors">Login</Link>
                                <Link to="/register" className="btn-cyber flex items-center gap-1.5 md:gap-2 !px-3 !py-2 md:!px-6 md:!py-2.5">
                                    <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                                    <span className="text-black text-[10px] md:text-xs">Register</span>
                                </Link>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </nav>
    );
};

export default Navbar;
