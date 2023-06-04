import React, { createElement, ReactElement, ReactNode } from "react";
import classes from "./ScreenItem.module.css";

export interface ScreenElementProps {
    left: number;
    top: number;
    width: number;
    height: number;
    item: ReactNode;
    widgetType: string;
}

const propsAreEqual = (prevProps: ScreenElementProps, newProps: ScreenElementProps): boolean => {
    return (
        prevProps.left === newProps.left &&
        prevProps.top === newProps.top &&
        prevProps.width === newProps.width &&
        prevProps.height === prevProps.height &&
        prevProps.item === newProps.item
    );
};

const ScreenItem = (props: ScreenElementProps): ReactElement => {
    const className = props.widgetType === "organogram"
        ? "orgchart-element"
        : props.widgetType === "pert"
        ? "pertchart-element"
        : ""
    return (
        <div
            className={`${className} ${classes.element}`}
            style={{
                width: props.width,
                height: props.height,
                left: props.left,
                top: props.top
            }}
        >
            {props.item}
        </div>
    );
};

export default React.memo(ScreenItem, propsAreEqual);
