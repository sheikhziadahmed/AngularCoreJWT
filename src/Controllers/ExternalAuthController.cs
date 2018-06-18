

using System;
using System.Net.Http;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using AngularASPNETCore2WebApiAuth.Auth;
using AngularASPNETCore2WebApiAuth.Data;
using AngularASPNETCore2WebApiAuth.Helpers;
using AngularASPNETCore2WebApiAuth.Models;
using AngularASPNETCore2WebApiAuth.Models.Entities;
using AngularASPNETCore2WebApiAuth.ViewModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System.Net;

namespace AngularASPNETCore2WebApiAuth.Controllers
{
    [Route("api/[controller]/[action]")]
    public class ExternalAuthController : Controller
    {
        private readonly ApplicationDbContext _appDbContext;
        private readonly UserManager<AppUser> _userManager;
        private readonly FacebookAuthSettings _fbAuthSettings;
        private readonly GoogleAuthSettings _googleAuthSettings;
        private readonly IJwtFactory _jwtFactory;
        private readonly JwtIssuerOptions _jwtOptions;
  
        public ExternalAuthController(IOptions<FacebookAuthSettings> fbAuthSettingsAccessor, IOptions<GoogleAuthSettings> googleAuthSettingsAccessor, UserManager<AppUser> userManager, ApplicationDbContext appDbContext, IJwtFactory jwtFactory, IOptions<JwtIssuerOptions> jwtOptions)
        {
            _googleAuthSettings = googleAuthSettingsAccessor.Value;
            _fbAuthSettings = fbAuthSettingsAccessor.Value;
            _userManager = userManager;
            _appDbContext = appDbContext;
            _jwtFactory = jwtFactory;
            _jwtOptions = jwtOptions.Value;
        }

        // POST api/externalauth/facebook
        [HttpPost]
        public async Task<IActionResult> Facebook([FromBody]FacebookAuthViewModel model)
        {
            // 1.generate an app access token
            using (var Client = new HttpClient())
            {

                
                var appAccessTokenResponse = await Client.GetStringAsync($"https://graph.facebook.com/oauth/access_token?client_id={_fbAuthSettings.AppId}&client_secret={_fbAuthSettings.AppSecret}&grant_type=client_credentials");
                var appAccessToken = JsonConvert.DeserializeObject<FacebookAppAccessToken>(appAccessTokenResponse);
                // 2. validate the user access token
                var userAccessTokenValidationResponse = await Client.GetStringAsync($"https://graph.facebook.com/debug_token?input_token={model.AccessToken}&access_token={appAccessToken.AccessToken}");
                var userAccessTokenValidation = JsonConvert.DeserializeObject<FacebookUserAccessTokenValidation>(userAccessTokenValidationResponse);

                if (!userAccessTokenValidation.Data.IsValid)
                {
                    return BadRequest(Errors.AddErrorToModelState("login_failure", "Invalid facebook token.", ModelState));
                }

                // 3. we've got a valid token so we can request user data from fb
                var userInfoResponse = await Client.GetStringAsync($"https://graph.facebook.com/v2.8/me?fields=id,email,first_name,last_name,name,gender,locale,location,birthday,picture&access_token={model.AccessToken}");
                var userInfo = JsonConvert.DeserializeObject<FacebookUserData>(userInfoResponse);

                // 4. ready to create the local user account (if necessary) and jwt
                var user = await _userManager.FindByEmailAsync(userInfo.Email);

                if (user == null)
                {
                    var appUser = new AppUser
                    {
                        FirstName = userInfo.FirstName,
                        LastName = userInfo.LastName,
                        FacebookId = userInfo.Id,
                        Email = userInfo.Email,
                        UserName = userInfo.Email,
                        PictureUrl = userInfo.Picture.Data.Url
                    };

                    var result = await _userManager.CreateAsync(appUser, Convert.ToBase64String(Guid.NewGuid().ToByteArray()).Substring(0, 8));
                    await _userManager.AddToRoleAsync(appUser, "Member");


                    if (!result.Succeeded) return new BadRequestObjectResult(Errors.AddErrorsToModelState(result, ModelState));

                    await _appDbContext.Customers.AddAsync(new Customer { IdentityId = appUser.Id, Location = userInfo.Location, Locale = userInfo.Locale, Gender = userInfo.Gender, Birthdate = userInfo.Birthdate });
                    await _appDbContext.SaveChangesAsync();
                }

                // generate the jwt for the local user...
                var localUser = await _userManager.FindByNameAsync(userInfo.Email);
                var Roles = await _userManager.GetRolesAsync(localUser);

                if (localUser == null)
                {
                    return BadRequest(Errors.AddErrorToModelState("login_failure", "Failed to create local user account.", ModelState));
                }

                var jwt = await Tokens.GenerateJwt(_jwtFactory.GenerateClaimsIdentity(localUser.UserName, localUser.Id, Roles),
                  _jwtFactory, localUser.UserName, _jwtOptions, new JsonSerializerSettings { Formatting = Formatting.Indented });

                return new OkObjectResult(jwt);
            }
        }

