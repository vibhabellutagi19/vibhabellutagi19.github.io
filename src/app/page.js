import Link from "next/link";

import { AboutPanel } from "@/components/terminal/AboutPanel";
import { HighlightsPanel } from "@/components/terminal/HighlightsPanel";
import { TypingLine } from "@/components/terminal/TypingLine";
import { aboutData, experienceData, projectsData } from "@/data/site";
import { getAllPosts } from "@/lib/posts";

const COMMIT_HASHES = ["a3f9e21", "7c41b08", "e98d3aa", "1b07f44", "0000001"];

function toBullets(text) {
  return text
    .split(/(?<=[.!])\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 4);
}

export default async function HomePage() {
  const posts = await getAllPosts();
  const previewPosts = posts.slice(0, 5);

  return (
    <main>
      <section id="home" className="hero">
        <div className="bufline hero-cmd">
          <span className="ln">1</span>
          <div className="code">
            <span className="prompt">vibhavari@portfolio:~$</span> neofetch
          </div>
        </div>

        <div className="neofetch">
          <div className="ascii" aria-hidden="true">
            {`██╗   ██╗██████╗ 
██╗   ██║██╔══██╗
██║   ██║██████╔╝
╚██╗ ██╔╝██╔══██╗
 ╚████╔╝ ██████╔╝
  ╚═══╝  ╚═════╝ `}
          </div>
          <div className="nf-info">
            <div className="nf-head">vibhavari@portfolio</div>
            <div className="nf-sep">─────────────────────────</div>
            <div className="nf-row">
              <span className="key">Role</span>
              <span className="val">Data Engineer · Backend Engineer</span>
            </div>
            <div className="nf-row">
              <span className="key">Focus</span>
              <span className="val">
                pipelines &amp; platforms · APIs &amp; backend services
              </span>
            </div>
            <div className="nf-row">
              <span className="key">Data</span>
              <span className="val">
                Apache Spark · Kafka · Databricks · Terraform · SQL
              </span>
            </div>
            <div className="nf-row">
              <span className="key">Backend</span>
              <span className="val">
                Python/TypeScript · FastAPI/Express · Node.js · AWS Cloud
              </span>
            </div>
            <div className="nf-row">
              <span className="key">Location</span>
              <span className="val">France / remote-friendly</span>
            </div>
            <div className="nf-row">
              <span className="key">Email</span>
              <span className="val">
                <a href="mailto:vibhavari.bellutagi@gmail.com">
                  vibhavari.bellutagi@gmail.com
                </a>
              </span>
            </div>
            <div className="nf-row">
              <span className="key">Site</span>
              <span className="val">portfolio · writing · open notes</span>
            </div>
            <div className="swatches" aria-hidden="true">
              <i style={{ background: "var(--rose)" }} />
              <i style={{ background: "var(--amber)" }} />
              <i style={{ background: "var(--teal)" }} />
              <i style={{ background: "var(--blue)" }} />
              <i style={{ background: "var(--dim)" }} />
              <i style={{ background: "var(--faint)" }} />
            </div>
          </div>
        </div>

        <TypingLine />

        <AboutPanel
          paragraphs={aboutData.paragraphs}
          highlights={aboutData.highlights}
        />

        <HighlightsPanel postCount={posts.length} />
      </section>

      <section id="experience">
        <div className="filehead">
          <span className="path">
            ~/experience.git — git log --graph --career
          </span>
          <span className="ft">{experienceData.length} commits · main</span>
        </div>

        {experienceData.map((item, index) => (
          <div className="commit" key={`${item.title}-${item.date}`}>
            <div className="graph">*</div>
            <div className="commit-body">
              <div>
                <span className="hash">
                  commit {COMMIT_HASHES[index] || "deadbeef"}
                </span>
                {index === 0 && (
                  <span className="refs"> (HEAD → main, tag: current)</span>
                )}
                <span className="refs"> · tag: {item.track}</span>
              </div>
              <h3>
                {item.title} <span className="org">@ {item.company}</span>
              </h3>
              <div className="date">Date: {item.date}</div>
              <ul>
                {toBullets(item.description).map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
                <li>
                  stack: <b>{item.skills.join(", ")}</b>
                </li>
              </ul>
            </div>
          </div>
        ))}
      </section>

      {projectsData.length > 0 && (
        <section id="projects">
          <div className="filehead">
            <span className="path">~/projects — ls -1</span>
            <span className="ft">{projectsData.length} repos · personal</span>
          </div>

          {projectsData.map((project) => (
            <article className="post" key={project.slug}>
              <div className="frontmatter">
                --- track: {project.track} · status: {project.status} · slug:{" "}
                {project.slug} ---
              </div>
              <div className="fname">
                {project.href ? (
                  <a href={project.href} target="_blank" rel="noreferrer">
                    {project.name}/
                  </a>
                ) : (
                  <span>{project.name}/</span>
                )}
              </div>
              <div className="fmeta">
                <span className="rt">{project.status}</span>
                {project.demo && (
                  <>
                    {" · "}
                    <a href={project.demo} target="_blank" rel="noreferrer">
                      demo
                    </a>
                  </>
                )}
              </div>
              <p className="excerpt">{project.description}</p>
              {project.highlights?.length > 0 && (
                <ul className="project-highlights">
                  {project.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              <p className="excerpt">
                stack: <b>{project.stack.join(" · ")}</b>
              </p>
            </article>
          ))}
        </section>
      )}

      <section id="blog">
        <div className="filehead">
          <span className="path">
            ~/blog — find . -name &apos;*.md&apos; | head -5
          </span>
          <span className="ft">filetype: markdown</span>
        </div>

        {previewPosts.map((post) => (
          <article className="post" key={post.slug}>
            <div className="frontmatter">
              --- date: {post.date} · slug: {post.slug} ---
            </div>
            <div className="fname">
              <Link href={`/blog/${post.slug}/`}>{post.slug}.md</Link>
            </div>
            <div className="fmeta">
              <span className="rt">{post.readTime}</span>
            </div>
            <p className="excerpt">{post.excerpt || post.title}</p>
            <Link className="readmore" href={`/blog/${post.slug}/`}>
              cat full-post.md →
            </Link>
          </article>
        ))}

        <Link className="readmore" href="/blog/">
          ls -la blog/ → all posts
        </Link>
      </section>

      <section id="contact">
        <div className="filehead">
          <span className="path">~/.env — vim contact.env</span>
          <span className="ft">chmod 644</span>
        </div>

        <div className="envfile">
          <div className="bufline">
            <span className="ln">1</span>
            <div className="code">
              <span className="c">
                # contact — portfolio of Vibhavari Bellutagi
              </span>
            </div>
          </div>
          <div className="bufline">
            <span className="ln">2</span>
            <div className="code">
              <span className="envvar">EMAIL</span>=
              <span className="envval s">
                <a href="mailto:vibhavari.bellutagi@gmail.com">
                  vibhavari.bellutagi@gmail.com
                </a>
              </span>
            </div>
          </div>
          <div className="bufline">
            <span className="ln">3</span>
            <div className="code">
              <span className="envvar">GITHUB</span>=
              <span className="envval s">
                <a href="https://github.com/vibhabellutagi19">
                  github.com/vibhabellutagi19
                </a>
              </span>
            </div>
          </div>
          <div className="bufline">
            <span className="ln">4</span>
            <div className="code">
              <span className="envvar">LINKEDIN</span>=
              <span className="envval s">
                <a href="https://www.linkedin.com/in/vibhavari-bellutagi/">
                  linkedin.com/in/vibhavari-bellutagi
                </a>
              </span>
            </div>
          </div>
          <div className="bufline">
            <span className="ln">5</span>
            <div className="code">
              <span className="envvar">ABOUT</span>=
              <span className="envval s">
                &quot;data platforms, pipelines, backend systems, technical
                writing&quot;
              </span>
            </div>
          </div>
        </div>

        <div className="footer-tip">
          <div>
            tip: <kbd>`</kbd> opens terminal · <kbd>:</kbd> command mode · click
            ◑ theme for paper/gruvbox/dracula
          </div>
          <div style={{ marginTop: 10 }}>© 2026 Vibhavari Bellutagi</div>
        </div>
      </section>
    </main>
  );
}
