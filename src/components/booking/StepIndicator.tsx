import { Check } from "lucide-react";

const STEP_LABELS = ["Review", "Details", "Confirmed"];

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0 px-4">
      {STEP_LABELS.map((label, i) => {
        const step = i + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;

        return (
          <div key={label} className="flex items-center">
            {i > 0 && (
              <div
                className={`h-0.5 w-8 sm:w-12 ${
                  isCompleted || isActive ? "bg-[#2563EB]" : "bg-muted"
                }`}
              />
            )}
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex size-7 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                  isCompleted
                    ? "bg-[#2563EB] text-white"
                    : isActive
                      ? "bg-[#2563EB] text-white"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {isCompleted ? <Check className="size-3.5" /> : step}
              </div>
              <span
                className={`text-[11px] font-medium ${
                  isActive || isCompleted
                    ? "text-[#2563EB]"
                    : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
