import { createElement, ReactElement, useEffect, useRef } from "react";
import { TreeGraphWidgetsCoreContainerProps } from "../../typings/TreeGraphWidgetsCoreProps";

import classes from "../TreeGraphWidgetsCore.module.css";
import useScreenElements from "../hooks/useScreenElements";
import Tree from "./Tree";
import Pert from "./Pert";

const BreakdownStructureComponent = (props: TreeGraphWidgetsCoreContainerProps): ReactElement => {
    const ref = useRef<HTMLDivElement>(null);

    const width = useRef(0);

    const { items, beziers, dimensions, focusedItemProps } = useScreenElements(props);

    useEffect(() => {
        width.current = ref.current!.getBoundingClientRect().width;
    }, []);

    return (
        <div
            ref={ref}
            className={props.widgetType === "tree" ? classes.tree : classes.organogram}
            style={{
                height: props.height
            }}
        >
            {props.widgetType === "tree" && <Tree items={items} />}
            {props.widgetType === "pert" && (
                <Pert
                    width={width.current}
                    height={props.height}
                    elementWidth={props.elementWidth}
                    elementHeight={props.elementHeight}
                    focusedItemProps={focusedItemProps}
                    items={items}
                    beziers={beziers}
                    dimensions={dimensions}
                    lineType={props.lineType}
                    lineStyle={props.lineStyle}
                />
            )}
        </div>
    );
};

export default BreakdownStructureComponent;
