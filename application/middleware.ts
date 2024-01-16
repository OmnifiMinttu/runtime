import { resolve } from '$std/path/resolve.ts';
import { basename, extname } from '$std/path/mod.ts';
import DataManager, { DataSyncSubscriber } from '../data/manager.ts';
import Navigation, { NavigationItem } from '../navigation/navigation.ts';
import Application from './application.ts';
import ApplicationLogo from './logo.ts';
import { applicationContentOriginPathVariable } from './environment.ts';
import { PageManager } from '../content/mod.ts';

/**
 * Options when instantiating the `ApplicationMiddleware` object.
 */
interface ApplicationMiddlewareOptions {
	/**
	 * Lookup path for the web manifest (i.e. .webmanifest file).
	 */
	manifestPath?: string;
	/**
	 * Location of the generate site content, including markdown files,
	 * and localization files.
	 */
	contentImportPath?: string;
}

/**
 * Middleware for handling the root application meta information, data retrieval,
 * and instantiation.
 *
 * It also handles the synchronization between external content stores.
 *
 * This implements the `Application` interface, providing the application structure.
 */
class ApplicationMiddleware implements Application, DataSyncSubscriber {
	/**
	 * Initializes a new ApplicationMiddleware with the given options.
	 *
	 * @param options Initialization options.
	 * @returns A new ApplicationMiddleware instance.
	 */
	// deno-lint-ignore require-await
	public static async init(options?: ApplicationMiddlewareOptions) {
		if (!ApplicationMiddleware.#context) {
			ApplicationMiddleware.#context = new ApplicationMiddleware(options);
		}

		return ApplicationMiddleware.#context;
	}

	/**
	 * Provides the singleton instance of the ApplicationMiddleware. If an instance
	 * has not already been created, then one will be instantiated at this point.
	 *
	 * @returns The singleton instance of the ApplicationMiddleware.
	 */
	public static async instance() {
		if (!ApplicationMiddleware.#context) await ApplicationMiddleware.init();

		return ApplicationMiddleware.#context;
	}

	/**
	 * The path within the content store to look up the navigation sections.
	 */
	static readonly #navigationPath = 'navigation';

	/**
	 * The ApplicationMiddleware instance.
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
	 * A reference to the DataManager singleton used to handle the content (and other)
	 * stores.
	 */
	#dataManager: DataManager;

	/**
	 * Instantiates a new ApplicationMiddleware with the given options (ApplicationMiddlewareOptions).
	 *
	 * @param options ApplicationMiddlewareOptions used to instantiate a new ApplicationMiddleware.
	 */
	private constructor(options?: ApplicationMiddlewareOptions) {
		if (options?.contentImportPath) {
			this.#contentImportPath = options.contentImportPath;
		} else {
			this.#contentImportPath = Deno.env.get(
				applicationContentOriginPathVariable,
			);
		}

		this.#manifestPath = options?.manifestPath;

		this.#dataManager = DataManager.instance();

		if (this.#contentImportPath) {
			this.#dataManager.addSyncRule('content', {
				sourcePath: this.#contentImportPath,
			}, this);
		} else {
			this.#dataManager.storeExists('content').then((exists) => {
				if (exists) {
					this.updated();
				} else {
					throw new Error(
						`application content origin path not set.\n\nTry export=${applicationContentOriginPathVariable}=<content path>`,
					);
				}
			});
		}
	}

	updated = async () => {
		const contentStoreDirectory = await this.#dataManager.getStore(
			'content',
		);

		if (this.#manifestPath) {
			await this.#loadManifest(this.#manifestPath);
		}

		await this.#loadNavigation(
			resolve(
				contentStoreDirectory,
				ApplicationMiddleware.#navigationPath,
			),
		);
		await PageManager.instance().refresh();
	};

	/**
	 * Loads the web manifest and uses it to provide sensible defaults for the application.
	 *
	 * @param path Path of the web manifest file.
	 */
	#loadManifest = async (path: string) => {
		const manifestURL = new URL(resolve(path), import.meta.url);
		const manifestFetchResponse = await fetch(manifestURL);
		const manifestJSON = await manifestFetchResponse.json();
		this.title = manifestJSON['name'];
	};

	/**
	 * Loads the navigation sections and uses them to populate the primary and footer navigation.
	 *
	 * @param path Path of the navigation configurations.
	 */
	#loadNavigation = async (path: string) => {
		const navigationDirectory = await Deno.readDir(path);

		for await (const content of navigationDirectory) {
			if (content.isFile) {
				const navigationFilePath = resolve(path, content.name);
				const navigationFetchResponse = await fetch(
					new URL(navigationFilePath, import.meta.url),
				);
				const navigationFileContent: NavigationItem[] =
					await navigationFetchResponse.json();
				this.navigation
					.sections[basename(content.name, extname(content.name))] =
						navigationFileContent;
			}
		}
	};
}

export default ApplicationMiddleware;

export { ApplicationMiddleware, type ApplicationMiddlewareOptions };
