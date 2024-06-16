/** This is an example of configuration file */
module.exports = {
  /**
   * Optional
   * @type {boolean}
   * @default true
   **/
  deleteIfExists: true,
  /**
   * Optional
   * @type {RegExp}
   **/
  patch: /^(fix|refactor|chore)/gi,
  /**
   * Optional
   * @type {RegExp}
   **/
  minor: /^(feat)/gi,
  /**
   * Optional
   * @type {RegExp}
   **/
  major: /^(bc)/gi,
  /**
   * Optional
   */
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