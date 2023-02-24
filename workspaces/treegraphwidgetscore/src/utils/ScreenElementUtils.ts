import { generateItems, getFocussedItem, getRootItem } from "./ItemUtils";
import { generateBeziers } from "./BezierUtils";
import { Item } from "../models/Item";
import { ListValue, ListAttributeValue, ListWidgetValue } from "mendix";
import { WidgetTypeEnum, LineTypeEnum } from "@treegraphwidgets/treegraphwidgetscore/typings/TreeGraphWidgetsCoreProps";
import Big from "big.js";
import { Dimensions } from "../models/Dimensions";

export const createItems = (
    dataMicroflow: ListValue,
    self: ListAttributeValue<string>,
    hasFocus: ListAttributeValue<boolean>,
    boxContent: ListWidgetValue,
    dimensions: Dimensions,
    widgetType: WidgetTypeEnum,
    dataMicroflowEdge?: ListValue,
    parent?: ListAttributeValue<string>,
    parentEdge?: ListAttributeValue<string>,
    childEdge?: ListAttributeValue<string>,
    showsChildren?: ListAttributeValue<boolean>,
    column?: ListAttributeValue<Big>,
    hasChildren?: ListAttributeValue<boolean>
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
        column,
        hasChildren
    );
};

export const createBeziers = (
    widgetType: WidgetTypeEnum,
    items: Item[],
    dimensions: Dimensions,
    lineType: LineTypeEnum
) => {
    return widgetType === "organogram" || widgetType === "pert"
        ? generateBeziers(items, dimensions, lineType, widgetType)
        : [];
};

export const getFocussedItemProps = (
    items: Item[]
) => {
    const focusedItem = getFocussedItem(items);
    const rootItem = getRootItem(items)[0];

    return focusedItem
        ? { x: focusedItem.x, y: focusedItem.y, isRoot: focusedItem.isRoot }
        : rootItem
            ? { x: rootItem.x, y: rootItem.y, isRoot: rootItem.isRoot }
            : { x: 0, y: 0, isRoot: false };
};
