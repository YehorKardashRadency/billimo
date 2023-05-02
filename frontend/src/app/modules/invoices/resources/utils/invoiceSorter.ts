import { Invoice } from "../models/Invoice";

function compareStrings(a: string, b: string) {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}
const compareNumbers = (a: number, b: number) => a - b;

export default function sortInvoices(invoices: Invoice[], sortProp: string | undefined, sortAscending: boolean) {
  if (sortProp !== undefined) {
    const sortOrder = sortAscending ? 1 : -1;
    invoices.sort((a: any, b: any) => {
      let aProp = getProp(sortProp, a);
      let bProp = getProp(sortProp, b);
      if (aProp === undefined || bProp === undefined) return 0;
      if (
        typeof aProp === 'string'
        && typeof bProp === 'string'
      )
      {
        if (isDate(aProp) && isDate(bProp))
          return compareNumbers(Date.parse(aProp), Date.parse(bProp)) * sortOrder;
        if (aProp.includes("INV-") && bProp.includes("INV-")) {
          aProp = parseInt(aProp.split("INV-")[1]);
          bProp = parseInt(bProp.split("INV-")[1]);
        }
        return compareStrings(aProp, bProp) * sortOrder;
      }
      if (
        typeof aProp === 'number'
        && typeof bProp === 'number'
      )
      {
        return compareNumbers(aProp, bProp) * sortOrder;
      }
      return 0;
    })
  }
  return invoices
}


function getProp(path: string, obj: any): any {
  return path.split('.').reduce((p, c) => p && p[c] || null, obj)
}
var isDate = function (date: string) {
  const parsed = Date.parse(date);
  return !isNaN(parsed);
}
