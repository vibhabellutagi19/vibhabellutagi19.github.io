// The handful of topics the posts are grouped into, on the home page, the blog index and in
// each post's "in order" list. Tags stay as they are; a topic is just a set of them.

export const TOPICS = [
  {
    id: 'apache-spark',
    name: 'Apache Spark',
    blurb: 'What Spark is doing while you wait: nulls, jobs, stages, tasks and where the driver runs.',
    tags: ['apache-spark'],
    ordered: true,
  },
  {
    id: 'git',
    name: 'Git',
    blurb: 'From the pendrive problem to what actually lives inside the .git folder.',
    tags: ['git'],
    ordered: true,
  },
  {
    id: 'networking',
    name: 'Networking',
    blurb: 'What happens between typing a URL and the first byte: DNS, TCP, UDP and cURL.',
    tags: ['networking'],
    ordered: true,
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    blurb: 'Operators, control flow, the global object and what “this” really points to.',
    tags: ['javascript'],
    ordered: true,
  },
  {
    // Also where a post lands when none of its tags belong to a topic above.
    // Its posts stand alone, so they aren't presented as parts of a sequence.
    id: 'projects',
    name: 'From real projects',
    blurb: 'Bugs and fixes from things I have shipped: row locks, sessions and CI/CD.',
    tags: ['building-apps'],
    ordered: false,
  },
];

const FALLBACK = TOPICS.at(-1);

function byDateAscending(a, b) {
  return (new Date(a.date).getTime() || 0) - (new Date(b.date).getTime() || 0);
}

export function getTopic(post) {
  return TOPICS.find((topic) => topic.tags.some((tag) => post.tags.includes(tag))) ?? FALLBACK;
}

/** Every topic that has posts, each with its posts oldest first: the order to read them in. */
export function groupByTopic(posts) {
  return TOPICS.map(({ tags, ...topic }) => ({
    ...topic,
    posts: posts.filter((post) => getTopic(post).id === topic.id).sort(byDateAscending),
  })).filter((topic) => topic.posts.length > 0);
}

/**
 * Where a post sits in its topic's reading order, in the same shape as `getSeries`.
 * Null when the topic isn't a sequence, or the post is the only one in it.
 */
export function getTopicPath(posts, post) {
  const topic = getTopic(post);
  if (!topic.ordered) {
    return null;
  }

  const parts = posts.filter((item) => getTopic(item).id === topic.id).sort(byDateAscending);
  const index = parts.findIndex((item) => item.slug === post.slug);
  if (index === -1 || parts.length < 2) {
    return null;
  }

  return {
    name: topic.name,
    parts,
    index,
    previous: parts[index - 1] ?? null,
    next: parts[index + 1] ?? null,
  };
}
