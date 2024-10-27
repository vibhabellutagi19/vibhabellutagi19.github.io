/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {

  // But you can create a sidebar manually
  ProjectsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'dataengineering',
      items: ['DataEngineering/create-a-blog-post', 'DataEngineering/create-a-second-blog'],
    },
    {
      type: 'category',
      label: 'CodeChallenges',
      items: ['CodeChallenges/challenge-1'],
    },
  ],
};

module.exports = sidebars;
