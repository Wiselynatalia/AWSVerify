import React, { useEffect, useState } from "react";
import "./loc.css";
import { Auth } from "aws-amplify";
import { useLocation, useHistory } from "react-router-dom";
import { Icon } from "@iconify/react";
import signOut16 from "@iconify/icons-octicon/sign-out-16";

export default function Location() {
  const { CognitoIdentityClient } = require("@aws-sdk/client-cognito-identity");
  const {
    fromCognitoIdentityPool,
  } = require("@aws-sdk/credential-provider-cognito-identity");
  const { Polly } = require("@aws-sdk/client-polly");
  const REGION = "us-east-2";
  const polly = new Polly({
    apiVersion: "2016-06-10",
    region: REGION,
    credentials: fromCognitoIdentityPool({
      client: new CognitoIdentityClient({ region: REGION }),
      identityPoolId: "us-east-2:a7c0847c-d830-4bd4-8cfd-665bb65b8fbe", // IDENTITY_POOL_ID
    }),
  });
  const [data, setData] = useState(null);
  const lol = localStorage.getItem("someimgs");
  const location = useLocation();
  const [flag, setFlag] = useState(false);
  const [info, setInfo] = useState(false);
  const AWS = require("aws-sdk");
  AWS.config.region = "us-east-2"; // Region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: "us-east-2:a7c0847c-d830-4bd4-8cfd-665bb65b8fbe",
  });

  var params = {
    OutputFormat: "mp3",
    SampleRate: "22050",
    Text: "Here is a summary page of your details. Please click the confirm button to continue!",
    TextType: "text",
    VoiceId: "Joanna",
  };

  const playAudio = () => {
    var signer = new AWS.Polly.Presigner(params, polly);
    signer.getSynthesizeSpeechUrl(params, function (error, url) {
      if (error) console.log(error);
      else {
        var audioElement = new Audio();
        audioElement.src = url;
        audioElement.play();
      }
    });
  };

  useEffect(() => {
    setData(location.state);
  }, [lol]);

  useEffect(() => {
    console.log("Var:", data);
    if (data != null) {
      setFlag(true);
    }
  }, [data]);

  async function signOut() {
    try {
      await Auth.signOut();
      window.location.reload();
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }
  const history = useHistory();
  const Final = () => {
    localStorage.clear();
    if (flag == true) {
      if (data.CSame == true && data.FSame == true) {
        console.log("SUCCESS");
        history.push("/success");
      } else {
        console.log("FAIL");
        history.push("/fail");
      }
    }
  };
  const onButtonClickHandler = () => {
    setInfo(!info);
  };

  return (
    <div>
      <button className="AudioButton" onClick={playAudio}>
        ?
      </button>
      <button className="Details" onClick={onButtonClickHandler}>
        Details
      </button>
      {info && (
        <div className="Info">
          <b>Amazon Rekognition</b>
          <br />
          {data.Rekognition};
          <br />
          <br />
          <b> Polly Script:</b> <br />
          {JSON.stringify(params)}
        </div>
      )}
      <div className="SignOutButton" onClick={signOut}>
        {" "}
        <Icon icon={signOut16} style={{ color: "#ff7a00", fontSize: "30px" }} />
      </div>
      <div className="Summary">
        <p
          style={{
            paddingTop: "15px",
            fontSize: "30px",
            fontWeight: "bold",
            margin: "0px",
          }}
        >
          Summary{" "}
        </p>
        <img className="preview" src={lol} />
        <p className="Content">Name:</p>
        <div className="whitebox">
          {flag && <p className="Text">{data.Name}</p>}
        </div>
        <p className="Content">Current Location:</p>
        <div className="whitebox">
          {flag && <p className="Text">{data.Loc.Label}</p>}
        </div>
        <button className="Confirm" onClick={Final}>
          Confirm
        </button>
      </div>
      <div className="Bar">
        <div className="Bar2"></div>
        <div className="contents">
          <div className="Card">
            <div className="dot one"></div>
            <div className="S">
              Step 1
              <br /> Upload Image
            </div>
          </div>

          <div className="Card">
            <div
              className="dot two"
              style={{ backgroundColor: "#ffc804" }}
            ></div>{" "}
            <b>Step 2</b>
            <br /> Summarise & Verify
          </div>

          <div className="Card">
            <div className="dot "></div>
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
}
