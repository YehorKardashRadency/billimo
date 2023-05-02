using AutoMapper;
using Invoicing.Application.Common.Mapping;
using Invoicing.Domain.Common;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Invoicing.Application.Common.Models.Request;
public class Request : IMapFrom<RequestDto>
{
    public string? Search { get; set; }
    public ICollection<Sort> Sort { get; set; } = new List<Sort>();
    public ICollection<Filter> Filter { get; set; } = new List<Filter>();
    public virtual void Mapping(Profile profile)
    {
        profile.CreateMap<RequestDto, Request>()
            .ForMember(x => x.Sort, y => y.MapFrom((s) => getSortFromQuery(s.Sort)))
            .ForMember(x => x.Filter, y => y.MapFrom((s) => getFilterFromQuery(s.Filter)));
    }

    public virtual ICollection<Filter> getFilterFromQuery(string[]? strings)
    {
        var filter = new List<Filter>();
        if (strings == null) return filter;
        strings.ToList().ForEach(x => { 
            var filterSettings = SplitIgnoreQuotes(x, " ");
            if (filterSettings.Count == 3)
            {
                filter.Add(new Filter { Key = filterSettings[0], FilterType = (FilterType)int.Parse(filterSettings[1]), Value = filterSettings[2]});
            }
        });
        return filter;
    }

    public virtual ICollection<Sort> getSortFromQuery(string[]? strings)
    {       
        var sort = new List<Sort>();
        if (strings == null) return sort;
        strings.ToList().ForEach(x => {
            var sortSetting = SplitIgnoreQuotes(x, " ");
            if (sortSetting.Count == 2) {
                sort.Add(new Sort { Field = sortSetting[0], direction = (SortDirection)int.Parse(sortSetting[1])});
            }
        });

        return sort;
    }

    private IList<string> SplitIgnoreQuotes(string input, string separator)
    {
        List<string> tokens = new();
        int startPosition = 0;
        bool isInQuotes = false;
        for (int currentPosition = 0; currentPosition < input.Length; currentPosition++)
        {
            if (input[currentPosition] == (char)34 || input[currentPosition] == (char)8220 || input[currentPosition] == (char)8221)
            {
                isInQuotes = !isInQuotes;
            }
            else if (input[currentPosition].ToString() == separator && !isInQuotes)
            {
                var resStr = input.Substring(startPosition, currentPosition - startPosition).Trim((char)32, (char)34, (char)8220, (char)8221);
                tokens.Add(resStr);
                startPosition = currentPosition + 1;
            }
        }

        string lastToken = input.Substring(startPosition).Trim((char)32, (char)34, (char)8220, (char)8221);
        if (lastToken.Equals(separator))
        {
            tokens.Add("");
        }
        else
        {
            tokens.Add(lastToken);
        }

        return tokens;
    }
}
