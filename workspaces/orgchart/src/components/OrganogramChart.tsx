import React, { createElement, Fragment, ReactElement } from "react";
import { Bezier } from "@treegraphwidgets/treegraphwidgetscore/src/models/Bezier";
import { Item } from "@treegraphwidgets/treegraphwidgetscore/src/models/Item";
import ScreenBezierList from "@treegraphwidgets/treegraphwidgetscore/src/components/ScreenBezierList";
import ScreenItemList from "@treegraphwidgets/treegraphwidgetscore/src/components/ScreenItemList";

export interface OrganogramChartProps {
    items: Item[];
    beziers: Bezier[];
    arrowWidth: number;
    lineStyle: string;
    width: number;
    height: number;
    elementHeight: number;
    elementWidth: number;
    lineType: string;
}

const propsAreEqual = (prevProps: OrganogramChartProps, newProps: OrganogramChartProps): boolean => {
    return (
        prevProps.items === newProps.items &&
        prevProps.elementWidth === newProps.elementWidth &&
        prevProps.elementHeight === newProps.elementHeight &&
        prevProps.lineStyle === newProps.lineStyle &&
        prevProps.width === newProps.width &&
        prevProps.height === newProps.height &&
        prevProps.lineType === newProps.lineType
    );
};

const OrganogramChart = (props: OrganogramChartProps): ReactElement => {
    return (
        <Fragment>
            <ScreenBezierList
                beziers={props.beziers}
                lineStyle={props.lineStyle}
                width={props.width}
                height={props.height}
                arrowWidth={props.arrowWidth}
                lineType={props.lineType}
            />
            <ScreenItemList 
                items={props.items} 
                elementWidth={props.elementWidth} 
                elementHeight={props.elementHeight} 
                widgetType="organogram"
            />
        </Fragment>
    );
};

export default React.memo(OrganogramChart, propsAreEqual);
