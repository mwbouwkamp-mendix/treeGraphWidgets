import { createElement, ReactElement } from "react";
import { Bezier } from "@treegraphwidgets/treegraphwidgetscore/src/models/Bezier";
import { Item } from "@treegraphwidgets/treegraphwidgetscore/src/models/Item";
import OrganogramChart from "./OrganogramChart";
import PanZoomScrollArea from "@treegraphwidgets/treegraphwidgetscore/src/components/PanZoomScrollArea";
import { FocusedItem } from "@treegraphwidgets/treegraphwidgetscore/src/models/FocusedItem";

export interface OrganogramProps {
    width: number;
    height: number;
    elementWidth: number;
    elementHeight: number;
    arrowWidth: number;
    focusedItemProps: FocusedItem;
    items: Item[];
    beziers: Bezier[];
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
            // focusItemProps={{
            //     id: props.focusedItemProps.id,
            //     x: props.focusedItemProps.x,
            //     y: props.focusedItemProps.y,
            //     isRoot: props.focusedItemProps.isRoot
            // }}
            focusItemProps={props.focusedItemProps}
            widgetType="organogram"
        >
            <OrganogramChart
                items={props.items}
                lineStyle={props.lineStyle}
                beziers={props.beziers}
                width={props.width}
                height={props.height}
                lineType={props.lineType}
                arrowWidth={props.arrowWidth}
                elementHeight={props.elementHeight}
                elementWidth={props.elementWidth}
            />
        </PanZoomScrollArea>
    );
};

export default Organogram;
