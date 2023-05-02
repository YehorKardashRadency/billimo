import { MatMenu, MatMenuPanel } from '@angular/material/menu';
import { ElementRef } from "@angular/core";
import { TableHeaderCellType } from "./TableHeaderCellType";
import { TableRowCellType } from "./TableRowCellType";

export interface TableHeaderCell{
    id:number,
    type:TableHeaderCellType,
    order:number,
    sortName?:string,
    minWidth?: string,
    flex?:string,
    maxWidth?:string,
    width?:string,
    text?:string,
    value?:any
    rowType:TableRowCellType,
    rowDataName: string[],
    menuRef?: MatMenu,
    isSortAscending?: boolean,
    isSortDescending?: boolean,
}
