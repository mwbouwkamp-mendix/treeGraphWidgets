import { ObjectItem, ListAttributeValue, ListWidgetValue } from "mendix";
import { Edge } from "../Edge";
import { Item } from "../Item";
import { ItemLayout } from "../ItemLayout";
import ItemsFactory from "./ItemsFactory";

export default abstract class GraphItemsFactory extends ItemsFactory {
    constructor(
        objectItems: ObjectItem[],
        selfAttribute: ListAttributeValue,
        hasFocusAttribute: ListAttributeValue,
        boxContent: ListWidgetValue,
        columnAttribute: ListAttributeValue,
        edgeObjectItems: ObjectItem[],
        edgeParent: ListAttributeValue,
        edgeChild: ListAttributeValue,
    ) {
        super();

        this.items = !objectItems
        ? []
        : this.createItems(
            objectItems,
            selfAttribute,
            hasFocusAttribute,
            boxContent,
            columnAttribute);
        this.edges = !edgeObjectItems
            ? [] 
            : this.createEdges(edgeObjectItems, edgeParent, edgeChild);
    }

    abstract override setXValues(currentItems: Item[], itemLayout: ItemLayout): Item[];
    abstract override setYValues(itemLayout: ItemLayout): Item[];
    abstract override sortItems(): Item[];

    createItems(
        items: ObjectItem[],
        selfAttribute: ListAttributeValue,
        hasFocusAttribute: ListAttributeValue,
        boxContent: ListWidgetValue,
        columnAttribute: ListAttributeValue | undefined,
    ): Item[] {
        if (!items) {
            throw Error("No items found");
        }
        return items.map(item => {
            return {
                id: selfAttribute.get(item).displayValue,
                // id: selfAttribute.get(item).displayValue + Math.round(Math.random() * 1000000),
                widgetContent: boxContent.get(item),
                self: selfAttribute.get(item).displayValue,
                parent: undefined,
                children: null,
                item,
                level: columnAttribute ? parseInt(columnAttribute.get(item).displayValue, 10) : 0,
                y: 0,
                x: 0,
                isRoot: !parent,
                hasFocus: hasFocusAttribute.get(item).value === true,
                showsChildren: undefined
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

    override setChildren(): Item[] {
        const itemsWithChildren = [...this.items];
        this.edges.forEach(edge => {
            const parentItem = this.items.find(item => item.self === edge.parent);
            if (!parentItem) {
                return;
            }

            const childItem = this.items.find(item => item.self === edge.child);
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
