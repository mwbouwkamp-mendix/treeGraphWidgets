import { createElement, ReactElement } from "react";
import { Item } from "@treegraphwidgets/TreeGraphWidgetsCore/src/models/Item";
import TreeView from "./TreeView";
import { v4 as uuidv4 } from "uuid";
import styles from "../ui/SlidingTreeView.module.css";

export interface TreeLinesProps {
    itemMatrix: Item[][];
}

const Treeviews = ({ itemMatrix }: TreeLinesProps): ReactElement => {
    const treeViews = itemMatrix.map(items => <TreeView key={uuidv4()} items={items} />);

    return <div className={styles.container}>{treeViews}</div>;
};

export default Treeviews;
