import { useEffect, useState } from "react";
import { Item } from "../models/Item";
import { Bezier } from "../models/Bezier";
import { createBeziers, createItems, getFocussedItemProps } from "../utils/ScreenElementUtils";
import Big from "big.js";
import { WidgetTypeEnum, LineTypeEnum } from "@treegraphwidgets/treegraphwidgetscore/typings/TreeGraphWidgetsCoreProps";
import { ListValue, ListAttributeValue, ListWidgetValue } from "mendix";
import { Dimensions } from "../models/Dimensions";

const HORIZONTAL_SPACING_FACTOR = 3;

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
    const dimensions: Dimensions = {
        elementWidth: props.elementWidth,
        elementHeight: props.elementHeight,
        horizontalSpacing: props.hSpacing,
        verticalSpacing: props.vSpacing,
        horizontalSpacingFactor: HORIZONTAL_SPACING_FACTOR,
        bezierDelta: props.bezierDelta,
        arrowWidth: props.arrowWidth
    };

    const [screenElements, setScreenElements] = useState<{
        items: Item[];
        beziers: Bezier[];
        focusedItemProps: { x: number; y: number; isRoot: boolean };
    }>({ 
        items: [], 
        beziers: [], 
        focusedItemProps: { x: 0, y: 0, isRoot: false }
    });

    useEffect(() => {
        if (
            props.dataMicroflow.items!.length > 0 &&
            (props.widgetType !== "pert" || (props.dataMicroflowEdge && props.dataMicroflowEdge.items!.length > 0))
        ) {
            const items = createItems(
                props.dataMicroflow,
                props.self,
                props.hasFocus,
                props.boxContent,
                dimensions,
                props.widgetType,
                props.dataMicroflowEdge,
                props.parent,
                props.parentEdge,
                props.childEdge,
                props.showsChildren,
                props.column,
                props.hasChildren
            )
        
            const beziers = createBeziers(
                props.widgetType,
                items, 
                dimensions
                , props.lineType
            );
        
            const focusedItemProps = getFocussedItemProps(
                items
            );
        
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
