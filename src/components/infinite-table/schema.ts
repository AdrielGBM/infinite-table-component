import {
  ARRAY_DELIMITER,
  RANGE_DELIMITER,
  SLIDER_DELIMITER,
} from "@/lib/delimiters";
import { z } from "zod";

// https://github.com/colinhacks/zod/issues/2985#issue-2008642190

export interface BaseRowSchema {
  uuid: string;
  date: string | Date;
}

export type ColumnSchema = BaseRowSchema &
  Record<
    string,
    | string
    | string[]
    | Date
    | number
    | Record<string, string>
    | Record<string, number>
    | undefined
  >;

export const columnFilterSchema = z.object({
  string: z.string().optional(),
  select: z
    .string()
    .transform((val) => val.split(ARRAY_DELIMITER))
    .pipe(z.string().array())
    .optional(),
  date: z
    .string()
    .transform((val) => val.split(RANGE_DELIMITER).map(Number))
    .pipe(z.coerce.date().array())
    .optional(),
  number: z
    .string()
    .transform((val) => val.split(SLIDER_DELIMITER))
    .pipe(z.coerce.number().array().max(2))
    .optional(),
});

export type ColumnFilterSchema = z.infer<typeof columnFilterSchema>;

export const facetMetadataSchema = z.object({
  rows: z.array(z.object({ value: z.any(), total: z.number() })),
  total: z.number(),
  min: z.number().optional(),
  max: z.number().optional(),
});

export type FacetMetadataSchema = z.infer<typeof facetMetadataSchema>;

export interface BaseChartSchema {
  timestamp: number;
  [key: string]: number;
}

export const timelineChartSchema = z.object({
  timestamp: z.number(), // UNIX
  // REMINDER: make sure to have the `timestamp` field in the object
}) satisfies z.ZodType<BaseChartSchema>;

export type TimelineChartSchema = z.infer<typeof timelineChartSchema>;
