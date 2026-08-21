# Tribes Simulation

Tribes models autonomous peoples that occupy territory, form diplomatic relationships, and create infrastructure on a procedural board.

## Language

**Tribe**:
An autonomous people with its own population, supplies, identity, behavior, cities, territory, and diplomatic relationships.
_Avoid_: Player, faction

**Tile occupation**:
The presence of a tribe on a tile during the current simulation state. Occupation may establish control, but it is not itself persistent control.
_Avoid_: Ownership

**Tile control**:
The persistent dominance established when a tribe occupies an undisputed tile. Control remains after the tribe leaves until another non-allied tribe validly takes it.
_Avoid_: Occupation, road ownership

**Alliance**:
A persistent, bilateral relationship between two tribes that remain autonomous and do not act hostilely toward each other.
_Avoid_: Merger, friendship

**Road segment**:
Infrastructure contained in one traversable tile, retaining the identity and color of the tribe that built it.
_Avoid_: Route

**Route**:
An orthogonally connected path of compatible road segments between distinct endpoints. Segments are compatible when their builders are the same tribe or allied tribes.
_Avoid_: Road segment

**Compatible territory**:
A tile that is uncontrolled, controlled by the route-building tribe, or controlled by one of its allies.
_Avoid_: Free tile
