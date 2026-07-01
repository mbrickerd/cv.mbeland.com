export type SkillGroup = {
  group: string;
  skills: string[];
};

export type Education = {
  degree: string;
  field: string;
  institution: string;
  location: string;
  completed: string;
};

export type Certification = {
  name: string;
  badge?: string;
  credly?: string;
  issued?: string;
  expires?: string;
  inProgress?: boolean;
};

export type CV = {
  name: string;
  title: string;
  location: string;
  email: string;
  linkedin?: string;
  github?: string;
  summary: string;
  skillGroups: SkillGroup[];
  education: Education[];
  certifications: Certification[];
  languages: string[];
  hobbies: string[];
};

export const cv: CV = {
  name: "Mallory Brickerd-Eland",
  title: "Senior Data Engineer",
  location: "Amsterdam, the Netherlands",
  email: "mallorybrickerd@gmail.com",
  linkedin: "https://www.linkedin.com/in/mallorybrickerd/",
  github: "https://github.com/mbrickerd",

  summary:
    "Senior Data Engineer with 7+ years of experience building scalable data platforms, " +
    "ML pipelines, and cloud-native solutions across GCP, Azure, and AWS. Proven track " +
    "record delivering production-grade data engineering and ML systems for global " +
    "enterprises across retail, financial services, pharmaceuticals, public sector, and " +
    "logistics. Expert in dbt, BigQuery, Apache Airflow, PySpark, and Terraform, with " +
    "deep hands-on experience in ML engineering and MLOps. Equally comfortable " +
    "architecting governed medallion-layer data models, building end-to-end SageMaker " +
    "pipelines, or shipping FastAPI microservices into production. Certified in Azure " +
    "(AZ-900, DP-203) and AWS ML Specialty.",

  skillGroups: [
    {
      group: "Data Engineering",
      skills: ["SQL", "Python", "Apache Airflow", "BigQuery", "dbt", "Data Modelling", "PySpark", "Databricks"],
    },
    {
      group: "Cloud & Infrastructure",
      skills: ["GCP", "Azure", "AWS", "Terraform", "Docker", "Kubernetes", "CI/CD", "Azure DevOps"],
    },
    {
      group: "Machine Learning & MLOps",
      skills: ["Machine Learning", "MLOps", "MLflow", "AWS SageMaker", "SHAP", "Model Monitoring", "PyTorch", "FastAPI"],
    },
  ],

  education: [
    {
      degree: "Bachelor of Science",
      field: "Applied Mathematics and Computer Science",
      institution: "The College of William & Mary",
      location: "Williamsburg, Virginia, United States",
      completed: "05/2016",
    },
  ],

  certifications: [
    {
      name: "AZ-900: Azure Fundamentals",
      badge: "https://images.credly.com/size/680x680/images/be8fcaeb-c769-4858-b567-ffaaa73ce8cf/image.png",
      credly: "https://www.credly.com/badges/80c59688-c158-433f-8f60-4c015da0cb8f/public_url",
      issued: "Nov 2021",
    },
    {
      name: "DP-203: Azure Data Engineer Associate",
      badge: "https://images.credly.com/size/680x680/images/61542181-0e8d-496c-a17c-3d4bf590eda1/azure-data-engineer-associate-600x600.png",
      credly: "https://www.credly.com/earner/earned/badge/b96fcb97-a4c4-4220-b331-3d0948c0c1b5",
      issued: "Mar 2022",
      expires: "Mar 2026",
    },
    {
      name: "AWS Certified Machine Learning – Specialty",
      badge: "https://images.credly.com/size/680x680/images/778bde6c-ad1c-4312-ac33-2fa40d50a147/image.png",
      credly: "https://www.credly.com/badges/1b8d0781-7984-458e-8cdc-c97055a30aee/public_url",
      issued: "Jun 2023",
      expires: "Jun 2026",
    },
    {
      name: "GCP Professional Data Engineer",
      badge: "https://images.credly.com/size/680x680/images/2d613ff8-8879-430b-b2d8-925fa29785e8/image.png",
      credly: "https://www.credly.com/org/google-cloud/badge/professional-data-engineer-certification",
      inProgress: true,
    },
  ],

  languages: ["English: Native language", "Dutch: Professional working proficiency"],

  hobbies: ["Boxing", "Cycling", "Yoga", "DIY", "Photography", "DJ"],
};
