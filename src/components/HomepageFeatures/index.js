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
    title: "From First Principles",
    link: "/FirstPrinciples/thoughts",
    Svg: require("@site/static/img/undraw_instant_analysis_re_mid5.svg").default,
    description: (
      <>
        A collection of articles that explain complex topics from first principles
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
