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
        widgetType: string,
        parentAttribute?: ListAttributeValue,
        showsChildrenAttribute?: ListAttributeValue,
        columnAttribute?: ListAttributeValue,
        edgeObjectItems?: ObjectItem[],
        edgeParent?: ListAttributeValue,
        edgeChild?: ListAttributeValue,
    ) {
        super(
            objectItems,
            selfAttribute,
            hasFocusAttribute,
            boxContent,
            widgetType,
            parentAttribute,
            showsChildrenAttribute,
            columnAttribute);
        this.edges = this.createEdges(edgeObjectItems, edgeParent, edgeChild);
    }

    abstract override setXValues(currentItems: Item[], itemLayout: ItemLayout, widgetType: string): Item[];
    abstract override setYValues(itemLayout: ItemLayout, widgetType: string): Item[];
    abstract override sortItems(): Item[];

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

    override setChildren(_widgetType: string, edges: Edge[]): Item[] {
        const itemsWithChildren = [...this.items];
        edges.forEach(edge => {
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
