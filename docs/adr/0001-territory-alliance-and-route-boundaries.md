# Separate territory, diplomacy, and route authorship

Tribes treats tile control, city ownership, and road authorship as separate concepts. Alliances are bilateral and persistent rather than merging tribes; they permit route continuity while each road segment keeps its original builder and color. Version 1.1.2 generates an all-or-nothing orthogonal route using a deliberately provisional Manhattan path, leaving distance pricing and A* pathfinding for version 1.3.0.

## Consequences

- Occupation establishes persistent tile control only when the tile is not disputed.
- A non-allied takeover removes the conquered tile's road segment; allied occupation preserves it.
- Route generation never grants control of intermediate tiles and cannot cross hostile, water, or mountain tiles.
- If the complete path cannot be built, the board remains unchanged and pays no route cost.
