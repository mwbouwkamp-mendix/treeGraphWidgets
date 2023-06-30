import { Item } from "@treegraphwidgets/TreeGraphWidgetsCore/src/models/Item";
import { ReactElement, createElement } from "react";
import { TreeListPreviewProps } from "typings/TreeListProps";
import Tree from "./components/Tree";
import classes from "@treegraphwidgets/treegraphwidgetscore/src/TreeGraphWidgetsCore.module.css";

export function preview(props: TreeListPreviewProps): ReactElement {
    const previewContent = props.boxContent ? (
        <props.boxContent.renderer>
            <div />
        </props.boxContent.renderer>
    ) : (
        <div />
    );

    const items: Item[] = [
        {
            id: "1",
            widgetContent: previewContent,
            self: "1",
            parent: "",
            children: null,
            item: null,
            level: 1,
            y: 0,
            x: 0,
            isRoot: true,
            hasFocus: true,
            showsChildren: false
        },
        {
            id: "2",
            widgetContent: previewContent,
            self: "2",
            parent: "1",
            children: null,
            item: null,
            level: 1,
            y: 0,
            x: props.indentation ? props.indentation : 100,
            isRoot: false,
            hasFocus: true,
            showsChildren: false
        },
        {
            id: "3",
            widgetContent: previewContent,
            self: "3",
            parent: "1",
            children: null,
            item: null,
            level: 1,
            y: 0,
            x: props.indentation ? props.indentation : 100,
            isRoot: false,
            hasFocus: true,
            showsChildren: false
        },
        {
            id: "4",
            widgetContent: previewContent,
            self: "4",
            parent: "",
            children: null,
            item: null,
            level: 1,
            y: 0,
            x: 0,
            isRoot: true,
            hasFocus: true,
            showsChildren: false
        },
        {
            id: "5",
            widgetContent: previewContent,
            self: "5",
            parent: "",
            children: null,
            item: null,
            level: 1,
            y: 0,
            x: 0,
            isRoot: true,
            hasFocus: true,
            showsChildren: false
        }
    ];

    return (
        <div>
            <div
                className={classes.tree}
                style={{
                    height: props.height ? props.height : 0
                }}
            >
                <Tree items={items} />
            </div>
        </div>
    );
}

export function getPreviewCss(): string {
    return require("./ui/TreeList.css");
}
