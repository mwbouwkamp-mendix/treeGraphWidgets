/**
 * This file was generated from TreeList.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { ComponentType, CSSProperties } from "react";
import { ListValue, ListAttributeValue, ListWidgetValue } from "mendix";
import { Big } from "big.js";

export type WidgetTypeEnum = "tree" | "organogram" | "pert";

export type LineTypeEnum = "line" | "bezier" | "square";

export interface TreeListContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    widgetType: WidgetTypeEnum;
    height: number;
    dataMicroflow: ListValue;
    self: ListAttributeValue<string>;
    parent?: ListAttributeValue<string>;
    hasFocus: ListAttributeValue<boolean>;
    hasChildren?: ListAttributeValue<boolean>;
    showsChildren?: ListAttributeValue<boolean>;
    elementWidth: number;
    elementHeight: number;
    hSpacing: number;
    vSpacing: number;
    bezierDelta: number;
    arrowWidth: number;
    lineType: LineTypeEnum;
    lineStyle: string;
    boxContent?: ListWidgetValue;
    dataMicroflowEdge?: ListValue;
    parentEdge?: ListAttributeValue<string>;
    childEdge?: ListAttributeValue<string>;
    column?: ListAttributeValue<Big>;
}

export interface TreeListPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    widgetType: WidgetTypeEnum;
    height: number | null;
    dataMicroflow: {} | { type: string } | null;
    self: string;
    parent: string;
    hasFocus: string;
    hasChildren: string;
    showsChildren: string;
    elementWidth: number | null;
    elementHeight: number | null;
    hSpacing: number | null;
    vSpacing: number | null;
    bezierDelta: number | null;
    arrowWidth: number | null;
    lineType: LineTypeEnum;
    lineStyle: string;
    boxContent: { widgetCount: number; renderer: ComponentType<{ caption?: string }> };
    dataMicroflowEdge: {} | { type: string } | null;
    parentEdge: string;
    childEdge: string;
    column: string;
}
