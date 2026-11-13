'use client';

import { useState } from 'react';

import { usePlayer } from './usePlayer';

// The post's diagram, animated: three developers' pull requests go through Jenkins, the ones
// that pass merge to main, and CD deploys the artifact CI built. Coordinates are in the
// SVG's 1010 × 640 viewBox.

const DEVS = [1, 2, 3].map((n) => ({ n, y: 60 + (n - 1) * 60 }));

const STAGES = ['Env-setup', 'install-dependencies', 'format-check', 'lint-check', 'run-unit-tests', 'push-code-to-artifact'];
const STAGE_Y = (index) => 296 + index * 50;
const LINT = 3;
const TOKEN_X = { 1: 222, 2: 239, 3: 256 };

// Step at which each part of the diagram lights up.
const AT = { commit: 1, push: 2, pr: 3, ci: 4, merge: 10, upload: 11, download: 12, apply: 13, deploy: 14 };
const LENGTH = 14;

function getStatus(step, breaks) {
  const texts = [
    'Three developers, three features. Press play to follow their code from a commit to S3.',
    'Each developer commits to a local feature branch.',
    'They push to the remote feature branches.',
    'Each opens a pull request, and Jenkins picks it up.',
    'Inside Jenkins, the CI pipeline starts on every pull request: Env-setup installs uv.',
    'install-dependencies: uv syncs everything in pyproject.toml.',
    'format-check: uv run ruff format --check.',
    breaks
      ? 'lint-check: Developer 2’s PR has an unused import. Lint fails, and that PR stops here.'
      : 'lint-check: uv run ruff check passes on all three.',
    breaks ? 'run-unit-tests: pytest runs on the two PRs still going.' : 'run-unit-tests: pytest runs on all three.',
    'push-code-to-artifact: the tested code is zipped, ready to publish.',
    breaks
      ? 'The passing PRs merge into main. Developer 2’s can’t merge until lint passes.'
      : 'All three PRs merge into main.',
    'The zip that passed CI is uploaded to the artefact repository.',
    'CD downloads that exact zip, nothing rebuilt, and runs terraform plan.',
    'terraform apply makes the planned changes.',
    'Deployed: the code is in Amazon S3, where Glue and Lambda pick it up.',
  ];
  return texts[step];
}

function Line({ d, on, tone = '', dashed = false, arrow = true }) {
  const marker = !arrow ? undefined : on ? `url(#cd-ah-${tone || 'on'})` : 'url(#cd-ah-off)';
  return (
    <path
      d={d}
      pathLength="1"
      className={`cd-line${tone ? ` is-${tone}` : ''}${dashed ? ' is-dashed' : ''}${on ? ' is-on' : ''}`}
      markerEnd={marker}
    />
  );
}

function Actor({ y, on }) {
  return (
    <g className={`cd-actor${on ? ' is-on' : ''}`} transform={`translate(28 ${y})`}>
      <path className="cd-actor-body" d="M-11 20 Q-13 -2 0 -5 Q12 -3 10 20 Z" />
      <circle className="cd-actor-head" cx="0" cy="-15" r="8" />
      <path className="cd-actor-screen" d="M6 10 L17 -8 L21 -6 L11 12 Z" />
      <path className="cd-actor-base" d="M3 12 H24" />
    </g>
  );
}

