import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import "../../style/hero-mask.css";

const HeroSection = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const hiddenLayer = hero.querySelector(".hidden-layer");
    const hoverTargets = hero.querySelectorAll("h1, p, button");

    const xTo = gsap.quickTo(hiddenLayer, "--x", {
      duration: 0.4,
      ease: "power4.out",
    });

    const yTo = gsap.quickTo(hiddenLayer, "--y", {
      duration: 0.4,
      ease: "power4.out",
    });

    const revealTl = gsap.timeline({ paused: true });
    revealTl.to(hiddenLayer, {
      "--size": 260,
      opacity: 1,
      duration: 0.75,
      ease: "back.out(1.7)",
    });

    hoverTargets.forEach((el) => {
      el.addEventListener("mouseenter", () => revealTl.restart());
      el.addEventListener("mouseleave", () => revealTl.reverse());
    });

    const onMove = (e) => {
      xTo(e.pageX);
      yTo(e.pageY);
    };

    window.addEventListener("mousemove", onMove);

    gsap.set(hiddenLayer, {
      opacity: 1,
      "--x": window.innerWidth / 2,
      "--y": window.innerHeight / 2,
    });

    return () => {
      window.removeEventListener("mousemove", onMove);
      hoverTargets.forEach((el) => {
        el.replaceWith(el.cloneNode(true));
      });
    };
  }, []);

  return (
    <section ref={heroRef} className="hero-wrapper">
      {/* MOVING AURORA GRADIENT */}
      <div className="hero-gradient-bg" />

      {/* DOT MASK */}
      <div className="hidden-layer" />

      {/* CONTENT */}
      <div className="hero-content">
        <div className="hero-inner">
          <div className="hero-text">
            <h1>
              Answers are cheap.
              <br />
              <span>Evidence is not.</span>
            </h1>

            <p>
              TRACE is an AI assistant that grounds every answer in your
              documents with clear, clickable citations.
            </p>

            <div className="hero-actions">
              <button className="primary-btn">
                Try TRACE <ArrowRight size={16} />
              </button>

              <button className="secondary-btn">
                See how it works
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
