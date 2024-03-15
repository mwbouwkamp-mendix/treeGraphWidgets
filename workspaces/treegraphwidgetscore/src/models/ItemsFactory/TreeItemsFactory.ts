import { getRootItem } from "../../utils/ItemUtils";
import { Item } from "../Item";
import { ItemLayout } from "../ItemLayout";
import ItemsFactory from "./ItemsFactory";
import { ObjectItem, ListAttributeValue, ListWidgetValue } from "mendix";

export default abstract class TreeItemsFactory extends ItemsFactory {
    constructor(
        objectItems: ObjectItem[],
        selfAttribute: ListAttributeValue,
        hasFocusAttribute: ListAttributeValue,
        boxContent: ListWidgetValue,
        parentAttribute: ListAttributeValue,
        showsChildrenAttribute: ListAttributeValue
    ) {
        super();
        this.items = !objectItems
        ? []
        : this.createItems(
            objectItems,
            selfAttribute,
            hasFocusAttribute,
            boxContent,
            parentAttribute,
            showsChildrenAttribute
       );
    }

    abstract override setXValues(currentItems: Item[], itemLayout: ItemLayout): Item[];
    abstract override setYValues(itemLayout: ItemLayout): Item[];
    abstract override sortItems(): Item[];

    createItems(
        items: ObjectItem[],
        selfAttribute: ListAttributeValue,
        hasFocusAttribute: ListAttributeValue,
        boxContent: ListWidgetValue,
        parentAttribute: ListAttributeValue,
        showsChildrenAttribute: ListAttributeValue
    ): Item[] {
        if (!items) {
            throw Error("No items found");
        }
        return items.map(item => {
            const parent = parentAttribute?.get(item).displayValue || undefined;

            return {
                id: selfAttribute.get(item).displayValue,
                // id: selfAttribute.get(item).displayValue + Math.round(Math.random() * 1000000),
                widgetContent: boxContent.get(item),
                self: selfAttribute.get(item).displayValue,
                parent,
                children: null,
                item,
                level: 0,
                y: 0,
                x: 0,
                isRoot: !parent,
                hasFocus: hasFocusAttribute.get(item).displayValue === "Yes",
                showsChildren: showsChildrenAttribute?.get(item).displayValue === "Yes" || undefined
            };
        }) as Item[];
    }

    override setChildren(): Item[] {
        return this.setChildrenBase(false);
    }

    /**
     * Sets the children array for Items based on the parent definition.
     *
     * If we have a Item[] with A, B and C and B and C have A as a parent, the list of children for A will become [B, C]
     *
     * @param items Item[] to be processed
     * @returns { itemTree: Item[], depth: number } with the processed items and the depth of the tree
     */
    setChildrenBase(isForest: boolean): Item[] {
        const rootItems = getRootItem(this.items);

        if (rootItems.length === 0) {
            return [];
        }

        let processedItems = isForest 
            ? [...rootItems]
            : [rootItems[0]];

        let toProcess = isForest
            ? [...rootItems]
            : [rootItems[0]];

        let depth = 0;

        while (toProcess.length > 0) {
            if (this.hasOnlyDummies(toProcess)) {
                return [
                    ...processedItems,
                    // eslint-disable-next-line no-loop-func
                    ...toProcess.filter(item => item.level <= depth).flatMap(item => this.addChildren(item))
                ];
            }

            const currentParent = toProcess.shift()!;

            if (currentParent.level > depth) {
                depth++;
            }

            const children = this.addChildren(currentParent);

            toProcess = [...toProcess, ...children];
            processedItems = [...processedItems, ...children];
        }

        return processedItems;
    };
}
