import { PatchStrategy } from "../enums/patch-strategy";
import { echo } from "shelljs";

export class Version {
  private readonly regexp = /([0-9]+)\.([0-9]+)\.([0-9]+)/g;

  private _patch: number = 0;
  private _minor: number = 0;
  private _major: number = 0;
  private _prefix: string = "";
  private _postfix: string = "";

  constructor(options?: { lastTag?: string; patcher?: PatchStrategy }) {
    this.parse(options?.lastTag);
    this.update(options?.patcher);
  }

  get patch() {
    return this._patch;
  }

  get minor() {
    return this._minor;
  }

  get major() {
    return this._major;
  }

  get postfix() {
    return this._postfix;
  }

  get prefix() {
    return this._prefix;
  }

  toString(): string {
    return `${this.prefix}${this.major}.${this.minor}.${this.patch}${this.postfix}`;
  }

  private parse(tag: string = "0.0.0"): void {
    const parsed = this.regexp.exec(tag);
    if (!parsed) {
      echo(`Version parsing from '${tag}' failed`);
      return;
    }

    this._major = +parsed?.[1];
    this._minor = +parsed?.[2];
    this._patch = +parsed?.[3];
    if (isNaN(this._patch) || isNaN(this._minor) || isNaN(this._major)) {
      echo(
        `Found incorrect version '${this._major}.${this._minor}.${this._patch}' in the tag '${tag}'`
      );
      return;
    }

    const [prefix, postfix] = tag.split(
      `${this._major}.${this._minor}.${this._patch}`
    );
    this._prefix = prefix ?? "";
    this._postfix = postfix ?? "";
  }

  private update(patcher?: PatchStrategy): void {
    echo("Current version:", this.toString());
    switch (patcher) {
      case PatchStrategy.Minor:
        this._minor += 1;
        break;
      case PatchStrategy.Major:
        this._major += 1;
        break;
      case PatchStrategy.Patch:
      default:
        this._patch += 1;
        break;
    }
    echo("Next version:", this.toString());
  }
}
