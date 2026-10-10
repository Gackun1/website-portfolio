"use client";

import { useState } from "react";
import ScrollReveal from "../../../components/motion/ScrollReveal";
import StaggerContainer from "../../../components/motion/StaggerContainer";
import StaggerItem from "../../../components/motion/StaggerItem";
import SectionHeading from "../../../components/SectionHeading/SectionHeading";
import SkillNetwork from "./SkillNetwork";
import styles from "./SkillsSection.module.scss";

type SkillCategory = {
  name: string;
  colorClass: string;
  skills: string[];
};

const skillCategories: SkillCategory[] = [
  {
    name: "Frontend",
    colorClass: "frontend",
    skills: ["HTML5", "CSS3", "SASS", "JavaScript", "TypeScript", "React.js", "Next.js", "jQuery"],
  },
  {
    name: "Backend / CMS",
    colorClass: "backend",
    skills: ["PHP", "Node.js", "MySQL", "WordPress", "Movable Type", "HeartCore", "Shopify", "MicroCMS"],
  },
  {
    name: "Design",
    colorClass: "design",
    skills: ["Figma", "Illustrator", "Photoshop", "XD", "Premiere Pro", "After Effects", "UI/UX"],
  },
  {
    name: "Quality",
    colorClass: "quality",
    skills: ["SEO", "Accessibility", "Core Web Vitals"],
  },
];

export default function SkillsSection() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  return (
    <section id="skill" className={styles.section}>
      <SectionHeading name="skills" index="02" label="Tech stack" />
      <div className={styles.layout}>
        <div className={styles.categories}>
          {skillCategories.map((category) => (
            <div key={category.name} className={styles.item}>
              <ScrollReveal>
                <h4 className={`${styles.categoryTitle} ${styles[category.colorClass]}`}>{category.name}</h4>
              </ScrollReveal>
              <StaggerContainer className={styles.list}>
                {category.skills.map((skill) => (
                  <StaggerItem key={skill}>
                    <span
                      className={`${styles.badge} ${styles[category.colorClass]}`}
                      tabIndex={0}
                      onMouseEnter={() => setHoveredSkill(skill)}
                      onMouseLeave={() => setHoveredSkill(null)}
                      onFocus={() => setHoveredSkill(skill)}
                      onBlur={() => setHoveredSkill(null)}
                    >
                      {skill}
                    </span>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          ))}
        </div>

        <div className={styles.visual}>
          <SkillNetwork skillData={skillCategories} hoveredSkill={hoveredSkill} />
        </div>
      </div>
    </section>
  );
}
