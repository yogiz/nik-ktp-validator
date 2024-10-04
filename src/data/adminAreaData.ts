import fs from "fs";
import path from "path";
import { parse } from "csv-parse";

export interface AdminArea {
  code: string;
  province: string;
  district: string;
  subdistrict: string;
}

export async function loadAdminAreaData(): Promise<AdminArea[]> {
  const results: AdminArea[] = [];
  const csvPath = path.join(
    __dirname,
    "..",
    "..",
    "src",
    "data",
    "csv",
    "data.csv"
  );

  const parser = fs.createReadStream(csvPath).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })
  );

  for await (const record of parser) {
    results.push(record);
  }

  return results;
}
