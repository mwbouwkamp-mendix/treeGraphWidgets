import { ReactElement, createElement, useEffect, useRef } from "react";
import useScreenElements from "@treegraphwidgets/treegraphwidgetscore/src/hooks/useScreenElements";
import classes from "@treegraphwidgets/treegraphwidgetscore/src/TreeGraphWidgetsCore.module.css";
import { OrgChartContainerProps } from "../typings/OrgChartProps";

import "./ui/OrgChart.css";
import Organogram from "./components/Organogram";
import { ItemLayout } from "@treegraphwidgets/treegraphwidgetscore/src/models/ItemLayout";
import { LineLayout } from "@treegraphwidgets/treegraphwidgetscore/src/models/LineLayout";

const HORIZONTAL_SPACING_FACTOR = 3;

export function OrgChart(props: OrgChartContainerProps): ReactElement {
    if (
        !props.dataMicroflow.items ||
        !props.self ||
        !props.boxContent
    ) {
        return <div />;
    }

    const ref = useRef<HTMLDivElement>(null);

    const width = useRef(0);

    const itemLayout: ItemLayout = {
        elementWidth: props.elementWidth,
        elementHeight: props.elementHeight,
        horizontalSpacing: props.hSpacing,
        verticalSpacing: props.vSpacing,
        horizontalSpacingFactor: HORIZONTAL_SPACING_FACTOR,
    };

    const lineLayout: LineLayout = {
        lineType: props.lineType,
        bezierDelta: props.bezierDelta,
        arrowWidth: props.arrowWidth
    }

    const { items, beziers, focusedItemProps } = useScreenElements(
        {
            widgetType: "organogram",
            dataMicroflow: props.dataMicroflow,
            self: props.self,
            parent: props.parent,
            hasFocus: props.hasFocus,
            hasChildren: props.hasChildren,
            showsChildren: props.showsChildren,
            itemLayout,
            lineLayout,
            boxContent: props.boxContent,
            dataMicroflowEdge: undefined,
            parentEdge: undefined,
            childEdge: undefined,
            column: undefined
        }
    );

    useEffect(() => {
        width.current = ref.current!.getBoundingClientRect().width;
    }, []);


    return (
        <div
            ref={ref}
            className={classes.organogram}
            style={{
                height: props.height
            }}
        >
            <Organogram
                width={width.current}
                height={props.height}
                elementWidth={props.elementWidth}
                elementHeight={props.elementHeight}
                focusedItemProps={focusedItemProps}
                items={items}
                lineStyle={props.lineStyle}
                beziers={beziers}
                lineType={props.lineType}
                arrowWidth={props.arrowWidth}
            />
        </div>
    );
}
