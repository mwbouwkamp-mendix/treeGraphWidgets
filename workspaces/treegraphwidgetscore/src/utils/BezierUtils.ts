import { Bezier } from "../models/Bezier";
import { Dimensions } from "../models/Dimensions";
import { Item } from "../models/Item";

/**
 * Generates Beziers based on the Items to be connected and the configured dimensions for a Pert
 *
 * A Bezier either (depending on the relative position of the Items):
 * - starts at the middle of the left/right of the parent Item and ends at the middle of the right/left of the child Item
 * - starts at the middle of the bottom/top of the parent Item and ends at the middle of the top/bottom of the child Item
 *
 * For lineType "bezier", two bezier control points are used at a configured distance from the start and end point
 *
 * @param items Items for which Beziers need to be generated
 * @param dimensions Dimensions with information about element width, height and horizontal and vertical spacing
 * @param lineType Type of line to be generated
 * @returns Bezier[] with the generated Beziers
 */
const generateBeziersPert = (items: Item[], dimensions: Dimensions, lineType: string): Bezier[] => {
    const arrowCompensation = lineType === "bezier" ? dimensions.arrowWidth : 0;

    return items
        .filter(item => item.children)
        .flatMap(item => {
            return item
                .children!.filter(child => child.x !== item.x || child.y !== item.y)
                .map(child => {
                    let startX = item.x;
                    let startY = item.y;
                    let endX = child.x;
                    let endY = child.y;
                    let controlStartX = 0;
                    let controlStartY = 0;
                    let controlEndX = 0;
                    let controlEndY = 0;

                    if (item.x < child.x) {
                        startX += dimensions.elementWidth;
                        startY += dimensions.elementHeight / 2;
                        endX -= arrowCompensation;
                        endY += dimensions.elementHeight / 2;
                        controlStartX = startX + (dimensions.bezierDelta * Math.abs(endX - startX)) / 100;
                        controlStartY = startY;
                        controlEndX = endX - (dimensions.bezierDelta * Math.abs(endX - startX)) / 100;
                        controlEndY = endY;
                    } else if (item.x > child.x) {
                        startY += dimensions.elementHeight / 2;
                        endX += dimensions.elementWidth + arrowCompensation;
                        endY += dimensions.elementHeight / 2;
                        controlStartX = startX - (dimensions.bezierDelta * Math.abs(endX - startX)) / 100;
                        controlStartY = startY;
                        controlEndX = endX + (dimensions.bezierDelta * Math.abs(endX - startX)) / 100;
                        controlEndY = endY;
                    } else if (item.y < child.y) {
                        startX += dimensions.elementWidth / 2;
                        startY += dimensions.elementHeight;
                        endX += dimensions.elementWidth / 2;
                        endY -= arrowCompensation;
                        controlStartX = startX;
                        controlStartY = startY + (dimensions.bezierDelta * Math.abs(endY - startY)) / 100;
                        controlEndX = endX;
                        controlEndY = endY - (dimensions.bezierDelta * Math.abs(endY - startY)) / 100;
                    } else if (item.y > child.y) {
                        startX += dimensions.elementWidth / 2;
                        endX += dimensions.elementWidth / 2;
                        endY += dimensions.elementHeight + arrowCompensation;
                        controlStartX = startX;
                        controlStartY = startY - (dimensions.bezierDelta * Math.abs(endY - startY)) / 100;
                        controlEndX = endX;
                        controlEndY = endY + (dimensions.bezierDelta * Math.abs(endY - startY)) / 100;
                    }
                    return lineType === "bezier"
                        ? {
                              id: startX + "-" + startY + "-" + endX + "-" + endY + Math.round(Math.random() * 1000000),
                              start: { x: startX, y: startY },
                              end: { x: endX, y: endY },
                              controlStart: { x: controlStartX, y: controlStartY },
                              controlEnd: { x: controlEndX, y: controlEndY }
                          }
                        : {
                              id: startX + "-" + startY + "-" + endX + "-" + endY + Math.round(Math.random() * 1000000),
                              start: { x: startX, y: startY },
                              end: { x: endX, y: endY }
                          };
                });
        });
};

