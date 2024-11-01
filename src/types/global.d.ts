import type { Dispatch, SetStateAction } from 'react';
import type { RegisterOptions } from 'react-hook-form';

export {};
declare global {
  type Setter<T> = Dispatch<SetStateAction<T>>
  type BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode
  type BookmarkType = 'directory' | 'bookmark'
  type Target = '_self' | '_blank'
  type Rules<T = any> = {
    [x in keyof T]?: RegisterOptions<T, keyof T>;
  };

  interface Style {
    left?: string | number;
    right?: string | number;
    width: string | number;
    fontSize: string | number;
    opacity: string | number;
    transform: string;
    '--duration': string;
  }

  interface Config {
    // 侧边栏宽度
    width: string;
    // 书签字体大小
    fontSize: string;
    // 触发宽度
    triggerWidth: string;
    // 书签高度
    bookmarkHeight: string;
    // 是否固定
    isAffixed: boolean;
    // 已展开id
    expandIds: string[];
    // 书签打开方式
    target: Target;
    // 动画过度时间
    duration: string;
    // 显示模式
    mode: 'dark' | 'light';
    // 停靠位置
    position: 'left' | 'right';
  }

  interface HandleForm {
    type: BookmarkType;
    parentId: string;
    parentTitle: string;
    id: string;
    title: string;
    url: string;
  }
}
