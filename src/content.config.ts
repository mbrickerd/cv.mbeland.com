import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const experienceSchema = z.object({
  company: z.string(),
  location: z.string(),
  role: z.string(),
  period: z.string(),
});

const projectSchema = z.object({
  title: z.string(),
  experienceId: z.string(),
  employer: z.string(),
  client: z.string(),
  sector: z.string(),
  duration: z.string(),
  role: z.string(),

  printSummary: z.string(),
  onlineSummary: z.string(),

  details: z.array(z.string()),

  skills: z.array(
    z.object({
      name: z.string(),
      level: z.number().min(1).max(5),
    })
  ),

  tags: z.array(z.string()),
});

export type ExperienceEntry = z.infer<typeof experienceSchema> & { id: string };
export type ProjectEntry = z.infer<typeof projectSchema> & { id: string };

const experience = defineCollection({
  loader: glob({
    pattern: "**/*.yml",
    base: "./src/content/experience",
  }),
  schema: experienceSchema,
});

const projects = defineCollection({
  loader: glob({
    pattern: "**/*.yml",
    base: "./src/content/projects",
  }),
  schema: projectSchema,
});

export const collections = {
  experience,
  projects,
};
