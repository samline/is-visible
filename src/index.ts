export interface IsVisibleOptions {
	inOut?: boolean;
	visible?: () => void;
	notVisible?: () => void;
	options?: IntersectionObserverInit;
	once?: boolean;
}

export default function isVisible(
	element: Element,
	{
		inOut = false,
		visible = () => {},
		notVisible = () => {},
		options = {},
		once = false,
	}: IsVisibleOptions = {},
) {
	const callback = (entries: IntersectionObserverEntry[]) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				visible();

				if (once) {
					observer.unobserve(entry.target);
				}

				return;
			}

			if (inOut) {
				notVisible();
			}
		});
	};

	const config: IntersectionObserverInit = {
		root: null,
		rootMargin: '0% 0% 0% 0%',
		threshold: 0,
		...options,
	};

	const observer = new IntersectionObserver(callback, config);

	observer.observe(element);

	return () => observer.disconnect();
}