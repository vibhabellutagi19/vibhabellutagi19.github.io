'use client';

import { useState } from 'react';

import { usePlayer } from './usePlayer';

// The Rotten Tomatoes column of the ten movies the post uses.
const MOVIES = [
  { title: 'The Land Girls', rating: null },
  { title: 'First Love, Last Rites', rating: null },
  { title: 'I Married a Strange Person', rating: null },
  { title: 'Pirates', rating: '13' },
  { title: 'Slam', rating: '62' },
  { title: 'Mississippi Mermaid', rating: null },
  { title: 'Following', rating: null },
  { title: 'Foolish', rating: null },
  { title: 'Pirates', rating: '25' },
  { title: 'Duel in the Sun', rating: '86' },
];

// What each predicate evaluates to for one rating. A filter keeps a row only on `true`.
const FILTERS = {
  eq: {
    label: '== None',
    test: () => null,
    result: { tone: 'is-bad', text: '0 rows. Every comparison with null evaluates to null, and a filter only keeps true.' },
  },
  isNull: {
    label: 'isNull()',
    test: (rating) => rating === null,
    result: { tone: 'is-ok', text: '6 rows: the movies with no rating. isNull() answers true or false, never null.' },
  },
  isNotNull: {
    label: 'isNotNull()',
    test: (rating) => rating !== null,
    result: { tone: 'is-ok', text: '4 rows: the movies that do have a rating.' },
  },
};

/** One filter, three ways of writing it, run over the post's ten movies a row at a time. */
export function NullFilter() {
  const [mode, setMode] = useState('eq');
  const player = usePlayer(MOVIES.length, 420);
  const filter = FILTERS[mode];

  const outcomes = MOVIES.map((movie) => filter.test(movie.rating));
  const kept = outcomes.slice(0, player.step).filter((outcome) => outcome === true).length;

  function choose(next) {
    setMode(next);
    player.reset();
  }

  return (
    <figure className="sim nf">
      <div className="sim-head">
        <div className="sim-mode" role="group" aria-label="Filter condition">
          {Object.entries(FILTERS).map(([id, item]) => (
            <button key={id} type="button" aria-pressed={mode === id} onClick={() => choose(id)}>
              {item.label}
            </button>
          ))}
        </div>
        <span className="race-step" aria-live="polite">
          Rows kept: <span key={kept} className="tick">{kept}</span>
        </span>
      </div>

      <div className="nf-table" role="table" aria-label="Movies passing through the filter">
        <div className="nf-row nf-head" role="row">
          <span role="columnheader">Title</span>
          <span role="columnheader">Rating</span>
          <span role="columnheader">Result</span>
          <span role="columnheader">Filter</span>
        </div>
        {MOVIES.map((movie, index) => {
          const seen = index < player.step;
          const outcome = outcomes[index];
          const state = !seen ? '' : outcome === true ? ' is-kept' : ' is-dropped';
          return (
            <div key={`${movie.title}-${index}`} className={`nf-row${state}`} role="row">
              <span role="cell">{movie.title}</span>
              <span role="cell" className={movie.rating === null ? 'nf-null' : 'nf-val'}>
                {movie.rating ?? 'null'}
              </span>
              <span role="cell" className={seen && outcome === null ? 'nf-null' : 'nf-val'}>
                {seen ? String(outcome) : '·'}
              </span>
              <span role="cell" className="nf-val">
                {!seen ? '·' : outcome === true ? 'kept' : 'dropped'}
              </span>
            </div>
          );
        })}
      </div>

      <p className={`sim-status${player.done ? ` ${filter.result.tone}` : ''}`} aria-live="polite">
        {player.done
          ? filter.result.text
          : player.step === 0
            ? `df.filter(col("Rotten_Tomatoes_Rating") ${mode === 'eq' ? '== None' : `.${filter.label}`}) on ten movies, six of them with no rating.`
            : 'Evaluating the condition for each row…'}
      </p>

      <div className="sim-controls">
        <button type="button" className="btn btn-primary btn-sm" onClick={player.play} disabled={player.playing}>
          {player.done ? 'Replay' : player.step === 0 ? 'Run the filter' : 'Continue'}
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={player.next} disabled={player.done}>
          Next row
        </button>
        <button type="button" className="text-link sim-reset" onClick={player.reset}>
          Reset
        </button>
      </div>

      <figcaption>Result is what the condition evaluates to for that row. Only true is kept.</figcaption>
    </figure>
  );
}
