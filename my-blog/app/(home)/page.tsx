import HeroSection from "./components/HeroSection/HeroSection";
import AboutSection from "./components/AboutSection/AboutSection";
import SkillsSection from "./components/SkillsSection/SkillsSection";
import WorksSection from "./components/WorksSection/WorksSection";
import BlogSection from "./components/BlogSection/BlogSection";
import ContactSection from "./components/ContactSection/ContactSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <WorksSection />
      <BlogSection />
      <ContactSection />
    </main>
  );
}
