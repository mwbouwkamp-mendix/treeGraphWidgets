import { ReactElement, createElement } from "react";

export function preview(): ReactElement {
    return <div />;
}

export function getPreviewCss(): string {
    return require("./ui/OrgChart.css");
}
