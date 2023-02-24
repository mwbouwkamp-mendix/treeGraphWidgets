import { ReactElement, createElement, useEffect, useRef } from "react";
import { TreeListContainerProps } from "../typings/TreeListProps";

import useScreenElements from "@treegraphwidgets/treegraphwidgetscore/src/hooks/useScreenElements";
import classes from "@treegraphwidgets/treegraphwidgetscore/src/TreeGraphWidgetsCore.module.css";

import "./ui/TreeList.css";
import Tree from "./components/Tree";
import { ItemLayout } from "@treegraphwidgets/treegraphwidgetscore/src/models/ItemLayout";

export function TreeList(props: TreeListContainerProps): ReactElement {
    if (
        !props.dataMicroflow.items ||
        !props.self ||
        !props.boxContent
    ) {
        return <div />;
    }

    const ref = useRef<HTMLDivElement>(null);

    const width = useRef(0);

    const itemLayout: ItemLayout = {
        elementWidth: 0,
        elementHeight: 0,
        horizontalSpacing: props.indentation,
        verticalSpacing: 0,
        horizontalSpacingFactor: 0,
    };

    const { items } = useScreenElements(
        {
            widgetType: "tree",
            dataMicroflow: props.dataMicroflow,
            self: props.self,
            parent: props.parent,
            hasFocus: props.hasFocus,
            hasChildren: props.hasChildren,
            showsChildren: props.showsChildren,
            itemLayout,
            lineLayout: undefined,
            boxContent: props.boxContent,
            dataMicroflowEdge: undefined,
            parentEdge: undefined,
            childEdge: undefined,
            column: undefined
        }
    );

    useEffect(() => {
        width.current = ref.current!.getBoundingClientRect().width;
    }, []);

    return (
        <div
            ref={ref}
            className={classes.tree}
            style={{
                height: props.height
            }}
        >
            <Tree items={items} />
        </div>
    );
}
