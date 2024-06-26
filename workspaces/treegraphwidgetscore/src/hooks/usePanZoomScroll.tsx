import { useCallback, useEffect, useState, MouseEvent } from "react";
import { FocusedItem } from "../models/FocusedItem";

let mouseClick: MouseEvent | undefined;

const DEFAULT_ZOOM = 100;

const usePanZoomScroll = (
    width: number,
    height: number,
    elementWidth: number,
    elementHeight: number,
    focusItemProps: FocusedItem,
    widgetType: string
): {
    zoom: number;
    translateX: number;
    translateY: number;
    onWheelEvent: (event: WheelEvent) => void;
    onMouseDown: (event: MouseEvent) => void;
    onMouseUp: (event?: MouseEvent) => void;
    onMouseMove: (event: MouseEvent) => void;
    onMouseDoubleClick: (event: MouseEvent) => void;
} => {
    const [zoom, setZoom] = useState(DEFAULT_ZOOM);
    const [origin, setOrigin] = useState({ x: -1, y: -1 });

    const adjustOrigin = useCallback(
        (x: number, y: number): void => {
            setOrigin(() => {
                return {
                    x: x,
                    y: y
                };
            });
        },
        [height]
    );

    const resetView = useCallback((resetZoom: boolean): void => {
        if (widgetType !== "pert" && focusItemProps.isRoot) {
            adjustOrigin((width - elementWidth) / 2 - focusItemProps.x, (height - elementHeight) / 2 - focusItemProps.y - height * 0.3);
        } else {
            adjustOrigin((width - elementWidth) / 2 - focusItemProps.x, (height - elementHeight) / 2 - focusItemProps.y);
        }

        if (resetZoom) {
            setZoom(() => 100);
        }
    }, [adjustOrigin, focusItemProps.isRoot, focusItemProps.x, focusItemProps.y, width, height, elementWidth, elementHeight, widgetType]);

    useEffect(() => {
        if (focusItemProps.x !== origin.x || focusItemProps.y !== origin.y) {
            resetView(false);
        }
    }, [resetView, focusItemProps.x, focusItemProps.y]);

    const moveOrigin = (delta: { x: number; y: number }): void => {
        setOrigin(prevOrigin => {
            return {
                x: prevOrigin.x + delta.x * 100 / zoom,
                y: prevOrigin.y + delta.y * 100 / zoom
            };
        });
    };

    const adjustZoom = (deltaY: number): void => {
        setZoom(prevZoom => Math.min(Math.max(10, prevZoom + deltaY * -0.08 * prevZoom / 100), 400));
    };

    const onWheelEvent = (event: WheelEvent): void => {
        event.preventDefault();
        if (event.ctrlKey) {
            adjustZoom(event.deltaY);
        } else {
            moveOrigin({
                x: origin.x,
                y: origin.y - event.deltaY
            });
        }
    };

    const onMouseDown = (event: MouseEvent): void => {
        event.preventDefault();
        mouseClick = event;
    };

    const onMouseUp = (event?: MouseEvent): void => {
        event?.preventDefault();
        mouseClick = undefined;
    };

    const onMouseMove = (event: MouseEvent): void => {
        event.preventDefault();
        if (!mouseClick || event.buttons === 0) {
            return;
        }
        moveOrigin({
            x: event.clientX - mouseClick.clientX,
            y: event.clientY - mouseClick.clientY
        });
        mouseClick = event;
    };

    const onMouseDoubleClick = (event: MouseEvent): void => {
        event.preventDefault();
        resetView(true);
    };

    const translateX = origin.x * (zoom / 100);
    const translateY = origin.y * (zoom / 100);

    return {
        zoom,
        translateX,
        translateY,
        onWheelEvent,
        onMouseDown,
        onMouseUp,
        onMouseMove,
        onMouseDoubleClick
    };
};

export default usePanZoomScroll;
