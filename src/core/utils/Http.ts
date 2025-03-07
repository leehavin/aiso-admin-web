import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import AppConsts from "../../utils/AppConsts";
import Tools from "./Tools";
import router from "@/core/router/index.js";
import ApiResult from "../typings/ApiResult";
import loginService from "@/services/LoginService";

const unAuthorizedMessage = "未登录或登录已过期,请重新登录!";
const unForbiddenMessage = "未授权,请授权后访问!";

/**
 * 网络请求客户端
 */
class Http {
  private static isLoading: boolean = true;
  private static isRefreshing: boolean = false;
  private static requests: any[] = [];

  /**
   * 初始化请求配置
   */
  static init(): void {
    //axios 基本配置
    axios.defaults.timeout = 100 * 1000;
    // axios.defaults.baseURL = AppConsts.domainServerApi;

    //http request 拦截器
    axios.interceptors.request.use(
      (config: AxiosRequestConfig<any>) => {
        if (Http.isLoading) {
          Tools.loadingStart();
        }

        let authorization = Tools.getAuthorization();
        if (authorization) {
          config!.headers![AppConsts.authorizationKeyName] = authorization;
        }

        config!.headers!["X-Requested-With"] = "XMLHttpRequest";

        if (!config!.headers!["Content-Type"]) {
          config!.headers!["Content-Type"] = "application/json; charset=UTF-8";
        }

        if (!config.data) return config;

        return config;
      },
      (error) => {
        console.log(error);
        return Promise.reject(error);
      }
    );

    //http response 拦截器
    axios.interceptors.response.use(
      (response: any) => {
        if (Http.isLoading) {
          Tools.loadingStop();
        }

        const data = response.data;

        if (Object.prototype.hasOwnProperty.call(data, "code")) {
          if (data.code === 401) {
            //接口授权码无效
            // Tools.notice.warning("未授权!");
            // return router.push(AppConsts.loginPath);
            return this.RefreshToken(response);
          }
          else if (data.code === 403) {
            Tools.notice.error(unForbiddenMessage);
          }
          else if (data.code === 500) {
            //失败
            Tools.message.error(data.message);
          }
        }

        return response;
      },
      (error) => {
        if (Http.isLoading) {
          Tools.loadingStop();
        }

        if (error.message && error.message == "canceled") {
          Tools.notice.success("已取消");
          return error;
        }

        if (!error.response) {
          Tools.notice.error(error.message);
          return error;
        }

        if (error.response.status === 401) {
          return this.RefreshToken(error);
        }
        else if (error.response.status === 403) {
          Tools.notice.error(unForbiddenMessage);
          return error;
        }
        else if (error.response.status === 500) {
          Tools.notice.error(error.response.data.message ?? error.message);
        }

        return error;
      }
    );
  }

  static RefreshToken(option: any) {
    console.log(option);

    const config = option.config ?? option.response.config;
    const request = option.request;

    if (this.isRefreshing) {
      if (request.responseURL.indexOf("RefreshToken") > -1) {
        return option;
      }

      return new Promise((resolve) => {
        this.requests.push((token: string) => {
          config.headers[AppConsts.authorizationKeyName] = token;
          resolve(axios.request(config));
        });
      });
    }

    const refreshToken = Tools.getRefreshToken();
    if (!refreshToken) {
      Tools.notice.warning(unAuthorizedMessage);
      router.replace(AppConsts.loginPath);
      return option;
    }

    //刷新 token
    this.isRefreshing = true;
    return loginService.refreshToken(refreshToken).then((result) => {
      if (result.code !== 200) {
        Tools.notice.warning(unAuthorizedMessage);
        router.replace(AppConsts.loginPath);
        return option;
      }

      //保存token
      const token = result.data.tokenType + " " + result.data.accessToken;
      Tools.setAuthorization(token, result.data.refreshToken);

      // 重新发起请求
      this.requests.forEach((req) => req(token));

      config.headers[AppConsts.authorizationKeyName] = token;
      return axios.request(config);
    }).catch(() => {
      Tools.notice.warning(unAuthorizedMessage);
      router.replace(AppConsts.loginPath);
    }).finally(() => {
      this.isRefreshing = false;
      this.requests = [];
    })
  }

  /**
   * get 请求
   * @param url 地址
   * @param data 数据
   * @param loading 是否有全局加载转圈
   * @param config 其他配置信息
   * @returns Promise 对象
   */
  static async get(url: string, data = {}, loading: boolean = true, config: any = {}): Promise<ApiResult<any>> {
    Http.isLoading = loading;
    const result = await axios.get<ApiResult<any>>(url, {
      params: data,
      ...config,
    });
    return result.data;
  }

