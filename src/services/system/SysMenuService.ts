import Http from "@/core/utils/Http";

/**
 * 菜单服务
 */
export default class SysMenuService {
    static urlPrefix = "/api/v1/admin/SysMenu";

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
     * 获取所有菜单集合
     *
     * @param {*} search
     * @returns
     */
    static getAll(search: any = {}) {
        return Http.post(`${this.urlPrefix}/getAll`, search);
    }

    /**
     * 复制菜单数据
     *
     * @param {*} id
     */
    static copyMenu(id: string | undefined) {
        return Http.post(`${this.urlPrefix}/copyMenu${id ? "/" + id : ""}`);
    }

    /**
     * 获取菜单国际化json
     * @constructor
     */
    static getGlobalNameJson() {
        return Http.get(`${this.urlPrefix}/getGlobalNameJson`);
    }
}
