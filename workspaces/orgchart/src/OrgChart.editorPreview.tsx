import { Item } from "@treegraphwidgets/treegraphwidgetscore/src/models/Item";
import { ReactElement, createElement, useRef, useEffect } from "react";
import { OrgChartPreviewProps } from "typings/OrgChartProps";
import classes from "@treegraphwidgets/treegraphwidgetscore/src/TreeGraphWidgetsCore.module.css";
import { createBeziers } from "@treegraphwidgets/treegraphwidgetscore/src/utils/ScreenElementUtils";
import { ItemLayout } from "@treegraphwidgets/treegraphwidgetscore/src/models/ItemLayout";
import { LineLayout } from "@treegraphwidgets/treegraphwidgetscore/src/models/LineLayout";
import OrganogramChart from "./components/OrganogramChart";
import { ObjectItem } from "mendix";

export function preview(props: OrgChartPreviewProps): ReactElement {
    const HEIGHT = 800;
    const ELEMENT_HEIGHT = 200;
    const ELEMENT_WIDTH = 200;
    const VSPACING = 40;
    const HSPACING = 30;
    const HORIZONTAL_SPACING_FACTOR = 1.5;
    const LINE_TYPE = "square";
    const BEZIER_DELTA = 40;
    const ARROW_WIDTH = 12;

    const ref = useRef<HTMLDivElement>(null);

    const width = useRef(0);

    const previewContent = props.boxContent ? (
        <props.boxContent.renderer>
            <div />
        </props.boxContent.renderer>
    ) : (
        <div>empty</div>
    );

    let deltaY = props.elementHeight ? props.elementHeight : ELEMENT_HEIGHT;
    deltaY = deltaY += props.vSpacing ? props.vSpacing : VSPACING;

    let deltaX = props.hSpacing ? props.hSpacing / 2 : HSPACING / 2;
    deltaX = deltaX += props.elementWidth ? props.elementWidth : ELEMENT_WIDTH;

    const xOffset =
        1.5 * (props.elementWidth ? props.elementWidth : ELEMENT_WIDTH) +
        20 +
        (width.current - (props.elementWidth ? props.elementWidth : ELEMENT_WIDTH)) / 2;
    const yOffset = 20;

    console.error(xOffset + " " + yOffset);
    const items: Item[] = [
        {
            id: "1",
            widgetContent: previewContent,
            self: "1",
            parent: "",
            children: [],
            item: {} as ObjectItem,
            level: 1,
            x: xOffset,
            y: yOffset,
            isRoot: true,
            hasFocus: true,
            showsChildren: false
        },
        {
            id: "2",
            widgetContent: previewContent,
            self: "2",
            parent: "1",
            children: [],
            item: {} as ObjectItem,
            level: 1,
            x: xOffset - deltaX,
            y: yOffset + deltaY,
            isRoot: false,
            hasFocus: false,
            showsChildren: false
        },
        {
            id: "3",
            widgetContent: previewContent,
            self: "3",
            parent: "1",
            children: [],
            item: {} as ObjectItem,
            level: 1,
            x: xOffset + deltaX,
            y: yOffset + deltaY,
            isRoot: false,
            hasFocus: false,
            showsChildren: false
        }
    ];

    items[0].children?.push(items[0]);
    items[0].children?.push(items[1]);

    const itemLayout: ItemLayout = {
        elementWidth: props.elementWidth || ELEMENT_WIDTH,
        elementHeight: props.elementHeight || ELEMENT_HEIGHT,
        horizontalSpacing: props.hSpacing || HSPACING,
        verticalSpacing: props.vSpacing || VSPACING,
        horizontalSpacingFactor: HORIZONTAL_SPACING_FACTOR
    };

    const lineLayout: LineLayout = {
        lineType: props.lineType || LINE_TYPE,
        bezierDelta: props.bezierDelta || BEZIER_DELTA,
        arrowWidth: props.arrowWidth || ARROW_WIDTH
    };
    const beziers = createBeziers("organogram", items, itemLayout, lineLayout);

    useEffect(() => {
        width.current = ref.current!.getBoundingClientRect().width;
    }, []);

    return (
        <div
            ref={ref}
            className={classes.organogram}
            style={{
                height: props.height || HEIGHT
            }}
        >
            <OrganogramChart
                items={items}
                lineStyle={props.lineStyle}
                beziers={beziers}
                width={width.current}
                height={props.height || HEIGHT}
                lineType={props.lineType}
                arrowWidth={props.arrowWidth || ARROW_WIDTH}
                elementHeight={props.elementHeight || ELEMENT_HEIGHT}
                elementWidth={props.elementWidth || ELEMENT_WIDTH}
            />
        </div>
    );
}

export function getPreviewCss(): string {
    return require("./ui/OrgChart.css");
}
