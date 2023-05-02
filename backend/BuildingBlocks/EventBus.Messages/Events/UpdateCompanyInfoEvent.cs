using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EventBus.Messages.Events
{
    public class UpdateCompanyInfoEvent : IntegrationBaseEvent
    {
        public long RefId { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}
