import React, { useState } from "react";
import "./result.css";
import { useHistory } from "react-router-dom";
import { Auth } from "aws-amplify";
import { Icon } from "@iconify/react";
import signOut16 from "@iconify/icons-octicon/sign-out-16";

export default function Fail() {
  const [info, setInfo] = useState(false);
  const history = useHistory();
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
  const AWS = require("aws-sdk");
  AWS.config.region = "us-east-2"; // Region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: "us-east-2:a7c0847c-d830-4bd4-8cfd-665bb65b8fbe",
  });
  async function signOut() {
    try {
      await Auth.signOut();
      history.push("/");
      window.location.reload();
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }
  var params = {
    OutputFormat: "mp3",
    SampleRate: "22050",
    Text: "Congratulations! Your verification is successful. Please click the ok button to continue.",
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
  const onButtonClickHandler = () => {
    setInfo(!info);
  };

  return (
    <div>
      <button className="Details" onClick={onButtonClickHandler}>
        Details
      </button>
      <button className="AudioButton" onClick={playAudio}>
        ?
      </button>
      <div className="SignOutButton" onClick={signOut}>
        {" "}
        <Icon icon={signOut16} style={{ color: "#ff7a00", fontSize: "30px" }} />
      </div>
      {info && (
        <div className="Info">
          <b> Polly Script:</b> <br />
          {JSON.stringify(params)}
        </div>
      )}
      <div className="Box">
        <p className="Title"> Verification Succeessful!</p>
        <p className="Paragraph">
          {" "}
          AWS has completed the verification process. Congratulations! Your
          credentials (photo or location) matches with your configured
          information in our system.
        </p>
        <button className="Button" onClick={signOut}>
          Okay
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
            <div className="dot two"></div>
            <div className="S">
              Step 2
              <br /> Summarise & Verify
            </div>
          </div>

          <div className="Card">
            <div className="dot three"></div> <b> Step 3</b>
            <br /> Finish
          </div>
        </div>
      </div>
    </div>
  );
}
