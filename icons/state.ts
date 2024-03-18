import { applicationIconsPathVariable } from '@minttu/runtime/icons/environment.ts';
import { Icon } from './icon.ts';
import { IconsOptions } from './options.ts';

/**
 * Application runtime state for icons, used to reduce the refetching and configuration of icons
 * in the application.
 */
class IconsState {
	/**
	 * A singleton reference of the state.
	 */
	static get context(): IconsState {
		if (!IconsState.#context) {
			IconsState.#context = new IconsState();
		}

		return IconsState.#context;
	}

	/**
	 * Options for fetching and handling icons.
	 */
	static get options(): IconsOptions {
		if (!IconsState.#options) {
			IconsState.#options = IconsState.#loadOptions();
		}

		return IconsState.#options;
	}

	/**
	 * Application icons.
	 */
	readonly applicationIcons: Set<Icon> = new Set();

	/**
	 * Singleton context for the icons state.
	 */
	static #context: IconsState | undefined;

	/**
	 * Singleton represntation of the icon handling options.
	 */
	static #options: IconsOptions | undefined;

	/**
	 * Constructs the default options for icons state for easy use.
	 * @returns An `IconOptions` structure with base defaults.
	 */
	static #defaultOptions(): IconsOptions {
		return {
			applicationIcons: {},
		};
	}

	/**
	 * Loads the `IconOptions` for use when handling icons. If options are not provided
	 * then the environment variables are checked instead.
	 *
	 * @param options `IconOptions` to use when handling icons throughout the application.
	 * @returns The `IconOptions` in-memory (should be the same as those passed).
	 */
	static #loadOptions(options?: IconsOptions): IconsOptions {
		if (!options) {
			options = IconsState.#defaultOptions();
		}

		options.applicationIcons = {
			path: Deno.env.get(applicationIconsPathVariable),
		};

		IconsState.#options = options;

		return options;
	}

	constructor() {}
}

export default IconsState;

export { IconsState };
