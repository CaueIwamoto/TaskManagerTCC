export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-xs text-[hsl(var(--brick))]">
      {message}
    </p>
  );
}

export const invalidClass = "border-[hsl(var(--brick))] focus-visible:ring-[hsl(var(--brick))]";