/**
 * Creates a vertical line that starts at the bottom center of an item and runs downward, halfway down the vertical spacing
 *
 * @param item the item for which the line has to be created
 * @param dimensions Dimensions with information about element width, height and horizontal and vertical spacing
 * @returns Line
 */
const createVerticalLineParent = (item: Item, dimensions: Dimensions): Bezier => {
    const startX = item.x + dimensions.elementWidth / 2;
    const startY = item.y + dimensions.elementHeight;
    const endX = item.x + dimensions.elementWidth / 2;
    const endY = item.y + dimensions.elementHeight + dimensions.verticalSpacing / 2;

    return {
        id: startX + "-" + startY + "-" + endX + "-" + endY + Math.round(Math.random() * 1000000),
        start: {
            x: startX,
            y: startY
        },
        end: {
            x: endX,
            y: endY
        }
    };
};

/**
 * Creates a horizontal line that starts at halfway down the vertical spacing, from the center of the first child to the center of the last child
 *
 * @param item the item for which the line has to be created
 * @param dimensions Dimensions with information about element width, height and horizontal and vertical spacing
 * @returns Line
 */
const createHorizontalLine = (item: Item, dimensions: Dimensions): Bezier => {
    const startX = item.children![0].x + dimensions.elementWidth / 2;
    const startY = item.y + dimensions.elementHeight + dimensions.verticalSpacing / 2;
    const endX = item.children![item.children!.length - 1].x + dimensions.elementWidth / 2;
    const endY = item.y + dimensions.elementHeight + dimensions.verticalSpacing / 2;

    return {
        id: startX + "-" + startY + "-" + endX + "-" + endY + Math.round(Math.random() * 1000000),
        start: {
            x: startX,
            y: startY
        },
        end: {
            x: endX,
            y: endY
        }
    };
};

/**
 * Creates a vertical line that starts at the bottom center of an item and runs upward, halfway up the vertical spacing
 *
 * @param item the item for which the line has to be created
 * @param dimensions Dimensions with information about element width, height and horizontal and vertical spacing
 * @returns Line
 */
const createVerticalLineChild = (item: Item, dimensions: Dimensions): Bezier => {
    const startX = item.x + dimensions.elementWidth / 2;
    const startY = item.y - dimensions.verticalSpacing / 2;
    const endX = item.x + dimensions.elementWidth / 2;
    const endY = item.y;
    return {
        id: startX + "-" + startY + "-" + endX + "-" + endY + Math.round(Math.random() * 1000000),
        start: {
            x: startX,
            y: startY
        },
        end: {
            x: endX,
            y: endY
        }
    };
};

/**
 * Creates Line[] from parent side
 *
 * @param items Item[] to be processed
 * @param dimensions Dimensions with information about element width, height and horizontal and vertical spacing
 * @returns
 */
const createParentLines = (items: Item[], dimensions: Dimensions): Bezier[] => {
    return items
        .filter(item => item.children?.find(child => child.item))
        .flatMap(item => {
            const itemParentLines = [];
            itemParentLines.push(createVerticalLineParent(item, dimensions));
            if (item.children!.length > 1) {
                itemParentLines.push(createHorizontalLine(item, dimensions));
            }
            return itemParentLines;
        });
};

/**
 * Creates Line[] from child side
 * @param items Item[] to be processed
 * @param dimensions Dimensions with information about element width, height and horizontal and vertical spacing
 * @returns Line[] with lines from child side
 */
const createChildLines = (items: Item[], dimensions: Dimensions): Bezier[] => {
    return items.filter(item => item.parent).map(item => createVerticalLineChild(item, dimensions));
};

/**
 * Creates a list of Lines based on the input provided by the widget (through props)
 *
 * @param items Item[] for which Lines need to be created
 * @param dimensions Dimensions with information about element width, height and horizontal and vertical spacing
 * @returns Line[] with the Lines
 */
