'use client';

import { usePlayer } from './usePlayer';

const ACTORS = [
  { id: 'machine', name: 'Your machine' },
  { id: 'manager', name: 'Cluster manager' },
  { id: 'driver', name: 'Driver' },
  { id: 'executors', name: 'Executors' },
];

// For each step: what every actor is doing, and the one message that defines the step.
const STEPS = [
  {
    name: 'Request',
    message: 'spark-submit → cluster manager: “start a driver for this application.”',
    actors: { machine: ['active', 'runs spark-submit'], manager: ['active', 'receives the request'], driver: ['absent', 'not started'], executors: ['absent', 'not started'] },
  },
  {
    name: 'Launch',
    message: 'Driver → cluster manager: “I need executors.” The cluster manager starts them.',
    actors: { machine: ['idle', 'no longer involved'], manager: ['active', 'starts driver, then executors'], driver: ['active', 'creates SparkSession'], executors: ['active', 'starting'] },
  },
  {
    name: 'Execution',
    message: 'Driver ⇄ executors: tasks go out, status and results come back.',
    actors: { machine: ['idle', 'no longer involved'], manager: ['idle', 'only hands out resources'], driver: ['active', 'schedules tasks'], executors: ['active', 'run tasks'] },
  },
  {
    name: 'Completion',
    message: 'The driver exits. The cluster manager shuts down its executors and frees the resources.',
    actors: { machine: ['idle', 'no longer involved'], manager: ['active', 'cleans up'], driver: ['gone', 'exited'], executors: ['gone', 'shut down'] },
  },
];

const BEFORE = { machine: ['idle', 'ready'], manager: ['idle', 'waiting'], driver: ['absent', 'not started'], executors: ['absent', 'not started'] };

/** A cluster-mode application in four steps: who is doing something at each one. */
export function AppLifecycle() {
  const player = usePlayer(STEPS.length, 2000);
  const current = STEPS[player.step - 1];
  const actors = current ? current.actors : BEFORE;

  return (
    <figure className="sim lc">
      <div className="sim-head">
        <div className="sim-mode" role="group" aria-label="Step">
          {STEPS.map((step, index) => (
            <button key={step.name} type="button" aria-pressed={player.step === index + 1} onClick={() => player.go(index + 1)}>
              {index + 1}. {step.name}
            </button>
          ))}
        </div>
      </div>

      <div className="lc-board">
        {ACTORS.map((actor) => {
          const [state, doing] = actors[actor.id];
          return (
            <div key={actor.id} className={`lc-actor is-${state}`}>
              <p className="lc-name">{actor.name}</p>
              <p className="lc-state">{doing}</p>
            </div>
          );
        })}
      </div>

      <p className="sim-status" aria-live="polite">
        {current ? current.message : 'Nothing has run yet. Four steps take the application from spark-submit to shutdown.'}
      </p>

      <div className="sim-controls">
        <button type="button" className="btn btn-primary btn-sm" onClick={player.play} disabled={player.playing}>
          {player.done ? 'Replay' : player.step === 0 ? 'Play all four steps' : 'Continue'}
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={player.next} disabled={player.done}>
          Next step
        </button>
        <button type="button" className="text-link sim-reset" onClick={player.reset}>
          Reset
        </button>
      </div>

      <figcaption>Dark boxes are the ones acting in that step. Dashed boxes don’t exist yet.</figcaption>
    </figure>
  );
}
