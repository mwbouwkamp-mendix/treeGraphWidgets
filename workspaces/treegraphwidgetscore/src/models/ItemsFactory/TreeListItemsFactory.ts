import ItemsFactory from "./ItemsFactory";
import { Edge } from "../Edge";
import { Item } from "../Item";
import { ItemLayout } from "../ItemLayout";
import { getRootItem } from "../../utils/ItemUtils";

export default class TreeListItemsFactory extends ItemsFactory {
    override setChildren(
        _edges: Edge[],
        widgetType: string
    ): Item[] {
        return this.setChildrenTree(widgetType);
    }

    /**
     * Sets x for all Items based on their position in the tree
     *
     * @param items Items[] to be processed
     * @param dimensions Dimensions with information about element width, height and horizontal and vertical spacing
     * @returns Item[], the updated items
     */
    override setXValues(
        _currentItems: Item[],
        itemLayout: ItemLayout,
        _widgetType: string
    ): Item[] {
        return this.items.map(item => {
            item.x = itemLayout.horizontalSpacing * item.level;
            return item;
        });
    };

    override setYValues(
        _itemLayout: ItemLayout,
        _widgetType: string
    ): Item[] {
        return this.items
    }
    /**
     * Sorts the list of items, for correct representation of the items in the tree (children righ beneight their parent)
     * @param items the Item[] to sort
     * @returns sorted Item[]
     */
    override sortItems(): Item[] {
        const rootItem = getRootItem(this.items);

        let toProcess = [...rootItem];
        let processedItems = [] as Item[];

        while (toProcess.length > 0) {
            const currentItem = toProcess.shift()!;

            if (currentItem.children) {
                toProcess = [...currentItem.children, ...toProcess];
            }
            processedItems = [...processedItems, currentItem];
        }

        return processedItems;
    };

}