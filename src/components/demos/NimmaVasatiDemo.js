'use client';

import { useStepLoop } from './useStepLoop';

/*
 * A short animated film: Priya finds a bed at Sunrise PG, and Shankar, the
 * owner, runs it all on NimmaVasati. Scenes are SVG illustrations with the
 * app's screens layered on top as HTML cards.
 */

const LOOKS = {
  priya: {
    skin: '#C68B64',
    top: '#E2A21A',
    topShade: '#B9820F',
    pants: '#45382C',
    pantsShade: '#2E241B',
    shoe: '#6E1F1F',
    hair: '#1E160F',
  },
  shankar: {
    skin: '#A9704C',
    top: '#7A8F3E',
    topShade: '#5E7030',
    pants: '#45382C',
    pantsShade: '#2E241B',
    shoe: '#1E160F',
    hair: '#B0A08C',
  },
};

function FrontArm({ pose, sY, c }) {
  if (pose === 'phone') {
    return (
      <g>
        <path d={`M28 ${sY + 10} L40 ${sY + 60} L16 ${sY + 42}`} fill="none" stroke={c.top} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="2" y={sY + 10} width="22" height="38" rx="4" fill="#1E160F" />
        <rect x="5" y={sY + 14} width="16" height="29" rx="2" fill="#FBE8B5" className="glow" />
        <circle cx="14" cy={sY + 42} r="7" fill={c.skin} />
      </g>
    );
  }

  if (pose === 'lap') {
    return (
      <g>
        <path d={`M28 ${sY + 10} L40 ${sY + 52} L64 ${sY + 60}`} fill="none" stroke={c.top} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="66" cy={sY + 60} r="7" fill={c.skin} />
      </g>
    );
  }

  return (
    <g className="limb arm-f">
      <rect x="24" y={sY + 4} width="12" height="74" rx="6" fill={c.top} />
      <circle cx="30" cy={sY + 80} r="7" fill={c.skin} />
    </g>
  );
}

