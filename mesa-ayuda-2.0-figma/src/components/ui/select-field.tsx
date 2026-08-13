import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/shared/lib/cn";

export type SelectOption = { label: string; value: string };

type SelectFieldProps = {
  label?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  triggerClassName?: string;
};

export function SelectField({
  label,
  value,
  onValueChange,
  options,
  placeholder = "Seleccione una opción",
  disabled,
  error,
  className,
  triggerClassName,
}: SelectFieldProps) {
  return (
    <label className={cn("block min-w-0", className)}>
      {label ? (
        <span className="mb-1.5 block text-xs font-semibold text-[var(--ui-text-secondary)]">
          {label}
        </span>
      ) : null}
      <SelectPrimitive.Root
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectPrimitive.Trigger
          aria-invalid={Boolean(error)}
          className={cn(
            "focus-ring flex h-10 w-full items-center justify-between gap-3 rounded-[var(--ui-control-radius)] border border-[var(--ui-border)] bg-[var(--ui-surface)] px-3 text-left text-sm text-[var(--ui-text-primary)] hover:border-slate-300 data-[placeholder]:text-slate-400",
            error && "border-[var(--ui-danger)]",
            triggerClassName,
          )}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon asChild>
            <ChevronDown className="h-4 w-4 shrink-0 text-[var(--ui-text-secondary)]" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            position="popper"
            sideOffset={6}
            className="z-[100] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-[var(--ui-control-radius)] border border-[var(--ui-border)] bg-[var(--ui-surface)] p-1 shadow-xl"
          >
            <SelectPrimitive.Viewport>
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  className="relative flex min-h-9 select-none items-center rounded-md py-2 pl-3 pr-9 text-sm text-[var(--ui-text-primary)] outline-none data-[highlighted]:bg-[var(--ui-primary-soft)] data-[highlighted]:text-[var(--ui-primary)]"
                >
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="absolute right-3">
                    <Check className="h-4 w-4 text-[var(--ui-primary)]" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
      {error ? (
        <span className="mt-1 block text-xs text-[var(--ui-danger)]">{error}</span>
      ) : null}
    </label>
  );
}
