import DataManager, {
	DataSyncSubscriber,
} from '@minttu/runtime/data/manager.ts';
import { SyncRule } from '@minttu/runtime/data/manager.ts';
import { EnvironmentMiddleware } from '@minttu/runtime/environment/mod.ts';
import AssetsController from '../cache/controller.ts';
import ApplicationController, {
	ApplicationOptions,
} from '@minttu/runtime/application/controller.ts';

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
 * Initialization options for the application and it's co-dependencies.
 */
interface InitOptions {
	/**
	 * Application options to use when initializing.
	 */
	applicationOptions?: ApplicationOptions;
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

/**
 * Initializes the application and its co-dependencies with a set of (optionally) given options.
 * @param options Options used to configure the initialization of the application.
 */
async function init(options?: InitOptions) {
	await initApplication(options?.applicationOptions);
}

/**
 * Initializes the application with a set of (optionally) given options.
 * @param options Options used to configure the initialization of the application.
 */
async function initApplication(options?: ApplicationOptions) {
	await ApplicationController.init(options);
}

export {
	init,
	type InitOptions,
	preload,
	type PreloadOptions,
	type SyncRuleRequest,
};
