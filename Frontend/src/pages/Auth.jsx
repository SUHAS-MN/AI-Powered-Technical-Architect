import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import api from '../utils/api';
import { Mail, Lock, User, ArrowRight, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Auth = ({ initialMode = 'login' }) => {
    useEffect(() => {
        document.title = initialMode === 'login' ? "Login | TechArch" : "Register | TechArch";
    }, [initialMode]);

    const [mode, setMode] = useState(initialMode);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
            const response = await api.post(endpoint, formData);
            const { user, accessToken } = response.data.data;
            await login(user, accessToken);
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Authentication failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 md:px-6 py-32 md:py-40">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg"
            >
                <div className="glass-panel p-6 md:p-12 border-cyan-500/10 shadow-[0_40px_80px_rgba(0,0,0,1)] relative overflow-hidden">
                    <div className="text-center mb-10 md:mb-12">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 glass-panel rounded-full mb-8 text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em] border-cyan-500/20">
                            <Shield className="w-3 h-3" />
                            {mode === 'login' ? 'User Login' : 'New Registration'}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tighter">
                            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AnimatePresence mode="wait">
                            {mode === 'register' && (
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-2"
                                >
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 ml-2">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                                        <input 
                                            type="text" 
                                            placeholder="Enter your name"
                                            className="cyber-input pl-14"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            required
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 ml-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                                <input 
                                    type="email" 
                                    placeholder="email@example.com"
                                    className="cyber-input pl-14"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 ml-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                                <input 
                                    type="password" 
                                    placeholder="••••••••"
                                    className="cyber-input pl-14"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="btn-cyber w-full py-5 !rounded-2xl flex items-center justify-center gap-3 group mt-10"
                        >
                            <span className="relative z-10 flex items-center gap-3 font-black uppercase tracking-widest text-xs text-black">
                                {loading ? 'Processing...' : mode === 'login' ? 'Login' : 'Register'}
                                {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                            </span>
                        </button>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-white/40 text-sm font-medium">
                            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                            <button 
                                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                                className="ml-2 text-cyan-400 font-black uppercase tracking-widest hover:underline text-xs"
                            >
                                {mode === 'login' ? 'Register Now' : 'Login Now'}
                            </button>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Auth;
