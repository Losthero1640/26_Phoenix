import { useEffect } from "react";

// This route is meant to open the separate Trace app located at `Frontend/trace/`.
// That app runs its own Vite dev server (configured to port 4000).
const Trace = () => {
  useEffect(() => {
    const { protocol, hostname } = window.location;
    const traceUrl = `${protocol}//${hostname}:4000/`;
    window.location.replace(traceUrl);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0a0a0a",
        color: "#f5f5f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div style={{ maxWidth: 720, textAlign: "center" }}>
        <div style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>
          Opening TRACE…
        </div>
        <div style={{ color: "#a8b5a0" }}>
          If nothing opens, start the Trace app from `Frontend/trace` (it runs on port 4000).
        </div>
      </div>
    </div>
  );
};

export default Trace;

