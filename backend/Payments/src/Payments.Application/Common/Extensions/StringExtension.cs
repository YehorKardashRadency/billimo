namespace Payments.Application.Common.Extensions;

public static class StringExtension
{
    public static string ConvertDecimalToMoney(this decimal value)
    {
        return value.ToString("F").Replace(",", ".");
    }
}