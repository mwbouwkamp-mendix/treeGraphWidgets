import { CSSProperties, useEffect, useState } from "react";
import { Item } from "../models/Item";
import { Bezier } from "../models/Bezier";
import { createScreenElements } from "../utils/ScreenElementUtils";
import { Dimensions } from "../models/Dimensions";
import Big from "big.js";
import { WidgetTypeEnum, LineTypeEnum } from "@treegraphwidgets/treegraphwidgetscore/typings/TreeGraphWidgetsCoreProps";
import { ListValue, ListAttributeValue, ListWidgetValue } from "mendix";

const useScreenElements = (props:
    {
        name: string;
        class: string;
        style?: CSSProperties;
        tabIndex?: number;
        widgetType: WidgetTypeEnum;
        height: number;
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
        lineStyle: string;
        boxContent: ListWidgetValue;
        dataMicroflowEdge?: ListValue;
        parentEdge?: ListAttributeValue<string>;
        childEdge?: ListAttributeValue<string>;
        column?: ListAttributeValue<Big>;
    }): {
    items: Item[];
    beziers: Bezier[];
    dimensions: Dimensions;
    focusedItemProps: { x: number; y: number; isRoot: boolean };
} => {
    const [screenElements, setScreenElements] = useState<{
        items: Item[];
        beziers: Bezier[];
        dimensions: Dimensions;
        focusedItemProps: { x: number; y: number; isRoot: boolean };
    }>(createScreenElements(props));

    useEffect(() => {
        if (
            props.dataMicroflow.items!.length > 0 &&
            (props.widgetType !== "pert" || (props.dataMicroflowEdge && props.dataMicroflowEdge.items!.length > 0))
        ) {
            const { items, beziers, dimensions, focusedItemProps } = createScreenElements(props);
            setScreenElements(_prevSceenElements => ({
                items,
                beziers,
                dimensions,
                focusedItemProps
            }));
        }
    }, [props.dataMicroflow.items]);

    return {
        items: screenElements.items,
        beziers: screenElements.beziers,
        dimensions: screenElements.dimensions,
        focusedItemProps: screenElements.focusedItemProps
    };
};

export default useScreenElements;
