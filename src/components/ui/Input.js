'use client';
export default function Input({ label, style, inputStyle, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.2rem', ...style }}>
      {label && <label style={{ fontWeight: '600', color: 'var(--black-light)' }}>{label}</label>}
      <input
        {...props}
        style={{
          padding: '0.8rem 1rem',
          borderRadius: '6px',
          border: '1px solid var(--gray)',
          fontSize: '1rem',
          outline: 'none',
          transition: 'border-color 0.2s',
          backgroundColor: '#fafafa',
          width: '100%',
          ...inputStyle
        }}
        onFocus={(e) => e.target.style.borderColor = 'var(--foreground)'}
        onBlur={(e) => e.target.style.borderColor = 'var(--gray)'}
      />
    </div>
  );
}
