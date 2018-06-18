# AngularCoreJWT

This file is an update to Project which you can find here:

https://fullstackmark.com/post/13/jwt-authentication-with-aspnet-core-2-web-api-angular-5-net-core-identity-and-facebook-login

JWT Authentication with ASP.NET Core 2 Web API, Angular 5, .NET Core Identity and Facebook Login.

I have added angular Material theme, Added roles, and google authentication in it. 

Please do grab google client id and key secret to use google auth.

UPDATE: I've used local sql server instead of express.

This below part is Copied from the above provided link:

Development Environment

    Sql Server Express 2017 & Sql Server Management Studio 2017
    Runs in both Visual Studio 2017 & Visual Studio Code
    Node 8.9.4 & NPM 5.6.0
    .NET Core 2.0 sdk
    Angular CLI -> npm install -g @angular/cli https://github.com/angular/angular-cli

Setup

To build and run the project using the command line:

    Install npm packages with src>npm install in the src directory.
    Restore nuget packages with src>dotnet restore in the src directory.
    Create the database with src>dotnet ef database update in the src directory.
    Run the project with src>dotnet run in the src directory.
    Point your browser to http://localhost:5000.

Of course, you can also run it from either Visual Studio 2017 or Visual Studio Code with the IDE handling most of the steps above. If you have issues, try running the above steps from the command line to ensure things are setup properly.
Facebook App Setup

You're free to use the demo facebook app Fullstack Cafe that the project is already configured with. To setup and use your own application follow the steps detailed on the post.

