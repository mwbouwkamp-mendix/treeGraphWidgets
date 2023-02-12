import React, { createElement, Fragment, ReactElement } from "react";
import { Bezier } from "@treegraphwidgets/treegraphwidgetscore/src/models/Bezier";
import { Dimensions } from "@treegraphwidgets/treegraphwidgetscore/src/models/Dimensions";
import { Item } from "@treegraphwidgets/treegraphwidgetscore/src/models/Item";
import ScreenBezierList from "@treegraphwidgets/treegraphwidgetscore/src/components/ScreenBezierList";
import ScreenItemList from "@treegraphwidgets/treegraphwidgetscore/src/components/ScreenItemList";

export interface OrganogramChartProps {
    items: Item[];
    beziers: Bezier[];
    dimensions: Dimensions;
    lineStyle: string;
    width: number;
    height: number;
    lineType: string;
}

const propsAreEqual = (prevProps: OrganogramChartProps, newProps: OrganogramChartProps): boolean => {
    return (
        prevProps.items === newProps.items &&
        prevProps.dimensions.elementWidth === newProps.dimensions.elementWidth &&
        prevProps.dimensions.elementHeight === newProps.dimensions.elementHeight &&
        prevProps.dimensions.verticalSpacing === newProps.dimensions.verticalSpacing &&
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
                dimensions={props.dimensions}
                lineType={props.lineType}
            />
            <ScreenItemList items={props.items} dimensions={props.dimensions} />
        </Fragment>
    );
};

export default React.memo(OrganogramChart, propsAreEqual);
