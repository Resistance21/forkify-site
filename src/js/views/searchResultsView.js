import icons from 'url:../../img/icons.svg';
import PreviewView from './previewView';

class SearchResultsView extends PreviewView {
  _parentElement = document.querySelector('.results');
  _errorMessage = `No Recipe could be found`;
}

export default new SearchResultsView();
