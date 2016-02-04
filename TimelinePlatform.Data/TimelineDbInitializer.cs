using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimelinePlatform.Data
{
    public class TimelineDbInitializer : IDatabaseInitializer<TimelineDbContext>
    {
        public void InitializeDatabase(TimelineDbContext context)
        {
            var exists = context.Database.Exists();
            if (exists)
            {
                if (context.Database.CompatibleWithModel(true)) 
                {
                    return;
                }
            }
            context.Database.Delete();
            context.Database.Create();
            TimelineDbContext.InitializeAndSeed(context);
        }
    }
}