function Person({ who, x, y, scale = 1, flip = false, pose = 'stand', walking, waving, suitcase }) {
  const c = LOOKS[who];
  const priya = who === 'priya';
  const sitting = pose === 'sit' || pose === 'lap';
  const hipY = sitting ? -55 : -95;
  const sY = hipY - 75;
  const hY = sY - 30;
  const hem = priya && !sitting ? -55 : hipY + 6;
  const flare = priya && !sitting ? 36 : 30;

  const classes = ['person', walking && 'is-walking', waving && 'is-waving', suitcase && 'has-case']
    .filter(Boolean)
    .join(' ');

  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      <g className={classes} style={walking ? { '--n': walking } : undefined}>
        {priya && (
          <path
            d={`M-26 ${hY} C-30 ${hY - 34} 30 ${hY - 34} 26 ${hY} L30 ${hY + 44} Q0 ${hY + 52} -30 ${hY + 44} Z`}
            fill={c.hair}
          />
        )}

        <g className="limb arm-b">
          <rect x="-36" y={sY + 4} width="12" height="74" rx="6" fill={c.topShade} />
          <circle cx="-30" cy={sY + 80} r="7" fill={c.skin} />
        </g>

        {sitting ? (
          <>
            <rect x="-14" y={hipY - 10} width="48" height="15" rx="7" fill={c.pantsShade} />
            <rect x="22" y={hipY - 6} width="13" height={-hipY + 2} rx="6" fill={c.pantsShade} />
            <rect x="-10" y={hipY - 4} width="52" height="15" rx="7" fill={c.pants} />
            <rect x="30" y={hipY} width="13" height={-hipY - 4} rx="6" fill={c.pants} />
            <ellipse cx="42" cy="-4" rx="11" ry="5" fill={c.shoe} />
          </>
        ) : (
          <>
            <g className="limb leg-b">
              <rect x="-13" y={hipY} width="13" height={-hipY - 4} rx="6" fill={c.pantsShade} />
              <ellipse cx="-5" cy="-4" rx="10" ry="5" fill={c.shoe} />
            </g>
            <g className="limb leg-f">
              <rect x="1" y={hipY} width="13" height={-hipY - 4} rx="6" fill={c.pants} />
              <ellipse cx="10" cy="-4" rx="10" ry="5" fill={c.shoe} />
            </g>
          </>
        )}

        <path
          d={`M-28 ${sY + 10} Q-28 ${sY} -16 ${sY} H16 Q28 ${sY} 28 ${sY + 10} L${flare} ${hem} H${-flare} Z`}
          fill={c.top}
        />
        {priya ? (
          <path d={`M-8 ${sY} Q0 ${sY + 12} 8 ${sY}`} fill="none" stroke="#9E6F0C" strokeWidth="2" />
        ) : (
          <path d={`M-9 ${sY} L0 ${sY + 12} L9 ${sY} Z`} fill="#FFFBF3" />
        )}

        <rect x="-7" y={hY + 16} width="14" height="16" fill={c.skin} />
        <circle cx="0" cy={hY} r="25" fill={c.skin} />

        <circle cx="-4" cy={hY - 2} r="2.6" fill="#1E160F" />
        <circle cx="12" cy={hY - 2} r="2.6" fill="#1E160F" />
        <circle cx="-9" cy={hY + 7} r="4.5" fill="#E58A65" opacity="0.35" />
        <circle cx="17" cy={hY + 7} r="4.5" fill="#E58A65" opacity="0.35" />
        <path d={`M-1 ${hY + 10} Q5 ${hY + 16} 11 ${hY + 10}`} fill="none" stroke="#6E1F1F" strokeWidth="2.4" strokeLinecap="round" />

        {priya ? (
          <>
            <circle cx="4" cy={hY - 11} r="1.8" fill="#9E3F1E" />
            <path
              d={`M-26 ${hY - 2} C-26 ${hY - 32} 26 ${hY - 32} 26 ${hY - 4} C18 ${hY - 18} 2 ${hY - 22} -8 ${hY - 14} C-14 ${hY - 9} -21 ${hY - 6} -26 ${hY - 2} Z`}
              fill={c.hair}
            />
          </>
        ) : (
          <>
            <path
              d={`M-25 ${hY - 6} C-25 ${hY - 33} 25 ${hY - 33} 25 ${hY - 6} C17 ${hY - 19} -17 ${hY - 19} -25 ${hY - 6} Z`}
              fill={c.hair}
            />
            <g fill="none" stroke="#1E160F" strokeWidth="1.8">
              <circle cx="-4" cy={hY - 2} r="7" />
              <circle cx="12" cy={hY - 2} r="7" />
              <path d={`M3 ${hY - 2} H5`} />
            </g>
            <path d={`M-2 ${hY + 8} Q4 ${hY + 4} 12 ${hY + 8} Q4 ${hY + 11} -2 ${hY + 8} Z`} fill="#6E6C68" />
          </>
        )}

        {suitcase && (
          <g>
            <rect x="50" y="-92" width="5" height="26" rx="2" fill="#3F1010" />
            <rect x="36" y="-68" width="38" height="58" rx="8" fill="#6E1F1F" />
            <rect x="36" y="-48" width="38" height="6" fill="#9E3F1E" />
            <circle cx="43" cy="-6" r="4" fill="#1E160F" />
            <circle cx="67" cy="-6" r="4" fill="#1E160F" />
          </g>
        )}

        <FrontArm pose={pose} sY={sY} c={c} />
      </g>
    </g>
  );
}

function Chair({ x, flip = false }) {
  return (
    <g transform={`translate(${x} 410) scale(${flip ? -1 : 1} 1)`} fill="#9E6F4A">
      <rect x="-36" y="-150" width="10" height="150" rx="4" />
      <rect x="-36" y="-60" width="74" height="10" rx="4" />
      <rect x="28" y="-52" width="8" height="52" rx="3" />
    </g>
  );
}

function Floor({ wall = '#F4ECDC' }) {
  return (
    <>
      <rect width="800" height="500" fill={wall} />
      <rect y="404" width="800" height="6" fill="#CDBFAC" />
      <rect y="410" width="800" height="90" fill="#E4D9C5" />
    </>
  );
}

