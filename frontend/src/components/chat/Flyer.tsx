import * as React from "react";
import ForumIcon from "@mui/icons-material/Forum";
import "./chat.css";
function Flyer({ setBotOpen }: { setBotOpen: (setOpen: boolean) => void }) {
  return (
    <div className="text" onClick={() => setBotOpen(true)}>
      <span>Chat Now</span>
      <div className="chatIcon" onClick={() => setBotOpen(true)}>
        <ForumIcon style={{ fontSize: "35px", textAlign: "center" }} />
      </div>
    </div>
  );
}

export default Flyer;
