import BaseTokenManager from './BaseTokenManager';
export default class RequestTokenManager extends BaseTokenManager {
  /**
   *
   * @param {string} token  token
   * @param {string} [config.cookieName = 'httpeaceTokenCookie'] 使用cookie名
   * @param {number} [config.cookieExpire = 365] cookie 過期時間
   * @memberof AuthManager
   */
  constructor(token) {
    super();
    if (token) {
      this.token = token;
    }
  }
  /**
   *
   * @param {string} token token
   */
  setToken(token) {
    this.token = token;
  }
  /**
   * 從cookie中獲取token
   */
  getToken() {
    return this.token;
  }
  clearToken() {
    this.token = null;
  }
  isAuthenticated() {
    return this.token ? true : false;
  }
}
