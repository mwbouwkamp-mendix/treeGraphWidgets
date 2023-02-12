import { ReactElement, createElement, useEffect, useRef } from "react";
import { TreeListContainerProps } from "../typings/TreeListProps";

import useScreenElements from "@treegraphwidgets/treegraphwidgetscore/src/hooks/useScreenElements";
import classes from "@treegraphwidgets/treegraphwidgetscore/src/TreeGraphWidgetsCore.module.css";

import "./ui/TreeList.css";
import Tree from "./components/Tree";

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

    const { items } = useScreenElements(
        {
            name: props.name,
            class: props.class,
            style: props.style,
            tabIndex: props.tabIndex,
            widgetType: props.widgetType,
            height: props.height,
            dataMicroflow: props.dataMicroflow,
            self: props.self,
            parent: props.parent,
            hasFocus: props.hasFocus,
            hasChildren: props.hasChildren,
            showsChildren: props.showsChildren,
            elementWidth: props.elementWidth,
            elementHeight: props.elementHeight,
            hSpacing: props.hSpacing,
            vSpacing: props.vSpacing,
            bezierDelta: props.bezierDelta,
            arrowWidth: props.arrowWidth,
            lineType: props.lineType,
            lineStyle: props.lineStyle,
            boxContent: props.boxContent,
            dataMicroflowEdge: props.dataMicroflowEdge,
            parentEdge: props.parentEdge,
            childEdge: props.childEdge,
            column: props.column
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
            {props.widgetType === "tree" && <Tree items={items} />}
        </div>
    );
}
