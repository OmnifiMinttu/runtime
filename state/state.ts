import Environment from '../environment/environment.ts';

/**
 * State structure.
 */
interface State {
	/**
	 * Environment state.
	 */
	environment: Environment;

	/**
	 * State data.
	 */
	data: string;
}

export default State;
