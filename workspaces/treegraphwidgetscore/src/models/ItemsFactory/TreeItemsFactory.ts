import { getRootItem } from "../../utils/ItemUtils";
import { Item } from "../Item";
import { ItemLayout } from "../ItemLayout";
import ItemsFactory from "./ItemsFactory";
import { ObjectItem, ListAttributeValue, ListWidgetValue } from "mendix";

export default abstract class TreeItemsFactory extends ItemsFactory {
    abstract override setXValues(currentItems: Item[], itemLayout: ItemLayout, widgetType: string): Item[];
    abstract override setYValues(itemLayout: ItemLayout, widgetType: string): Item[];
    abstract override sortItems(): Item[];

    override createItems(
        items: ObjectItem[],
        selfAttribute: ListAttributeValue,
        _columnAttribute: ListAttributeValue | undefined,
        hasFocusAttribute: ListAttributeValue,
        boxContent: ListWidgetValue,
        parentAttribute?: ListAttributeValue,
        showsChildrenAttribute?: ListAttributeValue
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

    /**
     * Sets the children array for Items based on the parent definition.
     *
     * If we have a Item[] with A, B and C and B and C have A as a parent, the list of children for A will become [B, C]
     *
     * @param items Item[] to be processed
     * @returns { itemTree: Item[], depth: number } with the processed items and the depth of the tree
     */
    override setChildren(widgetType: string): Item[] {
        const rootItems = getRootItem(this.items);

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
