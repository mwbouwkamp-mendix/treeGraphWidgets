import { createElement, ReactElement, useEffect, useRef } from "react";
import usePanZoomScroll from "../hooks/usePanZoomScroll";

import classes from "./PanZoomScrollArea.module.css";
import { FocusedItem } from "../models/FocusedItem";

export interface PanZoomScrollAreaProps {
    children: ReactElement | ReactElement[];
    width: number;
    height: number;
    elementWidth: number;
    elementHeight: number;
    focusItemProps: FocusedItem;
    widgetType: string;
}

const PanZoomScrollArea = (props: PanZoomScrollAreaProps): ReactElement => {
    const ref = useRef<HTMLDivElement>(null);

    const { zoom, translateX, translateY, onWheelEvent, onMouseDown, onMouseUp, onMouseMove, onMouseDoubleClick } =
        usePanZoomScroll(
            props.width,
            props.height,
            props.elementWidth,
            props.elementHeight,
            props.focusItemProps,
            props.widgetType
        );

    useEffect(() => {
        const curRef = ref.current;
        curRef?.addEventListener("wheel", onWheelEvent, { passive: false });
        return () => {
            curRef?.removeEventListener("wheel", onWheelEvent);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onBlur = (): void => onMouseUp();

    return (
        <div
            ref={ref}
            className={classes.enclosing}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            onDoubleClick={onMouseDoubleClick}
            onBlur={onBlur}
        >
            <div
                className={classes.dynamic}
                style={{
                    transformOrigin: `${props.width / 2}px ${props.height / 2}px`,
                    transform: `translate(${translateX}px, ${translateY}px) scale(${zoom / 100}, ${zoom / 100})`
                }}
            >
                {props.children}
            </div>
        </div>
    );
};

export default PanZoomScrollArea;
