using Administration.Application.Common.Interfaces;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Processing;
namespace Administration.Infrastructure.Services;
public class ThumbnailService: IThumbnailService
{
    public byte[] ResizeImage(string base64Image, Size destinationSize)
    {
        byte[] bytes = Convert.FromBase64String(base64Image);
        var image = Image.Load(bytes);

        image.Mutate(x => x.Resize(new ResizeOptions()
        {
            Size = destinationSize,
            Mode = ResizeMode.Crop,
        }));

        using var memoryStream = new MemoryStream();
        image.Save(memoryStream, new PngEncoder());
        return memoryStream.ToArray();
    }

    public long GetOriginalLengthInBytes(string base64string)
    {
        if (string.IsNullOrEmpty(base64string))
            return 0;

        var split = base64string.Split(",", 2);
        if (split.Length < 2)
            throw new ArgumentException(nameof(base64string));

        base64string = split.Last();
        var characterCount = base64string.Length;
        var paddingCount = base64string.Substring(characterCount - 2, 2).Count(c => c == '=');
        return 3 * (characterCount / 4) - paddingCount;
    }
}
