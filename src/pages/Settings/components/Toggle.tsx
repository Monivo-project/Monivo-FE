type ToggleProps = {
  checked: boolean;
  onChange: () => void;
};

export default function Toggle({
  checked,
  onChange,
}: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        checked
          ? "bg-blue-600"
          : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
          checked
            ? "translate-x-5"
            : "translate-x-0.5"
        }`}
      />
    </button>
  );
}