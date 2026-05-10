import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Clock, FileText, Database, GitBranch, ArrowRight, Loader2, LayoutGrid, Terminal, Sparkles, Activity } from 'lucide-react';

const Dashboard = () => {
    useEffect(() => {
        document.title = "Mission Hub | TechArch";
    }, []);

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await api.get('/generate/projects');
                setProjects(response.data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="relative">
                    <Loader2 className="w-16 h-16 text-cyan-400 animate-spin" />
                    <div className="absolute inset-0 blur-2xl bg-cyan-400/20 animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="pt-32 md:pt-40 pb-32 px-4 md:px-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-8 md:gap-12">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="flex items-center gap-3 text-cyan-400/60 mb-6 font-black uppercase tracking-[0.4em] text-[10px]">
                        <Activity className="w-4 h-4" />
                        Lead Architect Manifest
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight pb-4 mb-6">Mission <br /><span className="gradient-heading italic">Control_</span></h1>
                    <div className="flex items-center gap-6">
                        <div className="glass-panel px-4 py-2 flex items-center gap-2 border-cyan-500/10">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/80">{projects.length} ACTIVE SYSTEMS</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full md:w-auto"
                >
                    <Link to="/new-project" className="btn-cyber flex items-center justify-center gap-3 !px-10 w-full md:w-auto">
                        <Plus className="w-5 h-5" /> 
                        <span className="text-xs text-black">Initialize Mission</span>
                    </Link>
                </motion.div>
            </div>

            {/* Project Grid */}
            {projects.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bento-card text-center py-40 bg-gradient-to-br from-cyan-500/5 to-transparent"
                >
                    <div className="p-8 bg-white/5 rounded-[3rem] w-fit mx-auto mb-10 text-cyan-400/20 border border-white/5">
                        <Terminal className="w-20 h-20" />
                    </div>
                    <h3 className="text-4xl font-black text-white mb-6">The Universe is Silent</h3>
                    <p className="text-white/40 mb-16 max-w-md mx-auto text-lg font-medium leading-relaxed">Your neural network has no active architectural missions. Start by initializing a new blueprint protocol.</p>
                    <Link to="/new-project" className="btn-cyber">Generate First Blueprint</Link>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {projects.map((project, i) => (
                        <motion.div 
                            key={project._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Link to={`/project/${project._id}`} className="bento-card block group h-full hover:border-cyan-400/50 p-6 md:p-10 bg-white/[0.01]">
                                <div className="flex justify-between items-start mb-8 md:mb-12">
                                    <div className="p-4 md:p-5 bg-cyan-500/10 rounded-[1.5rem] text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-all duration-700 shadow-2xl border border-cyan-500/20">
                                        <FileText className="w-6 h-6 md:w-8 md:h-8" />
                                    </div>
                                    <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.3em] ${
                                        project.status === 'Completed' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/10' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/10'
                                    }`}>
                                        {project.status === 'Completed' ? 'SYNCHRONIZED' : 'PROCESSING'}
                                    </div>
                                </div>
                                
                                <h3 className="text-3xl font-black text-white mb-4 tracking-tight group-hover:text-cyan-400 transition-colors">
                                    {project.projectName}
                                </h3>
                                
                                <p className="text-sm text-white/40 font-medium line-clamp-2 mb-12 leading-relaxed">
                                    {project.prd_content?.summary || "Analyzing mission parameters in neural space..."}
                                </p>
                                
                                <div className="mt-auto pt-10 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-8">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Collections</span>
                                            <div className="flex items-center gap-2 text-white font-black text-lg">
                                                <Database className="w-5 h-5 text-cyan-400/60" />
                                                {project.schema_json?.length || 0}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Neural APIs</span>
                                            <div className="flex items-center gap-2 text-white font-black text-lg">
                                                <GitBranch className="w-5 h-5 text-accent" />
                                                {project.api_json?.length || 0}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-3 glass-panel border-cyan-500/10 group-hover:bg-cyan-500/20 transition-all group-hover:translate-x-2">
                                        <ArrowRight className="w-5 h-5 text-cyan-400" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
