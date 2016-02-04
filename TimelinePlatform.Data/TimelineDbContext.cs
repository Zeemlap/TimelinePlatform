using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Infrastructure.Annotations;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using TimelinePlatform.Utilities;

namespace TimelinePlatform.Data
{
    public class TimelineDbContext : DbContext
    {
        internal const int UserNameMaxLength = 32;
        internal const int EmailAddressMaxLength = 128;
        private static readonly StringValidator s_emailAddressValidator = new StringValidator()
        {
            MaxLength = EmailAddressMaxLength,
            IsRequired = true,
            NormalizationFunctions_PreValidationFirst = StringNormalizationFunctions.EmptyStringToNull,
            RegexThatMatchesValidValues = new Regex(
               @"^(?("")("".+?(?<!\\)""@)|(([0-9a-z]((\.(?!\.))|[-!#\$%&'\*\+/=\?\^`\{\}\|~\w])*)(?<=[0-9a-z])@))" +
               @"(?(\[)(\[(\d{1,3}\.){3}\d{1,3}\])|(([0-9a-z][-\w]*[0-9a-z]*\.)+[a-z0-9][\-a-z0-9]{0,22}[a-z0-9]))$",
               RegexOptions.IgnoreCase | RegexOptions.Compiled),
        }.Seal();
        private static readonly StringValidator s_usernameValidator = new StringValidator()
        {
            MinLength = 4,
            MaxLength = UserNameMaxLength,
            IllegalCharacters = new char[] { '@', },
            NormalizationFunctions_PreValidationFirst = StringNormalizationFunctions.TrimTrailingAsciiSpaces | StringNormalizationFunctions.EmptyStringToNull,
        }.Seal();
        public const int RoleNameMaxLength = 16;

        public TimelineDbContext(string nameOrConnectionString)
            : base(nameOrConnectionString)
        {
            Configuration.ValidateOnSaveEnabled = false;
        }
      
        public InsertOrUpdateOneUserErrorCode ParseInsertOrUpdateOneUserErrorCode(SqlException sqlEx)
        {
            return ExceptionParsing.ParseInsertOrUpdateOneUserErrorCode(sqlEx);
        }
        public InsertOrUpdateOneUserErrorCode ParseInsertOrUpdateOneUserErrorCode(DbUpdateException dbUpdateEx)
        {
            return ExceptionParsing.ParseInsertOrUpdateOneUserErrorCode(dbUpdateEx);
        }

        public StringValidator EmailAddressValidator { get; } = s_emailAddressValidator;
        public StringValidator UsernameValidator { get; } = s_usernameValidator;


        public DbSet<User> Users { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Timeline> Timelines { get; set; }
        public DbSet<TimelineEvent> TimelineEvents { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder
                .Entity<TimelineEvent>()
                .Property(t => t.TimePoint)
                .HasColumnType("datetime2");

            modelBuilder
                .Entity<User>()
                .Property(u => u.CreationTimePoint)
                .HasColumnType("datetime2");
            modelBuilder
                .Entity<User>()
                .Property(u => u.EmailAddressPadded)
                .HasColumnType("char")
                .HasMaxLength(EmailAddressValidator.MaxLength)
                .HasColumnAnnotation(
                    IndexAnnotation.AnnotationName,
                    new IndexAnnotation(new IndexAttribute(DbConstants.User_EmailAddressPadded_UniqueIndexName, 1) { IsUnique = true, }));
            modelBuilder
                .Entity<User>()
                .Property(u => u.NamePadded)
                .HasColumnName(DbConstants.User_NamePadded_ColumnName)
                .HasColumnType("char")
                .HasMaxLength(UserNameMaxLength); // We use a filtered unique index (non-null) users only.


            modelBuilder
                .Entity<Role>()
                .Property(u => u.NamePadded)
                .HasColumnType("char")
                .HasMaxLength(RoleNameMaxLength)
                .HasColumnAnnotation(
                    IndexAnnotation.AnnotationName,
                    new IndexAnnotation(new IndexAttribute(DbConstants.Role_NamePadded_UniqueIndexName, 1) { IsUnique = true, }));
        }

        internal static void InitializeAndSeed(TimelineDbContext db)
        {
            using (var conn = new SqlConnection(db.Database.Connection.ConnectionString))
            {
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = $"CREATE UNIQUE NONCLUSTERED INDEX {DbConstants.User_NamePadded_UniqueIndexName} ON dbo.Users ({DbConstants.User_NamePadded_ColumnName} ASC) WHERE {DbConstants.User_NamePadded_ColumnName} IS NOT NULL";
                    conn.Open();
                    cmd.ExecuteNonQuery();
                }
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = 
                        "INSERT INTO Users(EmailAddressPadded,NamePadded,CreationTimePoint,PasswordSalt,PasswordHash,SecurityStamp)" +
                        "VALUES" +
                            "('jasperbrekelmans@gmail.com',  'Zeemlap',      GETUTCDATE(), 0xEBF7B835DB28B646396712914FF6601C, 0xB679F37725A164AFA72FF258F94CBE1A1D8E025357D840598DE83008B1ED4A7E, NEWID())," +
                            "('jasper.brekelmans@gmail.com', 'jabrekelmans', GETUTCDATE(), 0xC921421AB803A1AF55E0074CD1AAB8DA, 0x5DDAA1C828C2548F286FE1F675CAD5517FA41183F92E34335382A1019B358E5C, NEWID())," +
                            "('jasperbrekelmans@hotmail.com', NULL,          GETUTCDATE(), 0x992F5F777041E9677F115C80A9762B01, 0x78CF72A05C6C1CA7CAB666CBADCC6FC64414E3CC887D714349C959340C63748E, NEWID())";
                    cmd.ExecuteNonQuery();
                }
            }

            var user1 = (from u in db.Users where u.NamePadded == "Zeemlap" select new { u.Id, }).SingleOrDefault();
            var user2 = (from u in db.Users where u.NamePadded == "jabrekelmans" select new { u.Id, }).SingleOrDefault();
            var user3 = (from u in db.Users where u.EmailAddressPadded == "jasperbrekelmans@hotmail.com" select new { u.Id, }).SingleOrDefault();
            if (user1 == null || user2 == null || user3 == null) throw new NotImplementedException();

            var adminRole = new Role() { NamePadded = Role.AdminRoleName, };
            db.Roles.Add(adminRole);
            db.SaveChanges();

            db.UserRoles.Add(new UserRole() { RoleId = adminRole.Id, UserId = user1.Id, });
            db.UserRoles.Add(new UserRole() { RoleId = adminRole.Id, UserId = user2.Id, });
            db.UserRoles.Add(new UserRole() { RoleId = adminRole.Id, UserId = user3.Id, });
            db.SaveChanges();
        }
    }
}
