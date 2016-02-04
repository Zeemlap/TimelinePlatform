using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TimelinePlatform.Utilities;

namespace TimelinePlatform.Test
{
    class Program
    {
        static void Main(string[] args)
        {
            string password = "Y5NGM2ZDgwND";
            var users = new[]
            {
                new { EmailAddress = "jasperbrekelmans@gmail.com", Name = "Zeemlap", },
                new { EmailAddress = "jasper.brekelmans@gmail.com", Name = "jabrekelmans", },
            };
            var sb = new StringBuilder();
            sb.AppendLine("INSERT INTO Users(EmailAddressPadded,NamePadded,CreationTimePoint,PasswordSalt,PasswordHash)");
            sb.AppendLine("VALUES");
            foreach (var user in users)
            {
                byte[] passwordSalt = CommonUtilities.GeneratePasswordSalt();
                byte[] passwordHash = CommonUtilities.ComputePasswordHash(passwordSalt, password);
                sb.AppendLine($"\t('{user.EmailAddress}','{user.Name}',GETUTCDATE(),0x{BitConverter.ToString(passwordSalt).Replace("-", "")},0x{BitConverter.ToString(passwordHash).Replace("-", "")}),");
            }
            int n = Environment.NewLine.Length + 1;
            sb.Remove(sb.Length - n, n);
            Console.WriteLine(sb.ToString());
            Console.ReadLine();
        }
    }
}
