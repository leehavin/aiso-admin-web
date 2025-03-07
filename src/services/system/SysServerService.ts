import Http from "@/core/utils/Http";

/**
 * 服务器服务
 */
export default class SyServerService {
  static urlPrefix = "/api/v1/admin/SysServer";

  /**
   * 获取服务器配置信息
   * @returns
   */
  static getServerBase() {
    return Http.get(`${this.urlPrefix}/getServerBase`);
  }

  /**
   * 获取服务器使用信息
   * @returns
   */
  static getServerUsed() {
    return Http.get(`${this.urlPrefix}/getServerUsed`, {}, false);
  }

  /**
   * 获取服务器磁盘信息
   * @returns
   */
  static getServerDisk() {
    return Http.get(`${this.urlPrefix}/getServerDisk`);
  }

  /**
   * 获取框架主要程序集
   * @returns
   */
  static getAssemblyList() {
    return Http.get(`${this.urlPrefix}/getAssemblyList`);
  }
}
