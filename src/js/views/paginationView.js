import View from './view';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _addHandlerClick(handler) {
    this._parentElement.addEventListener('click', ev => {
      const btn = ev.target.closest('.btn--inline');
      if (btn === null) return;
      if (btn.classList.contains('pagination__btn--prev')) {
        handler(this._data.page - 1);
      }

      if (btn.classList.contains('pagination__btn--next')) {
        handler(this._data.page + 1);
      }
    });
  }
  _generateHTML() {
    const { page } = this._data;
    const numPages = Math.ceil(
      this._data.result.length / this._data.resultsPerPage
    );
    let html = '';

    if (page === 1 && numPages === 1) return `no other pages`;

    if (page === numPages) return (html = this._generateLeftButton(page));

    if (page === 1 && page !== numPages) {
      return this._generateRightButton(page + 1);
    }

    if (page > 1 && page !== numPages) {
      html = this._generateLeftButton(page - 1);
      html = html + this._generateRightButton(page + 1);
      return html;
    }
  }

  _generateLeftButton(number) {
    return `<button class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>${number}</span>
          </button>`;
  }

  _generateRightButton(number) {
    return `<button class="btn--inline pagination__btn--next">
            <span>${number}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
  }

  _nextPageHandler(handler) {}
}

export default new PaginationView();
