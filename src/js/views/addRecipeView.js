import View from './view';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _overlayElement = document.querySelector('.overlay');
  _addRecipeWindowElement = document.querySelector('.add-recipe-window');
  _addRecipeButton = document.querySelector('.nav__btn--add-recipe');
  _closeModalButton = document.querySelector('.btn--close-modal');
  _uploadRecipeButton = document.querySelector('.upload__btn');

  constructor() {
    super();
    this._addHandlerToggelAddRecipe();
    this._addHandlerCloseAddRecipe();
  }

  toggelWindow() {
    this._overlayElement.classList.toggle('hidden');
    this._addRecipeWindowElement.classList.toggle('hidden');
  }

  _addHandlerToggelAddRecipe() {
    this._addRecipeButton.addEventListener('click', e => {
      this.toggelWindow();
    });
  }

  _addHandlerCloseAddRecipe() {
    this._closeModalButton.addEventListener('click', e => {
      this.toggelWindow();
    });
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', e => {
      e.preventDefault();
      const data = [...new FormData(this._parentElement)];
      handler(Object.fromEntries(data));
    });
  }

  _generateHTML() {
    return ``;
  }
}

export default new AddRecipeView();
