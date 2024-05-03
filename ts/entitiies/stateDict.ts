import MonsterState from "../monsterState.js";
import { Direction } from "../types.js"

class StateDict {
	idleDirection: Direction = "down";

	centerBoundDirection: Direction = "down";

	frightenedSaveState: MonsterState = MonsterState.IDLE_IN_PEN;

}

export default StateDict;