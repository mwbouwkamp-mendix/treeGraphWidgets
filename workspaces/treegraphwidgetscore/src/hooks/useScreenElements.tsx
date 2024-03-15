import { useEffect, useState } from "react";
import { Item } from "../models/Item";
import { Bezier } from "../models/Bezier";
import { createBeziers, createItems } from "../utils/ScreenElementUtils";
import { WidgetTypeEnum } from "@treegraphwidgets/treegraphwidgetscore/typings/TreeGraphWidgetsCoreProps";
import { ListValue, ListAttributeValue, ListWidgetValue } from "mendix";
import { ItemLayout } from "../models/ItemLayout";
import { LineLayout } from "../models/LineLayout";
import { FocusedItem } from "../models/FocusedItem";
import { getFocussedItemProps } from "../utils/ItemUtils";

const useScreenElements = (props: {
    widgetType: WidgetTypeEnum;
    dataMicroflow: ListValue;
    self: ListAttributeValue<string>;
    parent?: ListAttributeValue<string>;
    hasFocus: ListAttributeValue<boolean>;
    hasChildren?: ListAttributeValue<boolean>;
    showsChildren?: ListAttributeValue<boolean>;
    itemLayout: ItemLayout;
    lineLayout?: LineLayout;
    boxContent: ListWidgetValue;
    dataMicroflowEdge?: ListValue;
    parentEdge?: ListAttributeValue<string>;
    childEdge?: ListAttributeValue<string>;
    column?: ListAttributeValue<Big>;
}): {
    items: Item[];
    beziers: Bezier[];
    focusedItemProps: FocusedItem;
} => {
    const [screenElements, setScreenElements] = useState<{
        items: Item[];
        beziers: Bezier[];
        focusedItemProps: FocusedItem;
    }>({
        items: [],
        beziers: [],
        focusedItemProps: { id: "", x: 0, y: 0, isRoot: false }
    });

    useEffect(() => {
        if (props.dataMicroflow.items!.length > 0 && (props.widgetType !== "pert" || props.dataMicroflowEdge)) {
            const items = createItems(
                screenElements.items,
                props.dataMicroflow,
                props.self,
                props.hasFocus,
                props.boxContent,
                props.itemLayout,
                props.widgetType,
                props.dataMicroflowEdge,
                props.parent,
                props.parentEdge,
                props.childEdge,
                props.showsChildren,
                props.column
            );

            const beziers =
                props.widgetType === "organogram" || props.widgetType === "pert"
                    ? createBeziers(props.widgetType, items, props.itemLayout, props.lineLayout!)
                    : [];

            const focusedItemProps = getFocussedItemProps(items);

            setScreenElements(_prevSceenElements => ({
                items,
                beziers,
                focusedItemProps
            }));
        }
    }, [props.dataMicroflow.items]);

    return {
        items: screenElements?.items,
        beziers: screenElements?.beziers,
        focusedItemProps: screenElements?.focusedItemProps
    };
};

export default useScreenElements;
