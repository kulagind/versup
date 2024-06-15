import { Config } from "../interfaces/config.interface";
import path from "path";
import { Variable } from "../enums/variable";
import { echo } from "shelljs";

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
    echo(`Reading a configuration from '${pathToConfig}'`);
    let config = await import(pathToConfig);
    config = Config.parse(config);
    echo("Configuration has found:", JSON.stringify(config));
    return config;
  } catch (e) {
    echo("Import configuration failed:", e);
    echo("Used default configuration:", JSON.stringify(DEFAULT_CONFIG));
    return DEFAULT_CONFIG;
  }
}
