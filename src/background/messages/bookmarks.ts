import type { PlasmoMessaging } from '@plasmohq/messaging';

const Bookmarks: PlasmoMessaging.MessageHandler = async ({ body }, { send }) => {
  if (body) {
    const { action, data: { id, parentId, title, url, index } } = body;
    try {
      if (action === 'add') {
        await chrome.bookmarks.create({ parentId, title, url, index });
      } else if (action === 'edit') {
        await chrome.bookmarks.update(id, { title, url });
      } else if (action === 'delete') {
        await chrome.bookmarks.removeTree(id);
      } else if (action === 'move') {
        await chrome.bookmarks.move(id, { parentId, index });
      }
    } catch ({ message }) {
      send({ error: message });
    }
  }

  try {
    const bookmarks = await chrome.bookmarks.getTree();
    send({ bookmarks });
  } catch ({ message }) {
    send({ error: message });
  }
};

export default Bookmarks;
