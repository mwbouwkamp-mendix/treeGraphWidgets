import React, { createElement, Fragment, ReactElement, ReactNode } from "react";
import classes from "./ScreenItem.module.css";

export interface ScreenElementProps {
    left: number;
    top: number;
    width: number;
    height: number;
    item: ReactNode;
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
    return (
        <Fragment>
            <div
                className={classes.element}
                style={{
                    width: props.width,
                    height: props.height,
                    left: props.left,
                    top: props.top
                }}
            >
                {props.item}
            </div>
        </Fragment>
    );
};

export default React.memo(ScreenItem, propsAreEqual);
