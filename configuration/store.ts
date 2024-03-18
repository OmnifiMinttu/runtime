import { existsSync } from '$std/fs/mod.ts';
import { resolve } from '$std/path/mod.ts';
import {
	configurationPathVariable,
	defaultConfigurationPath,
} from './environment.ts';

/**
 * Store handler for the an application's configuration.
 */
class ConfigurationStore {
	/**
	 * Singleton context for the configuration store.
	 */
	static readonly context = new ConfigurationStore();

	/**
	 * Path where toe look fo rthe configuration.
	 */
	readonly path: string;

	/**
	 * Initializer for the `ConfigurationStore`.
	 */
	constructor() {
		this.path = Deno.env.get(configurationPathVariable) ??
			defaultConfigurationPath;

		const pathExists = existsSync(resolve(this.path));

		if (!pathExists) {
			throw new Error(
				`configuration path not set.\n\nTry export ${configurationPathVariable}=<configuration path>`,
			);
		}
	}
}

export default ConfigurationStore;

export { ConfigurationStore };
