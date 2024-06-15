import { Version } from "../classes/version";
import { Config } from "../interfaces/config.interface";
import fs from "fs/promises";
import { join } from "path";

export async function writeFile(
  { write }: Config,
  version: Version
): Promise<void | never> {
  if (!write) {
    return;
  }

  try {
    return fs.writeFile(
      join(process.cwd(), write.fileName),
      write.getContent(version)
    );
  } catch (e) {
    console.log("Ошибка записи в файл:", e);
  }
}
