import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import { 
    Download, FileText, Database, GitBranch, 
    ChevronRight, Wallet, Activity, Loader2, Sparkles, MessageSquare,
    Zap, Cpu, Shield, ArrowRight, X, Terminal
} from 'lucide-react';

const ProjectDetails = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('prd');
    const [exporting, setExporting] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessage, setChatMessage] = useState('');
    const [chatLoading, setChatLoading] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await api.get(`/generate/project/${id}`);
                setProject(response.data.data);
                document.title = `${response.data.data.projectName} | Architecture Blueprint`;
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id]);

    const handleExport = async () => {
        setExporting(true);
        try {
            const response = await api.get(`/generate/export/${id}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${project.projectName}_architecture.zip`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error(error);
        } finally {
            setExporting(false);
        }
    };

    const handleRefine = async (e) => {
        e.preventDefault();
        if (!chatMessage.trim()) return;
        
        setChatLoading(true);
        try {
            const response = await api.post('/generate/refine', { id, message: chatMessage });
            setProject(response.data.data);
            setChatMessage('');
            setIsChatOpen(false);
        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.message || "Failed to process architecture override.";
            alert(errorMessage);
        } finally {
            setChatLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-16 h-16 text-cyan-400 animate-spin" />
        </div>
    );
    
    if (!project) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <Terminal className="w-20 h-20 text-white/10 mx-auto mb-8" />
                <h1 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Manifest Lost</h1>
                <Link to="/dashboard" className="text-cyan-400 font-black uppercase tracking-widest text-xs">Return to Hub</Link>
            </div>
        </div>
    );

    const tabs = [
        { id: 'prd', label: 'Requirements', icon: <FileText className="w-5 h-5" /> },
        { id: 'schema', label: 'Neural Data', icon: <Database className="w-5 h-5" /> },
        { id: 'api', label: 'API Protocols', icon: <GitBranch className="w-5 h-5" /> },
        { id: 'flow', label: 'Logic Streams', icon: <Activity className="w-5 h-5" /> },
        { id: 'budget', label: 'Cost Analysis', icon: <Wallet className="w-5 h-5" /> },
    ];

    return (
        <div className="pt-24 md:pt-32 min-h-screen pb-32 md:pb-40">
            {/* Semantic Header */}
            <header className="px-4 md:px-6 py-8 md:py-12 relative overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-12 relative z-10">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <nav className="flex items-center gap-2 md:gap-3 text-[10px] font-black text-cyan-400/40 mb-4 md:mb-6 uppercase tracking-[0.2em] md:tracking-[0.4em]">
                            <Link to="/dashboard" className="hover:text-cyan-400 transition-colors">Mission Hub</Link>
                            <ChevronRight className="w-3 h-3" />
                            <span className="text-white/80">Active Blueprint</span>
                        </nav>
                        <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-white tracking-tighter leading-none">{project.projectName}</h1>
                    </motion.div>
                    
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsChatOpen(true)}
                            className="p-5 bento-card text-cyan-400 !rounded-2xl border-cyan-500/20 group"
                        >
                            <Sparkles className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
                        </button>
                        <button 
                            onClick={handleExport}
                            disabled={exporting}
                            className="btn-cyber flex items-center justify-center gap-2 md:gap-3 !rounded-2xl !px-6 md:!px-12 w-full md:w-auto"
                        >
                            {exporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                            <span className="font-black text-xs uppercase tracking-widest">{exporting ? 'Syncing...' : 'Export Core'}</span>
                        </button>
                    </motion.div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-20 flex flex-col lg:flex-row gap-10 md:gap-20">
                {/* Protocol Selector */}
                <aside className="lg:w-80 flex-shrink-0">
                    <nav className="flex overflow-x-auto lg:flex-col gap-4 lg:gap-0 lg:space-y-4 pb-4 lg:pb-0 sticky top-[80px] lg:top-[150px] z-40 hide-scrollbar">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-shrink-0 w-auto lg:w-full flex items-center justify-between px-6 py-4 md:px-8 md:py-6 rounded-[1.5rem] transition-all duration-700 relative overflow-hidden group ${
                                    activeTab === tab.id 
                                    ? 'bg-cyan-500 text-black shadow-[0_20px_50px_rgba(0,242,255,0.3)]' 
                                    : 'text-white/40 bento-card border-white/5 hover:text-white'
                                }`}
                            >
                                <div className="flex items-center gap-4 relative z-10">
                                    {tab.icon}
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{tab.label}</span>
                                </div>
                                <motion.div 
                                    animate={{ x: activeTab === tab.id ? 0 : -20, opacity: activeTab === tab.id ? 1 : 0 }}
                                    className="hidden lg:block relative z-10"
                                >
                                    <ArrowRight className="w-4 h-4" />
                                </motion.div>
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Data Manifest Area */}
                <article className="flex-1 min-h-[800px]">
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="bento-card !p-6 md:!p-12 h-full bg-white/[0.01] border-white/5 shadow-2xl"
                        >
                            {activeTab === 'prd' && (
                                <div className="space-y-24">
                                    <section>
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-400 mb-6 md:mb-10">Neural Mission Summary</h3>
                                        <p className="text-2xl md:text-4xl font-black text-white/90 leading-tight tracking-tighter italic">
                                            "{project.prd_content.summary}"
                                        </p>
                                    </section>
                                    <div className="grid md:grid-cols-2 gap-10 md:gap-20">
                                        <section>
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-10">Entity Target</h4>
                                            <div className="p-6 md:p-10 glass-panel border-l-8 border-accent text-white/50 font-medium leading-relaxed italic">
                                                {project.prd_content.target_audience}
                                            </div>
                                        </section>
                                        <section>
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400 mb-10">Protocol Features</h4>
                                            <div className="space-y-6">
                                                {project.prd_content.features.map((f, i) => {
                                                    const title = typeof f === 'object' ? f.title || f.name : f;
                                                    const desc = typeof f === 'object' ? f.description : '';
                                                    return (
                                                        <div key={i} className="flex flex-col gap-2 group">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black text-cyan-400 border border-white/5 group-hover:bg-cyan-500 group-hover:text-black transition-all">0{i+1}</div>
                                                                <span className="text-white/80 font-black text-sm uppercase tracking-widest">{title}</span>
                                                            </div>
                                                            {desc && <p className="text-white/40 text-sm ml-12">{desc}</p>}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'schema' && (
                                <div className="grid md:grid-cols-2 gap-10">
                                    {(project.schema_json || []).map((coll, i) => (
                                        <div key={i} className="glass-panel p-6 md:p-10 border-white/5 hover:border-cyan-500/20 transition-all duration-700">
                                            <div className="flex items-center gap-5 mb-10">
                                                <div className="p-4 bg-cyan-500/10 rounded-2xl text-cyan-400">
                                                    <Database className="w-8 h-8" />
                                                </div>
                                                <h4 className="text-3xl font-black text-white tracking-tighter">{coll.collection}</h4>
                                            </div>
                                            <div className="space-y-4">
                                                {(coll.fields || []).map((field, fi) => (
                                                    <div key={fi} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 group">
                                                        <span className="font-black text-xs uppercase tracking-widest text-white/70">{field.name}</span>
                                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-lg">{field.type}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'api' && (
                                <div className="space-y-6">
                                    {(project.api_json || []).map((api, i) => (
                                        <div key={i} className="glass-panel p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10 border-white/5 hover:bg-white/5 transition-all group">
                                            <div className={`px-6 py-2 rounded-xl font-black text-[9px] uppercase tracking-[0.3em] ${
                                                api.method === 'GET' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                                                api.method === 'POST' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                            }`}>
                                                {api.method}
                                            </div>
                                            <code className="text-sm md:text-xl font-black text-white flex-1 tracking-tight break-all">{api.path || api.endpoint}</code>
                                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 max-w-[200px] md:max-w-xs text-left md:text-right leading-relaxed mt-4 md:mt-0">{api.purpose || api.description}</div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'flow' && project.flowchart_json && project.flowchart_json.nodes && (
                                <div className="h-[400px] md:h-[700px] w-full rounded-[2.5rem] overflow-hidden border border-white/5">
                                    <ReactFlow 
                                        nodes={project.flowchart_json.nodes} 
                                        edges={project.flowchart_json.edges || []}
                                        fitView
                                    >
                                        <Background color="#1a1a1a" gap={25} size={1} />
                                        <Controls />
                                    </ReactFlow>
                                </div>
                            )}

                            {activeTab === 'budget' && (
                                <div className="space-y-16">
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {Object.entries(project.budget_estimate || {})
                                            .filter(([k]) => !k.toLowerCase().includes('total'))
                                            .map(([key, value], i) => {
                                                let displayValue = "";
                                                let provider = "";
                                                if (typeof value === 'object' && value !== null) {
                                                    const costKey = Object.keys(value).find(k => k.toLowerCase().includes('cost'));
                                                    displayValue = String(value[costKey] || "0");
                                                    provider = value.provider || value.description || "";
                                                } else {
                                                    displayValue = String(value);
                                                }

                                                return (
                                                    <motion.div 
                                                        key={i} 
                                                        whileHover={{ scale: 1.05 }}
                                                        className="p-6 md:p-10 glass-panel border-white/5 transition-all hover:bg-white/5"
                                                    >
                                                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 mb-8 block">Protocol Cost</span>
                                                        <h5 className="capitalize text-xl font-black text-white mb-3">{key.replace(/_/g, ' ')}</h5>
                                                        <div className="text-4xl font-black text-cyan-400 mb-8">
                                                            {displayValue.includes('$') ? displayValue : `$${displayValue}`}
                                                        </div>
                                                        {provider && <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 leading-relaxed">{provider}</p>}
                                                    </motion.div>
                                                );
                                            })}
                                    </div>
                                    <div className="glass-panel bg-cyan-500/5 border-cyan-500/20 p-6 md:p-24 flex flex-col items-center justify-center text-center !rounded-[2rem] md:!rounded-[3rem] relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent animate-pulse" />
                                        <Zap className="w-12 h-12 md:w-16 md:h-16 text-cyan-400 mb-6 md:mb-10 fill-cyan-400/10 relative z-10" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-cyan-400/40 mb-4 relative z-10">Final Est. Neural Payload</p>
                                        <p className="text-5xl md:text-8xl font-black text-cyan-400 tracking-tighter relative z-10">
                                            {(() => {
                                                const budget = project.budget_estimate || {};
                                                let total = budget.total_monthly_usd || budget.total_estimate || budget.total;
                                                if (!total) {
                                                    const sum = Object.entries(budget)
                                                        .filter(([k]) => !k.toLowerCase().includes('total'))
                                                        .reduce((acc, [_, val]) => {
                                                            let num = 0;
                                                            if (typeof val === 'object' && val !== null) {
                                                                const costKey = Object.keys(val).find(k => k.toLowerCase().includes('cost'));
                                                                num = parseFloat(String(val[costKey] || 0).replace(/[^0-9.]/g, ''));
                                                            } else {
                                                                num = parseFloat(String(val || 0).replace(/[^0-9.]/g, ''));
                                                            }
                                                            return acc + (isNaN(num) ? 0 : num);
                                                        }, 0);
                                                    total = sum > 0 ? sum.toFixed(2) : null;
                                                }
                                                if (!total) return "SYNCING";
                                                return String(total).includes('$') ? total : `$ ${total}`;
                                            })()}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </article>
            </div>

            {/* Neural Override Station */}
            <AnimatePresence>
                {isChatOpen && (
                    <div className="fixed inset-0 z-[200] flex justify-end">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-2xl" 
                            onClick={() => setIsChatOpen(false)} 
                        />
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="relative w-full max-w-2xl bg-[#050505] border-l border-white/10 p-6 md:p-16 flex flex-col h-full shadow-[0_0_100px_rgba(0,0,0,1)]"
                        >
                            <div className="flex justify-between items-center mb-16">
                                <div className="flex items-center gap-6">
                                    <div className="p-4 bg-cyan-500/10 rounded-2xl text-cyan-400 border border-cyan-500/20">
                                        <Sparkles className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <h3 className="text-4xl font-black text-white tracking-tighter leading-none">Neural Override</h3>
                                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-400 mt-2">Architecture Refinement Protocol Active</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsChatOpen(false)} className="p-5 rounded-full glass-panel hover:bg-white/10 transition-all">
                                    <X className="w-8 h-8" />
                                </button>
                            </div>
                            
                            <form onSubmit={handleRefine} className="flex-1 flex flex-col gap-12">
                                <div className="flex-1 relative">
                                    <textarea
                                        value={chatMessage}
                                        onChange={(e) => setChatMessage(e.target.value)}
                                        placeholder="Command your AI architect... Example: 'Transition to Neural Edge Computing' or 'Scale MongoDB to Sharded Global Cluster'"
                                        className="w-full h-full bento-card !p-6 md:!p-12 !bg-white/[0.02] !border-white/10 resize-none text-xl md:text-2xl font-black tracking-tight focus:!border-cyan-500/50 transition-all outline-none leading-relaxed"
                                        disabled={chatLoading}
                                    />
                                    <div className="absolute top-6 right-6 text-[9px] font-black text-white/5 uppercase tracking-[0.4em] pointer-events-none">Neural Manifest Stream</div>
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={chatLoading || !chatMessage.trim()}
                                    className="btn-cyber !py-8 !rounded-3xl flex items-center justify-center gap-6 relative overflow-hidden group"
                                >
                                    {chatLoading ? <Loader2 className="w-10 h-10 animate-spin" /> : <Zap className="w-10 h-10 fill-white/20" />}
                                    <span className="text-2xl font-black uppercase tracking-[0.4em] relative z-10">
                                        {chatLoading ? 'Syncing Neural Layers...' : 'Initialize Override'}
                                    </span>
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProjectDetails;
