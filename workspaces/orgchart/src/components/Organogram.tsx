import { createElement, ReactElement } from "react";
import { Bezier } from "@treegraphwidgets/treegraphwidgetscore/src/models/Bezier";
import { Dimensions } from "@treegraphwidgets/treegraphwidgetscore/src/models/Dimensions";
import { Item } from "@treegraphwidgets/treegraphwidgetscore/src/models/Item";
import OrganogramChart from "./OrganogramChart";
import PanZoomScrollArea from "@treegraphwidgets/treegraphwidgetscore/src/components/PanZoomScrollArea";

export interface OrganogramProps {
    width: number;
    height: number;
    elementWidth: number;
    elementHeight: number;
    focusedItemProps: { x: number; y: number; isRoot: boolean };
    items: Item[];
    beziers: Bezier[];
    dimensions: Dimensions;
    lineStyle: string;
    lineType: string;
}

const Organogram = (props: OrganogramProps): ReactElement => {
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
            widgetType="organogram"
        >
            <OrganogramChart
                items={props.items}
                dimensions={props.dimensions}
                lineStyle={props.lineStyle}
                beziers={props.beziers}
                width={props.width}
                height={props.height}
                lineType={props.lineType}
            />
        </PanZoomScrollArea>
    );
};

export default Organogram;
