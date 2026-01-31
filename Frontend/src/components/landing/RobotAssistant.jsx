import Lottie from "lottie-react";
import robotAnimation from "@/assets/Robot-Bot 3D.json";

const RobotAssistant = () => {
  return (
    <div
      style={{
        position: "fixed",
        right: "2rem",
        bottom: "2rem",
        width: "180px",
        height: "180px",
        zIndex: 5,
        pointerEvents: "none", // 👈 doesn't block hero interactions
        filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.6))",
      }}
    >
      <Lottie
        animationData={robotAnimation}
        loop
        autoplay
      />
    </div>
  );
};

export default RobotAssistant;
