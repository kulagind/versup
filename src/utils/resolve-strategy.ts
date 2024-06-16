import { PatchStrategy } from "../enums/patch-strategy";
import { Config } from "../interfaces/config.interface";
import { echo } from "shelljs";

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
    echo("Error while defining patch strategy:", JSON.stringify(e));
    return PatchStrategy.Patch;
  }
}
