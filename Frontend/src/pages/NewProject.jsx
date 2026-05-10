import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, ArrowRight, Cpu, Zap, Box, Layers, Terminal, Activity } from 'lucide-react';

const NewProject = () => {
    useEffect(() => {
        document.title = "Blueprint Designer | TechArch";
    }, []);

    const [step, setStep] = useState(1);
    const [projectName, setProjectName] = useState('');
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    const navigate = useNavigate();

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStep(3);
        
        try {
            setStatus('Initializing Neural Architecture Core...');
        
            const prdResponse = await api.post('/generate/prd', { projectName, prompt });
            console.log("doneeeeeeeeeeeeee");
            
            const projectId = prdResponse.data.data._id;
            // console.log(prdResponse.data.data._id);
            
            setStatus('Constructing Spatial Data Schemas...');
            await api.post('/generate/tech', { id: projectId });
            
            setStatus('Finalizing Blueprint Manifest...');
            navigate(`/project/${projectId}`);
        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.message || "Protocol failure: Architectural construction aborted.";
            alert(errorMessage);
            setLoading(false);
            setStep(2);
        }
    };

    return (
        <div className="min-h-screen pt-32 md:pt-40 pb-32 px-4 md:px-6 flex flex-col items-center">
            {/* Mission Phase Progress */}
            <div className="flex items-center gap-4 md:gap-8 mb-20 md:mb-32">
                {[
                    { id: 1, icon: <Box className="w-5 h-5" />, label: 'Entity' },
                    { id: 2, icon: <Layers className="w-5 h-5" />, label: 'Manifesto' },
                    { id: 3, icon: <Zap className="w-5 h-5" />, label: 'Assembly' }
                ].map((s, i, arr) => (
                    <React.Fragment key={s.id}>
                        <div className={`flex flex-col items-center gap-4 transition-all duration-700 ${step >= s.id ? 'opacity-100' : 'opacity-20'}`}>
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-700 ${
                                step === s.id ? 'bg-cyan-500 border-cyan-400 text-black shadow-[0_0_30px_#00f2ff]' : 'bg-white/5 border-white/10 text-white/40'
                            }`}>
                                {s.icon}
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-cyan-400/80">{s.label}</span>
                        </div>
                        {i < arr.length - 1 && <div className={`w-8 md:w-16 h-[2px] mb-8 transition-all duration-700 ${step > s.id ? 'bg-cyan-500' : 'bg-white/5'}`} />}
                    </React.Fragment>
                ))}
            </div>

            <div className="w-full max-w-4xl">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div 
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bento-card !p-8 md:!p-20 text-center bg-gradient-to-br from-cyan-500/5 to-transparent"
                        >
                            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 md:mb-8 tracking-tighter leading-none">Mission <br /><span className="gradient-heading italic">Identity</span></h2>
                            <p className="text-white/40 mb-12 md:mb-16 text-sm md:text-lg font-medium italic">Define the core identifier for your architectural mission.</p>
                            <div className="max-w-xl mx-auto space-y-8 md:space-y-12">
                                <input 
                                    type="text"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    placeholder="Project 'Ethereal Cloud'..."
                                    className="cyber-input !text-2xl md:!text-4xl !py-6 md:!py-10 !text-center font-black tracking-tighter !rounded-[2rem] md:!rounded-[2.5rem]"
                                />
                                <button 
                                    onClick={() => projectName && setStep(2)}
                                    className="btn-cyber !px-10 md:!px-16 !py-4 md:!py-6 !text-xs !rounded-full mx-auto"
                                >
                                    <span className="flex items-center gap-2">Next Phase Protocol <ArrowRight className="w-4 h-4" /></span>
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div 
                            key="step2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bento-card !p-8 md:!p-20"
                        >
                            <div className="text-center mb-10 md:mb-16">
                                <h2 className="text-4xl md:text-6xl font-black text-white mb-4 md:mb-6 tracking-tighter leading-none">The <span className="gradient-heading italic">Manifesto</span></h2>
                                <p className="text-white/40 text-sm md:text-lg font-medium italic">Describe your mission vision in neural high-fidelity.</p>
                            </div>
                            <form onSubmit={handleCreate} className="space-y-8 md:space-y-12">
                                <textarea 
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Describe the architectural requirements... Be specific about features, neural layers, and spatial mapping needs..."
                                    className="cyber-input !h-64 md:!h-96 !py-6 md:!py-10 !text-lg md:!text-xl !rounded-[2rem] md:!rounded-[3rem] resize-none leading-relaxed"
                                    required
                                />
                                <div className="flex flex-col-reverse md:flex-row justify-between items-center px-4 gap-6 md:gap-0">
                                    <button onClick={() => setStep(1)} className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-all flex items-center gap-2">Abort <ArrowRight className="w-3 h-3 rotate-180" /> Phase 1</button>
                                    <button 
                                        type="submit"
                                        className="btn-cyber !rounded-full w-full md:w-auto !px-10 md:!px-20 !py-4 md:!py-6 flex items-center justify-center gap-4 group"
                                    >
                                        <Sparkles className="w-6 h-6 group-hover:rotate-90 transition-transform duration-700" />
                                        <span className="text-sm">Initialize Assembly</span>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div 
                            key="step3"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-10 md:py-20 flex flex-col items-center w-full overflow-hidden"
                        >
                            <div className="relative w-96 h-96 shrink-0 mx-auto mb-10 md:mb-20 transform scale-75 md:scale-100 origin-center">
                                <div className="absolute inset-0 border-4 border-cyan-500/10 rounded-full animate-[spin_10s_linear_infinite]" />
                                <div className="absolute inset-8 border-2 border-cyan-400/20 rounded-full animate-[spin_6s_linear_infinite_reverse]" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-40 h-40 bg-cyan-500/10 rounded-full blur-[60px] animate-pulse" />
                                    <Cpu className="w-24 h-24 text-cyan-400 relative z-10 animate-bounce" />
                                </div>
                                {/* Data Nodes */}
                                {[...Array(8)].map((_, i) => (
                                    <div 
                                        key={i} 
                                        className="absolute w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_#00f2ff]"
                                        style={{
                                            top: '50%',
                                            left: '50%',
                                            transform: `rotate(${i * 45}deg) translate(180px)`
                                        }}
                                    />
                                ))}
                            </div>
                            
                            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 md:mb-6 tracking-tighter leading-none gradient-heading">
                                {status}
                            </h2>
                            <p className="text-white/40 text-sm md:text-lg font-medium max-w-md mx-auto italic">
                                The Neural Architect is currently assembling your blueprint layers in high-fidelity spatial space.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default NewProject;
