import type { PlasmoMessaging } from '@plasmohq/messaging';

const Bookmarks: PlasmoMessaging.MessageHandler = async (req, res) => {
  if (req.body) {
    const { action, data: { id, parentId, title, url, index } } = req.body;
    try {
      if (action === 'add') {
        await chrome.bookmarks.create({ parentId, title, url });
      } else if (action === 'edit') {
        await chrome.bookmarks.update(id, { title, url });
      } else if (action === 'delete') {
        await chrome.bookmarks.removeTree(id);
      } else if (action === 'move') {
        await chrome.bookmarks.move(id, { parentId, index });
      }
    } catch (e) {
      res.send({ error: e.message });
    }
  }

  try {
    const bookmarks = await chrome.bookmarks.getTree();
    res.send({ bookmarks });
  } catch (e) {
    res.send({ error: e.message });
  }
};

export default Bookmarks;
