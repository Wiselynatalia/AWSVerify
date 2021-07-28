# AWS Verify 

A React-JS project that aims to highlight the capability of Amazon Rekognition and Amazon Location to provide a seamless experience of user verification through the use of facial and real-time location comparison of users against their ID card profile picture and information stored in Amazon S3. Note that: this project is run in REGION: US-EAST-2

## Instructions:

1. Prepare the dependencies required for the web project by running the following command:
`npm install`

2. To prepare for AWS Rekognition, GeoLocation and Polly, write the code below :
```
const AWS = require("aws-sdk");
AWS.config.region = "us-east-2"; // Your Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
IdentityPoolId: "us-east-2:your-pool-id-paste-here",
});
```

3. Please change your IdentityPoolID to your own. You can find your IdentityPoolID via [the following steps](https://docs.aws.amazon.com/rekognition/latest/dg/image-bytes-javascript.html#image-bytes-javascript-auth) 


### AWS Rekognition
Initialize the AWS Rekognition API using the following code:
```
const client = new AWS.Rekognition();
      
To run the detect faces:
const params = {
        SourceImage: {
          Bytes: ib,	// buffer from base64 format of img
        },
        TargetImage: {
          S3Object: {
            Bucket: bucket,
            Name: photo_target,
          },
        },
        SimilarityThreshold: 90,
};

client.compareFaces(params, function (err, response) {
        console.log(params);
        if (err) {
          console.log(err, err.stack); // an error occurred
        } else {
          response.FaceMatches.forEach((data) => {
            let similarity = data.Similarity;
            console.log(
              `The selfie and ID picture matches with ${similarity} % confidence`
            );
          });
}

```
For more information [click here](  https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Rekognition.html#compareFaces-property)

### AWS Geolocation
Initialize the AWS Location API using the following code:
```
const credentials = await Auth.currentCredentials();
const client = new Location({
        credentials,
        region: "us-east-2",
});
```
[More information on usage of API can be found here:](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Location.html#searchPlaceIndexForText-property) 

### AWS Polly
Initialize the AWS Polly API using the following code:
```
const polly = new Polly({
    apiVersion: "2016-06-10",
    region: REGION,
    credentials: fromCognitoIdentityPool({
      client: new CognitoIdentityClient({ region: REGION }),
      identityPoolId: "us-east-2:a7c0847c-d830-4bd4-8cfd-665bb65b8fbe"
    }),
});
```
[More information on usage of API can be found here:](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Polly.html)

### AWS Amplify 
1. Install the Amplify CLI to the project with the following command
`npm install -g @aws-amplify/cli`
2. To setup the Amplify CLI. Configure Amplify by running the following command:
`amplify configure`
3. You will be asked to sign into the AWS Console.
4. Create a user with AdministratorAccess to your account to provision AWS resources for you like AppSync, Cognito etc.
5. Once the user is created, Amplify CLI will ask you to provide the accessKeyId and the secretAccessKey to connect Amplify CLI with your newly created IAM user.
6. Enter the access key of the newly created user:
```
? accessKeyId:  # YOUR_ACCESS_KEY_ID
? secretAccessKey:  # YOUR_SECRET_ACCESS_KEY
This would update/create the AWS Profile in your local machine
? Profile Name:  # (default)
```
7. Initialize new Amplify Backend: 
`amplify init`
8. Then: 
```
Enter a name for the project (awsverify)

# All AWS services you provision for your app are grouped into an "environment"

# A common naming convention is dev, staging, and production
Enter a name for the environment (dev)

# Sometimes the CLI will prompt you to edit a file, it will use this editor to open those files.
Choose your default editor

# Amplify supports JavaScript (Web & React Native), iOS, and Android apps
Choose the type of app that you're building (javascript)

What JavaScript framework are you using (react)

Source directory path (src)

Distribution directory path (build)

Build command (npm run build)

Start command (npm start)

```

This is the profile you created with the `amplify configure` command in the introduction step.
Do you want to use an AWS profile
 
# Hosting with AWS Amplify with Github
Under Services - type in Amplify -> create app. 
Select GitHub and select Continue.
Enable GitHub authorization by signing in with your GitHub account credentials.
Under Recently updated repositories, select your awsverify repository by clicking the dropdown bar.
Under Branch, select the master branch and click Next.
For Application name, enter awsverify
Check “Deploy updates to backend resources with your frontend on every code commit”
Select or create a new IAM role to allow the Amplify Console to access your AWS resources. Click Next.
On the “Review” page, Select Save and deploy.
The process takes a couple of minutes for Amplify Console to create the necessary resources and to deploy your code.
Once completed, click on the available link to launch your awsverify site.

The Amplify Framework uses Amazon Cognito as the main authentication provider. Amazon Cognito is a robust user directory service that handles user registration, authentication, account recovery & other operations. In this tutorial, you’ll learn how to add authentication to your application using Amazon Cognito and username/password login.

Create authentication service
`amplify add auth`

Then: 
```
? Do you want to use the default authentication and security configuration
? Default configuration
? How do you want users to be able to sign in? Username
```
Deploy the service with the push command:
`amplify push`

##Create Login UI 
Open src/App.js and make the following changes:
```
Import the withAuthenticator component:
import { withAuthenticator } from '@aws-amplify/ui-react'
```

Change the default export to be the withAuthenticator wrapping the main component:
`export default withAuthenticator(App)`

Run the app to see the new Authentication flow protecting the app:
`npm start`













