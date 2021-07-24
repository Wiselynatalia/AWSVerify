import React from "react";
import { NavLink, useHistory } from "react-router-dom";
import "./result.css";
import audio from "./fail.mp3";
import Amplify, { Auth } from "aws-amplify";
import { Icon, InlineIcon } from "@iconify/react";
import signOut16 from "@iconify/icons-octicon/sign-out-16";

export default function Fail() {
  const history = useHistory();
  const playAudio = () => {
    new Audio(audio).play();
    console.log("AUDIO");
  };
  async function signOut() {
    try {
      await Auth.signOut();
      history.push("/");
      window.location.reload();
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }
  return (
    <div>
      <button className="AudioButton" onClick={playAudio}>
        ?
      </button>
      <div className="SignOutButton" onClick={signOut}>
        {" "}
        <Icon icon={signOut16} style={{ color: "#ff7a00", fontSize: "30px" }} />
      </div>
      <div className="Box">
        <p className="Title"> Verification Failed!</p>
        <p className="Paragraph">
          {" "}
          AWS has completed the verification process. Unfortunately, your
          credentials (photo or location) do not match with your configured
          information in our system. Please
          <a href="mailto:contact@amazon.com"> contact us </a> for further
          assistance.
        </p>
        <div className="Button" onClick={signOut}>
          Okay
        </div>
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
