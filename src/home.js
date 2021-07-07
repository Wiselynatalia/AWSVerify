import React from "react";
import { Icon, InlineIcon } from "@iconify/react";
import outlineFileUpload from "@iconify/icons-ic/outline-file-upload";
import uploadImg from "./icon.png";
import { NavLink } from "react-router-dom";

export default function thePageName() {
  return (
    <div className="Background">
      <div className="bCircle"> </div>
      <div className="fCircle">
        <img className="uploadPic" src={uploadImg} />
      </div>

      <NavLink to="/locateuser" onClick={console.log("HELLO")}>
        <button className="ubutton">
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
        </button>
      </NavLink>

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
