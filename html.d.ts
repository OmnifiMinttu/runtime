export {};

declare global {
	namespace JSX {
		interface IntrinsicElements {
			link: {
				color?: string
			}
		}
	}
}