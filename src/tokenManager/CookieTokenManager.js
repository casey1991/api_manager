import Cookies from 'js-cookie';
import BaseTokenManager from './BaseTokenManager';
export default class CookieTokenMannager extends BaseTokenManager {
  /**
   *
   * @param {string} token  token
   * @param {string} [config.cookieName = 'httpeaceTokenCookie'] 使用cookie名
   * @param {number} [config.cookieExpire = 365] cookie 過期時間
   * @memberof AuthManager
   */
  _start() {
    this.token = this.getToken();
  }

  /**
   *
   * @param {string} token token
   */
  setToken(token) {
    const config = this._getConfig();
    if (!token) {
      this.notifyUnAuthenticate();
    } else {
      // set Token to cookie
      Cookies.set(config.cookieName, token, { expires: config.cookieExpire });
      this.token = token;
      this.notifyAuthenticated();
    }
  }
  /**
   * 從cookie中獲取token
   */
  getToken() {
    const config = this._getConfig();
    if (this.token) return this.token;
    return Cookies.get(config.cookieName);
  }
  clearToken() {
    const config = this._getConfig();
    Cookies.remove(config.cookieName);
    this.token = null;
    this.notifyUnAuthenticate();
  }
  isAuthenticated() {
    // 應該比這個複雜
    return this.token ? true : false;
  }
}
