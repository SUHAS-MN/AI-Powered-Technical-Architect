import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Code, Shield, ArrowRight, Layers, Box, Terminal, Sparkles, Activity, Database, GitBranch } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

const LandingPage = () => {
    const { user } = useAuth();
    useEffect(() => {
        document.title = "TechArch | AI-Powered Technical Architect Engine";
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
    };

    return (
        <div className="pt-32 md:pt-40 pb-32 px-4 md:px-6">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="text-center mb-40"
                >
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-6 py-2.5 glass-panel rounded-full mb-10 text-[10px] font-black text-cyan-400 border-cyan-500/20 uppercase tracking-[0.4em]">
                        <Activity className="w-4 h-4 animate-pulse" />
                        Next-Gen Architecture Protocols Active
                    </motion.div>
                    
                    <motion.h1 variants={itemVariants} className="text-4xl md:text-7xl lg:text-9xl font-black mb-6 md:mb-10 tracking-tighter leading-tight text-white pb-4">
                        Design the <br />
                        <span className="gradient-heading italic">Infinite Core_</span>
                    </motion.h1>
                    
                    <motion.p variants={itemVariants} className="text-xl text-white/40 max-w-2xl mx-auto mb-16 font-medium leading-relaxed">
                        The precision engine for multi-layered technical systems. Our AI architect constructs spatial blueprints that evolve with your mission.
                    </motion.p>
                    
                    {user ? (
                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-8">
                            <Link to="/dashboard" className="btn-cyber !px-10 !py-4 md:!px-12 md:!py-6 !text-xs md:!text-sm !rounded-2xl w-full sm:w-auto text-center flex justify-center">
                                <span className="text-black">Open Mission Hub</span>
                            </Link>
                        </motion.div>
                    ) : (
                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-8">
                            <Link to="/register" className="btn-cyber !px-10 !py-4 md:!px-12 md:!py-6 !text-xs md:!text-sm !rounded-2xl w-full sm:w-auto text-center flex justify-center">
                                <span className="text-black">Register Now</span>
                            </Link>
                            <Link to="/login" className="text-white/40 hover:text-white font-black uppercase tracking-[0.2em] text-[10px] md:text-xs transition-all flex items-center gap-3 group mt-4 sm:mt-0">
                                Login to Account <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </motion.div>
                    )}
                </motion.div>

                {/* Bento Feature Grid */}
                <div className="grid lg:grid-cols-3 grid-rows-2 gap-8 h-auto lg:h-[800px]">
                    {/* Main Feature - Bento 1 */}
                    <motion.div 
                        whileInView={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 40 }}
                        transition={{ duration: 1 }}
                        className="lg:col-span-2 bento-card p-6 md:p-12 flex flex-col justify-end bg-gradient-to-br from-cyan-500/10 to-transparent"
                    >
                        <div className="absolute top-0 right-0 p-6 md:p-12 opacity-10">
                            <Cpu className="w-64 h-64 text-cyan-400" />
                        </div>
                        <div className="relative z-10">
                            <Layers className="w-10 h-10 md:w-12 md:h-12 text-cyan-400 mb-6 md:mb-8" />
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 md:mb-6 tracking-tight">Neural Requirement Processing</h2>
                            <p className="text-white/40 max-w-lg text-sm md:text-lg leading-relaxed mb-8 md:mb-10">
                                Construct deep, hierarchical PRDs with AI-driven gap analysis. Our engine identifies missing architectural layers before they become critical failures.
                            </p>
                            <Link to="/register" className="text-cyan-400 font-black uppercase tracking-[0.3em] text-[10px] hover:tracking-[0.5em] transition-all flex items-center gap-2">Explore Processing <ArrowRight className="w-3 h-3" /></Link>
                        </div>
                    </motion.div>

                    {/* Bento 2 */}
                    <motion.div 
                        whileInView={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 40 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="bento-card p-6 md:p-12 flex flex-col items-center justify-center text-center"
                    >
                        <div className="p-6 bg-white/5 rounded-[2rem] mb-10 border border-white/5 shadow-2xl">
                            <Database className="w-12 h-12 text-accent" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-6">Spatial Schemas</h3>
                        <p className="text-white/40 leading-relaxed">Automated data modeling designed for petabyte-scale relationship mapping.</p>
                    </motion.div>

                    {/* Bento 3 */}
                    <motion.div 
                        whileInView={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 40 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="bento-card p-6 md:p-12 flex flex-col items-center justify-center text-center"
                    >
                        <div className="p-6 bg-white/5 rounded-[2rem] mb-10 border border-white/5 shadow-2xl">
                            <GitBranch className="w-12 h-12 text-cyan-400" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-6">API Core</h3>
                        <p className="text-white/40 leading-relaxed">Neural mapping of endpoints with automated documentation and flow logic.</p>
                    </motion.div>

                    {/* Bento 4 - Large Bottom */}
                    <motion.div 
                        whileInView={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 40 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="lg:col-span-2 bento-card p-6 md:p-12 flex flex-col sm:flex-row items-center gap-6 md:gap-12 bg-gradient-to-tr from-accent/10 to-transparent"
                    >
                        <div className="flex-1">
                            <Terminal className="w-10 h-10 md:w-12 md:h-12 text-accent mb-6 md:mb-8" />
                            <h3 className="text-3xl md:text-4xl font-black text-white mb-4 md:mb-6 tracking-tight">Infrastructure Manifest</h3>
                            <p className="text-white/40 text-sm md:text-lg leading-relaxed">Instant deployment of production-grade boilerplate code, perfectly aligned with your architectural specs.</p>
                        </div>
                        <div className="hidden md:block w-72 h-40 glass-panel border-white/5 p-4 relative overflow-hidden">
                            <div className="absolute top-0 left-0 p-4 font-mono text-[10px] text-cyan-400/50">
                                system.generate_core() <br />
                                [OK] initializing layers... <br />
                                [OK] building manifest...
                            </div>
                            <div className="absolute bottom-0 right-0 p-4">
                                <Sparkles className="w-8 h-8 text-cyan-400 animate-spin" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
