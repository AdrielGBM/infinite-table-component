export function DataTableColumnNumber({
  left,
  value,
  right,
}: {
  left?: string;
  value: number;
  right?: string;
}) {
  return (
    <div className="font-mono">
      {left && <span className="text-muted-foreground">{left}</span>}
      {new Intl.NumberFormat("en-US", { maximumFractionDigits: 3 }).format(
        value
      )}
      {right && <span className="text-muted-foreground">{right}</span>}
    </div>
  );
}
