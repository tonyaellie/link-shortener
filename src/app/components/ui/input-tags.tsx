// input-tags.tsx

"use client";

import * as React from "react";
import { Badge } from "./badge";
import { Button } from "./button";
import { XIcon } from "lucide-react";
import { cn } from "~/app/lib/utils";

type InputTagsProps = Omit<
  React.ComponentProps<"input">,
  "value" | "onChange"
> & {
  value: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
  validate?: (value: string) => boolean;
};

const InputTags = React.forwardRef<HTMLInputElement, InputTagsProps>(
  ({ className, value, onChange, validate, ...props }, ref) => {
    const [pendingDataPoint, setPendingDataPoint] = React.useState("");

    React.useEffect(() => {
      if (pendingDataPoint.includes(",")) {
        const newDataPoints = new Set([
          ...value,
          ...pendingDataPoint.split(",").map((chunk) => chunk.trim()),
        ]);
        onChange(Array.from(newDataPoints));
        setPendingDataPoint("");
      }
    }, [pendingDataPoint, onChange, value]);

    const addPendingDataPoint = () => {
      if (pendingDataPoint && validate?.(pendingDataPoint)) {
        const newDataPoints = new Set([...value, pendingDataPoint]);
        onChange(Array.from(newDataPoints));
        setPendingDataPoint("");
      }
    };

    return (
      <div
        className={cn(
          "flex min-h-10 w-full flex-wrap gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 dark:border-border dark:bg-background dark:ring-offset-background dark:has-[:focus-visible]:ring-secondary",
          className,
        )}
      >
        {value.map((item) => (
          <Badge key={item} variant="secondary">
            {item}
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 h-3 w-3"
              onClick={() => {
                onChange(value.filter((i) => i !== item));
              }}
            >
              <XIcon className="w-3" />
            </Button>
          </Badge>
        ))}
        <input
          className="flex-1 outline-none placeholder:text-neutral bg-background"
          value={pendingDataPoint}
          onChange={(e) => setPendingDataPoint(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addPendingDataPoint();
            } else if (
              e.key === "Backspace" &&
              pendingDataPoint.length === 0 &&
              value.length > 0
            ) {
              e.preventDefault();
              onChange(value.slice(0, -1));
            }
          }}
          {...props}
          ref={ref}
        />
      </div>
    );
  },
);

InputTags.displayName = "InputTags";

export { InputTags };
