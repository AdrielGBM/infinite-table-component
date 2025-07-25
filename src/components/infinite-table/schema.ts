import {
  ARRAY_DELIMITER,
  RANGE_DELIMITER,
  SLIDER_DELIMITER,
} from "@/lib/delimiters";
import { z } from "zod";
import { LEVELS } from "@/constants/levels";

// https://github.com/colinhacks/zod/issues/2985#issue-2008642190

export const columnSchema = z.object({
  string: z.string().optional(),
  select: z.union([z.string(), z.string().array()]),
  date: z.date(),
  number: z.number(),
  uuid: z.string(),
  level: z.enum(LEVELS),
  headers: z.record(z.string()),
  message: z.string().optional(),
  percentile: z.number().optional(),
});

export type ColumnSchema = z.infer<typeof columnSchema>;

// TODO: can we get rid of this in favor of nuqs search-params?
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
  level: z
    .string()
    .transform((val) => val.split(ARRAY_DELIMITER))
    .pipe(z.enum(LEVELS).array())
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
  ...LEVELS.reduce(
    (acc, level) => ({
      ...acc,
      [level]: z.number().default(0),
    }),
    {} as Record<(typeof LEVELS)[number], z.ZodNumber>
  ),
  // REMINDER: make sure to have the `timestamp` field in the object
}) satisfies z.ZodType<BaseChartSchema>;

export type TimelineChartSchema = z.infer<typeof timelineChartSchema>;
