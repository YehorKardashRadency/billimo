using Administration.Application.Common.Models;
using Administration.Application.Companies.Dto;
using Administration.Application.Notifications.Queries.GetNotificationsWithPagination;
using Microsoft.AspNetCore.Mvc;

namespace Administration.Controllers;

public class NotificationsController: ApiControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PaginatedList<NotificationDto>>> GetNotificationsAsync
        ([FromQuery] GetNotificationsWithPaginationQuery query)
    {
        return await Mediator.Send(query);
    }
}
