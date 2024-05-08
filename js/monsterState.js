var MonsterState;
(function (MonsterState) {
    MonsterState[MonsterState["IN_PEN"] = 0] = "IN_PEN";
    MonsterState[MonsterState["CHASE_MODE"] = 1] = "CHASE_MODE";
    MonsterState[MonsterState["SCATTER_MODE"] = 2] = "SCATTER_MODE";
    MonsterState[MonsterState["EYES_TO_PEN"] = 3] = "EYES_TO_PEN";
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
