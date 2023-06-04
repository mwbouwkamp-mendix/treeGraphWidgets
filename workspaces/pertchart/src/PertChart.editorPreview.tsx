import { Item } from "@treegraphwidgets/treegraphwidgetscore/src/models/Item";
import { ReactElement, createElement, useEffect, useRef } from "react";
import { PertChartPreviewProps } from "typings/PertChartProps";
import { ObjectItem } from "mendix";
import classes from "@treegraphwidgets/treegraphwidgetscore/src/TreeGraphWidgetsCore.module.css";
import PertChart from "./components/PertChart";
import { ItemLayout } from "@treegraphwidgets/treegraphwidgetscore/src/models/ItemLayout";
import { LineLayout } from "@treegraphwidgets/treegraphwidgetscore/src/models/LineLayout";
import { createBeziers } from "@treegraphwidgets/treegraphwidgetscore/src/utils/ScreenElementUtils";

export function preview(props: PertChartPreviewProps): ReactElement {
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

    const previewContent = props.boxContent
        ? <props.boxContent.renderer><div /></props.boxContent.renderer>
        : <div>empty</div>;

    let deltaY = props.elementHeight
        ? props.elementHeight
        : ELEMENT_HEIGHT;
    deltaY = deltaY += props.vSpacing
        ? props.vSpacing
        : VSPACING;

    let deltaX = props.hSpacing
        ? props.hSpacing / 2 
        : HSPACING / 2;
    deltaX = deltaX += props.elementWidth
        ? props.elementWidth
        : ELEMENT_WIDTH;

    const xOffset = 20 + (props.elementWidth ? props.elementWidth : ELEMENT_WIDTH) / 2 + (width.current - (props.elementWidth ? props.elementWidth : ELEMENT_WIDTH)) / 2;
    const yOffset = 1.5 * (props.elementHeight ? props.elementHeight : ELEMENT_HEIGHT) + 20;

    console.error(xOffset + ' ' + yOffset);
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
            item:  {} as ObjectItem,
            level: 1,
            x: xOffset + deltaX,
            y: yOffset - deltaY,
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
            item:  {} as ObjectItem,
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
        horizontalSpacingFactor: HORIZONTAL_SPACING_FACTOR,
    };

    const lineLayout: LineLayout = {
        lineType: props.lineType || LINE_TYPE,
        bezierDelta: props.bezierDelta || BEZIER_DELTA,
        arrowWidth: props.arrowWidth || ARROW_WIDTH
    }
    const beziers = createBeziers("pert", items, itemLayout, lineLayout);

    useEffect(() => {
        width.current = ref.current!.getBoundingClientRect().width;
    }, []);
    
    return (
        <div
            ref={ref}
            className={classes.pert}
            style={{
                height: props.height || HEIGHT
                
            }}
        >
            <PertChart
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
    return require("./ui/PertChart.css");
}
