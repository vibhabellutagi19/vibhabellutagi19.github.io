import { filterBlogPosts, findOpenTarget, searchItems } from './searchIndex';

function escapeHtml(text) {
  return String(text).replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatResults(results) {
  if (!results.length) {
    return [{ html: 'no matches found', className: 'err' }];
  }

  return results.map((item) => ({
    html: `<span class="hl">${escapeHtml(item.label)}</span> <span class="dim">— ${escapeHtml(item.hint || item.type)}</span>`,
  }));
}

export function executeTerminalCommand(raw, { searchIndex, blogPosts, sections, setTheme, themes }) {
  const line = raw.trim();
  const output = [];

  output.push({
    html: `<span class="tp">vibhavari@portfolio:~$</span> ${escapeHtml(line)}`,
  });

  if (!line) {
    return { output, effects: [] };
  }

  const [cmd, ...rest] = line.split(/\s+/);
  const arg = rest.join(' ').trim();
  const effects = [];

  switch (cmd.toLowerCase()) {
    case 'help':
      output.push({
        html:
          "commands: <span class='hl'>help</span> · <span class='hl'>grep</span> &lt;q&gt; · <span class='hl'>find</span> &lt;q&gt; · <span class='hl'>ls</span> [blog] · <span class='hl'>cat</span> &lt;slug&gt; · <span class='hl'>open</span> &lt;target&gt; · <span class='hl'>cd</span> home|experience|blog|contact · <span class='hl'>theme</span> · <span class='hl'>whoami</span> · <span class='hl'>clear</span> · <span class='hl'>exit</span>",
      });
      break;

    case 'grep':
    case 'find':
    case 'search': {
      if (!arg) {
        output.push({ html: `${cmd}: missing query (try: grep spark)`, className: 'err' });
        break;
      }
      const results = searchItems(searchIndex, arg, 8);
      output.push(...formatResults(results));
      if (results.length === 1) {
        output.push({ html: `→ run <span class="hl">open ${escapeHtml(results[0].label.replace(/\.md$/, ''))}</span> to go there` });
      }
      break;
    }

    case 'ls': {
      const target = (arg || 'blog').toLowerCase();
      if (target === 'blog' || target === 'posts') {
        if (!blogPosts.length) {
          output.push({ html: 'blog/: empty', className: 'err' });
        } else {
          blogPosts.forEach((post) => {
            output.push({ html: `<span class="hl">${escapeHtml(post.slug)}.md</span>  ${escapeHtml(post.title)}` });
          });
        }
      } else if (target === 'experience' || target === 'exp') {
        searchIndex
          .filter((item) => item.type === 'experience')
          .forEach((item) => {
            output.push({ html: `<span class="hl">${escapeHtml(item.label)}</span>  ${escapeHtml(item.hint)}` });
          });
      } else {
        output.push({ html: 'ls: try blog or experience', className: 'err' });
      }
      break;
    }

    case 'cat': {
      if (!arg) {
        output.push({ html: 'cat: missing file (try: cat spark-basics)', className: 'err' });
        break;
      }
      const slug = arg.replace(/\.md$/, '').toLowerCase();
      const post = blogPosts.find((item) => item.slug.toLowerCase() === slug || item.slug.toLowerCase().includes(slug));
      if (post) {
        output.push({ html: `<span class="hl">${escapeHtml(post.slug)}.md</span>` });
        output.push({ html: escapeHtml(post.title) });
        if (post.excerpt) {
          output.push({ html: `<span class="dim">${escapeHtml(post.excerpt)}</span>` });
        }
        output.push({ html: `→ <span class="hl">open ${escapeHtml(post.slug)}</span> to read` });
      } else {
        output.push({ html: `cat: ${escapeHtml(arg)}: no such file`, className: 'err' });
      }
      break;
    }

    case 'open': {
      if (!arg) {
        output.push({ html: 'open: missing target', className: 'err' });
        break;
      }
      const query = arg.replace(/\.md$/, '');
      const target = findOpenTarget(searchIndex, query);
      if (target) {
        output.push({ html: `→ opening <span class="hl">${escapeHtml(target.label)}</span>` });
        effects.push({ type: 'select', item: target });
      } else {
        output.push({ html: `open: ${escapeHtml(arg)}: not found`, className: 'err' });
      }
      break;
    }

    case 'cd': {
      const section = sections.find((item) => item.startsWith((arg || '').toLowerCase()));
      if (section) {
        effects.push({ type: 'section', id: section });
        output.push({ html: `→ jumped to ~/portfolio/${section}` });
      } else {
        output.push({ html: `cd: ${escapeHtml(arg)}: no such section`, className: 'err' });
      }
      break;
    }

    case 'theme':
      if (setTheme(arg)) {
        effects.push({ type: 'theme', name: arg });
        output.push({ html: `colorscheme set to <span class="hl">${escapeHtml(arg)}</span>` });
      } else {
        output.push({ html: `themes: ${themes.join(' ')}`, className: 'err' });
      }
      break;

    case 'whoami':
      output.push({ html: 'vibhavari — data & software engineer' });
      break;

    case 'clear':
      effects.push({ type: 'clear' });
      break;

    case 'exit':
    case 'quit':
      effects.push({ type: 'closeTerminal' });
      break;

    default:
      output.push({ html: `bash: ${escapeHtml(cmd)}: command not found (try help)`, className: 'err' });
  }

  return { output, effects };
}

export { filterBlogPosts, searchItems };
