import BaseInterceptor from './BaseInterceptor';
class LoggerInterceptor extends BaseInterceptor {
  intercept(config) {
    console.log(config);
    return config;
  }
  whenError(error) {
    return Promise.reject(error);
  }
}
export default LoggerInterceptor;
