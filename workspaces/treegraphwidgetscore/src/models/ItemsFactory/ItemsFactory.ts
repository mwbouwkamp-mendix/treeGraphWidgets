import { ItemLayout } from "../../models/ItemLayout";
import { Item } from "../../models/Item";
import { Edge } from "../../models/Edge";

export default abstract class ItemsFactory {
    protected items: Item[];
    protected edges: Edge[];

    constructor() {
        this.items = [];
        this.edges = [];
    }

    execute(
        currentItems: Item[],
        itemLayout: ItemLayout,
        widgetType: string
    ): Item[] {
        this.items = this.setChildren(widgetType);
        this.items = this.setXValues(currentItems, itemLayout);
        this.items = this.removeDummyItems();
        this.items = this.setYValues(itemLayout);
        this.items = this.sortItems();

        return this.items;
    }

    abstract setChildren(
        widgetType: string,
    ): Item[];

    abstract setXValues(
        currentItems: Item[],
        itemLayout: ItemLayout,
    ): Item[];

    abstract setYValues(
        itemLayout: ItemLayout
    ): Item[];

    abstract sortItems(): Item[];

    removeDummyItems(): Item[] {
        const dummies = this.items.filter(item => !item.item);
        this.items
            .filter(item => item.children && dummies.includes(item.children[0]))
            .forEach(item => (item.children = []));
        return this.items
            .filter(item => !!item.item);
    };

    /**
     * Checks if an array of Items is not only consisting of dummy Items.
     * An Item is a dummy item when parent.item is undefined
     *
     * @param items Item[] for which the dummy check needs to be performed
     * @returns true if all Items are dummy Items
     */
    hasOnlyDummies(items: Item[]): boolean {
        return items.filter(parent => parent.item).length === 0;
    };

    /**
     * Adds all children Items to a parent Item.
     *
     * If no children can be found in the array of Items provided, a single dummy Item is added as a child Item. This is required later on,
     * when the x-position of the Items is set. For this, the lowest level of the breakdown structure needs to have an Item for each branch
     *
     * @param item the parent Item to which childrend need to be added
     * @returns Item[] of the child Items for the parent Item
     */
    addChildren(parentItem: Item): Item[] {
        let children = this.items.filter(item => item.parent === parentItem.self);

        // In case there are no children, a dummy child needs to be added for creating the correct horizontal spacing of the items
        if (children.length === 0 || !parentItem.showsChildren) {
            const dummy: Item = {
                id: Math.round(Math.random() * 1000000).toString(),
                widgetContent: null,
                self: Math.round(Math.random() * 1000000).toString(),
                parent: parentItem.self,
                children: null,
                item: null,
                level: parentItem.level,
                y: 0,
                x: 0,
                isRoot: false,
                hasFocus: false,
                showsChildren: false
            };
            children = [dummy];
        }

        children = children.map(child => {
            return { ...child, level: parentItem.level + 1 };
        });

        parentItem.children = children;

        return children;
    };
}