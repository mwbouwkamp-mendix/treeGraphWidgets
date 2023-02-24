import { LineTypeEnum } from "@treegraphwidgets/treegraphwidgetscore/typings/TreeGraphWidgetsCoreProps";

export interface LineLayout {
    lineType: LineTypeEnum;
    bezierDelta: number;
    arrowWidth: number;
}
