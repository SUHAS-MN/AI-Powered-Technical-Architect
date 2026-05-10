import React from 'react';

const TechnicalGrid = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-0">
            {/* Base Dark Layer */}
            <div className="absolute inset-0 bg-[#050505]" />
            
            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.15]" 
                style={{ 
                    backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }} 
            />
            
            {/* Micro Dot Pattern */}
            <div className="absolute inset-0 opacity-[0.05]" 
                style={{ 
                    backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
                    backgroundSize: '10px 10px'
                }} 
            />

            {/* Slow Moving Glows */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* Noise Overlay for Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>
    );
};

export default TechnicalGrid;
