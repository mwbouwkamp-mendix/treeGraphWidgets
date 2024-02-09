import { createElement, ReactElement } from "react";
import { Bezier } from "../models/Bezier";
import { Coordinate } from "../models/Coordinate";
import ScreenBezier from "./ScreenBezier";

export interface ScreenBezierListProps {
    beziers: Bezier[];
    width: number;
    height: number;
    arrowWidth: number;
    lineType: string;
    lineStyle: string;
}

const DEFAULT_LINE_STROKE = "";
const DEFAULT_LINE_WIDTH = "2px";
const DEFAULT_LINE_COLOR = "black";

const getLineProperties = (lineStyle: string): { lineStroke: string; lineWidth: string; lineColor: string } => {
    let lineStroke = DEFAULT_LINE_STROKE;
    let lineWidth = DEFAULT_LINE_WIDTH;
    let lineColor = DEFAULT_LINE_COLOR;

    const lineStyleElements = lineStyle.split(" ");
    if (lineStyleElements.length === 3) {
        lineWidth = lineStyleElements[1].replace("px", "");
        const lineWidthNumber = parseInt(lineWidth, 10);
        switch (lineStyleElements[0]) {
            case "dotted":
                lineStroke = `${0} ${2 * lineWidthNumber}`;
                break;
            case "dashed":
                lineStroke = `${lineWidthNumber} ${2 * lineWidthNumber}`;
                break;
            default:
                break;
        }
        lineColor = lineStyleElements[2];
    }
    return { lineStroke, lineWidth, lineColor };
};

const calculateSVGDimensions = (beziers: Bezier[], arrowWidth: number): Coordinate => {
    let maxX = beziers.map(bezier => Math.max(bezier.start.x, bezier.end.x)).reduce((a, b) => (a > b ? a : b), 0);
    let maxY = beziers.map(bezier => Math.max(bezier.start.y, bezier.end.y)).reduce((a, b) => (a > b ? a : b), 0);
    maxX += arrowWidth;
    maxY += (arrowWidth * 2) / 3;
    return { x: maxX, y: maxY };
};

const ScreenBezierList = (props: ScreenBezierListProps): ReactElement => {
    const { lineStroke, lineWidth, lineColor } = getLineProperties(props.lineStyle);
    const svgDimensions = calculateSVGDimensions(props.beziers, props.arrowWidth);

    const createBezierElements = props.beziers.map(bezier => (
        <ScreenBezier
            key={bezier.id}
            bezier={bezier}
            lineStroke={lineStroke}
            lineWidth={lineWidth}
            lineColor={lineColor}
            lineType={props.lineType}
        />
    ));

    return (
        <div style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
            <svg width={svgDimensions.x} height={svgDimensions.y} style={{overflow: "visible"}}>
                <defs>
                    <marker
                        id="arrowhead"
                        markerWidth={props.arrowWidth}
                        markerHeight={(props.arrowWidth * 2) / 3}
                        refX={props.lineType === "bezier" ? 0 : props.arrowWidth}
                        refY={props.arrowWidth / 3}
                        orient="auto"
                    >
                        <polygon
                            points={`0 0, ${props.arrowWidth} ${props.arrowWidth / 3}, 0 ${(props.arrowWidth * 2) / 3}`}
                            fill={lineColor}
                            strokeWidth={1}
                        />
                    </marker>
                </defs>
                {createBezierElements}
            </svg>
        </div>
    );
};

export default ScreenBezierList;
