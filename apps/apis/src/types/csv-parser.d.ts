declare module "csv-parser" {
  import type {Transform} from "node:stream";

  type CsvParserOptions = {
    headers?: boolean | string[];
  };

  export default function csv(options?: CsvParserOptions): Transform;
}
