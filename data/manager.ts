import { copy, exists, existsSync } from '$std/fs/mod.ts';
import { resolve } from '$std/path/mod.ts';

/**
 * Synchronization rule for replicating external content into a local data store.
 */
interface SyncRule {
	/**
	 * Source path of the external data to be copied.
	 */
	sourcePath: string;
	/**
	 * Local path to be used as the data store destination.
	 */
	destinationPath?: string;
	/**
	 * File pattern to be used for the files to be copied.
	 */
	filePattern?: string;
}

/**
 * Watch structure connecting a SyncRule to a Deno file system watcher (FsWatcher).
 */
interface SyncWatch {
	/**
	 * SyncRule to be used to trigger the watcher. This is used to attach a listener to the
	 * change events and invoke a copy of the source content.
	 */
	rule: SyncRule;

	/**
	 * File system watcher for the source content.
	 */
	watcher: Deno.FsWatcher;
}

/**
 * Contract for the data synchronization subscribers.
 */
interface DataSyncSubscriber {
	/**
	 * Invoked when data is synchronized from an external source.
	 */
	updated(): void;
}

/**
 * Provides the functionality to pull data from external sources and synchronize in-memory at runtime.
 */
class DataManager {
	/**
	 * Returns the instance of the DataManager for storage and retrieval of content and application
	 * data at runtime.
	 *
	 * @returns An instance of the DataManager.
	 */
	static instance(): DataManager {
		if (!DataManager.#instance) {
			DataManager.#instance = new DataManager();
		}

		return DataManager.#instance;
	}

	/**
	 * The default storage path relative to the project.
	 */
	static readonly #defaultDataStoragePath = '.data';

	/**
	 * The instance of the DataManager used throughout the application.
	 */
	static #instance: DataManager;

	/**
	 * List of synchronization watch setups.
	 */
	#syncWatches: Record<string, SyncWatch> = {};

	/**
	 * Adds a synchronization rule to the DataManager.
	 *
	 * @param name The name given to the synchronization rule. For ease, this is often best suited
	 * by matching it against the destination folder.
	 * @param rule The rule for synchronization. Predominently used for matching a source and destination folder.
	 * @param subscriber The subscriber of to the rule. The runtime only supports a single subscriber.
	 */
	addSyncRule = async (
		name: string,
		rule: SyncRule,
		subscriber?: DataSyncSubscriber,
	) => {
		const watcher = Deno.watchFs(rule.sourcePath, { recursive: true });

		this.#syncWatches[name] = { rule: rule, watcher: watcher };

		await this.#syncStore(name);
		await subscriber?.updated();

		for await (const _event of watcher) {
			await this.#syncStore(name);
			await subscriber?.updated();
		}
	};

	/**
	 * Remove a synchronization rule from the DataManager.
	 *
	 * @param name The unique name of the rule.
	 */
	removeSyncRule = async (name: string) => {
		await this.#syncWatches[name].watcher.close();
		await delete this.#syncWatches[name];
	};

	/**
	 * Verifies whether the data store exists with a given name.
	 *
	 * @param name Name of the data store.
	 * @returns Boolean: true of the data store already exists in the destination store.
	 */
	storeExists = async (name: string) => {
		return await exists(resolve(DataManager.#defaultDataStoragePath, name));
	};

	/**
	 * Verifies whether the data store exists with a given name. Synchronous version
	 * of the original method.
	 *
	 * @param name Name of the data store.
	 * @returns Boolean: true of the data store already exists in the destination store.
	 */
	storeExistsSync = (name: string) => {
		return existsSync(resolve(DataManager.#defaultDataStoragePath, name));
	};

	/**
	 * Gets a data store with a given unique name.
	 *
	 * @param name Name of the data store to retrieve.
	 * @returns Rule path of the data store from the file system.
	 */
	// deno-lint-ignore require-await
	getStore = async (name: string) => {
		return resolve(DataManager.#defaultDataStoragePath, name);
	};

	/**
	 * Gets a data store with a given unique name. Synchronous version of the original method.
	 *
	 * @param name Name of the data store to retrieve.
	 * @returns Rule path of the data store from the file system.
	 */
	getStoreSync = (name: string) => {
		return resolve(DataManager.#defaultDataStoragePath, name);
	};

	/**
	 * Synchronizes a data store using the provided rule.
	 *
	 * @param name Name of the data store to synchronize.
	 */
	#syncStore = async (name: string) => {
		const destination = resolve(DataManager.#defaultDataStoragePath, name);

		if (await exists(destination)) {
			try {
				// TODO: consider debouncing the method to avoid attempted deletions
				// on a non-existent folder.
				await Deno.remove(destination, { recursive: true });
			} catch (error) {
				if (error! instanceof Deno.errors.NotFound) {
					throw error;
				}
			}
		}

		const source = resolve(this.#syncWatches[name].rule.sourcePath);
		await copy(source, destination, {
			overwrite: true,
		});
	};
}

export default DataManager;

export { DataManager, type DataSyncSubscriber, type SyncRule };
