/**
 *获取书签的 favicon URL
 * @param {string} url 书签 URL
 * @returns {string} 书签的 favicon URL
 * */
export function getFavicon(url: string = ''): string {
  if (typeof url !== 'string') return '';

  try {
    const faviconUrl = new URL(chrome.runtime.getURL('/_favicon/'));
    faviconUrl.searchParams.set('pageUrl', url);
    return faviconUrl.toString();
  } catch (error) {
    console.error(error);
    return '';
  }
}

/**
 * 获取目标元素
 * @param {HTMLElement} srcEl 源元素
 * @param {string} className 类名
 * @returns {HTMLElement | null} 目标元素
 * */
export function getElementBubble(srcEl: HTMLElement, className: string): HTMLElement | null {
  // 向上寻找目标元素
  while (srcEl) {
    if (srcEl.classList.contains(className)) return srcEl;
    srcEl = srcEl.parentElement;
  }
  return null;
}
