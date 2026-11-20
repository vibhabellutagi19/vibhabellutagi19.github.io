import Link from "next/link";

import { ReadMark } from "@/components/blog/ReadMark";
import { Reveal } from "@/components/ui/Reveal";
import {
  aboutData,
  experienceData,
  heroData,
  pinnedPosts,
  previousCompanies,
  profile,
  resumeLink,
  sideProjects,
  skillRows,
} from "@/data/site";
import { getAllNotes, noteHref } from "@/lib/notes";
import { getAllPosts, pickPosts } from "@/lib/posts";

function ResumeButton({ className = "btn btn-primary btn-lg" }) {
  return (
    <a
      className={className}
      href={resumeLink.href}
      {...(resumeLink.external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {resumeLink.label}
    </a>
  );
}

function Hero({ total }) {
  return (
    <div className="dark">
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero-grid">
          <div className="hero-inner">
            <p className="hero-prompt" aria-hidden="true">
              ~/vibhavari <span>$ whoami</span>
            </p>
            <h1 id="hero-title">
              I build data platforms, <span className="serif">and</span> the backends that feed them.
            </h1>
            <p className="hero-role">{profile.role}</p>
            <p className="hero-lede">{heroData.lede}</p>
            <p className="status">
              <span className="dot" aria-hidden="true" />
              {heroData.status}
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary btn-lg" href="#learn">
                Start learning
              </a>
              <a className="btn btn-ghost-dark btn-lg" href="#about">
                About me
              </a>
              <div className="hero-icons">
                <a
                  className="icon-btn"
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
                  </svg>
                </a>
                <a
                  className="icon-btn"
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
                  </svg>
                </a>
                <a
                  className="icon-btn"
                  href={`mailto:${profile.email}`}
                  aria-label="Email"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                </a>
              </div>
            </div>
            <p className="hero-prev">
              <span className="hero-prev-label">Previously at</span>
              {previousCompanies.map(({ name, url }) => (
                <a
                  key={name}
                  className="company-link"
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  title={`${name} website`}
                >
                  {name}
                </a>
              ))}
            </p>
          </div>

          <figure className="hero-photo">
            <img
              src={profile.photo}
              alt={`Portrait of ${profile.name}`}
              width="768"
              height="1024"
              fetchPriority="high"
            />
          </figure>

          <div className="skills-marquee" role="group" aria-label="Skills">
            {skillRows.map((row, index) => (
              <div className={`marquee${index % 2 ? ' marquee-reverse' : ''}`} key={row[0].name}>
                <ul className="marquee-track">
                  {[0, 1, 2, 3].flatMap((copy) =>
                    row.map((skill) => (
                      <li
                        key={`${copy}-${skill.name}`}
                        style={{ '--brand': skill.color }}
                        aria-hidden={copy > 0 ? 'true' : undefined}
                      >
                        <span className="skill-icon" style={{ '--icon': `url(/skills/${skill.icon}.svg)` }} aria-hidden="true" />
                        {skill.name}
                      </li>
                    ))
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/** Pinned posts (pinnedPosts in site.js), in their order. Everything else lives on /blog. */
function SelectedPosts({ posts, total }) {
  return (
    <section id="learn" className="home-section" aria-labelledby="learn-title">
      <div className="container">
        <p className="label">01 / Blog</p>
        <h2 id="learn-title" className="h-section">
          Highlights of my <span className="serif">writing.</span>
        </h2>
        <ul className="simple-list">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}/`}>
                <span className="simple-title">{post.title}</span>
                <span className="simple-date">
                  {post.date}
                  <ReadMark slug={post.slug} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="home-notes-foot">
          <Link className="text-link" href="/blog/">
            All {total} posts, by topic →
          </Link>
        </p>
      </div>
    </section>
  );
}

function LatestNotes({ notes }) {
  if (notes.length === 0) {
    return null;
  }

  return (
    <section id="notes" className="home-section" aria-labelledby="notes-title">
      <div className="container">
        <p className="label">02 / Notes</p>
        <h2 id="notes-title" className="h-section">
          One blog a day. <span className="serif">What stuck.</span>
        </h2>
        <ul className="simple-list">
          {notes.map((note) => (
            <li key={note.slug}>
              <Link href={noteHref(note.slug)}>
                <span className="simple-title">{note.title}</span>
                <span className="simple-date">{note.displayDate}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="home-notes-foot">
          <Link className="text-link" href="/notes/">
            All notes →
          </Link>
        </p>
      </div>
    </section>
  );
}

function ProjectCard({ project }) {
  const body = (
    <>
      <p className="project-mock" aria-hidden="true">
        {project.mock}
      </p>
      <p className="project-stack">{project.stack.join(" · ")}</p>
      <h3>{project.name}</h3>
      <p className="project-blurb">{project.blurb}</p>
      <p className="project-link">
        {project.post ? `${project.post.label} →` : "Write-up coming"}
      </p>
    </>
  );

  return project.post ? (
    <Link className="project" href={project.post.href}>
      {body}
    </Link>
  ) : (
    <div className="project project-static">{body}</div>
  );
}

function SideProjects() {
  return (
    <section
      id="projects"
      className="home-section"
      aria-labelledby="projects-title"
    >
      <div className="container">
        <p className="label">03 / Side projects</p>
        <h2 id="projects-title" className="h-section" style={{ maxWidth: 640 }}>
          Each app has one <span className="serif">hard part.</span> That is the
          lesson.
        </h2>
        <div className="projects">
          {sideProjects.map((project, index) => (
            <Reveal key={project.name} delay={index * 80}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section
      id="about"
      className="home-section about"
      aria-labelledby="about-title"
    >
      <div className="container">
        <p className="label">04 / About</p>
        <h2 id="about-title" className="h-section">
          Who is <span className="serif">writing</span> this.
        </h2>
        <p className="about-bio">{aboutData.bio}</p>
        <p className="about-links">
          <ResumeButton className="btn btn-ghost" />
          <a
            className="text-link"
            href={profile.linkedinRecommendations}
            target="_blank"
            rel="noreferrer"
          >
            Read {profile.recommendationCount} recommendations on LinkedIn →
          </a>
        </p>

        <h3 id="experience" className="timeline-title">
          Where I have <span className="serif">shipped.</span>
        </h3>
        <ol className="timeline">
          {experienceData.map((job) => (
            <li key={job.id}>
              <p className="timeline-date">
                {job.date}
                {job.place && <span>{job.place}</span>}
              </p>
              <div className="timeline-body">
                <h4>
                  {job.title} <span>· {job.company}</span>
                </h4>
                <ul>
                  {job.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <p className="timeline-skills">{job.skills.join(" · ")}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default async function HomePage() {
  const posts = await getAllPosts();
  const notes = (await getAllNotes())
    .filter((note) => note.status === "published")
    .slice(0, 3);

  return (
    <main>
      <Hero total={posts.length} />
      <SelectedPosts
        posts={pickPosts(posts, pinnedPosts)}
        total={posts.length}
      />
      <LatestNotes notes={notes} />
      <SideProjects />
      <About />
    </main>
  );
}
