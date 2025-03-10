import CoreStore from "@/core/store/layouts/CoreStore";
import SysLocaleService from "@/services/system/SysLocaleService";

export default () => {
  const coreStore = CoreStore();
  
  /** 获取本地化内容 */
  const getLocale = () => {
    // TODO 读取locale文件
    // SysLocaleService.findLocale(coreStore.state.locale).then((res) => {
    //   if (res.code != 200 || !res.data) {
    //     return;
    //   }

    //   try {
    //     coreStore.appendLocaleMessage(coreStore.state.locale, JSON.parse(res.data));
    //   } catch (e) {
    //     console.log(e);
    //   }
    // });
  };

  return {
    getLocale
  }
}