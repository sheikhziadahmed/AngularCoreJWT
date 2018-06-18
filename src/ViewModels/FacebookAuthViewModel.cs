namespace AngularASPNETCore2WebApiAuth.ViewModels
{
   
  public class FacebookAuthViewModel
  {
    public string AccessToken { get; set; }
  }
   public class GoogleAuthViewModel
  {
    public string code { get; set; }
    public string AccessToken { get; set; }
  }
}
