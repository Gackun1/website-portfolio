import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const postsDirectory = path.join(process.cwd(), "content/blog");

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  image: string;
  description: string;
};

export type Post = PostMeta & {
  contentHtml: string;
};

export function getPostSlugs(): string[] {
  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

export function getAllPosts(): PostMeta[] {
  const slugs = getPostSlugs();

  return slugs
    .map((slug) => {
      const filePath = path.join(postsDirectory, `${slug}.md`);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title,
        date: data.date,
        image: data.image,
        description: data.description,
      };
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getPostBySlug(slug: string): Post {
  const filePath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  const contentHtml = marked(content) as string;

  return {
    slug,
    title: data.title,
    date: data.date,
    image: data.image,
    description: data.description,
    contentHtml,
  };
}
