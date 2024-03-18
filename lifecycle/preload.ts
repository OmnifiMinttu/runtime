import AssetsController from '../cache/controller.ts';
import EnvironmentMiddleware from '../environment/middleware.ts';
import { DataManager, DataSyncSubscriber, SyncRule } from '../data/manager.ts';

/**
 * A request structure for synchronization rules of local data storage.
 */
type SyncRuleRequest = {
	/**
	 * Name of the rule. This is used as a unique identifier for key-value in-memory storage,
	 * as well as the local folder name where the data will be cached.
	 */
	name: string;
	/**
	 * Rule by which the data should be synchronized.
	 */
	rule: SyncRule;
	/**
	 * An optional subscriber that will be notified when data is re-synchronized locally.
	 */
	subscriber?: DataSyncSubscriber;
};

/**
 * Options to use when preloading the application.
 */
interface PreloadOptions {
	/**
	 * The preloaded synchronization rules to use before the application appears.
	 */
	syncRules?: SyncRuleRequest[];
}

/**
 * Preloads the application ensuring the data is where it should be before any in-process
 * tasks are run, such as rendering.
 *
 * @param options Preload options to use, including synchronization rules.
 */
async function preload(options?: PreloadOptions) {
	if (options?.syncRules) {
		await options.syncRules.forEach((rule) => {
			DataManager.instance().addSyncRule(
				rule.name,
				rule.rule,
				rule.subscriber,
			);
		});
	}

	await preloadEnvironment();
	await preloadAssets();
}

/**
 * Preloads the environment for the application.
 */
async function preloadEnvironment() {
	await EnvironmentMiddleware.init();
}

/**
 * Preloads the required assets to run the application.
 */
async function preloadAssets() {
	await AssetsController.instance();
}

export { preload, type PreloadOptions, type SyncRuleRequest };
