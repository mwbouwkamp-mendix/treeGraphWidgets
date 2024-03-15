import { Item } from "../models/Item";
import { FocusedItem } from "../models/FocusedItem";

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

export const getFocussedItemProps = (items: Item[]): FocusedItem => {
    const focusedItem = getFocussedItem(items);

    if (focusedItem !== undefined)
        return { id: focusedItem.id, x: focusedItem.x, y: focusedItem.y, isRoot: focusedItem.isRoot };

    const rootItem = getRootItem(items)[0];

    if (rootItem !== undefined) return { id: rootItem.id, x: rootItem.x, y: rootItem.y, isRoot: rootItem.isRoot };

    return { id: "", x: 0, y: 0, isRoot: false };
};

export const getParentItems = (childItem: Item, items: Item[]): Item[] => {
    return items.filter(item => item.children?.includes(childItem));
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
