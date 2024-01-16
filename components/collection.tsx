import { JSX } from 'preact/jsx-runtime';

/**
 * Properties for creating a collection component (`<section class='collection'>...`).
 */
interface CollectionProperties<CollectionType> {
    /**
     * Properties of the header banner for the collection.
     */
    header?: {
        /**
         * Title of the header banner.
         */
        title?: string;
    };
    /**
     * List of items in the collection.
     */
    items: CollectionType[];
};

/**
 * Collection component for presenting multiple identically classified items in a list.
 * 
 * @param properties Properties for setting up the collection, including the list items.
 * @returns The HTML element structuring the collection.
 */
function Collection<CollectionType>(properties: CollectionProperties<CollectionType>) {
    const itemComponentList = Array<JSX.Element>();

    properties.items.forEach(item => {
        itemComponentList.push(<li></li>);
    });

	return (
		<>
            <section class='collection'>
                {properties.header?.title &&
                    <header>
                        {properties.header.title}
                    </header>
                }
                <ul class='items'>
                    {itemComponentList}
                </ul>
		    </section>
        </>
	);
}

export {
    type CollectionProperties,
    Collection
}
