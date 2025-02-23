"use-client";

type ButtonProps = {
  text: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "outline";
  className: string;
};

export const Button = (props: ButtonProps) => {
  const { text, onClick, variant, className } = props;
  return (
    <button
      onClick={onClick}
      className={`h-5 ${
        variant === "secondary"
          ? "bg-gray-700" + " text-white"
          : variant === "outline"
          ? "bg-transparent" + " text-black"
          : "bg-black" + " text-white"
      } ${variant === "outline"? "border-[1px]" : ""} ${className}`}
    >
      {text}
    </button>
  );
};
