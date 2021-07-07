import React from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import Amplify, { Auth } from "aws-amplify";
import "./App.css";
import { BrowserRouter, Route, Switch, NavLink } from "react-router-dom";
import location from "./location.js";
import home from "./home.js";
import Location from "aws-sdk/clients/location";
import awsconfig from "./aws-exports";

const AWS = require("aws-sdk");
AWS.config.region = "RegionToUse"; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: "us-east-2:a7c0847c-d830-4bd4-8cfd-665bb65b8fbe",
});
// Make the call to obtain credentials
AWS.config.credentials.get(function () {
  // Credentials will be available when this function is called.
  var accessKeyId = AWS.config.credentials.accessKeyId;
  var secretAccessKey = AWS.config.credentials.secretAccessKey;
  var sessionToken = AWS.config.credentials.sessionToken;
});
Amplify.configure(awsconfig);

const bucket = "awsbucketwise"; // the bucketname without s3://
const photo_source = "1.png";
const photo_target = "S1.png";
const config = new AWS.Config({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
const client = new AWS.Rekognition();
const params = {
  SourceImage: {
    S3Object: {
      Bucket: bucket,
      Name: photo_source,
    },
  },
  TargetImage: {
    S3Object: {
      Bucket: bucket,
      Name: photo_target,
    },
  },
  SimilarityThreshold: 70,
};
client.compareFaces(params, function (err, response) {
  if (err) {
    console.log(err, err.stack); // an error occurred
  } else {
    response.FaceMatches.forEach((data) => {
      let position = data.Face.BoundingBox;
      let similarity = data.Similarity;
      console.log(
        `The face at: ${position.Left}, ${position.Top} matches with ${similarity} % confidence`
      );
    }); // for response.faceDetails
  } // if
});

const createClient = async () => {
  const credentials = await Auth.currentCredentials();
  const client = new Location({
    credentials,
    region: awsconfig.aws_project_region,
  });
  const params = {
    IndexName: "MyPlaceIndex",
    Text: "Gading Residence Jakarta",
  };
  client.searchPlaceIndexForText(params, (err, data) => {
    if (err) console.error(err);
    if (data) console.log(data.Results[0].Place);
  });

  // Creating a promise out of the function
  let getLocationPromise = new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        resolve({ latitude: lat, longitude: long });
      });
    } else {
      reject("Your browser doesn't support geolocation API");
    }
  });
  const coord = {
    IndexName: "MyPlaceIndex",
    Position: [10, 20],
  };

  getLocationPromise
    .then((location) => {
      coord.Position = [location.latitude, location.longitude];
      console.log(location);
    })
    .catch((err) => {
      console.log(err);
    });

  // getting address from coordinates

  client.searchPlaceIndexForPosition(coord, (err, data) => {
    if (err) console.error(err);
    console.log("C", coord);
    if (data) console.log("coord", data);
  });
  return client;
};

const App = () => {
  createClient();
  return (
    <BrowserRouter>
      <div className="Background">
        <div className="Header">
          <div className="H1">AWS </div>
          <div className="H2">Verify</div>
        </div>
        <div className="bar"> </div>
        <NavLink to="/" exact></NavLink>
        <NavLink to="/locateuser"></NavLink>
        <Switch>
          <Route component={home} path="/" exact />
          <Route component={location} path="/locateuser" exact />
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default withAuthenticator(App);
