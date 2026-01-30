const principles = [
  {
    title: "Evidence-backed by design",
    description: "Every response is anchored to specific passages in your source material. Nothing is fabricated.",
  },
  {
    title: "Clickable source citations",
    description: "Navigate directly to the exact location in your documents. Verify claims in seconds.",
  },
  {
    title: "Multi-modal document understanding",
    description: "Upload PDFs, images, audio, and video. TRACE processes them all with the same precision.",
  },
  {
    title: "Built for serious analysis",
    description: "Designed for research, law, finance, and any field where accuracy is non-negotiable.",
  },
];

const PrinciplesSection = () => {
  return (
    <section style={{ 
      paddingTop: 'clamp(6rem, 15vh, 12rem)', 
      paddingBottom: 'clamp(6rem, 15vh, 12rem)',
      borderTop: '1px solid hsl(0 0% 12%)'
    }}>
      <div style={{ maxWidth: '80rem', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1.5rem', paddingRight: '3rem' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '4rem'
        }}>
          {principles.map((principle, index) => (
            <div key={principle.title}>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 500, 
                color: 'hsl(40 20% 98%)', 
                letterSpacing: '-0.025em'
              }}>
                {principle.title}
              </h3>
              <p style={{ marginTop: '1rem', fontSize: '1.125rem', lineHeight: 1.7, color: 'hsl(0 0% 70%)' }}>
                {principle.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PrinciplesSection;
