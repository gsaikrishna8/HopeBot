import * as React from "react";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import {  Typography } from "@mui/material";

import ChatDetails from "./ChatDetails";
function Bot({ setBotOpen }: { setBotOpen: (setOpen: boolean) => void }) {
 
  return (
    <div className="chatOutsideContainer">
      <div className="chatInsideContainer">
        <div className="chatContent">
          <div className="chatHeader">
            <div
              style={{ display: "flex", justifyContent: "flex-end" }}
              onClick={() => setBotOpen(false)}
            >
              <CancelRoundedIcon
                style={{ fontSize: "25px", color: "#ffff", cursor: "pointer" }}
              />
            </div>
            <Typography
              style={{
                textAlign: "center",
                fontSize: "25px",
                color: "#E3D7FF",
                fontWeight: "bold",
                paddingTop: "20px",
              }}
            >
              HopeBot
            </Typography>
          </div>
          <ChatDetails />
        </div>
      </div>
    </div>
  );
}

export default Bot;
