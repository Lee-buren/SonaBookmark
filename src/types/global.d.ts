import type { Dispatch, SetStateAction } from 'react';

export {};
declare global {
  type Setter<T> = Dispatch<SetStateAction<T>>
  type BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode
  type HandleType = 'add' | 'edit' | 'delete'
  type BookmarkType = 'directory' | 'bookmark'
  type Target = '_self' | '_blank'

  interface Config {
    width: number;
    fontSize: number;
    triggerWidth: number;
    bookmarkHeight: number;
    isAffixed: boolean;
    expandId: string;
    expandIds: string[];
    target: Target;
    duration: number;
    mode: 'dark' | 'light';
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

  interface SettingForm {
    triggerWidth: number;
    width: number;
    bookmarkHeight: number;
    fontSize: number;
    duration: number;
    target: Target;
  }
}
