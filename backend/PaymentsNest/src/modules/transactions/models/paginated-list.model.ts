export class PaginatedList<T> {
  items: T[];
  totalPages: number;
  totalCount: number;

  constructor(items: T[], count: number, pageSize: number) {
    this.totalPages = Math.ceil(count / pageSize);
    this.items = items;
    this.totalCount = count;
  }
}
