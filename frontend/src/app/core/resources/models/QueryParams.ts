import { Filter } from "./Filter";
import { Sort } from "./Sort";

export interface QueryParams {
    filter: Filter[];
    search: string | null;
    sort: Sort[];
    pageIndex:number;
    pageSize:number;
}
