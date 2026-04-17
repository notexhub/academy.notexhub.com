'use client';
export default function Card({ children, style, ...props }) {
  return (
    <div
      {...props}
      style={{
        backgroundColor: 'var(--background)',
        border: '1px solid var(--gray)',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        transition: 'transform 0.2s box-shadow 0.2s',
        ...style
      }}
      onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 6px 25px rgba(0,0,0,0.08)'}
      onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)'}
    >
      {children}
    </div>
  );
}
