import View from './view';
import icons from 'url:../../img/icons.svg';

class PreviewView extends View {
  _generateHTML() {
    const activeID = window.location.hash.slice(1);
    return this._data
      .map(item => {
        return `<li class="preview">
            <a class="preview__link ${
              item.id === activeID ? 'preview__link--active' : ''
            }" href="#${item.id}">
              <figure class="preview__fig">
                <img src=${item.imageUrl} alt="${item.title}" crossorigin />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${item.title}</h4>
                <p class="preview__publisher">${item.publisher}</p>
              </div>
              <div class="recipe__user-generated ${item.key ? '' : 'hidden'}">
        <svg>
            <use href="${icons}#icon-user"></use>
        </svg>
        </div>
            </a>
          </li>`;
      })
      .join('\n');
  }
}

export default PreviewView;
