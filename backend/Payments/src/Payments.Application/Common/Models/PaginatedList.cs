using Microsoft.EntityFrameworkCore;

namespace Payments.Application.Common.Models;
public class PaginatedList<T>
{
    public IReadOnlyCollection<T> Items { get; }
    public int TotalPages { get; }
    public int TotalCount { get; }

    public PaginatedList(IReadOnlyCollection<T> items, int count, int pageSize)
    {
        TotalPages = (int)Math.Ceiling(count / (double)pageSize);
        TotalCount = count;
        Items = items;
    }

}

public static class ApplicationExtension
{
    public static async Task<PaginatedList<T>> Pagination<T>(this IQueryable<T> source, int pageNumber, int pageSize)
    {
        var count = await source.CountAsync();
        var items = await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

        return new PaginatedList<T>(items, count, pageSize);
    }
}