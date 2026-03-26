import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const CustomSelect = ({ value, onChange, options, placeholder, disabled, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selectedOption = options.find(o => o.value === value);

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      {/* Hidden native input for required validation */}
      {required && (
        <input 
          tabIndex={-1}
          autoComplete="off"
          style={{ opacity: 0, height: 0, width: 0, position: 'absolute', pointerEvents: 'none' }}
          value={value || ''}
          onChange={() => {}}
          required={required}
        />
      )}

      <div 
        className={`form-input flex justify-between items-center ${disabled ? 'opacity-50' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{ cursor: disabled ? 'not-allowed' : 'pointer', userSelect: 'none', opacity: disabled ? 0.6 : 1 }}
      >
        <span style={{ color: selectedOption ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={18} className="text-secondary" />
      </div>
      
      {isOpen && !disabled && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px',
          background: 'var(--bg-card)', border: '1px solid var(--border-color)',
          borderRadius: '8px', zIndex: 9999, maxHeight: '200px', overflowY: 'auto',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
        }}>
          {options.map((opt, i) => (
            <div 
              key={i}
              onClick={() => { onChange({ target: { value: opt.value } }); setIsOpen(false); }}
              style={{
                padding: '0.75rem 1rem', cursor: 'pointer',
                background: value === opt.value ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                color: value === opt.value ? 'var(--primary-color)' : 'var(--text-primary)'
              }}
              onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.05)'}
              onMouseLeave={e => e.target.style.background = value === opt.value ? 'rgba(16, 185, 129, 0.2)' : 'transparent'}
            >
              {opt.label}
            </div>
          ))}
          {options.length === 0 && (
            <div style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>Tidak ada data</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
