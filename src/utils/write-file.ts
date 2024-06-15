import { Version } from "../classes/version";
import { Config } from "../interfaces/config.interface";
import fs from "fs/promises";
import { join } from "path";
import { echo } from "shelljs";

export async function writeFile(
  { write }: Config,
  version: Version
): Promise<void | never> {
  if (!write) {
    return;
  }

  try {
    const filePath = join(process.cwd(), write.fileName);
    echo("Writing a file:", filePath);
    return fs.writeFile(filePath, write.getContent(version));
  } catch (e) {
    echo("Error while writing a file:", e);
  }
}
