"use strict";

const { echo, exit, which, cd, touch } = require("shelljs");
const path = require("path");

const { Git } = require("./git");

const CHANGE_LOG_FILE_PATH = path.join(__dirname, "change-log.json");
const VERSION_FILE_PATH = path.join(__dirname, "version.json");
const RELEASE_NOTES_PATH = path.join(__dirname, "release-notes");

const git = new Git();

if (!which("git")) {
  echo("This script requires git");
  exit(1);
}

const fs = require("fs");

const branchName =
  process.env.CI_COMMIT_BRANCH || process.env.CI_COMMIT_REF_NAME;

const tagPostfix = branchName.substr(0, 3);

const currentTag = git.getLastTag();

const currentVersion = currentTag ? currentTag.trim() : `1.0.0-${tagPostfix}`;

let newVersion;

const lastCommit = git.getCommit();
const lastCommitMessage = lastCommit.message;

const commitType = lastCommit.type;

const updateParams = process.argv
  .filter((e) => {
    return e.includes("--");
  })
  .map((e) => e.slice(2));

let commitMessageList = [];

function CommitTag(str) {
  const start = str.indexOf("[") + 1;
  const stop = str.indexOf("]") - 1;
  return start >= 0 && stop >= 0 ? str.substr(start, stop) : "skip";
}

function UpdateChanges(version) {
  const changeLogData = JSON.parse(
    fs.readFileSync(CHANGE_LOG_FILE_PATH, "utf8")
  );

  changeLogData[version] = commitMessageList;

  fs.writeFileSync(CHANGE_LOG_FILE_PATH, JSON.stringify(changeLogData));
}

function UpdateVersion(version) {
  fs.writeFileSync(
    VERSION_FILE_PATH,
    JSON.stringify({ version, type: tagPostfix })
  );

  git.tagDelete(currentVersion);
  git.tagCreate(`${version}-${tagPostfix}`);

  if (updateParams.includes("notes")) {
    cd(RELEASE_NOTES_PATH);
    touch(`${version}.md`);
    cd("../");
  }
  if (updateParams.includes("changes")) {
    UpdateChanges(version);
  }

  git.push(
    `${branchName} update version to ${newVersion}, previous ${currentVersion}`
  );
}

// eslint-disable-next-line @typescript-eslint/no-shadow
function GetNewVersion(commitMessageList) {
  const patchVersion = currentVersion.split("-")[0].split(".");

  for (const message of commitMessageList) {
    switch (CommitTag(message)) {
      case "BC":
        patchVersion[0] = +patchVersion[0] + 1;
        patchVersion[1] = 0;
        patchVersion[2] = 0;
        break;
      case "feat":
        patchVersion[1] = +patchVersion[1] + 1;
        patchVersion[2] = 0;
        break;
      case "fix":
        patchVersion[2] = +patchVersion[2] + 1;
        break;
      default:
        break;
    }
  }
  const newVersionIndex = `${patchVersion[0]}.${patchVersion[1]}.${patchVersion[2]}`;
  newVersion = `${newVersionIndex}-${tagPostfix}`;
  if (currentVersion !== newVersion) {
    UpdateVersion(`${newVersionIndex}`);
  }
}

switch (commitType) {
  case "commit":
    commitMessageList = [lastCommitMessage];
    GetNewVersion([lastCommitMessage]);
    break;
  case "merge":
    git.getMergeCommits(lastCommit.mergeId).then((data) => {
      // @ts-ignore
      commitMessageList = data.filter((e) => {
        return e.includes("#lk-zup");
      });
      GetNewVersion(commitMessageList);
    });
    break;
  default:
    console.log(`Nothing to do; commitType ${commitType}`);
    break;
}
