# Changelog

## Regression fixes (May 2026)

Surgical fixes on the L1 learning loop. Progress key `qacad_react_v1` unchanged.

1. **Duplicate tab bar removed.** Deleted the pill-style `loop-status` row. Only underline tabs remain (DESIGN.md).
2. **Labeled plot grids.** Shared `plotGrid.js` adds x/y labels, integer ticks -5 to 5, (0, 0) at origin, and +y up. Used in Vectors Do and Play.
3. **Do vs Play differentiated (Vectors).** Do is now a 4-step guided walkthrough plus one plotted vector with hint. Play stays the 5-round scored challenge.
4. **Recall free-text validation.** Numeric answers reject garbage without advancing. Wrong answers show concept explanations. Ambiguous fills converted to MCQ where needed.
5. **Quantum Coin Play fixed.** Challenge-only mode with 5 Born-rule rounds, score, and completion (no sandbox default). Entanglement and Entropy games upgraded to the same round pattern.
6. **Auto-complete (option A).** Topics auto-complete when Learn, Do, Play (if any), Exercise (if any), and Recall pass. Manual override is a small "Having trouble? Mark complete anyway" link.

### Build
- `npm run build` passes.
