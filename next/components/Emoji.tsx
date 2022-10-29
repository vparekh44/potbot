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
      { "texl-xl": (size = "sm") },
      { "text-2xl": (size = "md") },
      { "text-3xl": (size = "lg") },
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
