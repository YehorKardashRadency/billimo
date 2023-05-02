
namespace Administration.Application.Common.Interfaces;
public interface IThumbnailService
{
    byte[] ResizeImage(string base64Image, Size destinationSize);
    long GetOriginalLengthInBytes(string base64string);
}
