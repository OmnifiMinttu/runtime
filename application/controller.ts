import Navigation from '../navigation/navigation.ts';
import Application from './application.ts';
import ApplicationLogo from './logo.ts';
import { applicationContentOriginPathVariable } from './environment.ts';
import { IconSet } from '../icons/mod.ts';
import { ApplicationOptions } from './options.ts';

/**
 * Controller for handling the root application meta information, data retrieval,
 * and instantiation.
 *
 * It also handles the synchronization between external content stores.
 *
 * This implements the `Application` interface, providing the application structure.
 */
class ApplicationController implements Application {
	/**
	 * Provides the singleton instance of the ApplicationController. If an instance
	 * has not already been created, then one will be instantiated at this point.
	 *
	 * @returns The singleton instance of the ApplicationController.
	 */
	static get context(): Application {
		if (!ApplicationController.#context) ApplicationController.init();

		return ApplicationController.#context;
	}

	/**
	 * Initializes a new ApplicationController with the given options.
	 *
	 * @param options Initialization options.
	 * @returns A new ApplicationController instance.
	 */
	// deno-lint-ignore require-await
	static async init(options?: ApplicationOptions): Promise<Application> {
		if (!ApplicationController.#context) {
			ApplicationController.#context = new ApplicationController(options);
		}

		return ApplicationController.#context;
	}

	/**
	 * The ApplicationController instance.
	 */
	static #context: Application;

	/**
	 * The application navigation sections, including the primary ("primary") navigation and the footer
	 * ("footer") navigation.
	 */
	navigation: Navigation = { sections: {} };

	/**
	 * The title of the application.
	 */
	title = '';

	/**
	 * The main logo of the application.
	 */
	logo: ApplicationLogo = {};

	/**
	 * The location where to import content if not in the local store.
	 */
	#contentImportPath: string | undefined;

	/**
	 * The location of the (web) manifest, relative to the content store.
	 */
	#manifestPath: string | undefined;

	/**
	 * The location of the application icon set within the data store.
	 */
	#iconsPath: string | undefined;

	#iconSet: IconSet | undefined;

	/**
	 * Instantiates a new ApplicationController with the given options (ApplicationControllerOptions).
	 *
	 * @param options ApplicationControllerOptions used to instantiate a new ApplicationController.
	 */
	private constructor(options?: ApplicationOptions) {
		if (options?.contentImportPath) {
			this.#contentImportPath = options.contentImportPath;
		} else {
			this.#contentImportPath = Deno.env.get(
				applicationContentOriginPathVariable,
			);
		}
	}
}

export default ApplicationController;

export { ApplicationController, type ApplicationOptions };
