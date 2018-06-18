

using System.Threading.Tasks;
using AngularASPNETCore2WebApiAuth.Data;
using AngularASPNETCore2WebApiAuth.Helpers;
using AngularASPNETCore2WebApiAuth.Models.Entities;
using AngularASPNETCore2WebApiAuth.ViewModels;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
 

namespace AngularASPNETCore2WebApiAuth.Controllers
{
    [Route("api/[controller]")] 
    public class AccountsController : Controller
    {
        private readonly ApplicationDbContext _appDbContext;
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;

        public AccountsController(UserManager<AppUser> userManager, IMapper mapper, ApplicationDbContext appDbContext)
        {
            _userManager = userManager;
            _mapper = mapper;
            _appDbContext = appDbContext;
        }

        // POST api/accounts
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]RegistrationViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userIdentity = _mapper.Map<AppUser>(model);

            var result = await _userManager.CreateAsync(userIdentity, model.Password);

        //     IdentityResult roleResult;
        //     var User = "User";
        //     // roleResult = Admin;
        //     bool adminRoleExists = await _userManager.IsInRoleAsync(userIdentity,"User");
        //     if (!adminRoleExists)
        //     {
            
        //     _appDbContext.Roles.Add(new IdentityRole()
        //     {
        //     Name = User,
        //     NormalizedName = User.ToUpper()
        //     });
        // _appDbContext.SaveChanges();        
        // }

        // // Select the user, and then add the admin role to the user
        // if (!await _userManager.IsInRoleAsync(userIdentity, "Admin"))
        // {
        //     var userResult = await _userManager.AddToRoleAsync(userIdentity, "Admin");
        // }
                
            if (!result.Succeeded) return new BadRequestObjectResult(Errors.AddErrorsToModelState(result, ModelState));
            
            await _userManager.AddToRoleAsync(userIdentity, "Member");
            await _appDbContext.Customers.AddAsync(new Customer { IdentityId = userIdentity.Id, Location = model.Location,Gender = model.Gender,Birthdate = model.Birthdate });
            await _appDbContext.SaveChangesAsync();

            return new OkObjectResult("Account created");
        }
    }
}
