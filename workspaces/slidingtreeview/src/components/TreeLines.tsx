import { createElement, Fragment, ReactElement } from "react";
import { Item } from "@treegraphwidgets/TreeGraphWidgetsCore/src/models/Item";
import TreeLine from "./TreeLine";

export interface TreeLinesProps {
    items: Item[];
}

const TreeLines = (props: TreeLinesProps): ReactElement => {
    const treeLines = props.items.map(item => <TreeLine key={item.self} item={item} />);

    return <Fragment>{treeLines}</Fragment>;
};

export default TreeLines;
