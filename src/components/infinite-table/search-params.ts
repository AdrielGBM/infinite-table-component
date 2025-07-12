import {
  createParser,
  createSearchParamsCache,
  createSerializer,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  parseAsTimestamp,
  type inferParserType,
} from "nuqs/server";
// Note: import from 'nuqs/server' to avoid the "use client" directive
import {
  ARRAY_DELIMITER,
  RANGE_DELIMITER,
  SLIDER_DELIMITER,
  SORT_DELIMITER,
} from "@/lib/delimiters";
import { LEVELS } from "@/constants/levels";
import type { ColumnConfig } from "./infinite-table";

// https://logs.run/i?sort=latency.desc

export const parseAsSort = createParser({
  parse(queryValue) {
    const [id, desc] = queryValue.split(SORT_DELIMITER);
    if (!id && !desc) return null;
    return { id, desc: desc === "desc" };
  },
  serialize(value) {
    return `${value.id}.${value.desc ? "desc" : "asc"}`;
  },
});

export const searchParamsParser = (columnConfig: ColumnConfig[] = []) => {
  const types = {
    string: parseAsString,
    date: parseAsArrayOf(parseAsTimestamp, RANGE_DELIMITER),
    level: parseAsArrayOf(parseAsStringLiteral(LEVELS), ARRAY_DELIMITER),
    number: parseAsArrayOf(parseAsInteger, SLIDER_DELIMITER),
    "timing.dns": parseAsArrayOf(parseAsInteger, SLIDER_DELIMITER),
    "timing.connection": parseAsArrayOf(parseAsInteger, SLIDER_DELIMITER),
    "timing.tls": parseAsArrayOf(parseAsInteger, SLIDER_DELIMITER),
    "timing.ttfb": parseAsArrayOf(parseAsInteger, SLIDER_DELIMITER),
    "timing.transfer": parseAsArrayOf(parseAsInteger, SLIDER_DELIMITER),
  };

  const params: Record<string, unknown> = {};
  if (columnConfig.length > 0) {
    columnConfig.forEach((column) => {
      if (column.type === "select" && Array.isArray(column.options)) {
        params[column.id] = parseAsArrayOf(
          parseAsStringLiteral(column.options),
          ARRAY_DELIMITER
        );
      } else if (column.type && column.type in types) {
        params[column.id] = types[column.type as keyof typeof types];
      }
    });
  }

  return {
    ...params,
    // REQUIRED FOR SORTING & PAGINATION
    sort: parseAsSort,
    size: parseAsInteger.withDefault(40),
    start: parseAsInteger.withDefault(0),
    // REQUIRED FOR INFINITE SCROLLING (Live Mode and Load More)
    direction: parseAsStringLiteral(["prev", "next"]).withDefault("next"),
    cursor: parseAsTimestamp.withDefault(new Date()),
    live: parseAsBoolean.withDefault(false),
    // REQUIRED FOR SELECTION
    uuid: parseAsString,
  };
};

export const searchParamsCache = (columnConfig: ColumnConfig[]) =>
  createSearchParamsCache(searchParamsParser(columnConfig));

export const searchParamsSerializer = (columnConfig: ColumnConfig[]) =>
  createSerializer(searchParamsParser(columnConfig));

export type SearchParamsType = inferParserType<
  ReturnType<typeof searchParamsParser>
>;
