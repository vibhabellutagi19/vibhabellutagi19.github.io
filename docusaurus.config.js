// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Vibhavari Bellutagi',
  tagline: 'Learn | Build | Share',
  favicon: 'img/favicon.ico',
  url: 'https://github.com',
  baseUrl: '/',
  organizationName: 'vibhabellutagi19',
  projectName: 'vibhabellutagi19.github.io',
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        gtag: {
          trackingID: "G-1F9P2Z6DLX",
          anonymizeIP: true,
        },
        sitemap: {
          changefreq: "weekly",
          priority: 0.5,
          filename: "sitemap.xml",
        },
        docs: {
          sidebarPath: './sidebars.js',
          path: 'content',
          routeBasePath: '/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/vb-social-card.png',
      navbar: {
        title: 'buildwith_vibs',
        logo: {
          alt: 'My Site Logo',
          src: 'img/logo.png',
        },
        items: [
          {
            position: 'left',
            label: 'Projects',
            to: '/projects'
          },
          {
            to: '/blog',
            label: 'Blog',
            position: 'left'
          },
          {
            position: 'left',
            label: 'Resume',
            to: '/Resume/experience',
          },
          // {
          //   to: '/FirstPrinciples/thoughts',
          //   label: 'First Principles',
          //   position: 'left'
          // },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'About Me',
            items: [
              {
                label: 'Resume',
                to: '/Resume/experience',
              }
            ],
          },
          {
            title: 'Resources',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'Projects',
                to: '/projects',
              },
            ],
          },
          {
            title: 'Contact',
            items: [
              {
                label: 'Mail',
                to: 'mailto:vibhavari.bellutagi@gmail.com',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/vibhabellutagi19/vibhabellutagi19.github.io',
              },
              {
                label: 'Linkedin',
                href: 'https://www.linkedin.com/in/vibhavari-bellutagi-837871189/',
              },
              {
                label: 'Twitter',
                to: 'https://x.com/buildwith_vibs',

              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Vibhavari Bellutagi, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
  stylesheets: ["https://fonts.googleapis.com/icon?family=Material+Icons"],
  themes: [
    // ... Your other themes.
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      ({
        // ... Your options.
        // `hashed` is recommended as long-term-cache of index file is possible.
        hashed: true,
        // For Docs using Chinese, The `language` is recommended to set to:
        // ```
        // language: ["en", "zh"],
        // ```
      }),
    ],
  ],
};

module.exports = config;
