import { ItemLayout } from "../models/ItemLayout";
import { ListAttributeValue, ObjectItem, ListWidgetValue } from "mendix";
import { Item } from "../models/Item";
import { Edge } from "../models/Edge";
import { FocusedItem } from "../models/FocusedItem";

/**
 * Creates an array of Items based on the input provided by the widget (through props)
 *
 * @param items ObjectItem[] provided by the datasource (Datasource property of widget)
 * @param selfAttribute ListAttributeValue that references to the item itself (Descriptor property of widget)
 * @param parentAttribute ListAttributeValue that refers to the parent of the item (Parent association property of widget)
 * @param hasFocusAttribute ListAttributeValue that indicates if an item is focussed (Has focus property of widget)
 * @returns Items[] based on the ObjectItems provided by the datasource
 */
const createItems = (
    items: ObjectItem[],
    selfAttribute: ListAttributeValue,
    columnAttribute: ListAttributeValue | undefined,
    hasFocusAttribute: ListAttributeValue,
    boxContent: ListWidgetValue,
    widgetType: string,
    parentAttribute?: ListAttributeValue,
    showsChildrenAttribute?: ListAttributeValue
): Item[] => {
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
};

const createEdges = (
    edgeObjectItems: ObjectItem[] | undefined,
    parentAtrribute: ListAttributeValue | undefined,
    childAtrribute: ListAttributeValue | undefined
): Edge[] => {
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
};

/**
 * Returns a root Item from an array of Items. When the array of Items contains more than one root item, the first one will be returned
 * An Item is a root Item if it has no parent (parents === "")
 *
 * @param items Items[] from which the root needs to be found
 * @returns The first root Item
 */
export const getRootItem = (items: Item[]): Item[] => {
    return items.filter(item => !item.parent);
};

/**
 * Returns the focuessed Item or root Item if no Item has focus
 *
 * @param items Item[] from which the focuessed Item needs to be found
 * @returns the first Item with hasFocus === true
 */
export const getFocussedItem = (items: Item[]): Item | undefined => {
    return items?.find(item => item.hasFocus);
};

/**
 * Checks if an array of Items is not only consisting of dummy Items.
 * An Item is a dummy item when parent.item is undefined
 *
 * @param items Item[] for which the dummy check needs to be performed
 * @returns true if all Items are dummy Items
 */