  /**
   * 封装post请求
   * @param url
   * @param data
   * @param loading 是否有加载效果
   * @param config config信息
   * @returns {Promise}
   */
  static async post(url: string, data = {}, loading: boolean = true, config = {}): Promise<ApiResult<any>> {
    Http.isLoading = loading;
    const result = await axios.post<ApiResult<any>>(url, data, config);
    return result.data;
  }

  /**
   * 封装 post 请求 用于上传文件
   * @param url
   * @param data
   * @param loading 是否有加载效果
   * @param config config信息
   * @returns {Promise}
   */
  static async upload(url: string, data: any = {}, loading: boolean = true, config: AxiosRequestConfig<any> = {}): Promise<ApiResult<any>> {
    Http.isLoading = loading;
    if (!data) data = {};
    const result = await axios.post<ApiResult<any>>(url, data, {
      headers: { "Content-Type": "multipart/form-data" },
      ...config,
    });
    return result.data;
  }

  /**
   * 封装patch请求
   * @param url
   * @param data
   * @param loading 是否有加载效果
   * @param config config信息
   * @returns {Promise}
   */
  static async patch(url: string, data = {}, loading: boolean = true, config = {}): Promise<ApiResult<any>> {
    Http.isLoading = loading;
    const result = await axios.patch<ApiResult<any>>(url, data, config);
    return result.data;
  }

  /**
   * 封装put请求
   * @param url
   * @param data
   * @param loading 是否有加载效果
   * @param config config信息
   * @returns {Promise}
   */
  static async put(url: string, data = {}, loading: boolean = true, config = {}): Promise<ApiResult<any>> {
    Http.isLoading = loading;
    const result = await axios.put<ApiResult<any>>(url, data, config);
    return result.data;
  }

  /**
   * 封装 post请求 用于下载文件
   * @param url
   * @param data
   * @param loading
   * @param fileName
   * @returns
   */
  static async download(url: string, data = {}, loading: boolean = true, fileName?: string): Promise<any> {
    Http.isLoading = loading;
    const result = await axios.post<AxiosResponse<any>>(url, data, { responseType: "blob" });


    this.downloadFile(result, fileName);
  }

  /**
  * 封装 get请求 用于下载文件
  * @param url
  * @param data
  * @param loading
  * @param fileName
  * @returns
  */
  static async getDownload(url: string, data = {}, loading: boolean = true, config: AxiosRequestConfig<any> = {}, fileName?: string): Promise<any> {
    Http.isLoading = loading;
    const result = await axios.get<AxiosResponse<any>>(url, {
      params: data,
      responseType: "blob",
      ...config
    });

    // 如果返回的是json数据 则提示错误信息
    if (result.data && result.headers["content-type"]?.indexOf("application/json") > -1) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const data = JSON.parse(e.target!.result as string);
        Tools.notice.error(data.message);
      }
      reader.readAsText(result.data as any);
      return Promise.reject(result);
    }

    this.downloadFile(result, fileName);
  }

  /**
   * 封装 get请求 用于获取文件流
   * @param url
   * @param data
   * @param loading
   * @returns
   */
  static async getFileStream(url: string, data = {}, loading: boolean = true): Promise<ApiResult<any>> {
    const result = await Http.get(url, data, loading, { responseType: "blob" });

    return result.data;
  }

  private static downloadFile(result: any, fileName?: string) {
    var res: any = result.data;
    //如果没有文件名称 则使用当前时间
    if (!fileName) fileName = new Date().getTime().toString();
    //如果响应头里面有 filename 则使用响应头中的 filename
    var contentDisposition = result.headers["content-disposition"];
    if (contentDisposition && contentDisposition.indexOf("filename=") > -1) {
      let patt = new RegExp("filename=([^;]+\\.[^\\.;]+);*");
      let result = patt.exec(contentDisposition);
      fileName = decodeURI(result![1]);
    }
    console.log(result);
    var blob = new Blob([res], { type: res.type });
    let href = (window.URL || window.webkitURL).createObjectURL(blob);
    let a = document.createElement("a");
    a.style.display = "none";
    a.href = href;
    a.setAttribute("download", fileName);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a); // 下载完成移除元素
    window.URL.revokeObjectURL(href); // 只要映射存在，Blob就不能进行垃圾回收，因此一旦不再需要引用，就必须小心撤销URL，释放掉blob对象。
  }
}

//初始化 请求对象
Http.init();

export default Http;
