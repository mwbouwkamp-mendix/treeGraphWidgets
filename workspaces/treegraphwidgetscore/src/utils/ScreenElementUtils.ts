import { generateItems, getFocussedItem, getRootItem } from "./ItemUtils";
import { generateBeziers } from "./BezierUtils";
import { TreeGraphWidgetsCoreContainerProps } from "../../typings/TreeGraphWidgetsCoreProps";
import { Dimensions } from "../models/Dimensions";
import { Bezier } from "../models/Bezier";
import { Item } from "../models/Item";

const HORIZONTAL_SPACING_FACTOR = 3;

export const createScreenElements = (
    props: TreeGraphWidgetsCoreContainerProps
): {
    items: Item[];
    beziers: Bezier[];
    dimensions: Dimensions;
    focusedItemProps: { x: number; y: number; isRoot: boolean };
} => {
    const dimensions = {
        elementWidth: props.elementWidth,
        elementHeight: props.elementHeight,
        horizontalSpacing: props.hSpacing,
        verticalSpacing: props.vSpacing,
        horizontalSpacingFactor: HORIZONTAL_SPACING_FACTOR,
        bezierDelta: props.bezierDelta,
        arrowWidth: props.arrowWidth
    };

    const items = generateItems(
        props.dataMicroflow.items!,
        props.self,
        props.hasFocus,
        props.boxContent!,
        dimensions,
        props.widgetType,
        props.dataMicroflowEdge?.items,
        props.parent,
        props.parentEdge,
        props.childEdge,
        props.showsChildren,
        props.column,
        props.hasChildren
    );

    const beziers =
        props.widgetType === "organogram" || props.widgetType === "pert"
            ? generateBeziers(items, dimensions, props.lineType, props.widgetType)
            : [];

    const focusedItem = getFocussedItem(items);
    const rootItem = getRootItem(items)[0];

    const focusedItemProps = focusedItem
        ? { x: focusedItem.x, y: focusedItem.y, isRoot: focusedItem.isRoot }
        : rootItem
        ? { x: rootItem.x, y: rootItem.y, isRoot: rootItem.isRoot }
        : { x: 0, y: 0, isRoot: false };
    return { items, beziers, dimensions, focusedItemProps };
};
