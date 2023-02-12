import { createElement, Fragment, ReactElement } from "react";
import { Item } from "../models/Item";
import ScreenItem from "./ScreenItem";

export interface ScreenItemListProps {
    items: Item[];
    elementWidth: number;
    elementHeight: number;
}

const ScreenItemList = (props: ScreenItemListProps): ReactElement => {
    const createScreenItems = (items: Item[], elementWidth: number, elementHeight: number): ReactElement[] => {
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
                    width={elementWidth}
                    height={elementHeight}
                    item={item.widgetContent}
                />
            ));
    };

    return <Fragment>{createScreenItems(props.items, props.elementWidth, props.elementHeight)}</Fragment>;
};

export default ScreenItemList;
