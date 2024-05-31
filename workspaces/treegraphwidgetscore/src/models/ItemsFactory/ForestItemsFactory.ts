import { Item } from "../Item";
import TreeItemsFactory from "./TreeItemsFactory";

export default abstract class ForestItemsFactory extends TreeItemsFactory {
    override setChildren(): Item[] {
        return this.setChildrenBase(true);
    }
}