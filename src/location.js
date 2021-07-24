import React, { useEffect, useState } from "react";
import "./loc.css";
import Amplify, { Auth } from "aws-amplify";
import { useLocation, useHistory } from "react-router-dom";
import audio from "./summary.mp3";
import { Ripple } from "react-spinners-css";
import { Icon, InlineIcon } from "@iconify/react";
import signOut16 from "@iconify/icons-octicon/sign-out-16";

export default function Location() {
  const [imagestore, setImagestore] = useState(null);
  const [data, setData] = useState(null);
  // const [name, setName] = usestate(null);
  const lol = localStorage.getItem("someimgs");
  const location = useLocation();
  const [flag, setFlag] = useState(false);
  var idname = "";

  const playAudio = () => {
    new Audio(audio).play();
    console.log("AUDIO");
  };

  useEffect(() => {
    setImagestore(lol);
    setData(location.state);
  });

  useEffect(() => {
    console.log("Var:", data);
    setFlag(true);
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

  return (
    <div>
      <button className="AudioButton" onClick={playAudio}>
        ?
      </button>
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
