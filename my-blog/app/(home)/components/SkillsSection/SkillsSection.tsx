"use client";

import { useState } from "react";
import GeometricShapes from "../../../components/GeometricShapes/GeometricShapes";
import ScrollReveal from "../../../components/motion/ScrollReveal";
import StaggerContainer from "../../../components/motion/StaggerContainer";
import StaggerItem from "../../../components/motion/StaggerItem";
import SectionHeading from "../../../components/SectionHeading/SectionHeading";
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
    skills: ["PHP", "Node.js", "MySQL", "WordPress", "Shopify", "MicroCMS"],
  },
  {
    name: "Design",
    colorClass: "design",
    skills: ["Figma", "Illustrator", "Photoshop", "XD", "UI/UX"],
  },
  {
    name: "Quality",
    colorClass: "quality",
    skills: ["SEO", "アクセシビリティ", "コアウェブバイタル"],
  },
];

export default function SkillsSection() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  return (
    <section id="skill" className={styles.section}>
      <GeometricShapes
        variant="skills"
        skillData={skillCategories}
        hoveredSkill={hoveredSkill}
      />
      <div className={styles.content}>
        <ScrollReveal>
          <SectionHeading name="skills" />
        </ScrollReveal>
        <div className={styles.grid}>
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
                      onMouseEnter={() => setHoveredSkill(skill)}
                      onMouseLeave={() => setHoveredSkill(null)}
                    >
                      {skill}
                    </span>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
