import { Edge } from "../Edge";
import { Item } from "../Item";
import { ItemLayout } from "../ItemLayout";
import ItemsFactory from "./ItemsFactory";

export default abstract class TreeItemsFactory extends ItemsFactory {
    abstract override setChildren(widgetType: string, edges: Edge[]): Item[];
    abstract override setXValues(currentItems: Item[], itemLayout: ItemLayout, widgetType: string): Item[];
    abstract override setYValues(itemLayout: ItemLayout, widgetType: string): Item[];
    abstract override sortItems(): Item[];
}
