/**
 * Options when instantiating the `ApplicationController` object.
 */
interface ApplicationOptions {
	/**
	 * Icon path to attempt an automatic loading of the application icon set.
	 *
	 * This will compare with the web manifest and update accordingly.
	 */
	iconsPath?: string;
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

export default ApplicationOptions;

export type { ApplicationOptions };
