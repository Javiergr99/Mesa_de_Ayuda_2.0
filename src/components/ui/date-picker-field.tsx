import { useId, useMemo, useState } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { DayPicker } from "@daypicker/react";
import { es } from "@daypicker/react/locale";
import { format, isValid, parse, startOfDay } from "date-fns";
import { CalendarDays, ChevronDown } from "lucide-react";

import "@daypicker/react/style.css";
import "./date-picker-field.css";

import { cn } from "@/shared/lib/cn";

type DatePickerFieldProps = {
  id?: string;
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string | boolean;
  disabled?: boolean;
  className?: string;
  minDate?: string;
  maxDate?: string;
};

function parseDateValue(value?: string): Date | undefined {
  if (!value) {
    return undefined;
  }

  const parsedDate = parse(value, "yyyy-MM-dd", new Date());
  return isValid(parsedDate) ? startOfDay(parsedDate) : undefined;
}

function toFormDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

function toDisplayDate(date: Date): string {
  return format(date, "dd/MM/yyyy");
}

export function DatePickerField({
  id,
  label,
  value = "",
  onChange,
  placeholder = "Seleccione una fecha",
  error,
  disabled = false,
  className,
  minDate,
  maxDate,
}: DatePickerFieldProps) {
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const errorId = `${triggerId}-error`;
  const [open, setOpen] = useState(false);

  const selectedDate = useMemo(() => parseDateValue(value), [value]);
  const minDateValue = useMemo(() => parseDateValue(minDate), [minDate]);
  const maxDateValue = useMemo(() => parseDateValue(maxDate), [maxDate]);
  const today = startOfDay(new Date());

  const errorMessage =
    typeof error === "string"
      ? error
      : error
        ? "Seleccione una fecha válida."
        : "";

  const todayIsAllowed =
    (!minDateValue || today >= minDateValue) &&
    (!maxDateValue || today <= maxDateValue);

  const disabledDays = [
    ...(minDateValue ? [{ before: minDateValue }] : []),
    ...(maxDateValue ? [{ after: maxDateValue }] : []),
  ];

  function selectDate(date: Date | undefined) {
    if (!date) {
      return;
    }

    onChange(toFormDate(date));
    setOpen(false);
  }

  function selectToday() {
    if (!todayIsAllowed) {
      return;
    }

    onChange(toFormDate(today));
    setOpen(false);
  }

  function clearDate() {
    onChange("");
    setOpen(false);
  }

  return (
    <div className={cn("min-w-0", className)}>
      {label ? (
        <label
          htmlFor={triggerId}
          className="mb-1.5 block text-xs font-semibold text-[var(--ui-text-secondary)]"
        >
          {label}
        </label>
      ) : null}

      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger asChild>
          <button
            id={triggerId}
            type="button"
            disabled={disabled}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={errorMessage ? errorId : undefined}
            className={cn(
              "focus-ring flex h-10 w-full min-w-0 items-center justify-between gap-2 rounded-lg border bg-[var(--ui-surface)] px-3 text-left text-sm outline-none transition-colors",
              disabled
                ? "cursor-not-allowed border-[var(--ui-border)] bg-slate-50 opacity-60"
                : "cursor-pointer border-[var(--ui-border)] hover:border-slate-300",
              error && "border-red-400",
            )}
          >
            <span className="flex min-w-0 items-center gap-2.5">
              <CalendarDays
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-[var(--ui-primary)]"
              />
              <span
                className={cn(
                  "truncate",
                  selectedDate
                    ? "font-medium text-[var(--ui-text-primary)]"
                    : "text-[var(--ui-text-secondary)]",
                )}
              >
                {selectedDate ? toDisplayDate(selectedDate) : placeholder}
              </span>
            </span>

            <ChevronDown
              aria-hidden="true"
              className={cn(
                "h-4 w-4 shrink-0 text-[var(--ui-text-secondary)] transition-transform duration-200",
                open && "rotate-180",
              )}
            />
          </button>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="start"
            sideOffset={6}
            collisionPadding={12}
            className="ma-date-picker z-[110] overflow-hidden rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-surface)] p-3 shadow-[0_18px_50px_rgba(15,23,42,0.16)] outline-none"
          >
            <DayPicker
              animate
              mode="single"
              locale={es}
              weekStartsOn={1}
              showOutsideDays
              selected={selectedDate}
              onSelect={selectDate}
              disabled={disabledDays}
              startMonth={minDateValue}
              endMonth={maxDateValue}
              defaultMonth={selectedDate ?? maxDateValue ?? today}
            />

            <div className="mt-2 flex items-center justify-between border-t border-[var(--ui-border)] pt-3">
              <button
                type="button"
                onClick={clearDate}
                className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[var(--ui-text-secondary)] transition-colors hover:bg-slate-100 hover:text-[var(--ui-text-primary)]"
              >
                Limpiar
              </button>

              <button
                type="button"
                onClick={selectToday}
                disabled={!todayIsAllowed}
                className="rounded-lg bg-[var(--ui-primary)] px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Hoy
              </button>
            </div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>

      {errorMessage ? (
        <p id={errorId} role="alert" className="mt-1 text-xs text-red-600">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
