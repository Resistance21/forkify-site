class SearchView {
  _parentElement = document.querySelector('.search');
  _data;
  _errorMessage = `No Recipe could be found`;
  _searchResultsPanel = document.querySelector('.results');

  getQuery() {
    const query = document.querySelector('.search__field').value;
    this._clearField();
    return query;
  }

  _clearField() {
    document.querySelector('.search__field').value = '';
  }

  userSearch(handler) {
    this._parentElement.addEventListener('submit', ev => {
      ev.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
