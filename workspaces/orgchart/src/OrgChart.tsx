import { ReactElement, createElement, useEffect, useRef } from "react";
import useScreenElements from "@treegraphwidgets/treegraphwidgetscore/src/hooks/useScreenElements";
import classes from "@treegraphwidgets/treegraphwidgetscore/src/TreeGraphWidgetsCore.module.css";
import { OrgChartContainerProps } from "../typings/OrgChartProps";

import "./ui/OrgChart.css";
import Organogram from "./components/Organogram";

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

    const { items, beziers, focusedItemProps } = useScreenElements(
        {
            widgetType: props.widgetType,
            dataMicroflow: props.dataMicroflow,
            self: props.self,
            parent: props.parent,
            hasFocus: props.hasFocus,
            hasChildren: props.hasChildren,
            showsChildren: props.showsChildren,
            elementWidth: props.elementWidth,
            elementHeight: props.elementHeight,
            hSpacing: props.hSpacing,
            vSpacing: props.vSpacing,
            bezierDelta: props.bezierDelta,
            arrowWidth: props.arrowWidth,
            lineType: props.lineType,
            boxContent: props.boxContent,
            dataMicroflowEdge: props.dataMicroflowEdge,
            parentEdge: props.parentEdge,
            childEdge: props.childEdge,
            column: props.column
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
            {props.widgetType === "organogram" && (
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
            )}
        </div>
    );
}