/** The CI/CD diagram from the post, played step by step. */
export function CiCdPipeline() {
  const [breaks, setBreaks] = useState(true);
  const player = usePlayer(LENGTH, 1300);
  const s = player.step;
  const at = (name) => s >= AT[name];

  const passes = (n) => !(breaks && n === 2);
  const ciStep = s - AT.ci; // index of the stage running now
  const stageClass = (index) => {
    if (s >= AT.merge || ciStep > index) return ' is-pass';
    if (ciStep === index) return ' is-active';
    return at('ci') ? ' is-on' : '';
  };

  function choose(value) {
    setBreaks(value);
    player.reset();
  }

  return (
    <figure className="sim cd">
      <div className="sim-head">
        <div className="sim-mode" role="group" aria-label="Scenario">
          <button type="button" aria-pressed={breaks} onClick={() => choose(true)}>
            Developer 2 breaks lint
          </button>
          <button type="button" aria-pressed={!breaks} onClick={() => choose(false)}>
            Everyone passes
          </button>
        </div>
      </div>

      <div className="cd-scroll">
        <svg
          className="cd-svg"
          viewBox="0 0 1010 640"
          role="img"
          aria-label="Three developers push feature branches and open pull requests. Jenkins runs the CI pipeline (env setup, install dependencies, format check, lint check, unit tests, push code to artifact); passing pull requests merge to main. The artifact goes to an artefact repository, and the CD pipeline downloads it, runs terraform plan and apply, and deploys to Amazon S3."
        >
          <defs>
            {['off', 'on', 'green', 'warn', 'blue'].map((tone) => (
              <marker key={tone} id={`cd-ah-${tone}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path className={`cd-head is-${tone}`} d="M0 0 L10 5 L0 10 z" />
              </marker>
            ))}
          </defs>

          {/* Column headings */}
          <text className="cd-small" x="155" y="20" textAnchor="middle">local branch</text>
          <text className="cd-small" x="355" y="20" textAnchor="middle">remote branch</text>

          {/* Developers, branches and pull requests */}
          {DEVS.map(({ n, y }) => (
            <g key={n}>
              <Actor y={y} on={at('commit')} />
              <circle className={`cd-commit${at('commit') ? ' is-on' : ''}`} cx="72" cy={y} r="7" />
              <Line d={`M79 ${y} H88`} on={at('commit')} arrow={false} />
              <rect className={`cd-box${at('commit') ? ' is-on' : ''}`} x="90" y={y - 15} width="130" height="30" rx="7" />
              <text className="cd-mono-label" x="155" y={y + 5} textAnchor="middle">feature-{n}</text>

              <Line d={`M220 ${y} H287`} on={at('push')} />
              <text className="cd-small" x="254" y={y - 8} textAnchor="middle">pushes</text>
              <rect className={`cd-box${at('push') ? ' is-on' : ''}`} x="290" y={y - 15} width="130" height="30" rx="7" />
              <text className="cd-mono-label" x="355" y={y + 5} textAnchor="middle">feature-{n}</text>

              <Line d={`M420 ${y} H497`} on={at('pr')} />
              <text className="cd-small" x="459" y={y - 8} textAnchor="middle">open PR</text>

              <Line
                d={`M660 ${y} L777 120`}
                on={at('merge')}
                tone={at('merge') && !passes(n) ? 'warn' : ''}
                dashed={!passes(n)}
              />
              <text className={`cd-small${at('merge') && !passes(n) ? ' cd-text-warn' : ''}`} x="722" y={[78, 112, 168][n - 1]} textAnchor="middle">
                {at('merge') && !passes(n) ? 'blocked' : 'merges'}
              </text>
            </g>
          ))}

          <rect className={`cd-box${s >= AT.ci && s < AT.merge ? ' is-active' : at('pr') ? ' is-on' : ''}`} x="500" y="30" width="160" height="180" rx="12" />
          <text x="580" y="114" textAnchor="middle">Jenkins</text>
          <text x="580" y="134" textAnchor="middle">CI/CD pipeline</text>

          <rect className={`cd-box${at('merge') ? ' is-pass' : ''}`} x="780" y="102" width="100" height="36" rx="8" />
          <text x="830" y="125" textAnchor="middle">main</text>

          {/* What happens inside Jenkins */}
          <Line d="M580 210 V252 M390 278 V252 H820 V298" on={at('ci')} tone="blue" arrow={false} />
          <text className="cd-small cd-text-blue" x="580" y="270" textAnchor="middle">inside the pipeline</text>

          {/* CI pipeline */}
          <rect className={`cd-group${at('ci') ? ' is-on' : ''}`} x="272" y="280" width="226" height="318" rx="14" />
          <text className="cd-small" x="385" y="624" textAnchor="middle">CI pipeline</text>
          {STAGES.map((name, index) => {
            const y = STAGE_Y(index);
            const failedHere = breaks && index === LINT && s >= AT.ci + LINT;
            return (
              <g key={name}>
                <rect className={`cd-box${stageClass(index)}`} x="292" y={y} width="196" height="30" rx="7" />
                <text className="cd-stage-label" x="390" y={y + 20} textAnchor="middle">{name}</text>
                {index < STAGES.length - 1 && <Line d={`M390 ${y + 30} V${y + 48}`} on={ciStep > index || s >= AT.merge} tone="green" />}
                {index < STAGES.length - 1 && (
                  <g className={`cd-fail${failedHere ? ' is-on' : ''}`}>
                    <Line d={`M488 ${y + 15} H541`} on={failedHere} tone="warn" />
                    <text className="cd-tiny" x="503" y={y + 10}>failed</text>
                    <rect className="cd-x" x="545" y={y + 7} width="16" height="16" rx="3" />
                    <path className="cd-x-mark" d={`M549 ${y + 11} l8 8 m0 -8 l-8 8`} />
                  </g>
                )}
              </g>
            );
          })}

          {/* One token per pull request, moving down the stages */}
          {DEVS.map(({ n }) => {
            const reached = Math.max(0, Math.min(ciStep, STAGES.length - 1));
            const index = passes(n) ? reached : Math.min(reached, LINT);
            const failed = !passes(n) && s >= AT.ci + LINT;
            const shown = at('ci') && (s < AT.merge || passes(n) || failed);
            return (
              <g
                key={n}
                className={`cd-token${shown ? ' is-on' : ''}${failed ? ' is-fail' : ''}`}
                style={{ transform: `translate(${TOKEN_X[n]}px, ${STAGE_Y(index) + 15}px)` }}
              >
                <circle r="8" />
                <text className="cd-token-label" y="4" textAnchor="middle">{n}</text>
              </g>
            );
          })}
          <text className="cd-tiny" x="239" y="285" textAnchor="middle">PRs</text>

          {/* Artefact repository */}
          <Line d="M488 561 C 570 561, 640 545, 650 490" on={at('upload')} />
          <text className="cd-small" x="572" y="584" textAnchor="middle">uploads</text>
          <text className="cd-small" x="650" y="424" textAnchor="middle">artefact repository</text>
          <rect className={`cd-box${at('upload') ? ' is-pass' : ''}`} x="600" y="436" width="100" height="50" rx="8" />
          <text x="650" y="458" textAnchor="middle">JFrog</text>
          <text className="cd-tiny" x="650" y="476" textAnchor="middle">Artifactory</text>

          {/* CD pipeline */}
          <Line d="M700 438 L742 352" on={at('download')} dashed />
          <text className="cd-small" x="716" y="376" textAnchor="end">downloads</text>
          <text className="cd-small" x="716" y="392" textAnchor="end">artifact</text>
          <rect className={`cd-group${at('download') ? ' is-on' : ''}`} x="730" y="300" width="180" height="220" rx="14" />
          <text className="cd-small" x="820" y="546" textAnchor="middle">CD pipeline</text>
          <rect className={`cd-box${at('apply') ? ' is-pass' : at('download') ? ' is-active' : ''}`} x="745" y="330" width="150" height="30" rx="7" />
          <text className="cd-stage-label" x="820" y="350" textAnchor="middle">terraform plan</text>
          <Line d="M820 360 V448" on={at('apply')} tone="green" />
          <rect className={`cd-box${at('deploy') ? ' is-pass' : at('apply') ? ' is-active' : ''}`} x="745" y="450" width="150" height="30" rx="7" />
          <text className="cd-stage-label" x="820" y="470" textAnchor="middle">terraform apply</text>

          {/* Amazon S3 */}
          <Line d="M895 465 H936" on={at('deploy')} />
          <text className="cd-small" x="916" y="455" textAnchor="middle">deploy</text>
          <rect className={`cd-box${at('deploy') ? ' is-pass' : ''}`} x="940" y="442" width="50" height="46" rx="8" />
          <g className={`cd-bucket${at('deploy') ? ' is-on' : ''}`} transform="translate(965 465)">
            <ellipse cx="0" cy="-8" rx="12" ry="4" />
            <path d="M-12 -8 L-9 12 Q0 16 9 12 L12 -8" />
          </g>
          <text className="cd-small" x="965" y="506" textAnchor="middle">Amazon S3</text>
        </svg>
      </div>
      <p className="cd-scroll-hint">Scroll sideways to see the whole pipeline.</p>

      <p className={`sim-status${player.done ? ' is-ok' : breaks && s >= AT.ci + LINT && s < AT.merge + 1 ? ' is-bad' : ''}`} aria-live="polite">
        {getStatus(s, breaks)}
      </p>

      <div className="sim-controls">
        <button type="button" className="btn btn-primary btn-sm" onClick={player.play} disabled={player.playing}>
          {player.done ? 'Replay' : s === 0 ? 'Play' : 'Continue'}
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={player.next} disabled={player.done}>
          Next step
        </button>
        <button type="button" className="text-link sim-reset" onClick={player.reset}>
          Reset
        </button>
      </div>

      <figcaption>The numbered dots are the three pull requests. Play it, or use Next step to go one step at a time.</figcaption>
    </figure>
  );
}
