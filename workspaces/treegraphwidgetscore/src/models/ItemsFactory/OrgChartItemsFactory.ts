import ItemsFactory from "./ItemsFactory";
import { Edge } from "../Edge";
import { Item } from "../Item";
import { getFocussedItemProps } from "../../utils/ItemUtils";
import { ItemLayout } from "../ItemLayout";


export default class OrgChartItemsFactory extends ItemsFactory {
    override setChildren(
        _edges: Edge[],
        widgetType: string
    ): Item[] {
        return this.setChildrenTree(widgetType);
    }

    /**
     * Sets x for all Items based on their position in the organogram
     *
     * @param items Items[] to be processed
     * @param dimensions Dimensions with information about element width, height and horizontal and vertical spacing
     * @returns Item[], the updated items
     */
    override setXValues(
        currentItems: Item[],
        itemLayout: ItemLayout,
        _widgetType: string
    ): Item[] {
        const depth = Math.max(...this.items.map(item => item.level));

        const levels = [...Array(depth + 1).keys()].map(i => [...this.items].filter(item => item.level === i)).reverse();

        const itemsWithXValues = levels.flatMap((level, levelIndex) => {
            if (levelIndex === 0) {
                return this.setXValuesBottom(level, itemLayout);
            }
            return this.setXValuesNonBottom(level);
        });

        const focusedItemProps = getFocussedItemProps(currentItems);

        const currentFocus = currentItems.find(item => item.id === focusedItemProps.id);
        const itemsFocus = this.items.find(item => item.id === focusedItemProps.id);

        if (currentFocus && itemsFocus) {
            const deltaX = currentFocus.x - itemsFocus.x;
            itemsWithXValues.forEach(item => (item.x += deltaX));
        }

        return itemsWithXValues;
    };

    /**
     * Sets x for all Items for the bottom level
     *
     * @param level the level (Item[]) for which to set the x values
     * @returns Item[], the updated items
     */
    private setXValuesBottom(
        level: Item[],
        itemLayout: ItemLayout
    ): Item[] {
        return level.reduce((accumulator, item, itemIndex) => {
            if (itemIndex === 0) {
                return [item];
            }
            const prevItem = accumulator[accumulator.length - 1];
            const spacer = this.isSameHorizontalGroup(item, prevItem, this.items)
                ? itemLayout.horizontalSpacing
                : itemLayout.horizontalSpacing * itemLayout.horizontalSpacingFactor;

            item.x = accumulator[accumulator.length - 1].x + spacer + itemLayout.elementWidth;

            return [...accumulator, item];
        }, [] as Item[]);
    };

    /**
     * Checks if two Items belong to the same horizontal group. Items belong to the same horizontal group if the first branching
     * parent for both of them are the same
     *
     * @param firstItem the first item
     * @param secondItem the second item
     * @param items the Item[] that represents the tree
     * @returns true if the two Items share the same parent
     */
    private isSameHorizontalGroup(firstItem: Item, secondItem: Item, items: Item[]): boolean {
        const firstBranchingParent = this.getFirstBranchingParent(firstItem, items);
        if (!firstBranchingParent) {
            return false;
        }

        const secondBranchingParent = this.getFirstBranchingParent(secondItem, items);
        if (!secondBranchingParent) {
            return false;
        }

        return firstBranchingParent === secondBranchingParent;
    };

    /**
     * Recursively gets the parent, untill its finds a branching parent
     *
     * @param item the Item for which to get the branching parent
     * @param items the Item[] that represents the tree
     * @returns the branching parent Item
     */
    private getFirstBranchingParent(item: Item, items: Item[]): Item | undefined {
        const parent = items.find(itemFind => itemFind.self === item.parent);
        if (!parent) {
            return undefined;
        }

        if (parent.children && parent.children.length > 1) {
            return parent;
        }

        return this.getFirstBranchingParent(parent, items);
    };

    /**
             * Sets x for all Items for a level that is not the bottom level
             *
             * @param level the level (Item[]) for which to set the x values
             * @returns Item[], the updated items
             */
    private setXValuesNonBottom(level: Item[]): Item[] {
        return level.map(item => {
            const xValuesChildren = item.children!.map(child => child.x);
            item.x = (Math.min(...xValuesChildren) + Math.max(...xValuesChildren)) / 2;
            return item;
        });
    };

    /**
     *
     * @param items Sets y values for all Items based on their position in the organogram
     * @param dimensions Dimensions with information about element width, height and horizontal and vertical spacing
     * @returns Item[], the updated items
     */
    override setYValues(
        itemLayout: ItemLayout,
        _widgetType: string
    ): Item[] {
        return this.items.map(item => {
            item.y = item.level * (itemLayout.elementHeight + itemLayout.verticalSpacing);
            return item;
        });
    };

    override sortItems(): Item[] {
        return this.items;
    }
}