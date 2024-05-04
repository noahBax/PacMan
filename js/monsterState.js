var MonsterState;
(function (MonsterState) {
    MonsterState[MonsterState["IDLE_IN_PEN"] = 0] = "IDLE_IN_PEN";
    MonsterState[MonsterState["EXITING_PEN"] = 1] = "EXITING_PEN";
    MonsterState[MonsterState["CHASE_MODE"] = 2] = "CHASE_MODE";
    MonsterState[MonsterState["SCATTER_MODE"] = 3] = "SCATTER_MODE";
    MonsterState[MonsterState["FRIGHTENED"] = 4] = "FRIGHTENED";
    MonsterState[MonsterState["EYES_TO_PEN"] = 5] = "EYES_TO_PEN";
})(MonsterState || (MonsterState = {}));
export default MonsterState;
/**
 * IDLE_IN_PEN =>
 * 	EXITING_PEN
 *
 * EXITING_PEN =>
 * 	CHASE_MODE
 *
 * CHASE_MODE =>
 * 	SCATTER_MODE
 * 	FRIGHTENED	resumes to chase
 *
 * SCATTER_MODE =>
 * 	FRIGHTENED	resumes to scatter
 * 	CHASE_MODE
 *
 * FRIGHTENED =>
 * 	EYES_TO_PEN
 * 	CHASE_MODE
 * 	SCATTER_MODE
 */ 
