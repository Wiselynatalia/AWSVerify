import React, { useEffect, useState } from "react";
import { Icon, InlineIcon } from "@iconify/react";
import outlineFileUpload from "@iconify/icons-ic/outline-file-upload";
import uploadImg from "./icon.png";
import { useHistory } from "react-router-dom";
import Location from "aws-sdk/clients/location";
import awsconfig from "./aws-exports";
import Amplify, { Auth } from "aws-amplify";
import audio from "./welcome.mp3";
import { Ripple } from "react-spinners-css";
import signOut16 from "@iconify/icons-octicon/sign-out-16";
import { AppStream } from "aws-sdk";

const Home = () => {
  const { CognitoIdentityClient } = require("@aws-sdk/client-cognito-identity");
  const {
    fromCognitoIdentityPool,
  } = require("@aws-sdk/credential-provider-cognito-identity");
  const { Polly } = require("@aws-sdk/client-polly");
  const REGION = "us-east-2";
  const Fs = require("fs");
  const polly = new Polly({
    apiVersion: "2016-06-10",
    region: REGION,
    credentials: fromCognitoIdentityPool({
      client: new CognitoIdentityClient({ region: REGION }),
      identityPoolId: "us-east-2:a7c0847c-d830-4bd4-8cfd-665bb65b8fbe", // IDENTITY_POOL_ID
    }),
  });
  const history = useHistory();
  var face = false;
  const [ID_country, setIDcountry] = useState(null);
  const [IDname, setIDname] = useState(null);
  const [countrysame, setCountry] = useState(false);
  const [location, SetLocation] = useState(null);
  const [pic, setPic] = useState(null);
  // const [info, setInfo] = useState(false);
  var current_country = null;
  var pics = null;

  useEffect(() => {
    Auth.currentUserInfo().then((userInfo) => {
      const { attributes = {} } = userInfo;
      const x = attributes.sub;
      console.log("UserID", x);
      const y = ".jpeg";
      pics = x.concat(y);
      setPic(pics);
    });
  }, []);

  async function signOut() {
    try {
      await Auth.signOut();
      window.location.reload();
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }

  function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/jpeg");
    return dataURL.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
  }

  const AWS = require("aws-sdk");
  AWS.config.region = "us-east-2"; // Region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: "us-east-2:a7c0847c-d830-4bd4-8cfd-665bb65b8fbe",
  });

  const S3_BUCKET = "awsbucketwise";
  const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION,
  });

  //Text Rekognition
  const client = new AWS.Rekognition();
  var tarams = {
    Image: {
      S3Object: {
        Bucket: "awsbucketwise",
        Name: pic, //Depends on user cognito ID
      },
    },
  };
  var origin = null;
  var Name = "";
  var nflag = false;
  var tempName = null;
  let getTextPromise = new Promise((resolve, reject) => {
    client.detectText(tarams, function (err, data) {
      if (err) console.log(err, err.stack);
      // an error occurred
      else {
        origin = data.TextDetections[0]["DetectedText"].slice(9);
        tempName = data.TextDetections[4]["DetectedText"].slice(5);
        for (var i = 0; i < tempName.length; i++) {
          if (tempName[i] == " ") {
            setIDname(Name);
            Name += " ";
            nflag = true;
          } else if (nflag == false) {
            Name += tempName[i];
          } else if (nflag == true) {
            Name += "*";
          }
        }
        console.log("Text Detected:", data); //Text Detected
        resolve({ origin }); // successful response
      }
    });
  });
  var coord = {
    IndexName: "MyPlaceIndex",
    Position: [10, 20],
  };

  var userlocation = null;

  getTextPromise.then((origin) => {
    console.log("Origin", origin["origin"]);
    const createClient = async () => {
      const credentials = await Auth.currentCredentials();
      const client = new Location({
        credentials,
        region: awsconfig.aws_project_region,
      });
      const params = {
        IndexName: "MyPlaceIndex",
        Text: origin["origin"],
        //Need to be retrieved from S3 Text Rekognition
      };
      client.searchPlaceIndexForText(params, (err, data) => {
        if (err) console.error(err);
        if (data) {
          setIDcountry(data.Results[0].Place.Country);
          console.log("ID_Result", data.Results[0]);
          console.log("ID_country", data.Results[0].Place.Country);
        }
      });

      // Creating a promise out of the function
      let getLocationPromise = new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function (position) {
            var lat = position.coords.latitude;
            var long = position.coords.longitude;
            SetLocation([lat, long]);
            resolve({ latitude: lat, longitude: long });
          });
        } else {
          reject("Your browser doesn't support geolocation API");
        }
      });

      getLocationPromise
        .then((location) => {
          coord.Position = [location.longitude, location.latitude];
          client.searchPlaceIndexForPosition(coord, (err, data) => {
            if (err) console.error(err);
            if (data) {
              userlocation = data.Results[0].Place;
              current_country = data.Results[0].Place["Country"];
              console.log(current_country, ID_country);
              if (current_country == ID_country) {
                setCountry(true);
              }
              console.log("Country", data.Results[0].Place["Country"]);
              console.log("Userlocation", userlocation);
            } // Current country
          });
        })
        .catch((err) => {
          console.log(err);
        });

      return client;
    };
    createClient();
  });
  //GeoLocation

  //POLLY
  var params = {
    OutputFormat: "mp3",
    SampleRate: "22050",
    Text:
      "Hi" +
      IDname +
      "!Welcome to AWS Verify! Please click the button below to upload your selfie.",
    TextType: "text",
    VoiceId: "Joanna",
  };
  const playAudio = () => {
    var signer = new AWS.Polly.Presigner(params, polly);
    signer.getSynthesizeSpeechUrl(params, function (error, url) {
      if (error) console.log(error);
      else {
        console.log("AUDIO:", IDname);
        var audioElement = new Audio();
        audioElement.src = url;
        audioElement.play();
      }
    });
  };

  const changeHandler = (e) => {
    let selected = e.target.files[0];
    var imgData = null;
    // get URL of the img being uploaded
    var img = new Image();
    img.src = URL.createObjectURL(selected);
    localStorage.setItem("someimgs", img.src);
    // once img is loaded, run this function
    img.onload = function () {
      imgData = getBase64Image(img);
      var ib = Buffer.from(imgData, "base64");
      // console.log(imgData); // imgData is our base64 encoding
      var length = imgData.length;
      var imageBytes = new ArrayBuffer(length);
      var ua = new Uint8Array(imageBytes);
      for (var i = 0; i < length; i++) {
        ua[i] = imgData.charCodeAt(i);
      }
      const bucket = "awsbucketwise"; // the bucketname without s3://
      const photo_target = pic; //base on User ID
      const client = new AWS.Rekognition();
      const params = {
        SourceImage: {
          Bytes: ib,
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
            face = true;
            console.log("FACE Comparison:", face);
            let similarity = data.Similarity;
            console.log(
              `The selfie and ID picture matches with ${similarity} % confidence`
            );
          });
        }
        history.push({
          pathname: "/locateuser",
          state: {
            Name: Name,
            Origin: origin,
            Loc: userlocation,
            CSame: countrysame,
            FSame: face,
          },
        });
      });
    };
  };

  // const onButtonClickHandler = () => {
  //   setInfo(!info);
  // };

  if (ID_country != null) {
    return (
      <div className="Background">
        {/* <button className="Details" onClick={onButtonClickHandler}>
          Details
        </button> */}
        <button className="AudioButton" onClick={playAudio}>
          ?
        </button>
        <div className="SignOutButton" onClick={signOut}>
          {" "}
          <Icon
            icon={signOut16}
            style={{ color: "#ff7a00", fontSize: "30px" }}
          />
        </div>
        {/* {info && (
          <div className="Info">
            User Position (lat, long): <br />[{location[0]}, {location[1]}]{" "}
            <br />
          </div>
        )} */}
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
                  fontSize: "35px",
                  display: "inline",
                }}
              />
              <p
                style={{
                  fontSize: "25px",
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
              <div
                className="dot one"
                style={{ backgroundColor: "#ffc804" }}
              ></div>
              <b> Step 1</b>
              <br /> Upload Image
            </div>

            <div className="Card">
              <div className="dot"></div>
              <div className="S">
                {" "}
                Step 2
                <br /> Summarise & Verify
              </div>
            </div>

            <div className="Card">
              <div className="dot"></div>
              <div className="S">
                {" "}
                Step 3
                <br /> Finish
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className="Loading">
          <Ripple color="#ffc804" size={300} />
          <p> Retrieving location</p>
        </div>
      </div>
    );
  }
};

export default Home;
