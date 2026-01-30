const Navigation = () => {
  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      backgroundColor: 'hsl(0 0% 4% / 0.8)',
      backdropFilter: 'blur(12px)'
    }}>
      <div style={{ maxWidth: '80rem', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1.5rem', paddingRight: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '5rem' }}>
          {/* Logo */}
          <a href="/" style={{ color: 'hsl(40 20% 95%)', fontWeight: 600, fontSize: '1.25rem', letterSpacing: '-0.025em', textDecoration: 'none' }}>
            TRACE
          </a>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button style={{
              backgroundColor: 'transparent',
              color: 'hsl(0 0% 55%)',
              fontSize: '0.875rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'color 0.2s'
            }}>
              Log in
            </button>
            <button style={{
              backgroundColor: 'hsl(40 20% 95%)',
              color: 'hsl(0 0% 4%)',
              fontSize: '0.875rem',
              fontWeight: 500,
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              Sign up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
