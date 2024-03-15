import { Item } from "../Item";
import { ItemLayout } from "../ItemLayout";
import { getParentItems } from "../../utils/ItemUtils";
import GraphItemsFactory from "./GraphItemsFactory";

export default class PertChartItemsFactory extends GraphItemsFactory {

    /**
     * Sets x for all Items based on their position in the pert
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
            item.x = item.level * (itemLayout.elementWidth + itemLayout.horizontalSpacing);
            return item;
        });
    };

    /**
     *
     * @param items Sets y values for all Items based on their position in the pert diagram
     * @param dimensions Dimensions with information about element width, height and horizontal and vertical spacing
     * @returns Item[], the updated items
     */
    override setYValues(
        itemLayout: ItemLayout,
        _widgetType: string
    ): Item[] {
        // const itemsByLevel = items.sort((a, b) => a.level - b.level);

        const minLevel = this.items.map(item => item.level).reduce((a: number, b: number) => (b < a ? b : a), Number.MAX_VALUE);
        const maxLevel = this.items.map(item => item.level).reduce((a: number, b: number) => (b > a ? b : a), Number.MIN_VALUE);

        const zeroLevelItems = this.items.filter(item => item.level === minLevel);

        const otherLevelItems = this.items.filter(item => !zeroLevelItems.includes(item));

        let currentY = 0;

        zeroLevelItems.map(item => {
            item.y = currentY;
            currentY += itemLayout.elementHeight + itemLayout.verticalSpacing;
            return item;
        });

        for (let i = minLevel + 1; i <= maxLevel; i++) {
            currentY = Number.MIN_VALUE;
            const levelItems = otherLevelItems.filter(item => item.level === i);
            while (levelItems.length > 0) {
                const currentItem = levelItems.shift()!;
                const parents = getParentItems(currentItem, this.items);
                currentItem.y =
                    parents.length > 0 ? parents.map(parent => parent.y).reduce((a, b) => a + b, 0) / parents.length : 0;
                if (currentY !== Number.MIN_VALUE && currentItem.y <= currentY) {
                    currentItem.y = currentY + itemLayout.elementHeight + itemLayout.verticalSpacing;
                }
                currentY = currentItem.y;
            }
        }

        for (let i = minLevel + 1; i <= maxLevel; i++) {
            const levelItems = otherLevelItems.filter(item => item.level === i);
            this.fixStrainInLevel(levelItems);
        }

        let fixedOverlap = false;
        for (let i = minLevel + 1; i <= maxLevel; i++) {
            const levelItems = otherLevelItems.filter(item => item.level === i);
            for (let j = 0; j < levelItems.length - 1; j++) {
                if (this.itemsOverlappingY(levelItems[j], levelItems[j + 1], itemLayout)) {
                    fixedOverlap = true;
                    const averageY = (levelItems[j].y + levelItems[j + 1].y) / 2;
                    for (let k = 0; k < levelItems.length; k++) {
                        levelItems[k].y =
                            k <= j
                                ? levelItems[k].y +
                                (averageY - levelItems[k].y) -
                                (itemLayout.elementHeight + itemLayout.verticalSpacing / 2)
                                : levelItems[k].y + (averageY - levelItems[k].y) + itemLayout.verticalSpacing / 2;
                    }
                }
            }
        }

        if (fixedOverlap) {
            for (let i = minLevel + 1; i <= maxLevel; i++) {
                const levelItems = otherLevelItems.filter(item => item.level === i);
                this.fixStrainInLevel(levelItems);
            }
        }
        // otherLevelItems.forEach(item => {
        //     // const parents = getParentItems(item, items).filter(parent => parent.x !== item.x);
        //     const parents = getParentItems(item, items);
        //     item.y = parents.map(parent => parent.y).reduce((a, b) => a + b, 0) / parents.length;
        // });

        // let fixedParents: Item[] = [];

        // otherLevelItems.forEach(item => {
        //     const parents = getParentItems(item, items);
        //     if (parents.length === 1) {
        //         const singleParent = parents[0];
        //         const isFixed = fixedParents.find(parent => parent.self === singleParent.self);
        //         if (!isFixed) {
        //             const children = singleParent.children;
        //             if (children && children.length > 1) {
        //                 fixItemOverlap(children, dimensions);
        //                 fixedParents = [...fixedParents, parents[0]];
        //             }
        //         }
        //     }
        // });

        // let overlapping = true;
        // let retries = 100;

        // while (overlapping && retries > 0) {
        //     overlapping = false;
        //     retries--;
        //     if (retries === 0) {
        //         console.error("Unable to fully optimize y-values");
        //     }

        //     // If Items in a column have the overlapping y, they need to be adjusted
        //     // eslint-disable-next-line no-loop-func
        //     otherLevelItems.forEach(item => {
        //         const itemsWithOverlap = items
        //             .filter(itemOverlap => itemOverlap.level === item.level)
        //             .filter(itemOverlap => itemsOverlappingY(itemOverlap, item, dimensions));

        //         if (itemsWithOverlap.length > 1) {
        //             fixItemOverlap(itemsWithOverlap, dimensions);
        //             overlapping = true;
        //         }
        //     });

        //     // If child Items of same parent have overlapping y, they need to be adjusted
        //     // eslint-disable-next-line no-loop-func
        //     otherLevelItems.forEach(item => {
        //         const itemsWithOverlap = items
        //             .filter(itemOverlap => itemOverlap.parent === item.parent)
        //             .filter(itemOverlap => itemsOverlappingY(itemOverlap, item, dimensions));

        //         if (itemsWithOverlap.length > 1) {
        //             fixItemOverlap(itemsWithOverlap, dimensions);
        //             overlapping = true;
        //         }
        //     });

        //     // If a parent with a single child is no longer alligned with its child (because the child had to move because of overlap), the position of the parent should be reset to match the child
        //     const parentsToFix = items
        //         .filter(item => item.children?.length === 1) // Item has single child
        //         .filter(item => getParentItems(item.children![0], items).length === 1) // Child has single parent
        //         .filter(item => item.children![0].y !== item.y); // Item has different y value as its single child

        //     overlapping = parentsToFix.length > 0;
        //     parentsToFix.forEach(item => (item.y = item.children![0].y));
        // }

        return [...zeroLevelItems, ...otherLevelItems];
    };

    private itemsOverlappingY(firstItem: Item, secondItem: Item, itemLayout: ItemLayout): boolean {
        return (
            firstItem.y < secondItem.y + itemLayout.elementHeight + itemLayout.verticalSpacing &&
            firstItem.y + itemLayout.elementHeight + itemLayout.verticalSpacing > secondItem.y
        );
    };

    private fixStrainInLevel(levelItems: Item[]): void {
        const strain = levelItems.reduce((a, b) => {
            const parents = getParentItems(b, this.items);
            return (
                (a +
                    parents
                        .map(parent => {
                            return parent.y - b.y;
                        })
                        .reduce((a, b) => a + b, 0)) /
                parents.length
            );
        }, 0);
        if (!strain) {
            return;
        }
        levelItems.forEach(item => {
            item.y += strain / levelItems.length;
            return item;
        });
    };

    override sortItems(): Item[] {
        return this.items;
    }
}
