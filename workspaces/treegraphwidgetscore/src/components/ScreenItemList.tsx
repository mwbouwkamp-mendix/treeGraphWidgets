import { createElement, Fragment, ReactElement } from "react";
import { Dimensions } from "../models/Dimensions";
import { Item } from "../models/Item";
import ScreenItem from "./ScreenItem";

export interface ScreenItemListProps {
    items: Item[];
    dimensions: Dimensions;
}

const ScreenItemList = (props: ScreenItemListProps): ReactElement => {
    const createScreenItems = (items: Item[], dimensions: Dimensions): ReactElement[] => {
        if (!items) {
            return [];
        }
        return items
            .filter(item => item.item)
            .map(item => (
                <ScreenItem
                    key={item.id}
                    left={item.x}
                    top={item.y}
                    width={dimensions.elementWidth}
                    height={dimensions.elementHeight}
                    item={item.widgetContent}
                />
            ));
    };

    return <Fragment>{createScreenItems(props.items, props.dimensions)}</Fragment>;
};

export default ScreenItemList;
