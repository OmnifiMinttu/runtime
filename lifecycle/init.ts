import {
	ApplicationController,
	ApplicationOptions,
} from '../application/mod.ts';

/**
 * Application initialization options.
 */
interface InitOptions {
	/**
	 * Application specific options.
	 */
	applicationOptions?: ApplicationOptions;
}

/**
 * Initializes the application and its related processes with (optionally) given options.
 *
 * @param options Options used to start the application.
 */
async function init(options?: InitOptions) {
	await initApplication(options?.applicationOptions);
}

/**
 * Initializes the application with a set of specific options.
 *
 * @param options Options to initialize the application with.
 */
async function initApplication(options?: ApplicationOptions) {
	await ApplicationController.init(options);
}

export type { ApplicationOptions, InitOptions };

export { init };
