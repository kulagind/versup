import { Version } from "./classes/version";
("use strict");

import { echo, exit, which } from "shelljs";
import { Git } from "./classes/git";
import { readConfig } from "./utils/read-config";
import { resolveStrategy } from "./utils/resolve-strategy";
import { writeFile } from "./utils/write-file";

(async () => {
  if (!which("git")) {
    echo("This script requires git cli");
    exit(1);
  }

  const config = await readConfig();
  const git = new Git(config);
  const lastTag = git.getLastTag();
  const commitMessages = git.getCommmitMessages();

  const version = new Version({
    lastTag,
    patcher: resolveStrategy(config, commitMessages?.[0]),
  });
  git.createTag(version.toString());
  git.pushTag();

  if (config.write) {
    await writeFile(config, version);
  }
})();
