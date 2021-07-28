import React, { useEffect, useState } from "react";
import "./result.css";
import { NavLink, useHistory } from "react-router-dom";
import audio from "./success.mp3";
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
