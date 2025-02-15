import * as React from "react";
import Bot from "./chat/Bot";
import Flyer from "./chat/Flyer";

function BotIndex() {
  const [open, setOpen] = React.useState<boolean>(false);
  return (
    <div className="botInit">
      {open ? <Bot setBotOpen={setOpen} /> : <Flyer setBotOpen={setOpen} />}
    </div>
  );
}

export default BotIndex;
