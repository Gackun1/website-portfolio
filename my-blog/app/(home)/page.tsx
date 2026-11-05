import HeroSection from "./components/HeroSection/HeroSection";
import AboutSection from "./components/AboutSection/AboutSection";
import SkillsSection from "./components/SkillsSection/SkillsSection";
import WorksSection from "./components/WorksSection/WorksSection";
import BlogSection from "./components/BlogSection/BlogSection";
import ContactSection from "./components/ContactSection/ContactSection";
import Marquee from "../components/Marquee/Marquee";
import SectionIndicator from "../components/SectionIndicator/SectionIndicator";
import { getAllPosts } from "../lib/blog";
import { getAllWorks } from "../lib/works";

export default function Home() {
  const posts = getAllPosts();
  const works = getAllWorks().slice(0, 3); // トップは3件、残りは一覧ページで

  return (
    <main>
      <SectionIndicator />
      <HeroSection visual="pathPlus" />
      <AboutSection />
      <SkillsSection />
      <Marquee items={["Design", "Code", "Motion", "Interaction"]} />
      <WorksSection works={works} />
      <BlogSection posts={posts} />
      <ContactSection />
    </main>
  );
}
