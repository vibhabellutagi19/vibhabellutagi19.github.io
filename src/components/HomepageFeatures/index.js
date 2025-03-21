import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import Grid from "@mui/material/Grid";
import Link from "@docusaurus/Link";

const FeatureList = [
  {
    title: "Blog",
    link: "blog",
    Svg: require("@site/static/img/undraw_undraw_blog_9pne_-1-_mama.svg").default,
    description: (
      <>
        Find my latest blog posts on topics related to Python, Data Engineering, Software Engineering and System Design
      </>
    ),
  },
  {
    title: "Tech Bytes",
    link: "/TechBytes/intro",
    Svg: require("@site/static/img/undraw_my_code_snippets_re_4adu.svg").default,
    description: (
      <>
        Tech Bytes is a collection of code snippets, tips and tricks that I have found useful in my journey as a software engineer
      </>
    ),
  },
];

function Feature({ Svg, title, description, link }) {
  return (
    <>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Link to={link}>
          <Heading as="h3">{title}</Heading>
        </Link>
        <p>{description}</p>
      </div>
    </>
  );
}

export default function HomepageFeatures() {
  return (
    <>
      {FeatureList.map((props, idx) => (
        <Grid key={idx} xs={12} sm={10} md={6}>
          <Feature key={idx} {...props} />
        </Grid>
      ))}
    </>
  );
}
