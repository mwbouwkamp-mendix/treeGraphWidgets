/**
 * This file was generated from PertChart.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { ComponentType, CSSProperties, ReactNode } from "react";
import { ListValue, ListAttributeValue, ListWidgetValue } from "mendix";
import { Big } from "big.js";

export type LineTypeEnum = "line" | "bezier" | "square";

export interface PertChartContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    height: number;
    dataMicroflow: ListValue;
    self: ListAttributeValue<string>;
    hasFocus: ListAttributeValue<boolean>;
    elementWidth: number;
    elementHeight: number;
    hSpacing: number;
    vSpacing: number;
    bezierDelta: number;
    arrowWidth: number;
    lineType: LineTypeEnum;
    lineStyle: string;
    boxContent: ListWidgetValue;
    dataMicroflowEdge: ListValue;
    parentEdge: ListAttributeValue<string>;
    childEdge?: ListAttributeValue<string>;
    column?: ListAttributeValue<Big>;
}

export interface PertChartPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    height: number | null;
    dataMicroflow: {} | { caption: string } | { type: string } | null;
    self: string;
    hasFocus: string;
    elementWidth: number | null;
    elementHeight: number | null;
    hSpacing: number | null;
    vSpacing: number | null;
    bezierDelta: number | null;
    arrowWidth: number | null;
    lineType: LineTypeEnum;
    lineStyle: string;
    boxContent: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    dataMicroflowEdge: {} | { caption: string } | { type: string } | null;
    parentEdge: string;
    childEdge: string;
    column: string;
}
