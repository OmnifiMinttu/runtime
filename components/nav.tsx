/**
 * Options for setting a navigation element.
 */
type NavigationProperties = {
	/**
	 * Title of the navigation component.
	 */
	title?: string;
	/**
	 * Navigable items in the navigation component.
	 */
	items: NavigationItemProperties[];
};

/**
 * Options for a navigation item.
 */
type NavigationItemProperties = {
	/**
	 * Destination href for the navigation item.
	 */
	href: string;
	/**
	 * Unique key for the navigation item.
	 */
	key: string;
	/**
	 * Title of the navigation item.
	 */
	title: string;
};

/**
 * Navigation component (`<nav />`) with navigable items and optional
 * artifacts, including a title.
 *
 * @param properties Options for configuring the navigation component.
 * @returns A <nav /> HTML element with navigable items.
 */
function NavigationComponent(properties: NavigationProperties) {
	return (
		<nav>
			{properties.title &&
				(
					<header>
						<span>
							{properties.title}
						</span>
					</header>
				)}
			<ul>
				{properties.items.map((navItem) => {
					return NavigationItem(navItem);
				})}
			</ul>
		</nav>
	);
}

/**
 * Navigable item in the navigation element, structured around a list item (`<li />`).
 *
 * @param properties Options to configure the navigable list item.
 * @returns
 */
function NavigationItem(properties: NavigationItemProperties) {
	return (
		<li key={properties.key}>
			<a href={properties.href}>
				<span>{properties.title}</span>
			</a>
		</li>
	);
}

export {
	NavigationComponent,
	type NavigationItemProperties,
	type NavigationProperties,
};
