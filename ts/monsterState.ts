enum MonsterState {
	IDLE_IN_PEN,
	MOVING_TO_PEN_CENTER,
	EXITING_PEN,
	CHASE_MODE,
	SCATTER_MODE,
	FRIGHTENED,
	EYES_TO_PEN
}
export default MonsterState

/**
 * IDLE_IN_PEN =>
 * 	MOVING_TO_PEN_CENTER
 * 
 * MOVING_TO_PEN_CENTER =>
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