import { createElement, ReactElement } from "react";
import { Item } from "@treegraphwidgets/TreeGraphWidgetsCore/src/models/Item";
import classes from "./TreeLine.module.css";

export interface TreeLineProps {
    item: Item;
}

const TreeLine = (props: TreeLineProps): ReactElement => {
    return (
        <div className={`tree-list-line ${classes.container}`}>
            <div className="tree-list-line-indentation" style={{ width: props.item.x }}></div>
            <div className={`tree-list-line-content ${classes.main}`}>{props.item.widgetContent}</div>
        </div>
    );
};

export default TreeLine;
