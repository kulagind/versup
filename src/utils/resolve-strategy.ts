import { PatchStrategy } from "../enums/patch-strategy";
import { Config } from "../interfaces/config.interface";

export function resolveStrategy(
  config: Config,
  commitMessage: string
): PatchStrategy {
  try {
    switch (true) {
      case commitMessage && config.major && config.major.test(commitMessage):
        return PatchStrategy.Major;
      case commitMessage && config.minor && config.minor.test(commitMessage):
        return PatchStrategy.Minor;
      case commitMessage && config.patch && config.patch.test(commitMessage):
      default:
        return PatchStrategy.Patch;
    }
  } catch (e) {
    console.log("Ошибка определения стратегии патча:", e);
    return PatchStrategy.Patch;
  }
}
