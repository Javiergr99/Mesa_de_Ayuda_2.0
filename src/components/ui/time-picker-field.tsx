import { useId, useState } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Check, ChevronDown, Clock3 } from "lucide-react";

import { SelectField, type SelectOption } from "@/components/ui/select-field";
import { cn } from "@/shared/lib/cn";

const HOUR_OPTIONS: readonly SelectOption[] = Array.from({ length: 24 }, (_, hour) => {
  const value = String(hour).padStart(2, "0");
  return { value, label: value };
});

const MINUTE_OPTIONS: readonly SelectOption[] = Array.from({ length: 60 }, (_, minute) => {
  const value = String(minute).padStart(2, "0");
  return { value, label: value };
});

type TimePickerFieldProps = {
  id?: string;
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string | boolean;
  disabled?: boolean;
  className?: string;
};

function parseTime(value?: string): { hour: string; minute: string } {
  const match = /^(\d{2}):(\d{2})/.exec(value ?? "");

  if (!match) {
    return { hour: "", minute: "" };
  }

  const hour = Number(match[1]);
  const minute = Number(match[2]);

  if (hour > 23 || minute > 59) {
    return { hour: "", minute: "" };
  }

  return {
    hour: String(hour).padStart(2, "0"),
    minute: String(minute).padStart(2, "0"),
  };
}

function getTimeErrorMessage(error: string | boolean | undefined): string {
  if (typeof error === "string") {
    return error;
  }

  return error ? "Seleccione una hora válida." : "";
}

function getTimeTriggerText(value: string, placeholder: string): string {
  return value ? value.slice(0, 5) : placeholder;
}

function getTimeTriggerTextClassName(value: string): string {
  return value ? "font-medium text-[var(--ui-text-primary)]" : "text-[var(--ui-text-secondary)]";
}

function getTimePickerTriggerClassName(
  disabled: boolean,
  error: string | boolean | undefined,
): string {
  return cn(
    "focus-ring flex h-10 w-full min-w-0 items-center justify-between gap-2 rounded-lg border bg-[var(--ui-surface)] px-3 text-left text-sm outline-none transition-colors",
    disabled
      ? "cursor-not-allowed border-[var(--ui-border)] bg-slate-50 opacity-60"
      : "cursor-pointer border-[var(--ui-border)] hover:border-slate-300",
    error ? "border-red-400" : undefined,
  );
}

function TimePickerLabel({ id, label }: { id: string; label: string | undefined }) {
  if (!label) {
    return null;
  }

  return (
    <label
      htmlFor={id}
      className="mb-1.5 block text-xs font-semibold text-[var(--ui-text-secondary)]"
    >
      {label}
    </label>
  );
}

function TimeDraftPreview({ hour, minute }: { hour: string; minute: string }) {
  if (!hour || !minute) {
    return null;
  }

  return (
    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-sm font-bold tabular-nums text-[var(--ui-primary)]">
      {hour}:{minute}
    </span>
  );
}

function TimePickerErrorMessage({ id, message }: { id: string; message: string }) {
  if (!message) {
    return null;
  }

  return (
    <p id={id} role="alert" className="mt-1 text-xs text-red-600">
      {message}
    </p>
  );
}
export function TimePickerField({
  id,
  label,
  value = "",
  onChange,
  placeholder = "Seleccione una hora",
  error,
  disabled = false,
  className,
}: TimePickerFieldProps) {
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const errorId = `${triggerId}-error`;
  const [open, setOpen] = useState(false);
  const [draftHour, setDraftHour] = useState("");
  const [draftMinute, setDraftMinute] = useState("");

  const errorMessage = getTimeErrorMessage(error);
  const triggerText = getTimeTriggerText(value, placeholder);
  const triggerTextClassName = getTimeTriggerTextClassName(value);
  const triggerClassName = getTimePickerTriggerClassName(disabled, error);
  const canApply = Boolean(draftHour && draftMinute);

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      const parsed = parseTime(value);
      setDraftHour(parsed.hour);
      setDraftMinute(parsed.minute);
    }

    setOpen(nextOpen);
  }

  function applyTime() {
    if (!draftHour || !draftMinute) {
      return;
    }

    onChange(`${draftHour}:${draftMinute}`);
    setOpen(false);
  }

  function handleUseCurrentTime() {
    const now = new Date();
    const hour = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2, "0");

    onChange(`${hour}:${minute}`);
    setOpen(false);
  }

  function clearTime() {
    setDraftHour("");
    setDraftMinute("");
    onChange("");
    setOpen(false);
  }

  return (
    <div className={cn("min-w-0", className)}>
      <TimePickerLabel id={triggerId} label={label} />

      <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
        <PopoverPrimitive.Trigger asChild>
          <button
            id={triggerId}
            type="button"
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={errorMessage ? errorId : undefined}
            className={triggerClassName}
          >
            <span className="flex min-w-0 items-center gap-2.5">
              <Clock3 aria-hidden="true" className="h-4 w-4 shrink-0 text-[var(--ui-primary)]" />
              <span className={cn("truncate", triggerTextClassName)}>{triggerText}</span>
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
            className="z-[90] w-[min(22rem,calc(100vw-24px))] rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-surface)] p-4 shadow-[0_18px_50px_rgba(15,23,42,0.16)] outline-none"
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-[var(--ui-text-primary)]">Hora de atención</p>
                <p className="mt-0.5 text-xs text-[var(--ui-text-secondary)]">
                  Formato de 24 horas
                </p>
              </div>

              <TimeDraftPreview hour={draftHour} minute={draftMinute} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <SelectField
                label="Hora"
                value={draftHour}
                onValueChange={setDraftHour}
                options={HOUR_OPTIONS}
                placeholder="HH"
                triggerClassName="h-10 tabular-nums"
              />

              <SelectField
                label="Minuto"
                value={draftMinute}
                onValueChange={setDraftMinute}
                options={MINUTE_OPTIONS}
                placeholder="MM"
                triggerClassName="h-10 tabular-nums"
              />
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-[var(--ui-border)] pt-3">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={clearTime}
                  className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[var(--ui-text-secondary)] transition-colors hover:bg-slate-100 hover:text-[var(--ui-text-primary)]"
                >
                  Limpiar
                </button>

                <button
                  type="button"
                  onClick={handleUseCurrentTime}
                  className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[var(--ui-primary)] transition-colors hover:bg-slate-100"
                >
                  Ahora
                </button>
              </div>

              <button
                type="button"
                onClick={applyTime}
                disabled={!canApply}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--ui-primary)] px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Check aria-hidden="true" className="h-3.5 w-3.5" />
                Aplicar
              </button>
            </div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>

      <TimePickerErrorMessage id={errorId} message={errorMessage} />
    </div>
  );
}
