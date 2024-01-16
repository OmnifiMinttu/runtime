/**
 * Navigation structure with navigation sections for use across
 * an application.
 */
interface Navigation {
	sections: Record<string, NavigationItem[]>;
}

/**
 * Navigable item, including sub-items.
 */
interface NavigationItem {
	/**
	 * Destination of the navigable item.
	 */
	href?: string;
	/**
	 * Unique key for the navigation item.
	 */
	key: string;
	/**
	 * Title of the navigation item.
	 */
	title: string;
	/**
	 * Sub-items of the navigation item.
	 */
	items?: NavigationItem[];
}

export default Navigation;

export { type Navigation, type NavigationItem };