export const generateLines = (items: Item[], dimensions: Dimensions): Bezier[] => {
    if (!items) {
        return [];
    }
    return [...createParentLines(items, dimensions), ...createChildLines(items, dimensions)];
};

/**
 * Generates Beziers based on the Items to be connected and the configured dimensions for an Organogram
 *
 * A Bezier starts at the middle of the bottom of the parent Item and ends at the middle of the top of the child Item
 *
 * For lineType "bezier", two bezier control points are used at a configured distance from the start and end point
 *
 * @param items Items for which Beziers need to be generated
 * @param dimensions Dimensions with information about element width, height and horizontal and vertical spacing
 * @param lineType Type of line to be generated
 * @returns Bezier[] with the generated Beziers
 */
const generateBeziersOrganogram = (items: Item[], dimensions: Dimensions, lineType: string): Bezier[] => {
    switch (lineType) {
        case "square":
            return generateLines(items, dimensions);
        case "bezier":
        case "line":
            const arrowCompensation = lineType === "bezier" ? dimensions.arrowWidth : 0;

            return items
                .filter(item => item.children && item.showsChildren)
                .flatMap(item => {
                    return item
                        .children!.filter(child => child.x !== item.x || child.y !== item.y)
                        .map(child => {
                            const startX = item.x + dimensions.elementWidth / 2;
                            const startY = item.y + dimensions.elementHeight;
                            const endX = child.x + dimensions.elementWidth / 2;
                            const endY = child.y - arrowCompensation;
                            const controlStartX = startX;
                            const controlStartY = startY + (dimensions.bezierDelta * Math.abs(endY - startY)) / 100;
                            const controlEndX = endX;
                            const controlEndY = endY - (dimensions.bezierDelta * Math.abs(endY - startY)) / 100;

                            return lineType === "bezier"
                                ? {
                                      id:
                                          startX +
                                          "-" +
                                          startY +
                                          "-" +
                                          endX +
                                          "-" +
                                          endY +
                                          Math.round(Math.random() * 1000000),
                                      start: { x: startX, y: startY },
                                      end: { x: endX, y: endY },
                                      controlStart: { x: controlStartX, y: controlStartY },
                                      controlEnd: { x: controlEndX, y: controlEndY }
                                  }
                                : {
                                      id:
                                          startX +
                                          "-" +
                                          startY +
                                          "-" +
                                          endX +
                                          "-" +
                                          endY +
                                          Math.round(Math.random() * 1000000),
                                      start: { x: startX, y: startY },
                                      end: { x: endX, y: endY }
                                  };
                        });
                });
        default:
            throw new Error("Unsupported lineType: " + lineType);
    }
};

/**
 * Generates Beziers based on the Items to be connected and the configured dimensions.
 *
 * A Bezier either (depending on the relative position of the Items):
 * - starts at the middle of the left/right of the parent Item and ends at the middle of the right/left of the child Item
 * - starts at the middle of the bottom/top of the parent Item and ends at the middle of the top/bottom of the child Item
 *
 * In the horizontal direction, two bezier control points are used at a configured distance from the start and end point
 *
 * @param items Items for which Beziers need to be generated
 * @param dimensions Dimensions with information about element width, height and horizontal and vertical spacing
 * @param lineType Type of line to be generated
 * @returns Bezier[] with the generated Beziers
 */
export const generateBeziers = (
    items: Item[],
    dimensions: Dimensions,
    lineType: string,
    widgetType: string
): Bezier[] => {
    if (!items) {
        return [];
    }

    switch (widgetType) {
        case "pert":
            return generateBeziersPert(items, dimensions, lineType);
        case "organogram":
            return generateBeziersOrganogram(items, dimensions, lineType);
        case "tree":
            throw new Error("Tree does not support bezier curves");
        default:
            throw new Error("unsupported widget type: " + widgetType);
    }
};
