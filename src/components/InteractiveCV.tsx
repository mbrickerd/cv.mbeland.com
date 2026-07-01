import { useState, useMemo, useRef, useEffect } from "react";
import type { SkillGroup } from "../data/cv";
import type { ExperienceEntry, ProjectEntry } from "../content.config";
import SkillStars from "./SkillStars";

type Props = {
  skillGroups: SkillGroup[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
};

const CARDS_VISIBLE = 2;

function formatDuration(duration: string): string {
  const [startStr, endStr] = duration.split(" to ");

  function parseDate(s: string, fallback: "start" | "end"): Date {
    if (s.toLowerCase() === "present") return new Date();
    if (s.includes("/")) {
      const [m, y] = s.split("/");
      return new Date(parseInt(y), parseInt(m) - 1, 1);
    }
    const y = parseInt(s);
    return new Date(y, fallback === "start" ? 0 : 11, 1);
  }

  const start = parseDate(startStr, "start");
  const end = parseDate(endStr, "end");

  const totalMonths =
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} year${years !== 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} month${months !== 1 ? "s" : ""}`);
  return parts.join(" ") || "< 1 month";
}

export default function InteractiveCV({ skillGroups, experience, projects }: Props) {
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const [selectedExperienceId, setSelectedExperienceId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<ProjectEntry | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  function toggleSkill(skill: string) {
    setSelectedSkills((prev) => {
      const next = new Set(prev);
      if (next.has(skill)) next.delete(skill);
      else next.add(skill);
      return next;
    });
  }

  function toggleExperience(id: string) {
    setSelectedExperienceId((prev) => (prev === id ? null : id));
  }

  const filteredProjects = useMemo(() => {
    let result = projects;
    if (selectedExperienceId) {
      result = result.filter((p) => p.experienceId === selectedExperienceId);
    }
    if (selectedSkills.size > 0) {
      result = result.filter((p) => p.skills.some((s) => selectedSkills.has(s.name)));
    }
    return result;
  }, [projects, selectedExperienceId, selectedSkills]);

  useEffect(() => {
    setCurrentIndex(0);
    if (viewportRef.current) {
      viewportRef.current.scrollLeft = 0;
    }
  }, [filteredProjects]);

  function scrollToIndex(index: number) {
    if (!viewportRef.current) return;
    const firstCard = viewportRef.current.firstElementChild as HTMLElement;
    if (!firstCard) return;
    const step = firstCard.offsetWidth + 16;
    viewportRef.current.scrollTo({ left: index * step, behavior: "smooth" });
    setCurrentIndex(index);
  }

  const canPrev = currentIndex > 0;
  const canNext = currentIndex + CARDS_VISIBLE < filteredProjects.length;
  const hasFilters = selectedSkills.size > 0 || selectedExperienceId !== null;

  const experienceWithProjects = experience.filter((exp) =>
    projects.some((p) => p.experienceId === exp.id)
  );

  const filteredSkillGroups = useMemo(() => {
    const relevantSkills =
      selectedSkills.size > 0
        ? selectedSkills
        : new Set(filteredProjects.flatMap((p) => p.skills.map((s) => s.name)));
    return skillGroups
      .map((group) => ({
        ...group,
        skills: group.skills.filter((s) => relevantSkills.has(s)),
      }))
      .filter((group) => group.skills.length > 0);
  }, [skillGroups, selectedSkills, filteredProjects]);

  const projectsByExperience = useMemo(() => {
    const map = new Map<string, ProjectEntry[]>();
    for (const project of filteredProjects) {
      const existing = map.get(project.experienceId) ?? [];
      map.set(project.experienceId, [...existing, project]);
    }
    return map;
  }, [filteredProjects]);

  const filteredExperience = useMemo(
    () => experience.filter((exp) => projectsByExperience.has(exp.id)),
    [experience, projectsByExperience]
  );

  function handlePrint() {
    if (hasFilters) {
      document.body.setAttribute("data-filtered-print", "");
      const cleanup = () => {
        document.body.removeAttribute("data-filtered-print");
        window.removeEventListener("afterprint", cleanup);
      };
      window.addEventListener("afterprint", cleanup);
    }
    window.print();
  }

  return (
    <>
      {/* Skills section */}
      <section className="section skills-filter-section">
        <div className="section-heading-row">
          <h2>Skills</h2>
          {selectedSkills.size > 0 && (
            <button
              className="ghost-button"
              type="button"
              onClick={() => setSelectedSkills(new Set())}
            >
              Clear
            </button>
          )}
        </div>

        <div className="skill-groups">
          {skillGroups.map((group) => (
            <div key={group.group} className="skill-group">
              <h3>{group.group}</h3>
              <div className="skill-tags">
                {group.skills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    className={selectedSkills.has(skill) ? "skill-tag active" : "skill-tag"}
                    onClick={() => toggleSkill(skill)}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience section */}
      <section
        className="interactive-experience"
        onClick={() => setSelectedExperienceId(null)}
      >
        <div className="section-heading-row">
          <h2>Experience</h2>
        </div>

        <div
          className="position-tabs"
          role="tablist"
          aria-label="Filter by position"
          onClick={(e) => e.stopPropagation()}
        >
          {experienceWithProjects.map((exp) => {
            const active = selectedExperienceId === exp.id;
            return (
              <button
                key={exp.id}
                type="button"
                role="tab"
                aria-selected={active}
                className={active ? "position-tab active" : "position-tab"}
                onClick={() => toggleExperience(exp.id)}
              >
                <span className="tab-company">{exp.company}</span>
                <span className="tab-role">{exp.role}</span>
                <span className="tab-period">{exp.period}</span>
              </button>
            );
          })}
        </div>

        {filteredProjects.length > 0 ? (
          <>
            {hasFilters && (
              <p className="filter-result">
                {filteredProjects.length} project
                {filteredProjects.length !== 1 ? "s" : ""} match current filters.
              </p>
            )}

            <div className="project-slider-container" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="slider-arrow"
                onClick={() => scrollToIndex(currentIndex - 1)}
                disabled={!canPrev}
                aria-label="Previous projects"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>

              <div className="slider-viewport" ref={viewportRef}>
                {filteredProjects.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    className="project-card"
                    onClick={() => setSelectedProject(project)}
                  >
                    <span className="eyebrow">
                      {project.client} · {project.sector}
                    </span>
                    <h3>{project.title}</h3>
                    <p>{project.onlineSummary}</p>
                    <div className="project-skills">
                      {project.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="slider-arrow"
                onClick={() => scrollToIndex(currentIndex + 1)}
                disabled={!canNext}
                aria-label="Next projects"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <p className="filter-result">No projects match the current filters.</p>
        )}
      </section>

      {/* Filtered print view — hidden on screen, shown only when body[data-filtered-print] is set */}
      <div className="filtered-print-view">
        <section className="section">
          <h2>Skills</h2>
          <div className="skill-groups">
            {filteredSkillGroups.map((group) => (
              <div key={group.group} className="skill-group">
                <h3>{group.group}</h3>
                <div className="skill-tags">
                  {group.skills.map((skill) => (
                    <span key={skill} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2>Work History</h2>
          <div className="timeline">
            {filteredExperience.map((exp) => (
              <article key={exp.id} className="experience-item">
                <div className="period">{exp.period}</div>
                <div className="experience-content">
                  <h3>{exp.role}</h3>
                  <p className="company">
                    <strong>{exp.company}</strong> — {exp.location}
                  </p>
                  <ul>
                    {(projectsByExperience.get(exp.id) ?? []).map((project) => (
                      <li key={project.id}>
                        <strong>{project.title}</strong> — {project.printSummary}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {/* Project modal */}
      {selectedProject && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setSelectedProject(null)}
        >
          <article
            className="project-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="close-button"
              onClick={() => setSelectedProject(null)}
              aria-label="Close"
            >
              ×
            </button>

            <p className="eyebrow">{selectedProject.employer}</p>
            <h2 id="project-modal-title">{selectedProject.title}</h2>
            <p className="modal-summary">{selectedProject.onlineSummary}</p>

            <dl className="project-meta">
              <div>
                <dt>Client</dt>
                <dd>{selectedProject.client}</dd>
              </div>
              <div>
                <dt>Sector</dt>
                <dd>{selectedProject.sector}</dd>
              </div>
              <div>
                <dt>Duration</dt>
                <dd>{formatDuration(selectedProject.duration)}</dd>
              </div>
              <div>
                <dt>Role</dt>
                <dd>{selectedProject.role}</dd>
              </div>
            </dl>

            <h3>What I did</h3>
            <ul>
              {selectedProject.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>

            <h3>Skills used</h3>
            <SkillStars skills={[...selectedProject.skills].sort((a, b) => b.level - a.level)} />
          </article>
        </div>
      )}

      {/* Print button */}
      <button className="print-button" type="button" onClick={handlePrint}>
        {hasFilters ? "Export filtered PDF" : "Export as PDF"}
      </button>
    </>
  );
}
