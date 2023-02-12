import { Coordinate } from "./Coordinate";

export interface Bezier {
    id: string;
    start: Coordinate;
    end: Coordinate;
    controlStart?: Coordinate;
    controlEnd?: Coordinate;
}
