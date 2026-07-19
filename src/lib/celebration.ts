/**
 * The celebration trigger rule, isolated as a pure function so it's trivially
 * testable. Fire ONLY at the moment the list crosses from "not all packed"
 * into "all packed" — never on a fresh load that's already full (TC-7.2),
 * never while still incomplete, never when dropping back below N.
 */
export function shouldCelebrate(prevAllPacked: boolean, allPacked: boolean): boolean {
  return allPacked && !prevAllPacked;
}
