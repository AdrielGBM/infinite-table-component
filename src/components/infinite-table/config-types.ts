export type ColumnType =
  | "uuid"
  | "date"
  | "string"
  | "number"
  | "select"
  | "timeline"
  | "percentile"
  | "headers"
  | "message";

export interface BaseColumnConfig {
  id: string;
  type: ColumnType;
  label?: string;
  default?: boolean;
  noColumn?: boolean;
  columnSize?: number;
  noFilter?: boolean;
  noSheet?: boolean;
  sheetClassName?: string;
}

export interface UuidColumnConfig extends BaseColumnConfig {
  type: "uuid";
}

export interface DateColumnConfig extends BaseColumnConfig {
  type: "date";
}

export interface StringColumnConfig extends BaseColumnConfig {
  type: "string";
}

export interface NumberColumnConfig extends BaseColumnConfig {
  type: "number";
  min?: number;
  max?: number;
  left?: string;
  right?: string;
}

export interface ColumnOption {
  value: string;
  label?: string | null;
  color?: string | null;
}

export interface SelectColumnConfig extends BaseColumnConfig {
  type: "select";
  options: ColumnOption[];
  showColor?: boolean;
}

export interface TimelineColumnConfig extends BaseColumnConfig {
  type: "timeline";
  options: ColumnOption[];
  left?: string;
  right?: string;
}

export interface PercentileColumnConfig extends BaseColumnConfig {
  type: "percentile";
}

export interface HeadersColumnConfig extends BaseColumnConfig {
  type: "headers";
}

export interface MessageColumnConfig extends BaseColumnConfig {
  type: "message";
  color?: string;
}

export type ColumnConfig =
  | UuidColumnConfig
  | DateColumnConfig
  | StringColumnConfig
  | NumberColumnConfig
  | SelectColumnConfig
  | TimelineColumnConfig
  | PercentileColumnConfig
  | HeadersColumnConfig
  | MessageColumnConfig;

export interface RowConfig {
  label: string;
}
