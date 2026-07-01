type Skill = {
  name: string;
  level: number;
};

export default function SkillStars({ skills }: { skills: Skill[] }) {
  return (
    <div className="skill-stars">
      {skills.map((skill) => (
        <div className="skill-star-row" key={skill.name}>
          <span>{skill.name}</span>
          <span
            className="stars"
            aria-label={`${skill.level} out of 5`}
            title={`${skill.level} out of 5`}
          >
            {"★".repeat(skill.level)}
            {"☆".repeat(5 - skill.level)}
          </span>
        </div>
      ))}
    </div>
  );
}
