import React, { useEffect, useRef } from 'react';

const LivingGrid = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const gridSize = 50;
        const pulses = [];

        class Pulse {
            constructor() {
                this.reset();
            }

            reset() {
                this.vertical = Math.random() > 0.5;
                if (this.vertical) {
                    this.x = Math.floor(Math.random() * (width / gridSize)) * gridSize;
                    this.y = -100;
                    this.target = height + 100;
                } else {
                    this.y = Math.floor(Math.random() * (height / gridSize)) * gridSize;
                    this.x = -100;
                    this.target = width + 100;
                }
                this.speed = Math.random() * 2 + 1;
                this.length = Math.random() * 100 + 50;
                this.opacity = Math.random() * 0.5 + 0.1;
            }

            update() {
                if (this.vertical) {
                    this.y += this.speed;
                } else {
                    this.x += this.speed;
                }

                if ((this.vertical && this.y > this.target) || (!this.vertical && this.x > this.target)) {
                    this.reset();
                }
            }

            draw() {
                const grad = ctx.createLinearGradient(
                    this.x, this.y, 
                    this.vertical ? this.x : this.x + this.length, 
                    this.vertical ? this.y + this.length : this.y
                );
                grad.addColorStop(0, `rgba(0, 242, 255, 0)`);
                grad.addColorStop(0.5, `rgba(0, 242, 255, ${this.opacity})`);
                grad.addColorStop(1, `rgba(0, 242, 255, 0)`);

                ctx.strokeStyle = grad;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(
                    this.vertical ? this.x : this.x + this.length, 
                    this.vertical ? this.y + this.length : this.y
                );
                ctx.stroke();
            }
        }

        for (let i = 0; i < 20; i++) {
            pulses.push(new Pulse());
        }

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            
            // Draw static grid lines (very subtle)
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
            ctx.lineWidth = 0.5;
            
            for (let x = 0; x < width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            for (let y = 0; y < height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            pulses.forEach(p => {
                p.update();
                p.draw();
            });

            requestAnimationFrame(animate);
        };

        animate();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            className="fixed inset-0 pointer-events-none z-0"
        />
    );
};

export default LivingGrid;
