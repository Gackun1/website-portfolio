import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const worksDirectory = path.join(process.cwd(), "content/works");

export type WorkItem = {
  slug: string;
  title: string;
  category: string;
  image: string;
  fullImage: string;
  order: number;
};

export type Work = WorkItem & {
  contentHtml: string;
};

export function getWorkSlugs(): string[] {
  return fs
    .readdirSync(worksDirectory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

export function getAllWorks(): WorkItem[] {
  const slugs = getWorkSlugs();

  return slugs
    .map((slug) => {
      const filePath = path.join(worksDirectory, `${slug}.md`);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title,
        category: data.category,
        image: data.image,
        fullImage: data.fullImage,
        order: data.order ?? 0,
      };
    })
    .sort((a, b) => a.order - b.order);
}

export function getWorkBySlug(slug: string): Work {
  const filePath = path.join(worksDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  const contentHtml = marked(content) as string;

  return {
    slug,
    title: data.title,
    category: data.category,
    image: data.image,
    fullImage: data.fullImage,
    order: data.order ?? 0,
    contentHtml,
  };
}
