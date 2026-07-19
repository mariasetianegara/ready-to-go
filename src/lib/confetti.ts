// The 36 confetti pieces for the celebration overlay.
//
// A fixed seed feeds a small linear-congruential PRNG, so the pieces are
// identical on every run. Deterministic on purpose — the celebration looks
// the same every time, and the tests never flake on randomness. (The user
// won't notice; fewer ways to break.)

export interface ConfettiPiece {
  left: string; // horizontal start, e.g. "42.1%"
  dx: string; // horizontal drift during the fall, e.g. "-37px"
  delay: string; // animation-delay
  dur: string; // animation-duration
  bg: string; // one of the six pastel colours
  w: number; // width in px
  h: number; // height in px
  rot: string; // initial rotation, e.g. "212deg"
}

const COLORS = ['#e1a4a8', '#c9d8b5', '#e8c576', '#b97b80', '#a8c4d8', '#f3d9db'];

/** Build the deterministic confetti pieces. Same seed → identical output. */
export function generateConfetti(seed = 1729): ConfettiPiece[] {
  const pieces: ConfettiPiece[] = [];
  let s = seed;
  const r = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return (s & 0xffff) / 0xffff;
  };
  for (let i = 0; i < 36; i++) {
    pieces.push({
      left: `${r() * 100}%`,
      dx: `${(r() - 0.5) * 220}px`,
      delay: `${r() * 0.6}s`,
      dur: `${2 + r() * 1.4}s`,
      bg: COLORS[i % COLORS.length],
      w: 6 + Math.round(r() * 8),
      h: 10 + Math.round(r() * 8),
      rot: `${Math.round(r() * 360)}deg`,
    });
  }
  return pieces;
}

export const CONFETTI: ConfettiPiece[] = generateConfetti();
