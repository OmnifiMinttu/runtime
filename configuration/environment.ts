/**
 * Environment variable name for the source of the application configuration.
 *
 * It is typically that this is overridden by the application implementation.
 */
const configurationPathVariable = 'MINTTU_CONFIGURATION_PATH';

/**
 * Default location to look for the configuration folder if the environment variable is not set.
 */
const defaultConfigurationPath = './configuration';

export { configurationPathVariable, defaultConfigurationPath };
