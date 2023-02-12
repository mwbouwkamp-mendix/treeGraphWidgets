import { ReactElement, createElement, Fragment } from "react";
import { Bezier } from "../models/Bezier";

export interface ScreenPathProps {
    bezier: Bezier;
    lineStroke: string;
    lineWidth: string;
    lineColor: string;
    lineType: string;
}

const ScreenBezier = (props: ScreenPathProps): ReactElement => {
    const { start, end, controlStart, controlEnd } = props.bezier;

    const bezierPath =
        !!controlStart && !!controlEnd
            ? `M ${start.x}, ${start.y} C ${controlStart.x}, ${controlStart.y} ${controlEnd.x}, ${controlEnd.y} ${end.x}, ${end.y}`
            : `M ${start.x}, ${start.y} L ${end.x}, ${end.y}`;

    return (
        <Fragment>
            {props.lineType !== "square" && (
                <path d={bezierPath} fill="transparent" markerEnd="url(#arrowhead)" stroke="0" />
            )}
            <path
                d={bezierPath}
                fill="transparent"
                strokeDasharray={props.lineStroke}
                strokeWidth={props.lineWidth}
                stroke={props.lineColor}
                strokeLinecap="round"
            />
        </Fragment>
    );
};

export default ScreenBezier;
