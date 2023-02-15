import { useEffect, useState } from "react";
import { Item } from "../models/Item";
import { Bezier } from "../models/Bezier";
import { createScreenElements } from "../utils/ScreenElementUtils";
import Big from "big.js";
import { WidgetTypeEnum, LineTypeEnum } from "@treegraphwidgets/treegraphwidgetscore/typings/TreeGraphWidgetsCoreProps";
import { ListValue, ListAttributeValue, ListWidgetValue } from "mendix";

const useScreenElements = (props:
    {
        widgetType: WidgetTypeEnum;
        dataMicroflow: ListValue;
        self: ListAttributeValue<string>;
        parent?: ListAttributeValue<string>;
        hasFocus: ListAttributeValue<boolean>;
        hasChildren?: ListAttributeValue<boolean>;
        showsChildren?: ListAttributeValue<boolean>;
        elementWidth: number;
        elementHeight: number;
        hSpacing: number;
        vSpacing: number;
        bezierDelta: number;
        arrowWidth: number;
        lineType: LineTypeEnum;
        boxContent: ListWidgetValue;
        dataMicroflowEdge?: ListValue;
        parentEdge?: ListAttributeValue<string>;
        childEdge?: ListAttributeValue<string>;
        column?: ListAttributeValue<Big>;
}): {
    items: Item[];
    beziers: Bezier[];
    focusedItemProps: { x: number; y: number; isRoot: boolean };
} => {
    const [screenElements, setScreenElements] = useState<{
        items: Item[];
        beziers: Bezier[];
        focusedItemProps: { x: number; y: number; isRoot: boolean };
    }>(createScreenElements(props));

    useEffect(() => {
        if (
            props.dataMicroflow.items!.length > 0 &&
            (props.widgetType !== "pert" || (props.dataMicroflowEdge && props.dataMicroflowEdge.items!.length > 0))
        ) {
            const { items, beziers, focusedItemProps } = createScreenElements(props);
            setScreenElements(_prevSceenElements => ({
                items,
                beziers,
                focusedItemProps
            }));
        }
    }, [props.dataMicroflow.items]);

    return {
        items: screenElements.items,
        beziers: screenElements.beziers,
        focusedItemProps: screenElements.focusedItemProps
    };
};

export default useScreenElements;
