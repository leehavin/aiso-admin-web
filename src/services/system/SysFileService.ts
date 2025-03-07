import Http from "@/core/utils/Http";

/**
 * 附件服务
 */
export default class SysFileService {
  static urlPrefix = "/api/v1/admin/SysFile";

  /**
   * 获取数据列表
   * @param current
   * @param pageSize
   * @param search
   * @param searchSort
   * @returns
   */
  static findList(current: number, pageSize: number, search: any = {}, searchSort: any[] = []) {
    return Http.post(`${this.urlPrefix}/findList`, {
      page: current,
      size: pageSize,
      search,
      searchSort,
    });
  }

  /**
   * 删除集合数据
   *
   * @param ids
   * @returns
   */
  static deleteList(ids: string[]) {
    return Http.post(`${this.urlPrefix}/deleteList`, ids);
  }

  /**
   * 查询表单
   *
   * @param id
   * @returns
   */
  static findForm(id?: string | undefined) {
    return Http.get(`${this.urlPrefix}/findForm${id ? "/" + id : ""}`);
  }

  /**
   * 保存表单数据
   *
   * @param id
   * @param formData
   * @returns
   */
  static saveForm(id: string | undefined, formData: any) {
    return Http.post(`${this.urlPrefix}/${id ? "update" : "create"}`, formData);
  }

  /**
   * 导出 excel
   * @param search
   * @param searchSort
   * @returns
   */
  static exportExcel(search: any = {}, searchSort: any[] = []) {
    return Http.download(`${this.urlPrefix}/exportExcel`, {
      page: -1,
      size: -1,
      search,
      searchSort,
    });
  }

  /**
   * 上传文件
   *
   * @param formData
   * @returns
   */
  static uploadFile(file: any, abort?: AbortController, progress?: (percentCompleted: number | undefined) => void) {
    const formData = new FormData();
    formData.append("file", file);
    return Http.upload(`${this.urlPrefix}/uploadFile`, formData, false,
      {
        signal: abort?.signal,
        timeout: undefined,
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.progress) {
            return;
          }

          progress?.(Math.floor(progressEvent.progress * 10000) / 100);
        }
      });
  }

  /**
   * 下载文件
   *
   * @param id
   * @returns
   */
  static downloadFile(id: string, abort?: AbortController, progress?: (percentCompleted: number | undefined) => void) {
    if (!id) {
      return Promise.reject("id不能为空");
    }
    return Http.getDownload(`${this.urlPrefix}/downloadFile/${id}`, {}, false, {
      signal: abort?.signal,
      timeout: undefined,
      onDownloadProgress: (progressEvent) => {
        if (!progressEvent.progress) {
          return;
        }

        progress?.(Math.floor(progressEvent.progress * 10000) / 100);
      }
    });
  }
}