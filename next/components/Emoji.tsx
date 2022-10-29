import React from "react";

interface EmojiProps {
  label: string;
  symbol: any;
}
const Emoji = ({ label, symbol }: EmojiProps) => (
  <span
    className="emoji h-8 w-8"
    role="img"
    aria-label={label ? label : ""}
    aria-hidden={label ? "false" : "true"}
  >
    {symbol}
  </span>
);
export default Emoji;