function Logo({ x, y, size = 40 }) {
  return (
    <svg x={x} y={y} width={size} height={size} viewBox="0 0 48 48">
      <path d="M4 42V22a20 20 0 0 1 40 0v20Z" fill="#C0532C" />
      <path d="M10 42V24a14 14 0 0 1 28 0v18Z" fill="#FBF6EE" />
      <path d="M16 42V26a8 8 0 0 1 16 0v16Z" fill="#C0532C" />
    </svg>
  );
}

const at = (seconds) => ({ '--d': `${seconds}s` });

/* 1 · Priya arrives at Sunrise PG */
function Arrival() {
  return (
    <>
      <svg className="nvv-svg" viewBox="0 0 800 500">
        <rect width="800" height="500" fill="#FBF6EE" />
        <circle cx="300" cy="120" r="48" fill="#F6D4BE" />
        <g fill="#ECE1CC">
          <rect x="10" y="250" width="60" height="160" />
          <rect x="80" y="214" width="48" height="196" />
          <rect x="140" y="266" width="70" height="144" />
          <rect x="222" y="236" width="40" height="174" />
          <rect x="272" y="284" width="64" height="126" />
        </g>
        <rect y="404" width="800" height="8" fill="#CDBFAC" />
        <rect y="412" width="800" height="88" fill="#E4D9C5" />

        <rect x="404" y="330" width="12" height="80" fill="#8B6B4A" />
        <circle cx="410" cy="306" r="38" fill="#8F9F4F" />
        <circle cx="384" cy="330" r="24" fill="#7A8F3E" />
        <circle cx="438" cy="328" r="24" fill="#7A8F3E" />

        <rect x="480" y="150" width="280" height="260" fill="#F6D4BE" />
        <rect x="470" y="138" width="300" height="18" rx="4" fill="#C0532C" />
        {[510, 600, 690].map((wx) =>
          [182, 252].map((wy) => (
            <rect
              key={`${wx}-${wy}`}
              x={wx}
              y={wy}
              width="44"
              height="44"
              rx="3"
              fill={(wx + wy) % 3 === 0 ? '#FBE8B5' : '#FFFBF3'}
              stroke="#E58A65"
              strokeWidth="3"
            />
          ))
        )}
        <rect x="590" y="322" width="56" height="88" rx="4" fill="#45382C" />
        <circle cx="634" cy="368" r="3" fill="#E2A21A" />
        <path d="M576 320 H660 L650 302 H586 Z" fill="#C0532C" />
        <rect x="550" y="100" width="140" height="32" rx="6" fill="#1E160F" />
        <text x="620" y="122" textAnchor="middle" className="nvv-sign">
          SUNRISE PG
        </text>

        <g className="v-walk" style={{ '--from': '-640px', '--to': '0px', '--dur': '2.6s' }}>
          <Person who="priya" x={520} y={410} walking={4} suitcase />
        </g>

        <g className="v-pop" style={at(2.7)}>
          <rect x="268" y="112" width="226" height="66" rx="18" fill="#FFFBF3" stroke="#E4D9C5" strokeWidth="2" />
          <path d="M470 176 L494 196 L482 172 Z" fill="#FFFBF3" />
          <text x="290" y="140" className="nvv-talk">
            Hi! Is a bed free
          </text>
          <text x="290" y="164" className="nvv-talk">
            from 20 Oct?
          </text>
        </g>
      </svg>

      <div className="nvv-card v-pop" style={{ left: '3%', top: '13%', width: '30%', ...at(3.3) }}>
        <p className="nvv-kicker">
          <span className="nvv-ping" /> New enquiry
        </p>
        <p className="nvv-strong">Priya Rao</p>
        <p className="nvv-muted">2-share · from 20 Oct · ₹8,000</p>
      </div>
    </>
  );
}

