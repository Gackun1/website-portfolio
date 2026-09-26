import HeroSection from "./components/HeroSection/HeroSection";
import AboutSection from "./components/AboutSection/AboutSection";
import SkillsSection from "./components/SkillsSection/SkillsSection";
import WorksSection from "./components/WorksSection/WorksSection";
import BlogSection from "./components/BlogSection/BlogSection";
import ContactSection from "./components/ContactSection/ContactSection";
import Marquee from "../components/Marquee/Marquee";
import { getAllPosts } from "../lib/blog";
import { getAllWorks } from "../lib/works";

export default function Home() {
  const posts = getAllPosts();
  const works = getAllWorks();

  return (
    <main>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <Marquee items={["Design", "Code", "Motion", "Interaction"]} />
      <WorksSection works={works} />
      <BlogSection posts={posts} />
      <ContactSection />
    </main>
  );
}
