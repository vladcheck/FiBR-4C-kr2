import type { PropsWithChildren } from "react";

export default function SubmitButton({
  formId,
  onClick,
  children,
}: PropsWithChildren & {
  formId: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="submit"
      form={formId}
      onClick={onClick}
      className="transition-colors duration-150 bg-gray-900 text-white px-4 py-1 rounded-xl hover:bg-gray-800"
    >
      {children}
    </button>
  );
}
