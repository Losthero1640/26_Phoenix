import { Button } from "@/components/ui/button.jsx";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: '5rem', paddingBottom: '8rem' }}>
      <div style={{ maxWidth: '80rem', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1.5rem', paddingRight: '1.5rem', width: '100%' }}>
        <div style={{ maxWidth: '56rem' }}>
          {/* Headline */}
          <h1 style={{ 
            fontSize: 'clamp(3rem, 8vw, 6rem)', 
            lineHeight: 1.05, 
            letterSpacing: '-0.03em', 
            fontWeight: 600,
            color: 'hsl(40 20% 98%)'
          }}>
            Answers are cheap.
            <br />
            <span style={{ 
              background: 'linear-gradient(135deg, hsl(40 20% 98%) 0%, hsl(40 20% 70%) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Evidence is not.
            </span>
          </h1>

          {/* Subtext */}
          <p style={{ 
            marginTop: '2rem', 
            fontSize: '1.25rem', 
            lineHeight: 1.7, 
            color: 'hsl(0 0% 70%)',
            maxWidth: '42rem'
          }}>
            TRACE is an AI assistant that grounds every answer in your documents, 
            with clear, clickable citations.
          </p>

          {/* CTAs */}
          <div style={{ marginTop: '3rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <button style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              backgroundColor: 'hsl(40 20% 95%)',
              color: 'hsl(0 0% 4%)',
              fontSize: '1rem',
              fontWeight: 500,
              padding: '1rem 2rem',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}>
              Try TRACE
              <ArrowRight style={{ width: '1rem', height: '1rem' }} />
            </button>
            <button style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              color: 'hsl(40 20% 95%)',
              fontSize: '1rem',
              fontWeight: 500,
              padding: '1rem 2rem',
              borderRadius: '9999px',
              border: '1px solid hsl(40 20% 95% / 0.2)',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}>
              See how it works
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
