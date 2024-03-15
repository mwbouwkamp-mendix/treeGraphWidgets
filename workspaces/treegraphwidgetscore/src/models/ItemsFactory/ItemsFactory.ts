import { ItemLayout } from "../../models/ItemLayout";
import { ListAttributeValue, ObjectItem, ListWidgetValue } from "mendix";
import { Item } from "../../models/Item";
import { Edge } from "../../models/Edge";
// import { FocusedItem } from "../models/FocusedItem";

export default abstract class ItemsFactory {
    constructor() {
    }

    execute(
        currentItems: Item[],
        objectItems: ObjectItem[],
        selfAttribute: ListAttributeValue,
        hasFocusAttribute: ListAttributeValue,
        boxContent: ListWidgetValue,
        itemLayout: ItemLayout,
        widgetType: string,
        edgeObjectItems?: ObjectItem[],
        parentAttribute?: ListAttributeValue,
        edgeParent?: ListAttributeValue,
        edgeChild?: ListAttributeValue,
        showsChildrenAttribute?: ListAttributeValue,
        columnAttribute?: ListAttributeValue,
        hasChildren?: ListAttributeValue
    ): Item[] {
        if (!objectItems) {
            return [];
        }

        let items = this.createItems(
            objectItems,
            selfAttribute,
            columnAttribute,
            hasFocusAttribute,
            boxContent,
            widgetType,
            parentAttribute,
            showsChildrenAttribute
        );

        const edges = this.createEdges(edgeObjectItems, edgeParent, edgeChild);

        items = this.setChildren(items, edges, widgetType);

        if (hasChildren) {
            // Not yet supported by Mendix: Widget [WIDGET] is attempting to call "setValue". This operation is not yet supported on attributes linked to a datasource.
            //     setHasChildren(items, hasChildren);
        }

        items = this.setXValues(currentItems, items, itemLayout, widgetType);
        items = this.removeDummyItems(items);
        items = this.setYValues(items, itemLayout, widgetType);

        items = this.sortItems(items);
        
        return items;
    }

    createItems(
        items: ObjectItem[],
        selfAttribute: ListAttributeValue,
        columnAttribute: ListAttributeValue | undefined,
        hasFocusAttribute: ListAttributeValue,
        boxContent: ListWidgetValue,
        widgetType: string,
        parentAttribute?: ListAttributeValue,
        showsChildrenAttribute?: ListAttributeValue
    ): Item[] {
        if (!items) {
            throw Error("No items found");
        }
        return items.map(item => {
            const parent = widgetType === "pert" ? undefined : parentAttribute?.get(item).displayValue || undefined;
            const showsChildren =
                widgetType === "pert" ? undefined : showsChildrenAttribute?.get(item).displayValue === "Yes" || undefined;

            const column =
                widgetType === "pert" ? (columnAttribute ? parseInt(columnAttribute.get(item).displayValue, 10) : 0) : 0;
            return {
                id: selfAttribute.get(item).displayValue,
                // id: selfAttribute.get(item).displayValue + Math.round(Math.random() * 1000000),
                widgetContent: boxContent.get(item),
                self: selfAttribute.get(item).displayValue,
                parent,
                children: null,
                item,
                level: column,
                y: 0,
                x: 0,
                isRoot: !parent,
                hasFocus: hasFocusAttribute.get(item).displayValue === "Yes",
                showsChildren
            };
        }) as Item[];
    }

    createEdges(
        edgeObjectItems: ObjectItem[] | undefined,
        parentAtrribute: ListAttributeValue | undefined,
        childAtrribute: ListAttributeValue | undefined
    ): Edge[] {
        if (!edgeObjectItems || !parentAtrribute || !childAtrribute) {
            return [];
        }

        return edgeObjectItems
            .map(edge => {
                return {
                    parent: parentAtrribute.get(edge).displayValue,
                    child: childAtrribute.get(edge).displayValue
                };
            })
            .filter(edge => !!edge.child && !!edge.parent);
    }

    abstract setChildren(
        items: Item[],
        edges: Edge[],
        widgetType: string
    ): Item[];

    abstract setXValues(
        currentItems: Item[],
        items: Item[],
        itemLayout: ItemLayout,
        widgetType: string
    ): Item[];

    abstract setYValues(
        items: Item[],
        itemLayout: ItemLayout,
        widgetType: string
    ): Item[];

    abstract sortItems(
        items: Item[]
    ): Item[];

    removeDummyItems(items: Item[]): Item[] {
        const dummies = items.filter(item => !item.item);
        items.filter(item => item.children && dummies.includes(item.children[0])).forEach(item => (item.children = []));
        return items.filter(item => !!item.item);
    };

    /**
     * Sets the children array for Items based on the parent definition.
     *
     * If we have a Item[] with A, B and C and B and C have A as a parent, the list of children for A will become [B, C]
     *
     * @param items Item[] to be processed
     * @returns { itemTree: Item[], depth: number } with the processed items and the depth of the tree
     */
    setChildrenTree(items: Item[], widgetType: string): Item[] {
        const rootItems = this.getRootItem(items);

        if (rootItems.length === 0) {
            return [];
        }

        let processedItems = [] as Item[];
        let toProcess = [] as Item[];

        switch (widgetType) {
            case "tree":
                processedItems = [...rootItems];
                toProcess = [...rootItems];
                break;
            case "organogram":
                processedItems = [rootItems[0]];
                toProcess = [rootItems[0]];
                break;
            default:
                throw new Error("Unsupported widget type: " + widgetType);
        }

        let depth = 0;

        while (toProcess.length > 0) {
            if (this.hasOnlyDummies(toProcess)) {
                return [
                    ...processedItems,
                    // eslint-disable-next-line no-loop-func
                    ...toProcess.filter(item => item.level <= depth).flatMap(item => this.addChildren(item, items))
                ];
            }

            const currentParent = toProcess.shift()!;

            if (currentParent.level > depth) {
                depth++;
            }

            const children = this.addChildren(currentParent, items);

            toProcess = [...toProcess, ...children];
            processedItems = [...processedItems, ...children];
        }

        return processedItems;
    };

    /**
     * Returns a root Item from an array of Items. When the array of Items contains more than one root item, the first one will be returned
     * An Item is a root Item if it has no parent (parents === "")
     *
     * @param items Items[] from which the root needs to be found
     * @returns The first root Item
     */
    private getRootItem(items: Item[]): Item[] {
        return items.filter(item => !item.parent);
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
    addChildren(parent: Item, items: Item[]): Item[] {
        let children = items.filter(item => item.parent === parent.self);

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

    setChildrenGraph(items: Item[], edges: Edge[]): Item[] {
        const itemsWithChildren = [...items];
        edges.forEach(edge => {
            const parentItem = items.find(item => item.self === edge.parent);
            if (!parentItem) {
                return;
            }

            const childItem = items.find(item => item.self === edge.child);
            if (!childItem) {
                return;
            }

            const currentChildren = parentItem.children;
            if (currentChildren) {
                parentItem.children = [...currentChildren, childItem];
            } else {
                parentItem.children = [childItem];
            }

            childItem.parent = parentItem.self;
        });
        return itemsWithChildren;
    };

}