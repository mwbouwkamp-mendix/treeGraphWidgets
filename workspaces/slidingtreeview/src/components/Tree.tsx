import { createElement, ReactElement } from "react";
import { Item } from "@treegraphwidgets/TreeGraphWidgetsCore/src/models/Item";
import Treeviews from "./TreeViews";
import { getRootItem } from "@treegraphwidgets/TreeGraphWidgetsCore/src/utils/ItemUtils";

export interface TreeProps {
    items: Item[];
}

const Tree = ({ items }: TreeProps): ReactElement => {
    let itemMatrix: Item[][] = []

    const rootItems = getRootItem(items);
    itemMatrix.push(rootItems);

    let itemShowingChildren = rootItems.find(item => item.showsChildren);
    while (!!itemShowingChildren) {
        const childItems = items.filter(item => item.parent === itemShowingChildren!.id);
        itemMatrix.push(childItems);
        itemShowingChildren = childItems.find(item => item.showsChildren);
    }

    return <Treeviews itemMatrix={itemMatrix} />;
};

export default Tree;
