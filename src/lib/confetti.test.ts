import { generateConfetti, CONFETTI } from './confetti';

// The confetti is deliberately deterministic (fixed seed) so the celebration
// looks identical every time and the tests never flake on randomness.
describe('confetti', () => {
  it('produces exactly 36 pieces (the spec count)', () => {
    expect(CONFETTI).toHaveLength(36);
    expect(generateConfetti()).toHaveLength(36);
  });

  it('is deterministic — the same seed yields identical pieces every call', () => {
    expect(generateConfetti()).toEqual(generateConfetti());
    expect(generateConfetti()).toEqual(CONFETTI);
  });

  it('a different seed yields different pieces', () => {
    expect(generateConfetti(42)).not.toEqual(CONFETTI);
  });

  it('cycles the six pastel colours in order', () => {
    const colors = ['#e1a4a8', '#c9d8b5', '#e8c576', '#b97b80', '#a8c4d8', '#f3d9db'];
    CONFETTI.forEach((p, i) => expect(p.bg).toBe(colors[i % colors.length]));
  });

  it('gives every piece the full geometry the CSS animation expects', () => {
    for (const p of CONFETTI) {
      expect(p).toEqual(
        expect.objectContaining({
          left: expect.any(String),
          dx: expect.any(String),
          delay: expect.any(String),
          dur: expect.any(String),
          bg: expect.any(String),
          w: expect.any(Number),
          h: expect.any(Number),
          rot: expect.any(String),
        }),
      );
    }
  });
});
