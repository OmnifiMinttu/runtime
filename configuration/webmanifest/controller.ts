import ConfigurationStore from '../store.ts';
import { resolve } from '@std/path';
import { WebManifest } from './webmanifest.ts';

/**
 * Loads the web manifest and uses it to provide sensible defaults for the application.
 *
 * @param path Path of the web manifest file.
 */
const loadManifest = async () => {
	const manifestURL = new URL(
		resolve(ConfigurationStore.context.path),
		import.meta.url,
	);
	const manifestFetchResponse = await fetch(manifestURL);
	const webManifest = await manifestFetchResponse.json() as WebManifest;

	return webManifest;
};

export { loadManifest };
