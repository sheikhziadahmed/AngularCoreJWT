

using System;

namespace AngularASPNETCore2WebApiAuth.ViewModels
{
    public class RegistrationViewModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Location { get; set; }
        public string Gender { get; set; }
        public DateTime? Birthdate { get; set; }
    }
}
