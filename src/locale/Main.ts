import { createI18n } from "vue-i18n";
import zhCn from "@/locale/zh-CN.js";
import enUS from "@/locale/en-US.js";
import AppConsts from "@/utils/AppConsts";

function getLang() {
  return localStorage.getItem(`${AppConsts.appPrefix}_lang`) ?? "zh-CN";
}

const i18n = createI18n({
  // something vue-i18n options here ...
  locale: getLang(),
  messages: {
    "zh-CN": zhCn,
    "en-US": enUS,
  },
});

export default i18n;

/**
 * 翻译 多语言
 * @param key
 * @param defaultValue
 * @returns
 */
export function translate(key: string, defaultValue: string | undefined = undefined) {
  const translatedValue = i18n.global.t(key);
  return translatedValue !== key ? translatedValue : defaultValue;
}
