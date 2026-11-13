'use client';

import { useEffect, useState } from 'react';

const FINISH_MS = 2400;

const STATUS = {
  client: {
    idle: { text: 'Client mode: the driver will run on your laptop, the executors in the cluster.' },
    running: { text: 'Running. The driver on your laptop is sending tasks to the executors. Now close the laptop.' },
    closed: {
      tone: 'is-bad',
      text: 'The job died. The driver was on the laptop, and without a driver the executors have nothing to run.',
    },
  },
  cluster: {
    idle: { text: 'Cluster mode: the driver will run on a worker node, next to the executors.' },
    running: { text: 'Running. The driver is inside the cluster, sending tasks to the executors. Now close the laptop.' },
    closed: { text: 'The laptop is gone, and nothing in the cluster noticed. The job keeps running…' },
    finished: { tone: 'is-ok', text: 'The job finished without your laptop. Ask the cluster manager how it went.' },
  },
};

function Proc({ name, state, driver }) {
  return <span className={`dl-proc${driver ? ' is-driver' : ''}${state ? ` is-${state}` : ''}`}>{name}</span>;
}

/** Same job, two deploy modes. Close the laptop and see which one survives. */
export function DriverLocation() {
  const [mode, setMode] = useState('client');
  const [phase, setPhase] = useState('idle');

  // In cluster mode the job carries on after the lid closes, then completes.
  useEffect(() => {
    if (mode !== 'cluster' || phase !== 'closed') {
      return undefined;
    }
    const timer = setTimeout(() => setPhase('finished'), FINISH_MS);
    return () => clearTimeout(timer);
  }, [mode, phase]);

  function choose(next) {
    setMode(next);
    setPhase('idle');
  }

  const started = phase !== 'idle';
  const lidClosed = phase === 'closed' || phase === 'finished';
  const died = mode === 'client' && lidClosed;
  // What the processes inside the cluster are doing.
  const clusterState = !started ? '' : died ? 'dead' : phase === 'finished' ? 'done' : 'on';
  const status = STATUS[mode][phase];

  return (
    <figure className="sim dl">
      <div className="sim-head">
        <div className="sim-mode" role="group" aria-label="Deploy mode">
          <button type="button" aria-pressed={mode === 'client'} onClick={() => choose('client')}>
            --deploy-mode client
          </button>
          <button type="button" aria-pressed={mode === 'cluster'} onClick={() => choose('cluster')}>
            --deploy-mode cluster
          </button>
        </div>
      </div>

      <div className="dl-board">
        <div className={`dl-panel${lidClosed ? ' is-closed' : ''}`}>
          <p className="dl-title">
            Your laptop <span>{lidClosed ? 'lid closed' : 'open'}</span>
          </p>
          <div className="dl-procs">
            <Proc name="spark-submit" state={started && !lidClosed ? 'done' : ''} />
            {mode === 'client' && <Proc name="Driver" driver state={!started ? '' : lidClosed ? 'dead' : 'on'} />}
          </div>
        </div>

        <div className="dl-panel">
          <p className="dl-title">
            Cluster <span>worker nodes</span>
          </p>
          <div className="dl-nodes">
            <div className="dl-node">
              node 1
              {mode === 'cluster' ? <Proc name="Driver" driver state={clusterState} /> : <span className="dl-empty">no Spark process</span>}
            </div>
            {[2, 3, 4].map((node) => (
              <div key={node} className="dl-node">
                node {node}
                <Proc name="Executor" state={clusterState} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className={`sim-status${status.tone ? ` ${status.tone}` : ''}`} aria-live="polite">
        {status.text}
      </p>

      <div className="sim-controls">
        <button type="button" className="btn btn-primary btn-sm" onClick={() => setPhase('running')} disabled={started}>
          Submit the job
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setPhase('closed')} disabled={phase !== 'running'}>
          Close the laptop
        </button>
        <button type="button" className="text-link sim-reset" onClick={() => setPhase('idle')}>
          Reset
        </button>
      </div>

      <figcaption>A green dot is a running process. Try both modes: submit, then close the laptop.</figcaption>
    </figure>
  );
}
