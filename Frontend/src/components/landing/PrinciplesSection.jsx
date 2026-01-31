import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const principles = [
  {
    title: "Evidence-backed by design",
    description:
      "Every response is anchored to specific passages in your source material. Nothing is fabricated.",
  },
  {
    title: "Clickable source citations",
    description:
      "Navigate directly to the exact location in your documents. Verify claims in seconds.",
  },
  {
    title: "Multi-modal document understanding",
    description:
      "Upload PDFs, images, audio, and video. TRACE processes them all with the same precision.",
  },
];

const PrinciplesSection = () => {
  const sectionRef = useRef(null);

  // ✅ SCROLL IS NOW TIED TO THIS SECTION
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={sectionRef}
      style={{
        height: "250vh", // 👈 gives scroll room
        borderTop: "1px solid hsl(0 0% 12%)",
        background: "#0a0a0a",
      }}
    >
      {/* STICKY CONTAINER */}
      <div
        style={{
          position: "sticky",
          top: "120px",
          maxWidth: "80rem",
          margin: "0 auto",
          padding: "0 3rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "3rem",
          }}
        >
          {principles.map((principle, index) => {
            const start = index * 0.25;
            const end = start + 0.35;

            const y = useTransform(scrollYProgress, [start, end], [180, 0]);
            const rotate = useTransform(scrollYProgress, [start, end], [-10, 0]);
            const scale = useTransform(scrollYProgress, [start, end], [0.95, 1]);
            const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);

            return (
              <motion.div
                key={principle.title}
                style={{
                  y,
                  rotate,
                  scale,
                  opacity,
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: "18px",
                  padding: "2rem",
                  backdropFilter: "blur(14px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 500,
                    color: "hsl(40 20% 98%)",
                    letterSpacing: "-0.025em",
                  }}
                >
                  {principle.title}
                </h3>

                <p
                  style={{
                    marginTop: "1rem",
                    fontSize: "1.125rem",
                    lineHeight: 1.7,
                    color: "hsl(0 0% 70%)",
                  }}
                >
                  {principle.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PrinciplesSection;
