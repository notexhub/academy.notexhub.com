'use client';
export default function Button({ children, style, className, variant = 'primary', ...props }) {
  const isSecondary = variant === 'secondary';
  return (
    <button
      {...props}
      className={className}
      style={{
        backgroundColor: isSecondary ? 'var(--foreground)' : 'var(--lime)',
        color: isSecondary ? 'var(--lime)' : 'var(--foreground)',
        padding: '0.8rem 1.5rem',
        fontWeight: 'bold',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1rem',
        transition: 'all 0.2s ease',
        ...style
      }}
      onMouseOver={(e) => {
        e.target.style.transform = 'scale(1.02)';
        e.target.style.opacity = '0.9';
      }}
      onMouseOut={(e) => {
        e.target.style.transform = 'scale(1)';
        e.target.style.opacity = '1';
      }}
    >
      {children}
    </button>
  );
}
