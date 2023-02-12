import { createElement, ReactElement } from "react";
import { Bezier } from "@treegraphwidgets/treegraphwidgetscore/src/models/Bezier";
import { Item } from "@treegraphwidgets/treegraphwidgetscore/src/models/Item";
import PanZoomScrollArea from "@treegraphwidgets/treegraphwidgetscore/src/components/PanZoomScrollArea";
import PertChart from "./PertChart";

export interface PertProps {
    width: number;
    height: number;
    elementWidth: number;
    elementHeight: number;
    focusedItemProps: { x: number; y: number; isRoot: boolean };
    items: Item[];
    beziers: Bezier[];
    lineType: string;
    lineStyle: string;
    arrowWidth: number;
}

const Pert = (props: PertProps): ReactElement => {
    return (
        <PanZoomScrollArea
            width={props.width}
            height={props.height}
            elementWidth={props.elementWidth}
            elementHeight={props.elementHeight}
            focusItemProps={{
                x: props.focusedItemProps.x,
                y: props.focusedItemProps.y,
                isRoot: props.focusedItemProps.isRoot
            }}
            widgetType="pert"
        >
            <PertChart
                items={props.items}
                beziers={props.beziers}
                lineType={props.lineType}
                lineStyle={props.lineStyle}
                width={props.width}
                height={props.height} 
                elementWidth={props.elementWidth} 
                elementHeight={props.elementHeight} 
                arrowWidth={props.arrowWidth}           
            />
        </PanZoomScrollArea>
    );
};

export default Pert;
