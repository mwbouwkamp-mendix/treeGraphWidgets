/**
 * This file was generated from TreeList.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { ComponentType, CSSProperties } from "react";
import { ListValue, ListAttributeValue, ListWidgetValue } from "mendix";

export interface TreeListContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    height: number;
    dataMicroflow: ListValue;
    self: ListAttributeValue<string>;
    parent?: ListAttributeValue<string>;
    hasFocus: ListAttributeValue<boolean>;
    hasChildren?: ListAttributeValue<boolean>;
    showsChildren?: ListAttributeValue<boolean>;
    indentation: number;
    boxContent?: ListWidgetValue;
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
    height: number | null;
    dataMicroflow: {} | { type: string } | null;
    self: string;
    parent: string;
    hasFocus: string;
    hasChildren: string;
    showsChildren: string;
    indentation: number | null;
    boxContent: { widgetCount: number; renderer: ComponentType<{ caption?: string }> };
}
