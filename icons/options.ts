/**
 * Options when instantiating the managing icons within the application.
 */
interface IconsOptions {
	/**
	 * Options for application icons.
	 */
	applicationIcons?: ApplicationIconsOptions;
}

/**
 * Options when handling application icons.
 */
interface ApplicationIconsOptions {
	/**
	 * Icon path to attempt an automatic loading of the application icon set.
	 *
	 * This will compare with the web manifest and update accordingly.
	 */
	path?: string;
}

export default IconsOptions;

export { type ApplicationIconsOptions, type IconsOptions };
