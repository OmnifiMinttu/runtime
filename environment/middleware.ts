import Environment from './environment.ts';

/**
 * Handles the environmental logic for an application using the runtime.
 */
class EnvironmentMiddleware implements Environment {
	/**
	 * Provides a forced invocation of the environment middleware.
	 */
	// deno-lint-ignore require-await
	public static async init() {
		if (!EnvironmentMiddleware.#context) {
			EnvironmentMiddleware.#context = new EnvironmentMiddleware();
		}
	}

	/**
	 * Provides the singleton instance of the environment middleware. If
	 * this has not been invoked yet, it invokes on the first request.
	 *
	 * @returns The singleton instance of the environment middleware.
	 */
	public static instance(): Environment {
		if (!EnvironmentMiddleware.#context) {
			EnvironmentMiddleware.#context = new EnvironmentMiddleware();
		}

		return EnvironmentMiddleware.#context;
	}

	static #context: Environment;
}

export default EnvironmentMiddleware;

export { EnvironmentMiddleware };
