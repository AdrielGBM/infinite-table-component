import type { DataTableSliderFilterField } from "./types";
import { InputWithAddons } from "@/components/custom/input-with-addons";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/custom/slider";
import { isArrayOfNumbers } from "@/lib/is-array";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useDataTable } from "@/components/data-table/useDataTable";

function getFilter(filterValue: unknown) {
  return typeof filterValue === "number"
    ? [filterValue, filterValue]
    : Array.isArray(filterValue) && isArrayOfNumbers(filterValue)
    ? filterValue.length === 1
      ? [filterValue[0], filterValue[0]]
      : filterValue
    : null;
}

// TODO: discuss if we even need the `defaultMin` and `defaultMax`
export function DataTableFilterSlider<TData>({
  value: _value,
  min: defaultMin,
  max: defaultMax,
}: DataTableSliderFilterField<TData>) {
  const value = _value as string;
  const { table, columnFilters, getFacetedMinMaxValues } = useDataTable();
  const column = table.getColumn(value);
  const filterValue = columnFilters.find((i) => i.id === value)?.value;
  const filters = getFilter(filterValue);
  const [input, setInput] = useState<number[] | null>(filters);
  const [min, max] = getFacetedMinMaxValues?.(table, value) ??
    column?.getFacetedMinMaxValues() ?? [defaultMin, defaultMax];

  const debouncedInput = useDebounce(input, 500);

  useEffect(() => {
    if (debouncedInput?.length === 2) {
      column?.setFilterValue(debouncedInput);
    }
  }, [debouncedInput]);

  useEffect(() => {
    if (debouncedInput?.length !== 2) {
      /* empty */
    } else if (!filters) {
      setInput(null);
    } else if (
      debouncedInput[0] !== filters[0] ||
      debouncedInput[1] !== filters[1]
    ) {
      setInput(filters);
    }
  }, [filters]);

  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-4">
        <div className="grid w-full gap-1.5">
          <Label
            htmlFor={`min-${value}`}
            className="px-2 text-muted-foreground"
          >
            Min.
          </Label>
          <InputWithAddons
            placeholder="from"
            containerClassName="mb-2 h-9 rounded-lg"
            type="number"
            name={`min-${value}`}
            id={`min-${value}`}
            value={(input?.[0] ?? min).toString()}
            min={min}
            max={max}
            onChange={(e) => {
              setInput((prev) => [Number(e.target.value), prev?.[1] ?? max]);
            }}
          />
        </div>
        <div className="grid w-full gap-1.5">
          <Label
            htmlFor={`max-${value}`}
            className="px-2 text-muted-foreground"
          >
            Max.
          </Label>
          <InputWithAddons
            placeholder="to"
            containerClassName="mb-2 h-9 rounded-lg"
            type="number"
            name={`max-${value}`}
            id={`max-${value}`}
            value={(input?.[1] ?? max).toString()}
            min={min}
            max={max}
            onChange={(e) => {
              setInput((prev) => [prev?.[0] ?? min, Number(e.target.value)]);
            }}
          />
        </div>
      </div>
      <Slider
        min={min}
        max={max}
        value={input?.length === 2 ? input : [min, max]}
        onValueChange={(values) => {
          setInput(values);
        }}
      />
    </div>
  );
}
