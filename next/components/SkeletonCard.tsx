import classNames from "classnames";

export interface SkeletonCardProps {
  children?: JSX.Element;
  rounded?: "sm" | "md" | "xl" | "full";
}

const SkeletonCard = ({ children, rounded = "md" }: SkeletonCardProps) => {
  return (
    <div
      className={classNames(
        "mx-auto min-h-full min-w-full bg-neutral animate-pulse",
        {
          "rounded-sm": rounded == "sm",
          "rounded-md": rounded == "md",
          "rounded-xl": rounded == "xl",
          "rounded-full": rounded == "full",
        }
      )}
    >
      {children}
    </div>
  );
};

export default SkeletonCard;
