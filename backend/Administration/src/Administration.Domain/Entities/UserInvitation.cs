using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Administration.Domain.Common;

namespace Administration.Domain.Entities;
public class UserInvitation : BaseEntity
{

    public User User { get; set; }
    public long UserId { get; set; }
    public DateTime ExpirationDate { get; set; }

}
