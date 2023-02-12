import { ObjectItem } from "mendix";
import { ReactNode } from "react";

export interface Item {
    id: string;
    widgetContent: ReactNode;
    self: string;
    parent?: string;
    children: Item[] | null;
    item: ObjectItem | null;
    level: number;
    y: number;
    x: number;
    isRoot: boolean;
    hasFocus: boolean;
    showsChildren?: boolean;
}
