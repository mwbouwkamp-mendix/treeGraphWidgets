import { createElement, ReactElement } from "react";
import { Item } from "@treegraphwidgets/TreeGraphWidgetsCore/src/models/Item";
import styles from "../ui/SlidingTreeView.module.css";

export interface TreeLineProps {
    items: Item[];
}

const TreeView = ({ items }: TreeLineProps): ReactElement => {
    const itemList = items.map(item => <div key={item.id}>{item.widgetContent}</div>)
    return (
        <div className={styles.panel}>
            {itemList}
        </div>
    );
};

export default TreeView;
