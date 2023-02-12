import React, { createElement, Fragment, ReactElement } from "react";
import { Bezier } from "@treegraphwidgets/treegraphwidgetscore/src/models/Bezier";
import { Dimensions } from "@treegraphwidgets/treegraphwidgetscore/src/models/Dimensions";
import { Item } from "@treegraphwidgets/treegraphwidgetscore/src/models/Item";
import ScreenBezierList from "@treegraphwidgets/treegraphwidgetscore/src/components/ScreenBezierList";
import ScreenItemList from "@treegraphwidgets/treegraphwidgetscore/src/components/ScreenItemList";

export interface PertChartProps {
    items: Item[];
    beziers: Bezier[];
    dimensions: Dimensions;
    lineType: string;
    lineStyle: string;
    width: number;
    height: number;
}

const propsAreEqual = (prevProps: PertChartProps, newProps: PertChartProps): boolean => {
    return (
        prevProps.items === newProps.items &&
        prevProps.beziers === newProps.beziers &&
        prevProps.dimensions.elementWidth === newProps.dimensions.elementWidth &&
        prevProps.dimensions.elementHeight === newProps.dimensions.elementHeight &&
        prevProps.dimensions.verticalSpacing === newProps.dimensions.verticalSpacing &&
        prevProps.lineStyle === newProps.lineStyle &&
        prevProps.lineType === newProps.lineType &&
        prevProps.width === newProps.width &&
        prevProps.height === newProps.height
    );
};

const PertChart = (props: PertChartProps): ReactElement => {
    return (
        <Fragment>
            <ScreenItemList items={props.items} dimensions={props.dimensions} />
            <ScreenBezierList
                beziers={props.beziers}
                width={props.width}
                height={props.height}
                dimensions={props.dimensions}
                lineType={props.lineType}
                lineStyle={props.lineStyle}
            />
        </Fragment>
    );
};

export default React.memo(PertChart, propsAreEqual);
