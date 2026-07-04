import { highlightMetrics } from '@/data/site';

export function HighlightsPanel({ postCount }) {
  return (
    <div className="metrics-wrap">
      <div className="metrics-title">
        <span className="prompt">vibhavari@portfolio:~$</span> cat metrics.txt
      </div>
      <div className="metrics-table" role="table" aria-label="Work highlights">
        {highlightMetrics.map((item) => (
          <div className="metrics-row" role="row" key={item.label}>
            <span className="metrics-key" role="cell">
              {item.label}
            </span>
            <span className="metrics-val" role="cell">
              {item.value}
            </span>
            <span className="metrics-src" role="cell">
              {item.source}
            </span>
          </div>
        ))}
        <div className="metrics-row" role="row">
          <span className="metrics-key" role="cell">
            technical posts
          </span>
          <span className="metrics-val" role="cell">
            {postCount}
          </span>
          <span className="metrics-src" role="cell">
            ~/blog
          </span>
        </div>
      </div>
    </div>
  );
}
