import { generateItems, getFocussedItem, getRootItem } from "./ItemUtils";
import { generateBeziers } from "./BezierUtils";
import { Item } from "../models/Item";
import { ListValue, ListAttributeValue, ListWidgetValue } from "mendix";
import { WidgetTypeEnum } from "@treegraphwidgets/treegraphwidgetscore/typings/TreeGraphWidgetsCoreProps";
import Big from "big.js";
import { ItemLayout } from "../models/ItemLayout";
import { LineLayout } from "../models/LineLayout";

export const createItems = (
    dataMicroflow: ListValue,
    self: ListAttributeValue<string>,
    hasFocus: ListAttributeValue<boolean>,
    boxContent: ListWidgetValue,
    dimensions: ItemLayout,
    widgetType: WidgetTypeEnum,
    dataMicroflowEdge?: ListValue,
    parent?: ListAttributeValue<string>,
    parentEdge?: ListAttributeValue<string>,
    childEdge?: ListAttributeValue<string>,
    showsChildren?: ListAttributeValue<boolean>,
    column?: ListAttributeValue<Big>
): Item[] => {
    return generateItems(
        dataMicroflow.items!,
        self,
        hasFocus,
        boxContent!,
        dimensions,
        widgetType,
        dataMicroflowEdge?.items,
        parent,
        parentEdge,
        childEdge,
        showsChildren,
        column
    );
};

export const createBeziers = (
    widgetType: WidgetTypeEnum,
    items: Item[],
    itemLayout: ItemLayout,
    lineLayout: LineLayout
) => {
    if (widgetType === "tree") {
        return [];
    }

    return generateBeziers(items, itemLayout, lineLayout, widgetType);
};

export const getFocussedItemProps = (items: Item[]) => {
    const focusedItem = getFocussedItem(items);
    const rootItem = getRootItem(items)[0];

    return focusedItem
        ? { x: focusedItem.x, y: focusedItem.y, isRoot: focusedItem.isRoot }
        : rootItem
        ? { x: rootItem.x, y: rootItem.y, isRoot: rootItem.isRoot }
        : { x: 0, y: 0, isRoot: false };
};
