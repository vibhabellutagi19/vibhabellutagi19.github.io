'use client';

import { useEffect, useRef, useState } from 'react';

const BOOT_LINES = [
  ['ok', 'Mounted /home/vibhavari/portfolio'],
  ['ok', 'Started databricks-platform.service'],
  ['ok', 'Started spark-executor.service (dynamic allocation)'],
  ['ok', 'Reached target Data Platform'],
  ['svc', 'Welcome to portfolio OS — kernel: data-systems 5.x'],
];

export function BootOverlay() {
  const [done, setDone] = useState(false);
  const linesRef = useRef(null);

  useEffect(() => {
    if (sessionStorage.getItem('boot-done') === '1') {
      setDone(true);
      return undefined;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setDone(true);
      sessionStorage.setItem('boot-done', '1');
      return undefined;
    }

    function skip() {
      setDone(true);
      sessionStorage.setItem('boot-done', '1');
    }

    const onKey = () => skip();
    document.addEventListener('keydown', onKey, { once: true });

    let index = 0;
    const container = linesRef.current;
    if (!container) {
      return () => document.removeEventListener('keydown', onKey);
    }

    function next() {
      if (index >= BOOT_LINES.length) {
        setTimeout(skip, 420);
        return;
      }
      const [type, text] = BOOT_LINES[index++];
      const line = document.createElement('div');
      line.innerHTML =
        type === 'ok'
          ? `[ <span class="ok">OK</span> ] ${text}`
          : `<span class="svc">${text}</span>`;
      container.appendChild(line);
      setTimeout(next, index < 3 ? 160 : 120);
    }

    next();
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  if (done) {
    return null;
  }

  return (
    <div
      id="boot"
      role="button"
      tabIndex={0}
      aria-label="Skip boot sequence"
      onClick={() => {
        setDone(true);
        sessionStorage.setItem('boot-done', '1');
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          setDone(true);
          sessionStorage.setItem('boot-done', '1');
        }
      }}
    >
      <div ref={linesRef} />
      <div className="skip">click or press any key to skip ▸</div>
    </div>
  );
}
