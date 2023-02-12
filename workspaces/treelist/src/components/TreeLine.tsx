import { createElement, ReactElement } from "react";
import { Item } from "@treegraphwidgets/TreeGraphWidgetsCore/src/models/Item";
import classes from "./TreeLine.module.css";

export interface TreeLineProps {
    item: Item;
}

const TreeLine = (props: TreeLineProps): ReactElement => {
    return (
        <div className={classes.container}>
            <div style={{ width: props.item.x }}></div>
            <div className={classes.main}>{props.item.widgetContent}</div>
        </div>
    );
};

export default TreeLine;
