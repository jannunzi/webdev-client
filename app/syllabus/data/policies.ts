import type { PolicyBlock } from "./types";

export const latePolicy: PolicyBlock = {
  paragraphs: [
    "Assignments are due at the date and time posted on Canvas and on the agenda. Submit what you have by the deadline — a partial, working deployment is worth more than a perfect repository that arrives late.",
    "Work submitted after the deadline loses 10% of the assignment’s points per 24-hour period, or fraction thereof, for up to three days. After three days the assignment is not accepted, except when Disability Access Services accommodations or a documented emergency arranged with the instructor apply.",
    "Quizzes and the exam cannot be submitted late. If you have a university-approved absence or an emergency, write to the instructor before the deadline when possible.",
  ],
  bullets: [
    "On time — eligible for full credit.",
    "0–24 hours late — 10% penalty.",
    "24–48 hours late — 20% penalty.",
    "48–72 hours late — 30% penalty.",
    "More than 72 hours late — no credit, unless arranged in advance.",
  ],
};

export const aiPolicy: PolicyBlock = {
  paragraphs: [
    "Generative AI tools — Cursor, ChatGPT, Copilot, and similar assistants — are allowed as learning aids in this course. The book itself includes guided “with AI” exercises. Using a tool does not transfer authorship. You are responsible for every line you submit.",
    "You must be able to explain, modify, and debug your submission without the tool in the room. If you cannot, the work is not yours yet. Submitting generated code, prose, or configuration that you do not understand is an academic-integrity violation, the same as copying from another student.",
    "Do not paste unpublished assignment text or classmates’ code into public models. Do not submit a tool’s output as a substitute for the labs or the project write-up.",
  ],
  bullets: [
    "Allowed: using AI to learn an API, draft a first attempt, or refactor code you then rewrite and can defend.",
    "Not allowed: submitting generated work you cannot explain; sharing solutions; using AI on closed quizzes or the exam unless the handout says otherwise.",
    "When in doubt, disclose how you used the tool in a short comment on the assignment.",
  ],
};

export const academicIntegrity: PolicyBlock = {
  paragraphs: [
    "Northeastern expects every assignment, quiz, exam, and project in this course to meet the university Academic Integrity Policy. Instructors are required to cite that policy on the syllabus. Cheating, plagiarism, fabrication, unauthorized collaboration, and facilitating dishonesty are violations.",
    "In this course, that includes copying another student’s Kambaz or lab code (current or past semester), publishing solutions where others can turn them in, and submitting AI-generated work you cannot explain. You may discuss ideas with classmates; the code and write-up you turn in must be your own unless the assignment explicitly allows a team.",
    "A violation may be reported to the Office of Student Conduct and Conflict Resolution (OSCCR) and may also receive an academic penalty in the course, up to a failing grade, at the instructor’s discretion.",
  ],
  links: [
    {
      label: "Northeastern Academic Integrity Policy",
      href: "https://catalog.northeastern.edu/handbook/policies-regulations/academic-integrity/",
    },
    {
      label: "Office of Student Conduct and Conflict Resolution",
      href: "https://osccr.northeastern.edu/",
    },
  ],
};

export const classroomEnvironment: PolicyBlock = {
  paragraphs: [
    "This is an online classroom. Treat lecture, discussion, office hours, and shared repositories as professional spaces. Critique ideas and code, not people. Harassment, slurs, and exclusionary behavior are not acceptable.",
    "Keep cameras and microphones considerate during live sessions. Do not record other students without consent. When you post questions, include the route, the error, and what you already tried — that is how we help each other efficiently.",
    "If something in the course environment is preventing you from participating, contact the instructor. You may also use university reporting channels listed under Title IX and Disability Access Services.",
  ],
};

export const titleIX: PolicyBlock = {
  paragraphs: [
    "Northeastern University is committed to providing a living, learning, and working environment free from discrimination and harassment. The university does not discriminate on the basis of race, color, religion, sex (including pregnancy and related conditions), gender identity or expression, sexual orientation, age, national origin, disability, or veteran status in its programs and activities.",
    "Sexual and gender-based harassment, sexual assault, dating or domestic violence, and stalking are prohibited. Faculty and most university employees are responsible employees: if a student discloses a possible Title IX incident, we must share it with the Office for University Equity and Compliance so the university can offer support and options. Confidential resources are listed on the OUEC site.",
  ],
  links: [
    {
      label: "Office for University Equity and Compliance / Title IX",
      href: "https://ouec.northeastern.edu/",
    },
    {
      label: "Policy on Sexual and Gender-Based Harassment and Title IX",
      href: "https://policies.northeastern.edu/",
    },
  ],
};

export const disabilities: PolicyBlock = {
  paragraphs: [
    "Northeastern is committed to an inclusive learning environment and welcomes students with disabilities into its programs. Disability Access Services (DAS) determines reasonable accommodations. If you need accommodations in this course, contact DAS as early as possible and share your Professor Notification Letter so we can put supports in place.",
    "Any student who feels they may need an accommodation based on the impact of a disability is encouraged to contact Disability Access Services to coordinate reasonable accommodations.",
  ],
  links: [
    {
      label: "Disability Access Services",
      href: "https://disabilityaccessservices.northeastern.edu/",
    },
    {
      label: "DASboston@northeastern.edu",
      href: "mailto:DASboston@northeastern.edu",
    },
  ],
};
