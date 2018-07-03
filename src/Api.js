import { create } from "apisauce";
import TokenManager from "./tokenManager/CookieTokenManager";
import LoggerInterceptor from "./interceptors/LoggerInterceptor";

export default class Api {
  /**
   *
   * @param {string} baseURL baseURL
   * @param {string} config config
   * @param {object} [config.headers] api headers
   * @param {boolean} [config.debug] api debug mode
   * @param {object} [config.resetToken ={enable:false,api:"token?reset"}] refresh token
   * @param {object} [config.interceptor] interceptors object
   * @param {array} [config.intercecptor.request] request interceptor class
   * @param {array} [config.interceptor.response] response interceptor class
   * @param {string} [config.cookieName ='httpeaceTokenCookie'] token cookie name
   * @param {number} [config.cookieExpire = 365] token expire time (day)
   * @memberof Api
   */

  constructor(baseURL, config = {}) {
    // Save constructor parameters
    this._setConfig({
      ...this._getDefaultConfig(),
      ...config,
      baseURL
    });
    if (!this.tokenManager) {
      this.tokenManager = new TokenManager();
      this.tokenManager._setConfig(this._getConfig());
      this.tokenManager._start();
    }
    this.requestInterceptors = [];
    this.resonseInterceptors = [];

    //init api
    this._initApi();
  }
  start() {
    const token = this.tokenManager.getToken();
    this.tokenManager._setToken(token); //初始化时 reset
  }

  getTokenManager() {
    return this.tokenManager;
  }
  setTokenManager(tokenManager) {
    this.tokenManager = tokenManager;
    this.tokenManager._setConfig(this._getConfig());
    this.tokenManager._start();
    return this;
  }
  addRequestInterceptor(func) {
    return this;
  }
  addResponseInterceptor(func) {
    return this;
  }
  _initApi() {
    const that = this;
    this.api = create(this._getConfig());
    for (const name in this.api) {
      if (this.api.hasOwnProperty(name)) {
        const fn = this.api[name];
        this[name] = fn;
      }
    }
    //default has authorization transform
    this.api.addRequestTransform(request => {
      if (this.tokenManager._isAuthenticated()) {
        request.headers["Authorization"] =
          "Bearer " + this.tokenManager._getToken();
      }
    });
    this.api.addResponseTransform(response => {
      if (response.status === 401) {
      }
    });
    // for each interceptor to append custom interceptor
    const _customInterceptor = this._getConfig().interceptor;
    const axiosInterceptors = this.api.axiosInstance.interceptors;
    _customInterceptor.request.forEach(RequestInterceptor => {
      // we should check this is a class and this extends interceptor
      const interceptor = new RequestInterceptor(that._getConfig());
      axiosInterceptors.request.use(
        interceptor.intercept,
        interceptor.whenError
      );
    });
    _customInterceptor.response.forEach(ResponseInterceptor => {
      const interceptor = new ResponseInterceptor(that._getConfig());
      axiosInterceptors.response.use(
        interceptor.intercept,
        interceptor.whenError
      );
    });
    if (this._getConfig().debug) {
      const requestLogger = new LoggerInterceptor(this._getConfig());
      const responseLogger = new LoggerInterceptor(this._getConfig());
      axiosInterceptors.request.use(
        requestLogger.intercept,
        requestLogger.whenError
      );
      axiosInterceptors.response.use(
        responseLogger.intercept,
        responseLogger.whenError
      );
    }
  }
  _setConfig(config) {
    this.config = config;
  }

  _getConfig() {
    return this.config;
  }

  _getDefaultConfig() {
    return {
      resetToken: {
        enable: false,
        api: "token?reset"
      },
      getToken: {
        enable: false,
        api: "auth?token"
      },
      headers: {
        Accept: "application/json",
        appid: process.env.APP_ID || "5aaf6b12ed7dfccb8192e5dc"
      },
      interceptor: {
        request: [],
        response: []
      },
      debug: true,
      cookieName: "httpeaceTokenCookie",
      cookieExpire: 365
    };
  }
}
