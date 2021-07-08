import React, { useState } from "react";
import { Icon, InlineIcon } from "@iconify/react";
import outlineFileUpload from "@iconify/icons-ic/outline-file-upload";
import uploadImg from "./icon.png";
import { NavLink } from "react-router-dom";
import Location from "aws-sdk/clients/location";
import awsconfig from "./aws-exports";
import Amplify, { Auth } from "aws-amplify";
import ImageUploader from "react-images-upload";

export default function thePageName() {
  const changeHandler = (e) => {
    console.log("hello");
    console.log(e);
  };

  const AWS = require("aws-sdk");
  AWS.config.region = "us-east-2"; // Region
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

  const S3_BUCKET = "awsbucketwise";
  const REGION = "us-east-2";
  const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION,
  });

  const bucket = "awsbucketwise"; // the bucketname without s3://
  const photo_source = "1.png";
  const photo_target = "S1.png";
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
    SimilarityThreshold: 80,
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
      Text: "Gading Residence Jakarta", //Need to be retrieved from S3 Text Rekognition
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
      if (data) console.log("coord", data.Results[0].Place["Country"]); // Current country
    });
    return client;
  };

  createClient();
  return (
    <div className="Background">
      <div className="bCircle"> </div>
      <div className="fCircle">
        <img className="uploadPic" src={uploadImg} />
      </div>

      <label>
        <input type="file" onChange={changeHandler} />
        <span className="ubutton">
          <div className="b_inside">
            <Icon
              icon={outlineFileUpload}
              style={{
                color: "#ff7a00",
                fontSize: "55px",
                display: "inline",
              }}
            />
            <p
              style={{
                fontSize: "44px",
                fontWeight: "bolder",
                color: "#FF7A00",
                margin: "0",
              }}
            >
              {" "}
              Upload
            </p>
          </div>
        </span>
      </label>
      <div className="Bar">
        <div className="Bar2"></div>
        <div className="contents">
          <div className="Card">
            <div className="dot dot1"></div>
            <div className="S1">
              <b> Step 1</b>
              <br /> Upload Image
            </div>
          </div>
          <div className="Card">
            <div className="dot"></div>
            <div className="S">
              {" "}
              Step 2
              <br /> Locate User
            </div>
          </div>

          <div className="Card">
            <div className="dot"></div>
            <div className="S">
              {" "}
              Step 3
              <br /> Summarise & Verify
            </div>
          </div>

          <div className="Card">
            <div className="dot"></div>
            <div className="S">
              {" "}
              Step 4
              <br /> Finish
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
