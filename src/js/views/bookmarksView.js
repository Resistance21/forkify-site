import PreviewView from './previewView';
import View from './view';

class BookMarksView extends PreviewView {
  _parentElement = document.querySelector('.bookmarks__list');
}

export default new BookMarksView();
