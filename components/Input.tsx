import {
  Children,
  cloneElement,
  ForwardedRef,
  forwardRef,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactElement,
  ReactNode,
} from "react";
import useId from "@/hooks/useId";

interface InputProps extends HTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  children: ReactElement;
  errorText?: string;
}

export function Input({ label, children, errorText, ...props }: InputProps) {
  const child = Children.only(children);
  const generateId = useId("input");
  const id = child.props.id || generateId;
  const isError = child.props.error ?? true;
  return (
    <div className="w-full relative [&+&]:mt-5">
      <label htmlFor={id} className="block text-gray-500 text-md mb-2 ">
        {label}
      </label>
      {cloneElement(child, {
        id,
        ...child.props,
      })}
      {errorText !== null && (
        <p
          className={`text-red-500 absolute duration-300 ${
            isError ? "opacity-100" : "opacity-0"
          }`}
        >
          {errorText}
        </p>
      )}
    </div>
  );
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  onEnter?: () => void;
}

Input.TextField = forwardRef(
  (
    { error, onEnter = () => {}, ...props }: TextFieldProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    return (
      <input
        className={`duration-300 py-2 px-4 w-full rounded-md border border-gray-700/20 bg-gray-700/5 ${
          error &&
          "!text-red-500 border-red-500 bg-red-500/20 placeholder:text-red-500/50"
        }`}
        onKeyDown={(e) => {
          if (e.code === "Enter") {
            e.preventDefault();
            onEnter();
          }
        }}
        ref={ref}
        {...props}
      />
    );
  }
);
