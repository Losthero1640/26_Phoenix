import { Link } from "react-router-dom";

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
          <Link to="/" style={{ color: 'hsl(40 20% 95%)', fontWeight: 600, fontSize: '1.25rem', letterSpacing: '-0.025em', textDecoration: 'none' }}>
            TRACE
          </Link>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link 
              to="/login"
              style={{
                backgroundColor: 'transparent',
                color: 'hsl(0 0% 55%)',
                fontSize: '0.875rem',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
            >
              Log in
            </Link>
            <Link 
              to="/signup"
              style={{
                backgroundColor: 'hsl(40 20% 95%)',
                color: 'hsl(0 0% 4%)',
                fontSize: '0.875rem',
                fontWeight: 500,
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
