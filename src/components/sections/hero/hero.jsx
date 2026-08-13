import React, { useRef, useEffect, useState } from 'react';
import './hero.css';

// Default target positions matching the marked boxes (x, y percentages)
const DEFAULT_ICONS = [
  { id: 'about', label: 'About', href: '#about', icon: '/public/logos/about.png', defaultXRatio: 0.21, defaultYRatio: 0.08 },
  { id: 'skills', label: 'Skills', href: '#skills', icon: '/public/logos/skills.png', defaultXRatio: 0.79, defaultYRatio: 0.08 },
  { id: 'projects', label: 'Projects', href: '#projects', icon: '/public/logos/project.png', defaultXRatio: 0.08, defaultYRatio: 0.81 },
  { id: 'contact', label: 'Contact', href: '#contact', icon: '/public/logos/contact.png', defaultXRatio: 0.90, defaultYRatio: 0.71 },
  { id: 'certificates', label: 'Certificates', href: '#certificates', icon: '/public/logos/award.png', defaultXRatio: 0.01, defaultYRatio: 0.50 },
];

const GRID_SIZE = 20; // Grid snap interval in pixels
const LOCAL_STORAGE_KEY = 'portfolio_desktop_icon_positions_v1';

const Home = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const [currentTime, setCurrentTime] = useState(new Date());

  // State to track desktop icon coordinates
  const [iconPositions, setIconPositions] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved icon positions', e);
      }
    }
    // Calculate initial positions based on screen dimensions matching marked positions
    const initialPos = {};
    const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const height = typeof window !== 'undefined' ? window.innerHeight : 800;

    DEFAULT_ICONS.forEach((item) => {
      initialPos[item.id] = {
        x: Math.round((width * item.defaultXRatio) / GRID_SIZE) * GRID_SIZE,
        y: Math.round((height * item.defaultYRatio) / GRID_SIZE) * GRID_SIZE,
      };
    });
    return initialPos;
  });

  const [activeDragId, setActiveDragId] = useState(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Save positions to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(iconPositions));
  }, [iconPositions]);

  // Live Date and Time Tracker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Inject Google Fonts dynamically
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Syne:wght@800;900&family=JetBrains+Mono:wght@400;500&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Vector Field Grid
    const spacing = 16;
    const lineLength = 8;
    const radius = 320;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#151515';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;

      const cols = Math.ceil(canvas.width / spacing);
      const rows = Math.ceil(canvas.height / spacing);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing + spacing / 2;
          const y = j * spacing + spacing / 2;

          const dx = mouseX - x;
          const dy = mouseY - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx);

          const intensity = Math.max(0, 1 - dist / radius);

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);

          if (intensity > 0) {
            ctx.lineWidth = 1;
            const r = Math.floor(34 + intensity * (232 - 34));
            const g = Math.floor(211 - intensity * (211 - 121));
            const b = Math.floor(238 + intensity * (249 - 238));
            const alpha = 0.15 + intensity * 0.85;

            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;

            if (intensity > 0.4) {
              ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.8)`;
              ctx.shadowBlur = intensity * 8;
            }
          } else {
            ctx.lineWidth = 0.75;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
            ctx.shadowBlur = 0;
          }

          ctx.beginPath();
          ctx.moveTo(-lineLength / 2, 0);
          ctx.lineTo(lineLength / 2, 0);
          ctx.stroke();

          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // --- Pointer Event Drag & Drop Handlers with Grid Snap ---
  const handlePointerDown = (id, e) => {
    e.preventDefault();
    setActiveDragId(id);
    const current = iconPositions[id] || { x: 0, y: 0 };
    dragOffset.current = {
      x: e.clientX - current.x,
      y: e.clientY - current.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (id, e) => {
    if (activeDragId !== id) return;
    const rawX = e.clientX - dragOffset.current.x;
    const rawY = e.clientY - dragOffset.current.y;

    setIconPositions((prev) => ({
      ...prev,
      [id]: { x: rawX, y: rawY },
    }));
  };

  const handlePointerUp = (id, e) => {
    if (activeDragId !== id) return;
    setActiveDragId(null);

    // Snap on drop to grid
    const current = iconPositions[id];
    if (current) {
      const snappedX = Math.round(current.x / GRID_SIZE) * GRID_SIZE;
      const snappedY = Math.round(current.y / GRID_SIZE) * GRID_SIZE;

      setIconPositions((prev) => ({
        ...prev,
        [id]: { x: snappedX, y: snappedY },
      }));
    }
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // Time & Date Formatters
  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const day = String(currentTime.getDate()).padStart(2, '0');
  const month = String(currentTime.getMonth() + 1).padStart(2, '0');
  const year = currentTime.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: 'auto',
        height: 'auto',
        overflow: 'hidden',
        backgroundColor: '#252525',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: '4vw',
        paddingRight: '0vw',
        boxSizing: 'border-box',
      }}
    >
      {/* Background Vector Field Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Left Content Column (Typography) */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          fontFamily: "'Syne', 'Arial Black', sans-serif",
          textTransform: 'uppercase',
          userSelect: 'none',
          letterSpacing: '-0.02em',
          lineHeight: '0.95',
          maxWidth: '50vw',
          transform: 'translate(35px, -50px)',
        }}
      >
        <span
          style={{
            color: '#FFFFFF',
            fontSize: 'clamp(2rem, 5vw, 4.5rem)',
            fontWeight: 900,
            paddingLeft: '8px',
            textShadow: '0 10px 30px rgba(0,0,0,0.8)',
          }}
        >
          SOFTWARE
        </span>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            color: '#0D0D0D',
            padding: '4px 16px',
            marginTop: '6px',
            fontSize: 'clamp(2rem, 5vw, 4.5rem)',
            fontWeight: 900,
            boxShadow: '8px 8px 0px rgba(0,0,0,0.5)',
          }}
        >
          DEVELOPER
        </div>

        <div
          style={{
            backgroundColor: '#ccff00',
            color: '#0D0D0D',
            padding: '4px 16px',
            marginTop: '6px',
            fontSize: 'clamp(2rem, 5vw, 4.5rem)',
            fontWeight: 900,
            boxShadow: '8px 8px 0px rgba(0,0,0,0.5)',
          }}
        >
          & DESIGNER
        </div>
      </div>

      {/* Draggable Desktop Icons Layer at Marked Positions */}
      {DEFAULT_ICONS.map((item) => {
        const pos = iconPositions[item.id] || { x: 0, y: 0 };
        const isDragging = activeDragId === item.id;

        return (
          <div
            key={item.id}
            className={`desktop-icon ${isDragging ? 'desktop-icon--dragging' : ''}`}
            style={{
              transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
            }}
            onPointerDown={(e) => handlePointerDown(item.id, e)}
            onPointerMove={(e) => handlePointerMove(item.id, e)}
            onPointerUp={(e) => handlePointerUp(item.id, e)}
          >
            <a
              href={item.href}
              className="desktop-icon__link"
              onClick={(e) => {
                // Prevent navigation click if dragging
                if (isDragging) e.preventDefault();
              }}
            >
              <div className="desktop-icon__box">
                <img src={item.icon} alt={item.label} className="desktop-icon__img" />
              </div>
              <span className="desktop-icon__caption">{item.label}</span>
            </a>
          </div>
        );
      })}

      {/* Right Column (Expanded Image Anchored to Bottom) */}
      <div
        style={{
          position: 'absolute',
          right: 'calc(2vw - 35px)',
          bottom: 0,
          zIndex: 10,
          width: '65vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <img
          src="/assets/images/picture.png"
          alt="Portfolio Visual"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'bottom center',
            filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.7))',
          }}
        />
      </div>

      {/* Borderless Bottom-Right Clock */}
      <div
        style={{
          position: 'absolute',
          bottom: '36px',
          right: '36px',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          fontFamily: "'JetBrains Mono', monospace",
          color: '#FFFFFF',
          userSelect: 'none',
        }}
      >
        <span
          style={{
            fontSize: '18px',
            fontWeight: 400,
            letterSpacing: '0.05em',
          }}
        >
          {formattedTime}
        </span>
        <span
          style={{
            fontSize: '14px',
            fontWeight: 400,
            color: '#FFFFFF',
            opacity: 0.7,
            marginTop: '2px',
            letterSpacing: '0.05em',
          }}
        >
          {formattedDate}
        </span>
      </div>

      {/* Bottom-Centre Translucent Dock */}
      <nav className="hero-dock" aria-label="Quick links">
        <a
          className="hero-dock__item"
          href="#terminal"
          aria-label="Terminal"
          title="Terminal"
        >
          <img src="/public/logos/terminal.png" alt="" className="hero-dock__icon" />
        </a>
        <a
          className="hero-dock__item"
          href="https://leetcode.com/u/ssup_devaki/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LeetCode"
          title="LeetCode"
        >
          <img src="/public/logos/leetcode.png" alt="" className="hero-dock__icon" />
        </a>
        <a
          className="hero-dock__item"
          href="https://github.com/Devaki01"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          title="GitHub"
        >
          <img src="/public/logos/github.png" alt="" className="hero-dock__icon" />
        </a>
        <a
          className="hero-dock__item"
          href="https://www.linkedin.com/in/devaki-joshi-033b6a307/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          title="LinkedIn"
        >
          <img src="/public/logos/linkedin.png" alt="" className="hero-dock__icon" />
        </a>
        <a
          className="hero-dock__item"
          href="https://figma.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Figma"
          title="Figma"
        >
          <img src="/public/logos/figma.png" alt="" className="hero-dock__icon" />
        </a>
      </nav>
    </div>
  );
};

export default Home;