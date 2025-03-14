﻿import Http from "@/core/utils/Http";

/**
 * SysLocale服务
 */
export default class SysLocaleService {

    static urlPrefix = "/api/v1/admin/SysLocale";

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
            searchSort
        })
    }

    /**
     * 获取本地化内容
     * 
     * @param key 
     * @returns 
     */
    static findLocale(key: string) {
        return Http.get(`${this.urlPrefix}/findLocale/${key}`)
    }

    /**
     * 删除集合数据
     * 
     * @param ids 
     * @returns 
     */
    static deleteList(ids: string[]) {
        return Http.post(`${this.urlPrefix}/deleteList`, ids)
    }

    /**
     * 查询表单
     * 
     * @param id 
     * @returns 
     */
    static findForm(id?: string | undefined) {
        return Http.get(`${this.urlPrefix}/findForm${(id ? '/' + id : '')}`)
    }

    /**
     * 保存表单数据
     * 
     * @param id 
     * @param formData 
     * @returns 
     */
    static saveForm(id: string | undefined, formData: any) {
        return Http.post(`${this.urlPrefix}/${id ? 'update' : 'create'}`, formData)
    }

    /**
     * 导出 excel
     * 
     * @param search 
     * @param searchSort 
     * @returns 
     */
    static exportExcel(search: any = {}, searchSort: any[] = []) {
        return Http.download(`${this.urlPrefix}/findList?exportExcel=true`, {
            page: -1,
            size: -1,
            search,
            searchSort
        });
    }

}