/* 2 · Shankar onboards her at his desk */
function Onboarding() {
  const checks = ['Contact & emergency details', 'Aadhaar stored masked', 'Deposit + prorated rent'];

  return (
    <>
      <svg className="nvv-svg" viewBox="0 0 800 500">
        <Floor />
        <rect x="560" y="70" width="160" height="128" rx="4" fill="#FFFBF3" stroke="#CDBFAC" strokeWidth="6" />
        <path d="M640 70 V198 M560 134 H720" stroke="#CDBFAC" strokeWidth="4" />
        <rect x="436" y="120" width="70" height="86" rx="4" fill="#FBEDE3" stroke="#F6D4BE" strokeWidth="4" />
        <Logo x={451} y={142} size={40} />

        <Chair x={318} />
        <Person who="priya" x={318} y={410} pose="sit" />
        <Chair x={600} flip />
        <Person who="shankar" x={600} y={410} pose="sit" flip />

        <rect x="372" y="312" width="180" height="12" rx="3" fill="#9E6F4A" />
        <rect x="384" y="324" width="10" height="86" fill="#8B6B4A" />
        <rect x="530" y="324" width="10" height="86" fill="#8B6B4A" />
        <rect x="474" y="306" width="58" height="6" rx="2" fill="#CDBFAC" />
        <path d="M476 308 L460 262" stroke="#B0A08C" strokeWidth="7" strokeLinecap="round" />
        <rect x="398" y="304" width="40" height="8" rx="1" fill="#FFFBF3" transform="rotate(-6 418 308)" />

        <g className="v-pop" style={at(0.4)}>
          <rect x="470" y="214" width="58" height="28" rx="14" fill="#FFFBF3" stroke="#E4D9C5" strokeWidth="2" />
          {[486, 499, 512].map((cx, index) => (
            <circle key={cx} cx={cx} cy="228" r="4" fill="#8B7864" className="blink" style={at(index * 0.2)} />
          ))}
        </g>
      </svg>

      <div className="nvv-card" style={{ left: '3%', top: '13%', width: '31%' }}>
        <p className="nvv-kicker">New tenant · Priya Rao</p>
        <ul className="nvv-checks">
          {checks.map((check, index) => (
            <li key={check} className="v-pop" style={at(0.7 + index * 0.7)}>
              <b>✓</b>
              {check}
            </li>
          ))}
        </ul>
        <p className="nvv-total v-pop" style={at(2.9)}>
          <span>Due at move-in</span>
          <b>₹19,597</b>
        </p>
      </div>
    </>
  );
}

/* 3 · Keys, room 104B */
function MoveIn() {
  const beds = ['101A', '101B', '102A', '102B', '103A', '103B', '104A', '104B'];

  return (
    <>
      <svg className="nvv-svg" viewBox="0 0 800 500">
        <Floor wall="#FBEDE3" />
        <ellipse cx="470" cy="448" rx="170" ry="26" fill="#F6D4BE" />

        <rect x="60" y="170" width="112" height="240" fill="#FFFBF3" stroke="#CDBFAC" strokeWidth="8" />
        <rect x="82" y="134" width="68" height="26" rx="4" fill="#1E160F" />
        <text x="116" y="153" textAnchor="middle" className="nvv-sign">
          104B
        </text>

        <rect x="600" y="80" width="130" height="112" rx="4" fill="#FFFBF3" stroke="#CDBFAC" strokeWidth="6" />
        <rect x="588" y="72" width="26" height="136" rx="6" fill="#C0532C" />
        <rect x="716" y="72" width="26" height="136" rx="6" fill="#C0532C" />

        <rect x="700" y="248" width="22" height="162" rx="4" fill="#9E6F4A" />
        <rect x="470" y="340" width="252" height="40" rx="4" fill="#B98458" />
        <rect x="470" y="318" width="240" height="28" rx="8" fill="#FFFBF3" />
        <rect x="642" y="298" width="54" height="24" rx="10" fill="#FBE8B5" />
        <rect x="470" y="322" width="168" height="26" rx="8" fill="#C0532C" />
        <rect x="478" y="380" width="10" height="30" fill="#8B6B4A" />

        <Person who="shankar" x={116} y={410} scale={0.95} waving />

        <g className="v-walk" style={{ '--from': '-280px', '--to': '0px', '--dur': '2s', ...at(0.3) }}>
          <Person who="priya" x={400} y={410} walking={3} suitcase />
        </g>

        <g className="v-pop" style={at(2.4)}>
          <circle cx="480" cy="250" r="22" fill="#FBE8B5" />
          <circle cx="472" cy="250" r="7" fill="none" stroke="#9E6F0C" strokeWidth="4" />
          <path d="M479 250 H496 M490 250 V258 M496 250 V256" stroke="#9E6F0C" strokeWidth="4" strokeLinecap="round" />
          <path d="M512 222 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4 Z" fill="#E2A21A" />
        </g>
      </svg>

      <div className="nvv-card" style={{ left: '26%', top: '13%', width: '44%' }}>
        <p className="nvv-kicker">Floor 1 · Sunrise PG</p>
        <div className="nvv-beds">
          {beds.map((bed) => (
            <span
              key={bed}
              className={bed === '103A' ? '' : bed === '104B' ? 'is-new' : 'is-occ'}
              style={bed === '104B' ? at(2.3) : undefined}
            >
              {bed}
            </span>
          ))}
        </div>
        <p className="nvv-muted">
          Occupancy 75%{' '}
          <b className="nvv-up v-pop" style={at(2.6)}>
            → 88%
          </b>
        </p>
      </div>
    </>
  );
}

