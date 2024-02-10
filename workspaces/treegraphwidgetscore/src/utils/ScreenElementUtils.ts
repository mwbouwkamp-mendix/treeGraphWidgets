import { generateItems } from "./ItemUtils";
import { generateBeziers } from "./BezierUtils";
import { Item } from "../models/Item";
import { ListValue, ListAttributeValue, ListWidgetValue } from "mendix";
import { WidgetTypeEnum } from "@treegraphwidgets/treegraphwidgetscore/typings/TreeGraphWidgetsCoreProps";
import { ItemLayout } from "../models/ItemLayout";
import { LineLayout } from "../models/LineLayout";

export const createItems = (
    currentItems: Item[],
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
        currentItems,
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
