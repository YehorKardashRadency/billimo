namespace Invoicing.Application.MyEntity.Queries;

public class MyEntityDto
{
    public string Name { get; set; }
    public MyEntityDetailDto Detail { get; set; }
}

public class MyEntityDetailDto
{
    public string Detail { get; set; }
}