        // POST api/externalauth/google
        [HttpPost]
        public async Task<IActionResult> Google([FromBody]GoogleAuthViewModel model)
        {
            using (var Client = new HttpClient())
            {
                // 1.generate an app access token
                var url = $"https://www.googleapis.com/oauth2/v4/token?code={model.code}&client_id={_googleAuthSettings.ClientId}&client_secret={_googleAuthSettings.ClientSecret}&redirect_uri=http://localhost:5000/google-auth.html&grant_type=authorization_code";
                var uri = new Uri(url);
                Client.BaseAddress = uri;


                Client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpRequestMessage req = new HttpRequestMessage(HttpMethod.Post, uri);

                HttpResponseMessage httpResponseMessage = await Client.SendAsync(req);

                if (!httpResponseMessage.IsSuccessStatusCode)
                {
                    return BadRequest(Errors.AddErrorToModelState("login_failure", "Invalid google token.", ModelState));
                }

                httpResponseMessage.EnsureSuccessStatusCode();
                HttpContent httpContent = httpResponseMessage.Content;
                var responseString = await httpContent.ReadAsStringAsync();
                
                var resultData = JsonConvert.DeserializeObject<GoogleAppAccessToken>(responseString);

                var userAccessTokenValidationResponse = await Client.GetStringAsync($"https://www.googleapis.com/plus/v1/people/me/openIdConnect?access_token={resultData.AccessToken}");
                // HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
                // response.Content = new StringContent(userAccessTokenValidationResponse, Encoding.UTF8, "application/json");
                var userInfo = JsonConvert.DeserializeObject<GoogleUserData>(userAccessTokenValidationResponse);


                // 4. ready to create the local user account (if necessary) and jwt
                var user = await _userManager.FindByEmailAsync(userInfo.Email);

                if (user == null)
                {
                    var appUser = new AppUser
                    {
                        FirstName = userInfo.GivenName,
                        LastName = userInfo.FamilyName,
                        GoogleId = userInfo.Sub,
                        Email = userInfo.Email,
                        UserName = userInfo.Email,
                        PictureUrl = userInfo.Picture
                    };

                    var result = await _userManager.CreateAsync(appUser, Convert.ToBase64String(Guid.NewGuid().ToByteArray()).Substring(0, 8));
                    await _userManager.AddToRoleAsync(appUser, "Member");


                    if (!result.Succeeded) return new BadRequestObjectResult(Errors.AddErrorsToModelState(result, ModelState));
                    
                    await _appDbContext.Customers.AddAsync(new Customer { IdentityId = appUser.Id, Locale = userInfo.Locale, Gender = userInfo.Gender });
                    await _appDbContext.SaveChangesAsync();
                }

                // generate the jwt for the local user...
                var localUser = await _userManager.FindByNameAsync(userInfo.Email);


                if (localUser == null)
                {
                    return BadRequest(Errors.AddErrorToModelState("login_failure", "Failed to create local user account.", ModelState));
                }
                var Roles = await _userManager.GetRolesAsync(localUser);

                var jwt = await Tokens.GenerateJwt(_jwtFactory.GenerateClaimsIdentity(localUser.UserName, localUser.Id, Roles),
                  _jwtFactory, localUser.UserName, _jwtOptions, new JsonSerializerSettings { Formatting = Formatting.Indented });

                return new OkObjectResult(jwt);
            }
        }
    //     public void Dispose()
    // {
    //     foreach (var httpClient in _httpClients.Values)
    //     {
    //         httpClient.Dispose();
    //     }
    // }
    }
}
