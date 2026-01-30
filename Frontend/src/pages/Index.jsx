import Navigation from "@/components/landing/Navigation.jsx";
import HeroSection from "@/components/landing/HeroSection.jsx";
import ExplainerSection from "@/components/landing/ExplainerSection.jsx";
import PrinciplesSection from "@/components/landing/PrinciplesSection.jsx";
import FooterSection from "@/components/landing/FooterSection.jsx";

const Index = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'hsl(0 0% 4%)', color: 'hsl(40 20% 95%)' }}>
      <Navigation />
      <main>
        <HeroSection />
        <ExplainerSection />
        <PrinciplesSection />
      </main>
      <FooterSection />
    </div>
  );
};

export default Index;
