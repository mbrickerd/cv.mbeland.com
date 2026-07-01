import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const cv = defineCollection({
  loader: glob({
    pattern: "**/*.yml",
    base: "./src/content/cv"
  }),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    location: z.string(),
    email: z.string(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
    summary: z.string(),

    skillGroups: z.array(
      z.object({
        group: z.string(),
        skills: z.array(z.string())
      })
    ),

    experience: z.array(
      z.object({
        id: z.string(),
        company: z.string(),
        location: z.string(),
        role: z.string(),
        period: z.string(),
        highlights: z.array(
          z.object({
            title: z.string(),
            summary: z.string()
          })
        )
      })
    ),

    education: z.array(
      z.object({
        degree: z.string(),
        field: z.string(),
        institution: z.string(),
        location: z.string(),
        completed: z.string()
      })
    ),

    certifications: z.array(z.string()),
    languages: z.array(z.string()),
    hobbies: z.array(z.string())
  })
});

const projects = defineCollection({
  loader: glob({
    pattern: "**/*.yml",
    base: "./src/content/projects"
  }),
  schema: z.object({
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
        level: z.number().min(1).max(5)
      })
    ),

    tags: z.array(z.string())
  })
});

export const collections = {
  cv,
  projects
};