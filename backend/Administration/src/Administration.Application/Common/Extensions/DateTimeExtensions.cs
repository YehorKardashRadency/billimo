namespace Administration.Application.Common.Extensions;
public static class DateTimeExtensions
{
    public static string TimeAgo(this DateTime dateTime)
    {
        var timeSpan = DateTime.UtcNow.Subtract(dateTime);

        return timeSpan switch
        {
            { TotalSeconds: < 60 } => $"now",

            { TotalMinutes: < 60 } => timeSpan.Minutes > 1 ? $"{timeSpan.Minutes} minutes ago" : "a minute ago",

            { TotalHours: < 24 } => timeSpan.Hours > 1 ? $"{timeSpan.Hours} hours ago" : "an hour ago",

            { TotalDays: < 30 } => timeSpan.Days > 1 ? $"{timeSpan.Days} days ago" : "yesterday",

            { TotalDays: < 365 } => timeSpan.Days / 30 > 1 ? $"{timeSpan.Days / 30} months ago" : "a month ago",

            _ => timeSpan.Days / 365 > 1 ? $"{timeSpan.Days / 365} years ago" : "a year ago"
        };
    }
}
