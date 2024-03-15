import { ItemLayout } from "../../models/ItemLayout";
import { ListAttributeValue, ObjectItem, ListWidgetValue } from "mendix";
import { Item } from "../../models/Item";
import { Edge } from "../../models/Edge";
// import { FocusedItem } from "../models/FocusedItem";

export default abstract class ItemsFactory {
    items: Item[];
    edges: Edge[];

    constructor(
        objectItems: ObjectItem[],
        selfAttribute: ListAttributeValue,
        hasFocusAttribute: ListAttributeValue,
        boxContent: ListWidgetValue,
        parentAttribute?: ListAttributeValue,
        showsChildrenAttribute?: ListAttributeValue,
        columnAttribute?: ListAttributeValue,
    ) {
        this.items = !objectItems
            ? []
            : this.createItems(
                objectItems,
                selfAttribute,
                columnAttribute,
                hasFocusAttribute,
                boxContent,
                parentAttribute,
                showsChildrenAttribute
            );
        this.edges = [];
    }

    execute(
        currentItems: Item[],
        itemLayout: ItemLayout,
        widgetType: string,
        hasChildren?: ListAttributeValue
    ): Item[] {
        this.items = this.setChildren(widgetType, this.edges);

        if (hasChildren) {
            // Not yet supported by Mendix: Widget [WIDGET] is attempting to call "setValue". This operation is not yet supported on attributes linked to a datasource.
            //     setHasChildren(items, hasChildren);
        }

        this.items = this.setXValues(currentItems, itemLayout, widgetType);
        this.items = this.removeDummyItems();
        this.items = this.setYValues(itemLayout, widgetType);

        this.items = this.sortItems();

        return this.items;
    }

    abstract createItems(
        items: ObjectItem[],
        selfAttribute: ListAttributeValue,
        columnAttribute: ListAttributeValue | undefined,
        hasFocusAttribute: ListAttributeValue,
        boxContent: ListWidgetValue,
        parentAttribute?: ListAttributeValue,
        showsChildrenAttribute?: ListAttributeValue
    ): Item[];

    abstract setChildren(
        widgetType: string,
        edges?: Edge[]
    ): Item[];

    abstract setXValues(
        currentItems: Item[],
        itemLayout: ItemLayout,
        widgetType: string
    ): Item[];

    abstract setYValues(
        itemLayout: ItemLayout,
        widgetType: string
    ): Item[];

    abstract sortItems(): Item[];

    removeDummyItems(): Item[] {
        const dummies = this.items.filter(item => !item.item);
        this.items.filter(item => item.children && dummies.includes(item.children[0])).forEach(item => (item.children = []));
        return this.items.filter(item => !!item.item);
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
     * @param parent the parent Item to which childrend need to be added
     * @param items Item[] containing potential childeren
     * @returns Item[] of the child Items for the parent Item
     */
    addChildren(parent: Item): Item[] {
        let children = this.items.filter(item => item.parent === parent.self);

        // In case there are no children, a dummy child needs to be added for creating the correct horizontal spacing of the items
        if (children.length === 0 || !parent.showsChildren) {
            const dummy: Item = {
                id: Math.round(Math.random() * 1000000).toString(),
                widgetContent: null,
                self: Math.round(Math.random() * 1000000).toString(),
                parent: parent.self,
                children: null,
                item: null,
                level: parent.level,
                y: 0,
                x: 0,
                isRoot: false,
                hasFocus: false,
                showsChildren: false
            };
            children = [dummy];
        }

        children = children.map(child => {
            return { ...child, level: parent.level + 1 };
        });

        parent.children = children;

        return children;
    };
}