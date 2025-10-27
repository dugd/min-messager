interface ErrorMessageProps {
  message?: string | null;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className="bg-[#ff3b30]/10 border border-[#ff3b30]/20 text-[#ff3b30] px-4 py-3 rounded-lg text-sm">
      {message}
    </div>
  );
}
