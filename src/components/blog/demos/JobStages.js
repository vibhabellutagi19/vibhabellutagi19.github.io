'use client';

import { useState } from 'react';

import { usePlayer } from './usePlayer';

const SHUFFLE_PARTITIONS = [200, 50, 8];

// The post's join program, one row per stage. A stage runs one task per partition of its data.
function getStages(shufflePartitions) {
  return [
    { op: 'Create df1', why: 'range() made 8 partitions on this machine', tasks: 8 },
    { op: 'Create df2', why: 'range() again, 8 partitions', tasks: 8 },
    { op: 'After repartition(5)', why: 'the shuffle wrote 5 partitions', tasks: 5 },
    { op: 'After repartition(6)', why: 'the shuffle wrote 6 partitions', tasks: 6 },
    {
      op: 'After the join',
      why: `the join shuffle wrote spark.sql.shuffle.partitions = ${shufflePartitions}`,
      tasks: shufflePartitions,
    },
    { op: 'Final sum', why: 'everything is combined into 1 partition', tasks: 1 },
  ];
}

/** The join job stage by stage, with every task drawn as a square. */
export function JobStages() {
  const [shufflePartitions, setShufflePartitions] = useState(200);
  const stages = getStages(shufflePartitions);
  const player = usePlayer(stages.length, 950);

  const total = stages.reduce((sum, stage) => sum + stage.tasks, 0);
  const ran = stages.slice(0, player.step).reduce((sum, stage) => sum + stage.tasks, 0);

  function choose(value) {
    setShufflePartitions(value);
    player.reset();
  }

  return (
    <figure className="sim st">
      <div className="sim-head">
        <div className="sim-mode" role="group" aria-label="spark.sql.shuffle.partitions">
          {SHUFFLE_PARTITIONS.map((value) => (
            <button key={value} type="button" aria-pressed={shufflePartitions === value} onClick={() => choose(value)}>
              {value === 200 ? '200 (default)' : value}
            </button>
          ))}
        </div>
        <span className="race-step" aria-live="polite">
          Tasks run: <span key={ran} className="tick">{ran}</span> / {total}
        </span>
      </div>

      <ol className="st-rows">
        {stages.map((stage, index) => {
          const state = index < player.step ? ' is-done' : '';
          return (
            <li key={stage.op} className={`st-row${state}`}>
              <div>
                <p className="st-op">{stage.op}</p>
                <p className="st-why">{stage.why}</p>
              </div>
              <div className="st-tasks" aria-hidden="true">
                {Array.from({ length: stage.tasks }, (_, task) => (
                  <span key={task} style={{ '--i': task }} />
                ))}
              </div>
              <p className="st-count">
                {stage.tasks} {stage.tasks === 1 ? 'task' : 'tasks'}
              </p>
            </li>
          );
        })}
      </ol>

      <p className={`sim-status${player.done ? ' is-ok' : ''}`} aria-live="polite">
        {player.done
          ? shufflePartitions === 200
            ? `${total} tasks, 200 of them in one stage. Nothing in the code says 200; the setting does.`
            : `${total} tasks. Same code, same data. Only spark.sql.shuffle.partitions changed.`
          : player.step === 0
            ? 'One action, so one job. Each row below is a stage, and each square is a task.'
            : 'Each stage waits for the shuffle before it…'}
      </p>

      <div className="sim-controls">
        <button type="button" className="btn btn-primary btn-sm" onClick={player.play} disabled={player.playing}>
          {player.done ? 'Replay' : player.step === 0 ? 'Run the job' : 'Continue'}
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={player.next} disabled={player.done}>
          Next stage
        </button>
        <button type="button" className="text-link sim-reset" onClick={player.reset}>
          Reset
        </button>
      </div>

      <figcaption>Change spark.sql.shuffle.partitions at the top and run it again. Only the stage after the join changes.</figcaption>
    </figure>
  );
}
