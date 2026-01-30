const ExplainerSection = () => {
  return (
    <section style={{ 
      paddingTop: 'clamp(4rem, 10vh, 8rem)', 
      paddingBottom: 'clamp(4rem, 10vh, 8rem)',
      borderTop: '1px solid hsl(0 0% 12%)'
    }}>
      <div style={{ maxWidth: '80rem', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1.5rem', paddingRight: '3rem' }}>
        <div style={{ maxWidth: '48rem' }}>
          <p style={{ 
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', 
            lineHeight: 1.1, 
            letterSpacing: '-0.02em', 
            fontWeight: 500,
            color: 'hsl(40 20% 98%)'
          }}>
            TRACE analyzes your documents and shows exactly where each answer comes from.
          </p>
          <p style={{ marginTop: '1.5rem', fontSize: '1.25rem', lineHeight: 1.7, color: 'hsl(0 0% 70%)' }}>
            No hallucinations. No black boxes.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ExplainerSection;
