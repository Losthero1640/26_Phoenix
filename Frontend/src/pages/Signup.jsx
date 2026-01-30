import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import traceLogo from "@/assets/trace-logo.png";
import { signup } from "@/lib/authApi.js";
import { setAuth } from "@/lib/authStorage.js";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await signup({ email, password });
      // backend auto-logs in after signup and returns tokens
      setAuth({ ...res, email });
      navigate("/trace");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      color: '#f5f5f0',
      display: 'flex',
      justifyContent: 'center',
    }}>
      {/* Content Container - Centered */}
      <div style={{
        display: 'flex',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {/* Left Side - Form */}
        <div style={{
          flex: '0 0 45%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '3rem 4rem 3rem 3rem',
        }}>
          {/* Logo/Brand */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '3rem',
              textDecoration: 'none',
            }}
          >
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              border: '2px solid #a8b5a0',
              backgroundColor: 'transparent',
            }} />
            <span style={{
              fontSize: '1.125rem',
              fontWeight: 500,
              color: '#a8b5a0',
            }}>
              Trace
            </span>
          </Link>

          {/* Heading */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            lineHeight: 1.1,
            fontWeight: 400,
            marginBottom: '3rem',
          }}>
            <span style={{ color: '#f5f5f0' }}>From raw</span>
            <br />
            <span style={{ color: '#f5f5f0' }}>documents</span>
            <br />
            <span style={{ color: '#a8b5a0' }}>to grounded</span>
            <br />
            <span style={{ color: '#a8b5a0' }}>answers</span>
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
            {/* Email Label */}
            <label 
              htmlFor="email" 
              style={{ 
                fontSize: '0.75rem', 
                fontWeight: 500, 
                color: '#888',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'block',
                marginBottom: '0.5rem',
              }}
            >
              Email
            </label>
            
            {/* Email Input */}
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              required
              style={{
                width: '100%',
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '0.5rem',
                padding: '1rem',
                color: '#f5f5f0',
                fontSize: '1rem',
                outline: 'none',
                marginBottom: '1rem',
                boxSizing: 'border-box',
              }}
            />

            {/* Password Label */}
            <label 
              htmlFor="password" 
              style={{ 
                fontSize: '0.75rem', 
                fontWeight: 500, 
                color: '#888',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'block',
                marginBottom: '0.5rem',
              }}
            >
              Password
            </label>
            
            {/* Password Input */}
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              style={{
                width: '100%',
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '0.5rem',
                padding: '1rem',
                color: '#f5f5f0',
                fontSize: '1rem',
                outline: 'none',
                marginBottom: '1.5rem',
                boxSizing: 'border-box',
              }}
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                backgroundColor: '#c5d4b8',
                color: '#1a1a1a',
                fontSize: '1rem',
                fontWeight: 500,
                padding: '1rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                marginBottom: '1.5rem',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>

            {/* Error */}
            {error ? (
              <p style={{ color: "#ffb4b4", fontSize: "0.875rem", marginBottom: "1rem" }}>
                {error}
              </p>
            ) : null}

            {/* Terms */}
            <p style={{
              fontSize: '0.875rem',
              color: '#888',
              lineHeight: 1.6,
              marginBottom: '2rem',
              textAlign: 'center',
            }}>
              By signing up, you agree to our{' '}
              <a href="#" style={{ color: '#f5f5f0', textDecoration: 'underline' }}>
                Terms and Conditions
              </a>{' '}
              and{' '}
              <a href="#" style={{ color: '#f5f5f0', textDecoration: 'underline' }}>
                Privacy Policy
              </a>.
            </p>
          </form>

          {/* Login Link */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '1rem',
            backgroundColor: '#1a1a1a',
            padding: '0.75rem 1rem',
            borderRadius: '9999px',
            maxWidth: 'fit-content',
          }}>
            <span style={{ color: '#888', fontSize: '0.875rem' }}>
              Do you have account already?
            </span>
            <Link
              to="/login"
              style={{
                backgroundColor: '#2a2a2a',
                color: '#f5f5f0',
                fontSize: '0.875rem',
                fontWeight: 500,
                textDecoration: 'none',
                padding: '0.5rem 1.25rem',
                borderRadius: '9999px',
                border: 'none',
              }}
            >
              Log in
            </Link>
          </div>
        </div>

        {/* Right Side - Arch with Logo */}
        <div style={{
          flex: '0 0 55%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '2rem 0',
          position: 'relative',
        }}>
          {/* Arch Shape */}
          <div style={{
            width: '90%',
            maxWidth: '480px',
            height: '90vh',
            maxHeight: '700px',
            backgroundColor: '#1a1a1a',
            borderRadius: '240px 240px 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Decorative dots */}
            <div style={{
              position: 'absolute',
              top: '8%',
              right: '20%',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#3a3a3a',
            }} />
            <div style={{
              position: 'absolute',
              top: '15%',
              right: '10%',
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              backgroundColor: '#3a3a3a',
            }} />
            <div style={{
              position: 'absolute',
              top: '35%',
              left: '8%',
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              backgroundColor: '#3a3a3a',
            }} />
            <div style={{
              position: 'absolute',
              bottom: '40%',
              left: '12%',
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              backgroundColor: '#3a3a3a',
            }} />
            <div style={{
              position: 'absolute',
              bottom: '25%',
              right: '15%',
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              backgroundColor: '#3a3a3a',
            }} />
            
            {/* Logo Image */}
            <img 
              src={traceLogo} 
              alt="TRACE Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 40%',
              }}
            />
          </div>
        </div>
      </div>

      {/* Responsive styles for mobile */}
      <style>{`
        @media (max-width: 900px) {
          div > div:first-child {
            flex-direction: column;
          }
          div > div:first-child > div:last-child {
            display: none;
          }
          div > div:first-child > div:first-child {
            flex: 1;
            padding: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Signup;