const hasOnlyDummies = (items: Item[]): boolean => {
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
const addChildren = (parent: Item, items: Item[]): Item[] => {
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

/**
 * Sets the children array for Items based on the parent definition.
 *
 * If we have a Item[] with A, B and C and B and C have A as a parent, the list of children for A will become [B, C]
 *
 * @param items Item[] to be processed
 * @returns { itemTree: Item[], depth: number } with the processed items and the depth of the tree
 */
const setChildrenTree = (items: Item[], widgetType: string): Item[] => {
    const rootItems = getRootItem(items);

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
        if (hasOnlyDummies(toProcess)) {
            return [
                ...processedItems,
                // eslint-disable-next-line no-loop-func
                ...toProcess.filter(item => item.level <= depth).flatMap(item => addChildren(item, items))
            ];
        }

        const currentParent = toProcess.shift()!;

        if (currentParent.level > depth) {
            depth++;
        }

        const children = addChildren(currentParent, items);

        toProcess = [...toProcess, ...children];
        processedItems = [...processedItems, ...children];
    }

    return processedItems;
};

const setChildrenGraph = (items: Item[], edges: Edge[]): Item[] => {
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

const setChildren = (items: Item[], edges: Edge[], widgetType: string): Item[] => {
    switch (widgetType) {
        case "tree":
        case "organogram":
            return setChildrenTree(items, widgetType);
        case "pert":
            return setChildrenGraph(items, edges);
        default:
            throw new Error("Unsupported widget type: " + widgetType);
    }
};

/**
 * Recursively gets the parent, untill its finds a branching parent
 *
 * @param item the Item for which to get the branching parent
 * @param items the Item[] that represents the tree
 * @returns the branching parent Item
 */
const getFirstBranchingParent = (item: Item, items: Item[]): Item | undefined => {
    const parent = items.find(itemFind => itemFind.self === item.parent);
    if (!parent) {
        return undefined;
    }

    if (parent.children && parent.children.length > 1) {
        return parent;
    }

    return getFirstBranchingParent(parent, items);
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
const isSameHorizontalGroup = (firstItem: Item, secondItem: Item, items: Item[]): boolean => {
    const firstBranchingParent = getFirstBranchingParent(firstItem, items);
    if (!firstBranchingParent) {
        return false;
    }

    const secondBranchingParent = getFirstBranchingParent(secondItem, items);
    if (!secondBranchingParent) {
        return false;
    }

    return firstBranchingParent === secondBranchingParent;
};

/**
 * Sets x for all Items for the bottom level
 *
 * @param level the level (Item[]) for which to set the x values
 * @returns Item[], the updated items
 */
const setXValuesBottom = (level: Item[], items: Item[], itemLayout: ItemLayout): Item[] => {
    return level.reduce((accumulator, item, itemIndex) => {
        if (itemIndex === 0) {
            return [item];
        }
        const prevItem = accumulator[accumulator.length - 1];
        const spacer = isSameHorizontalGroup(item, prevItem, items)
            ? itemLayout.horizontalSpacing
            : itemLayout.horizontalSpacing * itemLayout.horizontalSpacingFactor;

        item.x = accumulator[accumulator.length - 1].x + spacer + itemLayout.elementWidth;

        return [...accumulator, item];
    }, [] as Item[]);
};

/**
 * Sets x for all Items for a level that is not the bottom level
 *
 * @param level the level (Item[]) for which to set the x values
 * @returns Item[], the updated items
 */
const setXValuesNonBottom = (level: Item[]): Item[] => {
    return level.map(item => {
        const xValuesChildren = item.children!.map(child => child.x);
        item.x = (Math.min(...xValuesChildren) + Math.max(...xValuesChildren)) / 2;
        return item;
    });
};

/**
 * Sets x for all Items based on their position in the tree
 *
 * @param items Items[] to be processed
 * @param dimensions Dimensions with information about element width, height and horizontal and vertical spacing
 * @returns Item[], the updated items
 */
const setXValuesTree = (items: Item[], itemLayout: ItemLayout): Item[] => {
    return items.map(item => {
        item.x = itemLayout.horizontalSpacing * item.level;
        return item;
    });
};

export const getFocussedItemProps = (items: Item[]): FocusedItem => {
    const focusedItem = getFocussedItem(items);

    if (focusedItem !== undefined) 
        return { id: focusedItem.id, x: focusedItem.x, y: focusedItem.y, isRoot: focusedItem.isRoot };

    const rootItem = getRootItem(items)[0];

    if (rootItem !== undefined)
        return { id: rootItem.id, x: rootItem.x, y: rootItem.y, isRoot: rootItem.isRoot };
    
    return { id: "", x: 0, y: 0, isRoot: false };
};

/**
 * Sets x for all Items based on their position in the organogram
 *
 * @param items Items[] to be processed
 * @param dimensions Dimensions with information about element width, height and horizontal and vertical spacing
 * @returns Item[], the updated items
 */
const setXValuesOrganogram = (currentItems: Item[], items: Item[], itemLayout: ItemLayout): Item[] => {
    const depth = Math.max(...items.map(item => item.level));

    const levels = [...Array(depth + 1).keys()].map(i => [...items].filter(item => item.level === i)).reverse();

    const itemsWithXValues = levels.flatMap((level, levelIndex) => {
        if (levelIndex === 0) {
            return setXValuesBottom(level, items, itemLayout);
        }
        return setXValuesNonBottom(level); 
    });

    const focusedItemProps = getFocussedItemProps(currentItems);

    const currentFocus = currentItems.find(item => item.id === focusedItemProps.id);
    const itemsFocus = items.find(item => item.id === focusedItemProps.id);

    if (currentFocus && itemsFocus) {
        const deltaX = currentFocus.x - itemsFocus.x;
        itemsWithXValues.forEach(item => item.x += deltaX);
    }
    
    return itemsWithXValues;
};

/**
 * Sets x for all Items based on their position in the pert
 *
 * @param items Items[] to be processed
 * @param dimensions Dimensions with information about element width, height and horizontal and vertical spacing
 * @returns Item[], the updated items
 */
const setXValuesPert = (items: Item[], itemLayout: ItemLayout): Item[] => {
    return items.map(item => {
        item.x = item.level * (itemLayout.elementWidth + itemLayout.horizontalSpacing);
        return item;
    });
};

/**
 * Sets x for all Items based on their position in the tree
 *
 * @param items Items[] to be processed
 * @param dimensions Dimensions with information about element width, height and horizontal and vertical spacing
 * @param widgetType String representation of the type of widget
 * @returns Item[], the updated items
 */
const setXValues = (currentItems: Item[], items: Item[], itemLayout: ItemLayout, widgetType: string): Item[] => {
    switch (widgetType) {
        case "tree":
            return setXValuesTree(items, itemLayout);
        case "organogram":
            return setXValuesOrganogram(currentItems, items, itemLayout);
        case "pert":
            return setXValuesPert(items, itemLayout);
        default:
            throw new Error("Unsupported widget type: " + widgetType);
    }
};

/**
 *
 * @param items Sets y values for all Items based on their position in the organogram
 * @param dimensions Dimensions with information about element width, height and horizontal and vertical spacing
 * @returns Item[], the updated items
 */
const setYValuesOrganogram = (items: Item[], itemLayout: ItemLayout): Item[] => {
    return items.map(item => {
        item.y = item.level * (itemLayout.elementHeight + itemLayout.verticalSpacing);
        return item;
    });
};

const getParentItems = (childItem: Item, items: Item[]): Item[] => {
    return items.filter(item => item.children?.includes(childItem));
};

// const getSubTree = (item: Item): Item[] => {
//     let toProcess = [item];
//     let processedItems = [] as Item[];

//     while (toProcess.length > 0) {
//         const currentItem = toProcess.shift()!;

//         if (currentItem.children) {
//             toProcess = [...toProcess, ...currentItem.children];
//         }
//         processedItems = [...processedItems, currentItem];
//     }

//     return processedItems;
// };

// function fixItemOverlap(itemsWithOverlap: Item[], dimensions: Dimensions): void {
//     const delta = dimensions.elementHeight + dimensions.verticalSpacing;

//     const yValues = itemsWithOverlap.map(item => item.y);
//     const minY = yValues.reduce((a, b) => (a < b ? a : b), Number.MAX_VALUE);
//     const maxY = yValues.reduce((a, b) => (a > b ? a : b), 0) + dimensions.elementHeight;
//     const center = (maxY + minY) / 2;

//     let newY =
//         center -
//         (itemsWithOverlap.length * dimensions.elementHeight) / 2 -
//         ((itemsWithOverlap.length - 1) * dimensions.verticalSpacing) / 2;

//     itemsWithOverlap.forEach(itemWithOverlap => {
//         const toMove = itemWithOverlap.y - newY;
//         const subTreeItemWithOverlap = getSubTree(itemWithOverlap);
//         subTreeItemWithOverlap.forEach(item => (item.y -= toMove));
//         newY += delta;
//     });
// }

const itemsOverlappingY = (firstItem: Item, secondItem: Item, itemLayout: ItemLayout): boolean => {
    return (
        firstItem.y < secondItem.y + itemLayout.elementHeight + itemLayout.verticalSpacing &&
        firstItem.y + itemLayout.elementHeight + itemLayout.verticalSpacing > secondItem.y
    );
};

const fixStrainInLevel = (levelItems: Item[], items: Item[]): void => {
    const strain = levelItems.reduce((a, b) => {
        const parents = getParentItems(b, items);
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

/**
 *
 * @param items Sets y values for all Items based on their position in the pert diagram
 * @param dimensions Dimensions with information about element width, height and horizontal and vertical spacing
 * @returns Item[], the updated items
 */
const setYValuesPert = (items: Item[], itemLayout: ItemLayout): Item[] => {
    // const itemsByLevel = items.sort((a, b) => a.level - b.level);

    const minLevel = items.map(item => item.level).reduce((a, b) => (b < a ? b : a), Number.MAX_VALUE);
    const maxLevel = items.map(item => item.level).reduce((a, b) => (b > a ? b : a), Number.MIN_VALUE);

    const zeroLevelItems = items.filter(item => item.level === minLevel);

    const otherLevelItems = items.filter(item => !zeroLevelItems.includes(item));

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
            const parents = getParentItems(currentItem, items);
            currentItem.y = parents.length > 0 
                ? parents.map(parent => parent.y).reduce((a, b) => a + b, 0) / parents.length
                : 0;
            if (currentY !== Number.MIN_VALUE && currentItem.y <= currentY) {
                currentItem.y = currentY + itemLayout.elementHeight + itemLayout.verticalSpacing;
            }
            currentY = currentItem.y;
        }
    }

    for (let i = minLevel + 1; i <= maxLevel; i++) {
        const levelItems = otherLevelItems.filter(item => item.level === i);
        fixStrainInLevel(levelItems, items);
    }

    let fixedOverlap = false;
    for (let i = minLevel + 1; i <= maxLevel; i++) {
        const levelItems = otherLevelItems.filter(item => item.level === i);
        for (let j = 0; j < levelItems.length - 1; j++) {
            if (itemsOverlappingY(levelItems[j], levelItems[j + 1], itemLayout)) {
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
            fixStrainInLevel(levelItems, items);
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

/**
 *
 * @param items Sets y values for all Items
 * @param dimensions Dimensions with information about element width, height and horizontal and vertical spacing
 * @returns Item[], the updated items
 */
const setYValues = (items: Item[], itemLayout: ItemLayout, widgetType: string): Item[] => {
    switch (widgetType) {
        case "organogram":
            return setYValuesOrganogram(items, itemLayout);
        case "pert":
            return setYValuesPert(items, itemLayout);
        case "tree":
        default:
            throw new Error("Unsupported widget type: " + widgetType);
    }
};

/**
 * Removes dummy items from list of items. For dummy items, item.item === undefined
 *
 * @param items Item[]
 * @returns Item[]
 */
const removeDummyItems = (items: Item[]): Item[] => {
    const dummies = items.filter(item => !item.item);
    items.filter(item => item.children && dummies.includes(item.children[0])).forEach(item => (item.children = []));
    return items.filter(item => !!item.item);
};

/**
 * Sorts the list of items, for correct representation of the items in the tree (children righ beneight their parent)
 * @param items the Item[] to sort
 * @returns sorted Item[]
 */
const sortTree = (items: Item[]): Item[] => {
    const rootItem = getRootItem(items);

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

// Not yet supported by Mendix: Widget [WIDGET] is attempting to call "setValue". This operation is not yet supported on attributes linked to a datasource.
/**
 * Sets the hasChildren attribute for Items based on whether or not they have children
 *
 * @param items Items to set the hasChildren attribute for
 * @param hasChildren ListAttributeValue for hasChildren atytribute
 */
// const setHasChildren = (items: Item[], hasChildren: ListAttributeValue): void => {
//     items
//         .filter(item => item.item)
//         .map(item => hasChildren.get(item.item!).setValue(!!item.children && item.children.length > 0));
// };

/**
 * Creates a list of Items and Lines based on the input provided by the widget (through props)
 *
 * @param objectItems ObjectItem[] provided by the datasource (Datasource property of widget)
 * @param selfAttribute ListAttributeValue that references to the item itself (Descriptor property of widget)
 * @param parentAttribute ListAttributeValue that refers to the parent of the item (Parent association property of widget)
 * @param hasFocusAttribute ListAttributeValue that indicates if an item is focussed (Has focus property of widget)
 * @param dimensions Dimensions with information about element width, height and horizontal and vertical spacing
 * @returns { items: [Item], lines: [Line] } with the Items and Lines
 */
export const generateItems = (
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
): Item[] => {
    if (!objectItems) {
        return [];
    }

    let items = createItems(
        objectItems,
        selfAttribute,
        columnAttribute,
        hasFocusAttribute,
        boxContent,
        widgetType,
        parentAttribute,
        showsChildrenAttribute
    );

    const edges = widgetType === "pert" ? createEdges(edgeObjectItems, edgeParent, edgeChild) : [];

    items = setChildren(items, edges, widgetType);

    if (hasChildren) {
        // Not yet supported by Mendix: Widget [WIDGET] is attempting to call "setValue". This operation is not yet supported on attributes linked to a datasource.
        //     setHasChildren(items, hasChildren);
    }

    items = setXValues(currentItems, items, itemLayout, widgetType);
    items = removeDummyItems(items);
    if (widgetType === "organogram" || widgetType === "pert") {
        items = setYValues(items, itemLayout, widgetType);
    }
    if (widgetType === "tree") {
        items = sortTree(items);
    }
    return items;
};
