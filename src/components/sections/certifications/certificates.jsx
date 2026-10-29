import React, { useState, useRef, useCallback } from 'react';
import './certificates.css';

const Certificates = () => {
  return (
    <>
      <header className="certificates-header">
        <h1 className="certificates-headline">
          <span className="highlight-box">
            <img 
              src="../../../assets/images/cert.png" 
              alt="Character" 
              className="cert-character-img" 
            />
            CERTIFICATIONS <span className="asterisk">*</span>
          </span>
        </h1>
        <span className="certificates-tag">stay weird, its limited edition </span>
      </header>
    </>
  );
};

export default Certificates;