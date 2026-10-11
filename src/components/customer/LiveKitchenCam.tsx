import React, { useEffect, useRef, useState } from 'react';
import { useRestaurant } from '../../store/restaurantStore';
import { Camera, Volume2, VolumeX, Maximize2, Sparkles } from 'lucide-react';

export const LiveKitchenCam: React.FC = () => {
  const { t } = useRestaurant();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const [fps, setFps] = useState(30);

  // Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(
        now.toISOString().replace('T', ' ').substring(0, 19) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Ambient Kitchen Visual Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let tick = 0;

    // Particle embers
    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * 320,
      y: 120 + Math.random() * 60,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -0.6 - Math.random() * 1.2,
      size: 1 + Math.random() * 2.5,
      alpha: 0.2 + Math.random() * 0.8,
      hue: 25 + Math.random() * 25, // amber to warm orange
    }));

    const render = () => {
      tick++;
      const w = (canvas.width = canvas.parentElement?.clientWidth || 320);
      const h = (canvas.height = 180);

      // Deep kitchen studio background
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#100c08');
      grad.addColorStop(0.6, '#1f1610');
      grad.addColorStop(1, '#0d0a07');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Warm glow from woodstone pizza oven / grill
      const ovenGlow = ctx.createRadialGradient(w * 0.5, h * 0.9, 10, w * 0.5, h * 0.9, 140);
      const pulse = Math.sin(tick * 0.05) * 0.15 + 0.85;
      ovenGlow.addColorStop(0, `rgba(245, 158, 11, ${0.45 * pulse})`);
      ovenGlow.addColorStop(0.5, `rgba(217, 119, 6, ${0.25 * pulse})`);
      ovenGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = ovenGlow;
      ctx.fillRect(0, 0, w, h);

      // Countertop and pan silhouette
      ctx.fillStyle = '#171412';
      ctx.fillRect(0, h * 0.72, w, h * 0.28);

      // Stainless steel trim highlight
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.72);
      ctx.lineTo(w, h * 0.72);
      ctx.stroke();

      // Pan & saute sizzle silhouette
      ctx.fillStyle = '#26201b';
      ctx.beginPath();
      ctx.ellipse(w * 0.45, h * 0.78, 48, 14, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pan handle
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#26201b';
      ctx.beginPath();
      ctx.moveTo(w * 0.45 + 44, h * 0.78);
      ctx.lineTo(w * 0.45 + 85, h * 0.74);
      ctx.stroke();

      // Rising steam/heat wave distortion
      for (let i = 0; i < 3; i++) {
        const sx = w * 0.38 + i * 20 + Math.sin(tick * 0.04 + i) * 6;
        const sy = h * 0.7 - ((tick * 1.2 + i * 30) % 70);
        const radius = 12 + ((tick * 0.5 + i * 15) % 30);
        const steamGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, radius);
        steamGrad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
        steamGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = steamGrad;
        ctx.beginPath();
        ctx.arc(sx, sy, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Sizzle flame spark embers
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.008;

        if (p.y < h * 0.2 || p.alpha <= 0) {
          p.x = w * 0.35 + Math.random() * (w * 0.3);
          p.y = h * 0.75;
          p.alpha = 0.5 + Math.random() * 0.5;
          p.vy = -0.8 - Math.random() * 1.4;
        }

        ctx.fillStyle = `hsla(${p.hue}, 95%, 65%, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Subtle CRT / Camera lens scanlines
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      for (let y = 0; y < h; y += 4) {
        ctx.fillRect(0, y, w, 1.5);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="relative rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-md">
      {/* Realtime Canvas Simulation */}
      <canvas ref={canvasRef} className="w-full h-44 block object-cover" />

      {/* Top Stream Overlay */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-white pointer-events-none">
        <div className="flex items-center gap-2">
          {/* LIVE badge */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] font-bold tracking-wider font-mono shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            LIVE · {t('Kitchen Cam', 'किचन कैम')}
          </div>

          <span className="text-[10px] font-mono tracking-tight text-white/90 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/10">
            {t('CAM 02 · TANDOOR & GRILL', 'कैमरा 02 · तंदूर व ग्रिल')}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/10">
          <Sparkles className="w-3 h-3" />
          <span>445°C</span>
        </div>
      </div>

      {/* Bottom Stream Status */}
      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-[10px] font-mono bg-black/60 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-white/10">
        <div className="flex items-center gap-2 text-white/80">
          <Camera className="w-3.5 h-3.5 text-amber-400" />
          <span className="tabular-nums">{currentTimeStr}</span>
        </div>

        <div className="flex items-center gap-2 text-white/70">
          <span className="hidden sm:inline">1080p · {fps}fps</span>
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className="pointer-events-auto p-1 hover:text-white"
            title="Sizzle sound"
          >
            {isAudioMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
          </button>
        </div>
      </div>
    </div>
  );
};
