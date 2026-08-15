import React, { useEffect, useState } from 'react';
import './terminal.css';

const Terminal = ({ onClose }) => {
  const [today] = useState(() =>
    new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    })
  );

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="terminal-window" role="dialog" aria-label="Terminal">
      <div className="terminal-titlebar">
        <div className="traffic-lights">
          <button
            type="button"
            className="terminal-close"
            onClick={onClose}
            aria-label="Close terminal"
            title="Close"
          >
            <svg className="terminal-close__icon" viewBox="0 0 10 10" aria-hidden="true">
              <line x1="1" y1="1" x2="9" y2="9" />
              <line x1="9" y1="1" x2="1" y2="9" />
            </svg>
          </button>
        </div>
        <span className="titlebar-label">
          guest@devaki-portfolio &mdash; zsh &mdash; 80&times;24
        </span>
        <span className="titlebar-spacer" />
      </div>

      <div className="terminal-glass">
        <div className="terminal-body">
          <p className="line line-muted">Last login: {today} on ttys000</p>

          <p className="line">
            <span className="prompt">
              <span className="prompt-user">guest@devaki</span>
              <span className="prompt-sep"> : ~ $</span>
            </span>
            whoami
          </p>
          <p className="line line-output">Devaki</p>

          <p className="line">
            <span className="prompt">
              <span className="prompt-user">guest@devaki</span>
              <span className="prompt-sep"> : ~ $</span>
            </span>
            <span className="cursor" />
          </p>
        </div>
      </div>

      <div className="terminal-footer">
        <span>UTF-8 &middot; zsh &middot; ln 12, col 1</span>
        <span className="footer-italic">
          Read-only preview &mdash; commands coming soon
        </span>
      </div>
    </div>
  );
};

export default Terminal;