/* 4 · UPI rent, invoice back */
function Payment() {
  return (
    <>
      <svg className="nvv-svg" viewBox="0 0 800 500">
        <rect width="400" height="500" fill="#FBF6EE" />
        <rect x="400" width="400" height="500" fill="#FBEDE3" />
        <path d="M400 0 V500" stroke="#E4D9C5" strokeWidth="3" strokeDasharray="10 10" />
        <Person who="priya" x={290} y={548} scale={1.4} pose="phone" />
        <Person who="shankar" x={590} y={548} scale={1.4} pose="phone" flip />
      </svg>

      <div className="nvv-card nvv-phone" style={{ left: '3%', top: '13%', width: '27%' }}>
        <p className="nvv-kicker">UPI · Sunrise PG</p>
        <p className="nvv-amount">₹19,597</p>
        <div className="nvv-swap">
          <span className="nvv-btn v-out" style={at(1)}>
            Pay
          </span>
          <span className="nvv-btn is-done v-pop" style={at(1)}>
            ✓ Paid
          </span>
        </div>
        <p className="nvv-file v-pop" style={at(3)}>
          <span className="nvv-pdf">PDF</span> NV-0143 received
        </p>
      </div>

      <div className="nvv-card" style={{ right: '3%', top: '13%', width: '30%' }}>
        <p className="nvv-kicker">Rent ledger · Oct</p>
        <p className="nvv-row">
          <span>
            Priya R. <small>104B</small>
          </span>
          <span className="nvv-swap">
            <span className="nvv-pill v-out" style={at(1.8)}>
              Due
            </span>
            <span className="nvv-pill is-paid v-pop" style={at(1.8)}>
              Paid
            </span>
          </span>
        </p>
        <p className="nvv-muted v-pop" style={at(2.2)}>
          Invoice NV-0143 sent ✓
        </p>
      </div>

      <span className="nvv-fly nvv-coin" style={{ '--from': '28%', '--to': '64%', ...at(1) }}>
        ₹
      </span>
      <span className="nvv-fly nvv-doc" style={{ '--from': '64%', '--to': '24%', ...at(2.3) }}>
        PDF
      </span>
    </>
  );
}

