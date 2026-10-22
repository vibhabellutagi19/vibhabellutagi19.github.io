import { MoveDemo } from '@/components/demos/MoveDemo';
import { NimmaVasatiDemo } from '@/components/demos/NimmaVasatiDemo';
import { Reveal } from '@/components/ui/Reveal';
import { TestimonialCarousel } from '@/components/ui/TestimonialCarousel';
import {
  aboutData,
  caseStudies,
  experienceData,
  heroData,
  otherWorkData,
  processData,
  profile,
  servicesData,
  testimonialsData,
} from '@/data/site';

function hostOf(url) {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

const DEMOS = {
  nimmavasati: NimmaVasatiDemo,
  move: MoveDemo,
};

function Screenshot({ study }) {
  const Demo = DEMOS[study.slug];

  return (
    <div className="shot">
      <div className="shot-bar" aria-hidden="true">
        <span />
        <span />
        <span />
        <em>{hostOf(study.href)}</em>
      </div>
      {study.image ? (
        <img src={study.image} alt={`${study.name} screenshot`} loading="lazy" />
      ) : Demo ? (
        <Demo />
      ) : (
        <div className="shot-placeholder">
          <span>{study.name}</span>
          <small>Screenshot coming soon</small>
        </div>
      )}
    </div>
  );
}

function CaseStudy({ study, index }) {
  return (
    <Reveal as="article" className={`case${index % 2 ? ' case-flip' : ''}`}>
      <Screenshot study={study} />
      <div className="case-body">
        <p className="eyebrow">{study.kind}</p>
        <h3>{study.name}</h3>
        <p className="case-summary">{study.summary}</p>
        <ul className="checklist">
          {study.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        <p className="case-outcome">{study.outcome}</p>
        <ul className="tags" aria-label="Tech stack">
          {study.stack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
        <a className="text-link" href={study.href} target="_blank" rel="noreferrer">
          Visit {hostOf(study.href)} →
        </a>
      </div>
    </Reveal>
  );
}

function SectionHead({ eyebrow, title, lede }) {
  return (
    <div className="section-head">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {lede && <p className="section-lede">{lede}</p>}
    </div>
  );
}

export default function HomePage() {
  const testimonials = testimonialsData.filter((item) => item.quote);

  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow eyebrow-pill">
              <span className="dot" aria-hidden="true" />
              {heroData.eyebrow}
            </p>
            <h1>{heroData.title}</h1>
            <p className="hero-lede">{heroData.lede}</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href={profile.bookingUrl} target="_blank" rel="noreferrer">
                Book a discovery call
              </a>
              <a className="btn btn-ghost" href="#work">
                See my work
              </a>
            </div>
            <dl className="stats">
              {heroData.stats.map((stat) => (
                <div key={stat.label}>
                  <dt>{stat.label}</dt>
                  <dd>{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <figure className="hero-photo">
            <img
              src={profile.photo}
              alt={`Illustration of ${profile.name} at a desk with a laptop, labelled software developer, data engineer and freelancer`}
              width="900"
              height="900"
              fetchPriority="high"
            />
          </figure>
        </div>
      </section>

      <section id="work" className="section">
        <div className="container">
          <SectionHead
            eyebrow="Selected work"
            title="Products running real businesses"
            lede="Built end to end, from database design to deployment, and live in production today."
          />
          <div className="cases">
            {caseStudies.map((study, index) => (
              <CaseStudy key={study.slug} study={study} index={index} />
            ))}
          </div>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section id="testimonials" className="section section-follow">
          <div className="container testimonials">
            <SectionHead eyebrow="Kind words" title="What clients and colleagues say" />
            <TestimonialCarousel items={testimonials} />
            <a className="text-link quotes-more" href={profile.linkedinRecommendations} target="_blank" rel="noreferrer">
              Read all {profile.recommendationCount} recommendations on LinkedIn →
            </a>
          </div>
        </section>
      )}

      <section id="services" className="section section-alt">
        <div className="container">
          <SectionHead
            eyebrow="What I build"
            title="Any product, from idea to production"
            lede="Business owner or startup founder: if it can be built as software, I can take it from idea to launch, on a data foundation that holds up as you grow."
          />
          <div className="grid grid-4">
            {servicesData.map((service, index) => (
              <Reveal key={service.title} className="card" delay={index * 60}>
                <h3>{service.title}</h3>
                <p>{service.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="section">
        <div className="container">
          <SectionHead eyebrow="How we work together" title="From first call to launch" />
          <ol className="steps">
            {processData.map((step, index) => (
              <Reveal as="li" key={step.title} className="step" delay={index * 60}>
                <span className="step-num">{String(index + 1).padStart(2, '0')}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section id="about" className="section section-alt">
        <div className="container about">
          <div>
            <SectionHead eyebrow="About" title="Ten years of engineering, now building products" />
            {aboutData.paragraphs.map((paragraph) => (
              <p className="about-p" key={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>

          <div className="timeline" tabIndex={0} role="region" aria-label="Experience, scrollable">
            <h3 className="timeline-title">Experience</h3>
            <ul>
              <li className="timeline-item timeline-current">
                <div className="timeline-meta">
                  <span>Jan 2026 – present</span>
                </div>
                <h4>
                  Freelance Full-Stack Developer <span>· Independent</span>
                </h4>
                <p>Building NimmaVasati and Move, plus the client projects below.</p>
              </li>
              {experienceData.map((item) => (
                <li className="timeline-item" key={item.company}>
                  <div className="timeline-meta">
                    <span>{item.date}</span>
                  </div>
                  <h4>
                    {item.title} <span>· {item.company}</span>
                  </h4>
                  <p>{item.description}</p>
                  <ul className="tags tags-sm">
                    {item.skills.map((skill) => (
                      <li key={skill}>{skill}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>

            <h3 className="timeline-title">Other client work</h3>
            <ul>
              {otherWorkData.map((item) => (
                <li className="timeline-item" key={item.title}>
                  <h4>
                    {item.title} <span>· {item.company}</span>
                  </h4>
                  <p>{item.description}</p>
                  <ul className="tags tags-sm">
                    {item.skills.map((skill) => (
                      <li key={skill}>{skill}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="contact" className="section">
        <div className="container">
          <Reveal className="cta">
            <h2>Have a product in mind?</h2>
            <p>
              Tell me about your business and what you want to build. I will reply within a couple of
              days with honest next steps, even if I am not the right fit.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href={profile.bookingUrl} target="_blank" rel="noreferrer">
                Book a discovery call
              </a>
              <a
                className="btn btn-ghost btn-round"
                href={profile.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`WhatsApp ${profile.whatsapp}`}
                title={`WhatsApp ${profile.whatsapp}`}
              >
                <svg className="icon-whatsapp" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                  <path
                    d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l4.8-1.3A9.5 9.5 0 1 0 12 2.5Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.7 7.3c.2-.4.4-.4.6-.4h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .6l-.4.6c-.1.2-.1.4 0 .6.4.8 1.3 1.8 2.3 2.3.2.1.4.1.6 0l.6-.6c.2-.2.4-.2.6-.1l1.9.9c.2.1.4.2.4.4v.5c0 .5-.3 1-.8 1.3-.6.3-1.4.4-2.4.1-1.6-.5-3.4-2.1-4.3-3.6-.7-1.2-.9-2.2-.7-3 .1-.4.3-.8.5-1Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
              <a
                className="btn btn-ghost btn-round"
                href={`mailto:${profile.email}`}
                aria-label={`Email ${profile.email}`}
                title={profile.email}
              >
                <svg className="icon-email" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                  <path
                    d="m4 7 8 6 8-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
