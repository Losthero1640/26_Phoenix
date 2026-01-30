const FooterSection = () => {
  return (
    <footer style={{ paddingTop: '3rem', paddingBottom: '3rem', borderTop: '1px solid hsl(0 0% 12%)' }}>
      <div style={{ maxWidth: '80rem', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1.5rem', paddingRight: '3rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
            <div style={{ color: 'hsl(40 20% 95%)', fontWeight: 600, fontSize: '1.125rem', letterSpacing: '-0.025em' }}>
              TRACE
            </div>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <a href="#" style={{ color: 'hsl(0 0% 45%)', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s' }}>
                Privacy
              </a>
              <a href="#" style={{ color: 'hsl(0 0% 45%)', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s' }}>
                Terms
              </a>
              <a href="#" style={{ color: 'hsl(0 0% 45%)', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s' }}>
                Contact
              </a>
            </div>
          </div>
          <div style={{ paddingTop: '2rem', borderTop: '1px solid hsl(0 0% 12%)' }}>
            <p style={{ color: 'hsl(0 0% 45%)', fontSize: '0.875rem' }}>
              © {new Date().getFullYear()} TRACE. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
