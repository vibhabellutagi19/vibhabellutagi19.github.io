import { describe, expect, it } from 'vitest';

import {
  buildSearchIndex,
  filterBlogPosts,
  findOpenTarget,
  searchItems,
} from '../terminal/searchIndex';

const blogPosts = [
  { slug: 'spark-basics', title: 'Spark Basics', excerpt: 'Introduction to Apache Spark' },
  { slug: 'git-essentials', title: 'Git Essentials', excerpt: 'Version control fundamentals' },
];

const experience = [
  {
    title: 'Data Engineer - Platform',
    company: 'Mews, France',
    description: 'Databricks pipelines and Terraform',
    skills: ['Terraform', 'Databricks'],
  },
];

describe('searchIndex', () => {
  const index = buildSearchIndex({ blogPosts, experience });

  it('returns default nav items when query is empty', () => {
    const results = searchItems(index, '');
    expect(results.some((item) => item.id === 'home')).toBe(true);
    expect(results.some((item) => item.id === 'blog-index')).toBe(true);
  });

  it('finds blog posts by slug and title', () => {
    const bySlug = searchItems(index, 'spark');
    expect(bySlug[0]?.id).toBe('blog-spark-basics');

    const byTitle = searchItems(index, 'git essentials');
    expect(byTitle.some((item) => item.id === 'blog-git-essentials')).toBe(true);
  });

  it('finds experience entries by company or skill', () => {
    const byCompany = searchItems(index, 'mews');
    expect(byCompany.some((item) => item.type === 'experience')).toBe(true);

    const bySkill = searchItems(index, 'terraform');
    expect(bySkill.some((item) => item.label.includes('Data Engineer'))).toBe(true);
  });

  it('prefers blog slugs for open git over experience.git', () => {
    const target = findOpenTarget(index, 'git');
    expect(target?.type).toBe('blog');
    expect(target?.label).toBe('git-essentials.md');
  });

  it('filters blog posts in sidebar search', () => {
    expect(filterBlogPosts(blogPosts, 'spark')).toHaveLength(1);
    expect(filterBlogPosts(blogPosts, 'git version')).toHaveLength(1);
    expect(filterBlogPosts(blogPosts, 'missing')).toHaveLength(0);
    expect(filterBlogPosts(blogPosts, '')).toHaveLength(2);
  });
});
