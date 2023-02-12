import { useState } from "react";
import { Dimensions } from "../models/Dimensions";

const useDimensions = (
    elementWidth: number,
    elementHeight: number,
    horizontalSpacing: number,
    verticalSpacing: number,
    horizontalSpacingFactor: number,
    bezierDelta: number,
    arrowWidth: number
): Dimensions => {
    const [dimensions] = useState<Dimensions>({
        elementWidth,
        elementHeight,
        horizontalSpacing,
        verticalSpacing,
        horizontalSpacingFactor,
        bezierDelta,
        arrowWidth
    });

    return dimensions;
};

export default useDimensions;
