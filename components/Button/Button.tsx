import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: keyof typeof sizes;
  color?: string;
  variant?: keyof typeof variants;
}
export function Button({
  size = "md" as keyof typeof sizes,
  color,
  variant,
  ...props
}: Props) {
  return (
    <button
      className={`
        py-2 px-4 w-full border rounded-md
        flex items-center justify-center
        duration-300   
        ${sizes[size]} 
        ${variant && variants[variant]} 
        ${color && color}
      `}
      {...props}
    />
  );
}

const sizes = {
  sm: "h-4 text-sm",
  md: "h-6 text-md",
  lg: "h-10 text-lg",
};

const variants = {
  primary: "bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-700",
  secondary: "bg-emerald-600 border-emerald-500 text-white", //아직 색상 확정이 안됨
  kakao: "bg-[#F6E04D] border-none",
  google: "bg-white border",
};
