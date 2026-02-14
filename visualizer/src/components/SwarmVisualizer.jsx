import React, { useRef, useEffect } from 'react';

const SwarmVisualizer = ({ swarmSize, isAttacking, attackProgress, realTxFound }) => {
    const canvasRef = useRef(null);
    const particles = useRef([]);
    const animationRef = useRef(null);

    // Initialization & Resizing
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                // Set internal resolution to match display size
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
                initParticles();
            }
        };

        window.addEventListener('resize', handleResize);

        // Force initial sizing
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, [swarmSize]);

    const initParticles = () => {
        if (!canvasRef.current) return;
        const width = canvasRef.current.width;
        const height = canvasRef.current.height;

        const newParticles = [];
        // 1 Real Tx
        newParticles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            isReal: true,
            color: '#FFD700', // Gold
            size: 5,
            locked: false
        });

        // N Decoys
        for (let i = 0; i < swarmSize; i++) {
            newParticles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                isReal: false,
                color: Math.random() > 0.5 ? '#00FF00' : '#00FFFF',
                size: 2,
                locked: false
            });
        }
        particles.current = newParticles;
    };

    // Animation Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const update = () => {
            // Fill background (trail effect)
            ctx.fillStyle = 'rgba(5, 5, 5, 0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw Quantum Scanner Beam
            if (isAttacking) {
                const scanY = (attackProgress / 100) * canvas.height;
                ctx.beginPath();
                ctx.moveTo(0, scanY);
                ctx.lineTo(canvas.width, scanY);
                ctx.strokeStyle = '#FF0055'; // Danger Red
                ctx.lineWidth = 2;
                ctx.shadowBlur = 20;
                ctx.shadowColor = '#FF0055';
                ctx.stroke();
                ctx.shadowBlur = 0;
            }

            // Update and Draw Particles
            if (particles.current.length > 0) {
                particles.current.forEach(p => {
                    if (!p.locked) {
                        p.x += p.vx;
                        p.y += p.vy;
                        // Bounce
                        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                    }

                    ctx.beginPath();
                    if (p.isReal) {
                        // Draw Bitcoin Coin
                        const coinSize = p.size * 2.5;

                        // Outer Glow
                        ctx.shadowBlur = 15;
                        ctx.shadowColor = '#FFD700';

                        // Coin Body (Orange w/ Gold Rim)
                        ctx.fillStyle = '#f7931a';
                        ctx.strokeStyle = '#FFD700';
                        ctx.lineWidth = 2;
                        ctx.arc(p.x, p.y, coinSize, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.stroke();

                        // '₿' Symbol
                        ctx.fillStyle = '#fff';
                        ctx.font = `bold ${coinSize * 1.4}px Arial`;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.shadowBlur = 0;
                        ctx.fillText('₿', p.x, p.y + 1);

                        // Pulse effect if found
                        if (realTxFound) {
                            ctx.beginPath();
                            ctx.arc(p.x, p.y, coinSize + Math.sin(Date.now() / 100) * 8, 0, Math.PI * 2);
                            ctx.strokeStyle = '#FF0055';
                            ctx.lineWidth = 2;
                            ctx.stroke();
                        }
                    } else {
                        // Decoy
                        ctx.rect(p.x, p.y, p.size, p.size);
                        ctx.fillStyle = p.color;
                        ctx.shadowBlur = 0;
                        ctx.fill();
                    }
                    ctx.shadowBlur = 0;
                });
            }

            if (realTxFound) {
                ctx.font = '20px Consolas';
                ctx.fillStyle = '#FFD700';
                ctx.fillText("TARGET ACQUIRED", canvas.width / 2 - 80, canvas.height / 2);
            }

            animationRef.current = requestAnimationFrame(update);
        };

        animationRef.current = requestAnimationFrame(update);
        return () => cancelAnimationFrame(animationRef.current);
    }, [swarmSize, isAttacking, attackProgress, realTxFound]);

    return <canvas ref={canvasRef} className="canvas-layer" style={{ display: 'block', width: '100%', height: '100%', background: '#050505' }} />;
};

export default SwarmVisualizer;
