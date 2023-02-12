import React, { createElement, Fragment, ReactElement } from "react";
import { Bezier } from "@treegraphwidgets/treegraphwidgetscore/src/models/Bezier";
import { Item } from "@treegraphwidgets/treegraphwidgetscore/src/models/Item";
import ScreenBezierList from "@treegraphwidgets/treegraphwidgetscore/src/components/ScreenBezierList";
import ScreenItemList from "@treegraphwidgets/treegraphwidgetscore/src/components/ScreenItemList";

export interface PertChartProps {
    items: Item[];
    beziers: Bezier[];
    lineType: string;
    lineStyle: string;
    width: number;
    height: number;
    elementWidth: number;
    elementHeight: number;
    arrowWidth: number;
}

const propsAreEqual = (prevProps: PertChartProps, newProps: PertChartProps): boolean => {
    return (
        prevProps.items === newProps.items &&
        prevProps.beziers === newProps.beziers &&
        prevProps.elementWidth === newProps.elementWidth &&
        prevProps.elementHeight === newProps.elementHeight &&
        prevProps.lineStyle === newProps.lineStyle &&
        prevProps.lineType === newProps.lineType &&
        prevProps.width === newProps.width &&
        prevProps.height === newProps.height &&
        prevProps.arrowWidth === newProps.arrowWidth
    );
};

const PertChart = (props: PertChartProps): ReactElement => {
    return (
        <Fragment>
            <ScreenItemList items={props.items} elementWidth={props.elementWidth} elementHeight={props.elementHeight} />
            <ScreenBezierList
                beziers={props.beziers}
                width={props.width}
                height={props.height}
                lineType={props.lineType}
                lineStyle={props.lineStyle} arrowWidth={props.arrowWidth}
            />
        </Fragment>
    );
};

export default React.memo(PertChart, propsAreEqual);
