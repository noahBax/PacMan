import MonsterState from "../monsterState.js";
class StateDict {
    constructor() {
        this.centerBoundDirection = "down";
        this.frightenedSaveState = MonsterState.IDLE_IN_PEN;
    }
}
class IdleDict {
    constructor() {
        this.directionSet = false;
        this.direction = "down";
    }
}
class CenterBoundDict {
    constructor() {
        this.directionSet = false;
        this.direction = "down";
    }
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
