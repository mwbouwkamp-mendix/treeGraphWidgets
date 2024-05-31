import { createElement, ReactElement } from "react";
import { Item } from "@treegraphwidgets/TreeGraphWidgetsCore/src/models/Item";
import TreeLines from "./TreeLines";

export interface TreeProps {
    items: Item[];
}

const Tree = (props: TreeProps): ReactElement => {
    return <TreeLines items={props.items} />;
};

export default Tree;
