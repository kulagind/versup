module.exports = {
  /** @type {boolean} */
  deleteIfExists: true,
  /** @type {RegExp} */
  patch: /^(fix|refactor|chore)/gi,
  /** @type {RegExp} */
  minor: /^(feat)/gi,
  /** @type {RegExp} */
  major: /^(bc)/gi,
  write: {
    /** @type {string} */
    fileName: 'assets/version.json',
    /**
     * @type {(version) => string}
     * @param {{
     *  patch: number,
     *  minor: number,
     *  major: number,
     *  prefix: string,
     *  postfix: string,
     *  toString: () => string
     * }} version
     */
    getContent: (version) => `{"version":"${version.toString()}"}`
  }
}