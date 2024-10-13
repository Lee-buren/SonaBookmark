import type { BookmarkTreeNode } from 'SonaBookmark/src/components/BookmarkTree';

/**
 *获取书签的 favicon URL
 * @param {string} url 书签 URL
 * @returns {string} 书签的 favicon URL
 * */
export function faviconURL(url: string = ''): string {
  if (typeof url !== 'string') return '';

  try {
    const Url = new URL(chrome.runtime.getURL('/_favicon/'));
    Url.searchParams.set('pageUrl', url);
    return Url.toString();
  } catch (error) {
    console.error(error);
    return '';
  }
}

/**
 * 获取目标元素
 * @param {HTMLElement} srcEl 源元素
 * @param {string} className 类名
 * @returns {HTMLElement} 目标元素
 * */
export function getElement(srcEl: HTMLElement, className: string): HTMLElement {
  while (srcEl) {
    if (srcEl.classList.contains(className)) return srcEl;
    srcEl = srcEl.parentElement;
  }
  return null;
}

type Bookmark = Omit<BookmarkTreeNode, 'children'> & { depth: number };

/*
 * 将树形结构数组转换为平铺结构数组
 * @param {Array} trees 树形结构数组
 * @param {number} depth 树的深度
 * @returns {Array} array
 **/
export function treeToArray(trees: BookmarkTreeNode[], depth = 0): Bookmark[] {
  return trees.reduce((arr, item) => {
    const { children, ...i } = item;
    return arr.concat({ ...i, depth }, children?.length ? treeToArray(children, depth + 1) : []);
  }, []);
}
