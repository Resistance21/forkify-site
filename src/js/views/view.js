import icons from 'url:../../img/icons.svg';

export default class View {
  _data;
  render(data) {
    if (!data) return this.displayErrorMessage();
    this._data = data;
    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML(
      'beforeend',
      this._generateHTML(this._data)
    );
  }

  update(data) {
    if (!data) return this.displayErrorMessage();
    this._data = data;

    const newHTML = this._generateHTML(this._data);
    const newDOM = document.createRange().createContextualFragment(newHTML);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currentElements = Array.from(
      this._parentElement.querySelectorAll('*')
    );
    newElements.forEach((ele, i) => {
      if (
        !ele.isEqualNode(currentElements[i]) &&
        ele.firstChild?.nodeValue.trim() !== ''
      ) {
        currentElements[i].textContent = ele.textContent;
      }

      Array.from(ele.attributes).forEach(attr => {
        currentElements[i].setAttribute(attr.name, attr.value);
      });
    });
  }

  renderSpinner() {
    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML(
      'beforeend',
      `<div class="spinner">
    <svg>
      <use href="${icons}#icon-loader"></use>
    </svg>
    </div>`
    );
  }

  displayMessage(message) {
    this._parentElement.innerHTML = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
  }

  displayErrorMessage(error = this._errorMessage) {
    this._parentElement.innerHTML = `<div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${error}</p>
      </div>`;
  }
}
