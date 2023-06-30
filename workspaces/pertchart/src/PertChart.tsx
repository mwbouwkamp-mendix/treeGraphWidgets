import { ReactElement, createElement, useEffect, useRef } from "react";
import useScreenElements from "@treegraphwidgets/treegraphwidgetscore/src/hooks/useScreenElements";
import classes from "@treegraphwidgets/treegraphwidgetscore/src/TreeGraphWidgetsCore.module.css";

import { PertChartContainerProps } from "../typings/PertChartProps";

import "./ui/PertChart.css";
import Pert from "./components/Pert";
import { ItemLayout } from "@treegraphwidgets/treegraphwidgetscore/src/models/ItemLayout";
import { LineLayout } from "@treegraphwidgets/treegraphwidgetscore/src/models/LineLayout";

export function PertChart(props: PertChartContainerProps): ReactElement {
    if (!props.dataMicroflow.items || !props.dataMicroflowEdge?.items || !props.self || !props.boxContent) {
        return <div />;
    }

    const ref = useRef<HTMLDivElement>(null);

    const width = useRef(0);

    const itemLayout: ItemLayout = {
        elementWidth: props.elementWidth,
        elementHeight: props.elementHeight,
        horizontalSpacing: props.hSpacing,
        verticalSpacing: props.vSpacing,
        horizontalSpacingFactor: 0
    };

    const lineLayout: LineLayout = {
        lineType: props.lineType,
        bezierDelta: props.bezierDelta,
        arrowWidth: props.arrowWidth
    };

    const { items, beziers, focusedItemProps } = useScreenElements({
        widgetType: "pert",
        dataMicroflow: props.dataMicroflow,
        self: props.self,
        parent: undefined,
        hasFocus: props.hasFocus,
        showsChildren: undefined,
        itemLayout,
        lineLayout,
        boxContent: props.boxContent,
        dataMicroflowEdge: props.dataMicroflowEdge,
        parentEdge: props.parentEdge,
        childEdge: props.childEdge,
        column: props.column
    });

    useEffect(() => {
        width.current = ref.current!.getBoundingClientRect().width;
    }, []);

    return (
        <div
            ref={ref}
            className={`pertchart ${classes.pert}`}
            style={{
                height: props.height
            }}
        >
            <Pert
                width={width.current}
                height={props.height}
                elementWidth={props.elementWidth}
                elementHeight={props.elementHeight}
                focusedItemProps={focusedItemProps}
                items={items}
                beziers={beziers}
                lineType={props.lineType}
                lineStyle={props.lineStyle}
                arrowWidth={props.arrowWidth}
            />
        </div>
    );
}
