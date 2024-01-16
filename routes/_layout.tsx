import { FreshContext } from '$fresh/server.ts';
import ApplicationMiddleware from '../application/middleware.ts';
import { FooterComponent } from '../components/footer.tsx';
import {
	HeaderComponent,
	HeaderLogoProperties,
} from '../components/header.tsx';
import {
	NavigationComponent,
	NavigationItemProperties,
	NavigationProperties,
} from '../components/nav.tsx';

/**
 * Provides the basic layout for each page as default.
 *
 * @param _request HTTP request object.
 * @param context Fresh context.
 *
 * @returns HTML for the layout of the page.
 */
async function Layout(_request: Request, context: FreshContext) {
	const application = await ApplicationMiddleware.instance();
	const primaryNavigation = await application.navigation.sections['primary'];

	const navigationItems = primaryNavigation.map((navigationItem) => {
		return {
			href: navigationItem.href ?? '',
			key: navigationItem.key,
			title: navigationItem.title,
		};
	});

	const footerNavProperties: NavigationProperties[] = application.navigation
		.sections['footer'].map((navigationItem) => {
			let subItems: NavigationItemProperties[] = [];

			if (navigationItem.items) {
				subItems = navigationItem.items.map((navigationItem) => {
					return {
						href: navigationItem.href ?? '',
						key: navigationItem.key,
						title: navigationItem.title,
					};
				});
			}

			return {
				title: navigationItem.title,
				key: navigationItem.key,
				items: subItems,
			};
		});

	const title = application.title;
	const logo = application.logo;

	const headerProperties = {
		logo: {
			href: logo.href,
			url: logo.url,
			content: logo.content,
			dimensions: logo.dimensions,
		},
		title: title,
	};

	return (
		<>
			<NavigationComponent
				items={navigationItems}
			/>
			<HeaderComponent logo={headerProperties.logo} title={title} />

			<main>
				<context.Component />
			</main>

			<FooterComponent
				header={headerProperties}
				navigation={footerNavProperties}
			/>
		</>
	);
}

export default Layout;

export { Layout };
