import { exec, ShellString, exit } from "shelljs";
import { Config } from "./interfaces/config.inteface";

export class GitTag {
  constructor(private readonly config?: Config) {}

  create(name: string): void {
    let result = exec(`git tag ${name}`);

    if (result.code !== 0) {
      console.log(`Version ${name} already exists`);

      if (this.config?.deleteIfExists) {
        this.delete(name);
        result = exec(`git tag ${name}`);
      }

      if (result.code !== 0) {
        exit(1);
      }
    }
  }

  push(message: string): void {
    exec('git config --global user.email "bot@gmail.com"');
    exec('git config --global user.name "Bot"');
    exec("git add --all");
    exec(`git commit -m "${message}"`);
    exec("git remote rm ssh_origin || true");
    exec(`git remote add ssh_origin git@git:${process.env.CI_PROJECT_PATH}`);
    exec(
      `git push --push-option=ci.skip ssh_origin HEAD:${process.env.CI_COMMIT_REF_NAME}`
    );
    exec(`git push --push-option=ci.skip --tags`);
  }

  getLast(): string | null {
    const result = exec("git describe --tags --abbrev=0");
    if (result.code !== 0) {
      return null;
    }

    const tags = result.stdout
      .split("\n")
      .filter((i: string) => i.trim().length);

    return tags.length ? tags[0] : null;
  }

  private getMessages(): string[] {
    const lastTag = exec(`git describe --tags --abbrev=0 2>/dev/null`);
    let result: ShellString;
    /**
     * Если тег не нейден - берем 1 последнее сообщение (коммит)
     * Иначе, берем все последние коммиты до тега
     **/
    if (lastTag.code !== 0) {
      result = exec(`git log -1 --pretty=%B`);
    } else {
      result = exec(`git log ${lastTag.stdout}^~1..HEAD --pretty=%B`);
    }

    const messages = result.stdout?.split("\n") || [];

    return messages;
  }

  private delete(name: string): void {
    exec(`git tag -d ${name}`);
  }
}
