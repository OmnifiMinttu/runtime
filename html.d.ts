export {};

// deno-lint-ignore no-unused-vars
import { JSX } from 'preact';

declare module 'preact' {
	namespace JSX {
		interface DOMAttributes<Target extends EventTarget> {
			color?: string;
		}
	}
}
