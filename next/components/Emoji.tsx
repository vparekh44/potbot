import classNames from "classnames";
import React from "react";

interface EmojiProps {
  label: string;
  symbol: any;
  size?: "sm" | "md" | "lg";
  className?: string;
}
const Emoji = ({ label, symbol, size = "md", className }: EmojiProps) => (
  <span
    className={classNames(
      "emoji",
      { "h-6 w-6": (size = "sm") },
      { "h-8 w-8": (size = "md") },
      { "h-10 w-10": (size = "lg") },
      className
    )}
    role="img"
    aria-label={label ? label : ""}
    aria-hidden={label ? "false" : "true"}
  >
    {symbol}
  </span>
);
export default Emoji;
