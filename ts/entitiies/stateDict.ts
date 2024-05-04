import MonsterState from "../monsterState.js";
import { Direction } from "../types.js"

class StateDict {
	
	centerBoundDirection: Direction = "down";
	
	frightenedSaveState: MonsterState = MonsterState.IDLE_IN_PEN;
	
}

class IdleDict {
	directionSet: boolean = false;
	direction: Direction = "down";
}

class CenterBoundDict {
	directionSet: boolean = false;
	direction: Direction = "down";
}

class ExitingDict {
}

class ChaseDict {

}

class ScatterDict {

}

class FrightenedDict {

}

class EyesDict {
	
}

export default StateDict;