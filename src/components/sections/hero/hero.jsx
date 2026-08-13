import React, { useRef, useEffect, useState } from 'react';
import './hero.css';

const Home = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const [currentTime, setCurrentTime] = useState(new Date());

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

      // Background set to Jet Black (#252525)
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

  // Time Formatter
  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  // Date Formatter: DD-MM-YYYY
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
          transform: 'translate(35px, -50px)', // Shifted +35px right and +50px higher
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

      {/* Section Navigation */}
      <nav className="hero-section-nav" aria-label="Portfolio sections">
        <a href="#about" className="hero-section-nav__item">
          <img src="/public/logos/about.png" alt="" />
          <span>About</span>
        </a>
        <a href="#skills" className="hero-section-nav__item">
          <img src="/public/logos/skills.png" alt="" />
          <span>Skills</span>
        </a>
        <a href="#projects" className="hero-section-nav__item">
          <img src="/public/logos/project.png" alt="" />
          <span>Projects</span>
        </a>
        <a href="#contact" className="hero-section-nav__item">
          <img src="/public/logos/contact.png" alt="" />
          <span>Contact</span>
        </a>
      </nav>

      {/* Right Column (Expanded Image Anchored to Bottom) */}
      <div
        style={{
          position: 'absolute',
          right: 'calc(2vw - 35px)', // Shifted 35px to the right
          bottom: 0,
          zIndex: 10,
          width: '63vw',
          height: '95vh',
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