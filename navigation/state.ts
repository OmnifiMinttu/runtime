import { basename, extname, resolve } from '@std/path';
import { ConfigurationStore } from '../configuration/mod.ts';
import Navigation, { NavigationItem } from './navigation.ts';

/**
 * Navigation state for an application process.
 */
class NavigationState {
	static #context: NavigationState;

	/**
	 * The application navigation sections, including the primary ("primary") navigation and the footer
	 * ("footer") navigation.
	 */
	navigation: Navigation = { sections: {} };

	/**
	 * Fetches the navigation state information for the application.
	 *
	 * @returns A promise with a `Navigation` structure.
	 */
	static async fetchNavigation(): Promise<Navigation> {
		if (!NavigationState.#context) {
			NavigationState.#context = new NavigationState();

			const configurationPath = resolve(
				ConfigurationStore.context.path,
				'navigation',
			);

			NavigationState.#context.navigation = await loadNavigation(
				configurationPath,
			);
		}

		return NavigationState.#context.navigation;
	}
}

/**
 * Loads the navigation sections and uses them to populate the primary and footer navigation.
 *
 * @param path Path of the navigation configurations.
 */
const loadNavigation = async (path: string) => {
	const navigationDirectory = await Deno.readDir(path);

	const navigation: Navigation = { sections: {} };

	for await (const content of navigationDirectory) {
		if (content.isFile) {
			const navigationFilePath = resolve(path, content.name);
			const navigationFetchResponse = await fetch(
				new URL(navigationFilePath, import.meta.url),
			);
			const navigationFileContent: NavigationItem[] =
				await navigationFetchResponse.json();
			navigation
				.sections[basename(content.name, extname(content.name))] =
					navigationFileContent;
		}
	}

	return navigation;
};

export default NavigationState;

export { loadNavigation, NavigationState };
