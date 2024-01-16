import { Navigation } from '../navigation/mod.ts';
import ApplicationLogo from './logo.ts';

/**
 * A representation of a web application that is used across various web APIs
 * to provide a consistent resource for a single web application.
 */
interface Application {
	/**
	 * Navigation sections across the root web application.
	 */
	navigation: Navigation;

	/**
	 * Root title of the web application. This will be used in the
	 * web manifest, root meta title, and any additional meta resources.
	 */
	title: string;

	/**
	 * Main application logo.
	 */
	logo: ApplicationLogo;
}

export default Application;

export { type Application };