/* 5 · Month end, over chai */
function Reports() {
  const months = [
    ['May', 62],
    ['Jun', 70],
    ['Jul', 66],
    ['Aug', 78],
    ['Sep', 84],
    ['Oct', 96],
  ];

  return (
    <>
      <svg className="nvv-svg" viewBox="0 0 800 500">
        <Floor />
        <rect x="70" y="70" width="170" height="130" rx="4" fill="#2E241B" stroke="#CDBFAC" strokeWidth="6" />
        <circle cx="200" cy="108" r="16" fill="#FFFBF3" />
        <circle cx="194" cy="104" r="14" fill="#2E241B" />
        {[
          [104, 98],
          [140, 130],
          [118, 160],
          [170, 168],
          [214, 156],
        ].map(([cx, cy], index) => (
          <circle key={cx} cx={cx} cy={cy} r="2.2" fill="#FBE8B5" className="blink" style={at(index * 0.3)} />
        ))}

        <g transform="translate(-40 0)">
        <rect x="54" y="272" width="292" height="92" rx="22" fill="#C0532C" />
        <rect x="44" y="346" width="312" height="44" rx="14" fill="#D86C44" />
        <rect x="34" y="318" width="40" height="80" rx="16" fill="#9E3F1E" />
        <rect x="326" y="318" width="40" height="80" rx="16" fill="#9E3F1E" />
        <rect x="60" y="390" width="10" height="20" fill="#50200E" />
        <rect x="330" y="390" width="10" height="20" fill="#50200E" />

        <Person who="shankar" x={170} y={410} pose="lap" />
        <rect x="190" y="342" width="70" height="7" rx="2" fill="#9B9895" />
        <path d="M258 345 L276 298" stroke="#6E6C68" strokeWidth="7" strokeLinecap="round" />
        </g>

        <rect x="320" y="352" width="66" height="58" rx="4" fill="#9E6F4A" />
        <rect x="336" y="326" width="26" height="26" rx="5" fill="#FFFBF3" />
        <circle cx="366" cy="338" r="6" fill="none" stroke="#FFFBF3" strokeWidth="3" />
        <g fill="none" stroke="#B0A08C" strokeWidth="3" strokeLinecap="round">
          <path className="steam" d="M344 318 q-6 -10 0 -20 q6 -10 0 -20" />
          <path className="steam" style={at(0.7)} d="M354 318 q-6 -10 0 -20 q6 -10 0 -20" />
        </g>
      </svg>

      <div className="nvv-card nvv-report" style={{ left: '50%', top: '13%', width: '46%' }}>
        <p className="nvv-kicker">October · Sunrise PG</p>
        <div className="nvv-tiles">
          <span className="v-pop" style={at(0.3)}>
            <small>Occupancy</small>88%
          </span>
          <span className="v-pop" style={at(0.45)}>
            <small>Collected</small>₹2,12,097
          </span>
          <span className="v-pop" style={at(0.6)}>
            <small>Expenses</small>₹46,300
          </span>
          <span className="v-pop is-key" style={at(0.75)}>
            <small>Net income</small>₹1,65,797
          </span>
        </div>
        <div className="nvv-bars">
          {months.map(([month, height], index) => (
            <span key={month} className={month === 'Oct' ? 'is-now' : ''}>
              <i style={{ '--h': `${height}%`, ...at(1 + index * 0.15) }} />
              {month}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

const SCENES = [
  {
    View: Arrival,
    ms: 4600,
    caption: 'Meet Priya. New job in Bengaluru, needs a bed by 20 Oct.',
  },
  {
    View: Onboarding,
    ms: 4600,
    caption: 'Shankar, the owner, onboards her in minutes. The maths is done for him.',
  },
  {
    View: MoveIn,
    ms: 4400,
    caption: 'Keys handed over. Bed 104B is hers, and occupancy updates itself.',
  },
  {
    View: Payment,
    ms: 4600,
    caption: 'She pays by UPI. Rent is marked paid, the invoice lands in her inbox.',
  },
  {
    View: Reports,
    ms: 5000,
    caption: 'Month end. Over chai, Shankar sees the whole month in one place.',
  },
];

export function NimmaVasatiDemo() {
  const [ref, step, running] = useStepLoop(SCENES.map((scene) => scene.ms));
  const { View, ms, caption } = SCENES[step];

  return (
    <div className={`demo nvv${running ? '' : ' is-paused'}`} ref={ref} aria-hidden="true">
      <div className="nvv-stage" key={step}>
        <View />
      </div>

      <div className="nvv-top">
        <span className="nvv-chip">
          <svg viewBox="0 0 48 48" width="1.1em" height="1.1em">
            <path d="M4 42V22a20 20 0 0 1 40 0v20Z" fill="#C0532C" />
            <path d="M10 42V24a14 14 0 0 1 28 0v18Z" fill="#FBF6EE" />
            <path d="M16 42V26a8 8 0 0 1 16 0v16Z" fill="#C0532C" />
          </svg>
          NimmaVasati
        </span>
        <span className="nvv-chip nvv-count">
          Priya&apos;s story · {step + 1}/{SCENES.length}
        </span>
      </div>

      <div className="nvv-bottom">
        <p className="nvv-caption" key={step}>
          {caption}
        </p>
        <div className="nvv-progress" style={{ '--dur': `${ms}ms` }}>
          {SCENES.map((scene, index) => (
            <span
              key={scene.caption}
              className={index < step ? 'is-done' : index === step ? 'is-active' : ''}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
