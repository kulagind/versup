import { Config } from "../interfaces/config.interface";
import path from "path";
import { Variable } from "../enums/variable";

const DEFAULT_PATH = "version.config.js";
const DEFAULT_CONFIG: Config = {
  deleteIfExists: true,
};

export async function readConfig(): Promise<Config> {
  try {
    const pathToConfig = path.join(
      process.cwd(),
      process.env[Variable.VER_CONFIG_PATH] ?? DEFAULT_PATH
    );
    console.log(`Чтение конфигурации из '${pathToConfig}'`);
    let config = await import(pathToConfig);
    config = Config.parse(config);
    console.log("Найдена конфигурация:", JSON.stringify(config));
    return config;
  } catch (e) {
    console.log("Не удалось импортировать конфигурацию:", e);
    console.log(
      "Используется стандартная конфигурация:",
      JSON.stringify(DEFAULT_CONFIG)
    );
    return DEFAULT_CONFIG;
  }
}
