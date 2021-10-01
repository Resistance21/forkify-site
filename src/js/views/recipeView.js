import View from './view';

import icons from 'url:../../img/icons.svg';
//import { Fraction } from 'fractional';
import { Fraction } from 'fraction.js';

class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = `No Recipe could be found`;
  _searchResultsPanel = document.querySelector('.results');

  _generateIngridientsList(recipe) {
    return recipe.ingredients
      .map(ing => {
        return `<li class="recipe__ingredient">
          <svg class="recipe__icon">
            <use href="${icons}#icon-check"></use>
          </svg>
          ${
            ing.quantity !== null
              ? `<div class="recipe__quantity">${new Fraction(
                  ing.quantity
                ).toFraction(true)}</div>`
              : ''
          }
          <div class="recipe__description">
            <span class="recipe__unit">${ing.unit ? ing.unit : ''}</span>
            ${ing.description}
          </div>
        </li>`;
      })
      .join('\n');
  }

  _generateHTML(recipe) {
    return `<figure class="recipe__fig">
        <img src="${recipe.imageUrl}" alt="${
      recipe.title
    }" class="recipe__img" crossorigin />
        <h1 class="recipe__title">
        <span>${recipe.title}</span>
        </h1>
    </figure>

    <div class="recipe__details">
        <div class="recipe__info">
        <svg class="recipe__info-icon">
            <use href="${icons}#icon-clock"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${
          recipe.cookingTime
        }</span>
        <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
        <svg class="recipe__info-icon">
            <use href="${icons}#icon-users"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${
          recipe.servings
        }</span>
        <span class="recipe__info-text">servings</span>

        <div class="recipe__info-buttons">
            <button data-decrease="-1" class="btn--tiny btn--decrease-servings">
            <svg>
                <use href="${icons}#icon-minus-circle"></use>
            </svg>
            </button>
            <button data.increase="1" class="btn--tiny btn--increase-servings">
            <svg>
                <use href="${icons}#icon-plus-circle"></use>
            </svg>
            </button>
        </div>
        </div>

        <div class="recipe__user-generated ${recipe.key ? '' : 'hidden'}">
        <svg>
            <use href="${icons}#icon-user"></use>
        </svg>
        </div>
        <button class="btn--round btn--bookmark">
        <svg class="">
            <use href="${icons}#icon-bookmark${
      recipe.bookMarked ? '-fill' : ''
    }"></use>
        </svg>
        </button>
    </div>

    <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
        ${this._generateIngridientsList(this._data)}
        </ul>
    </div>

    <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__publisher">${
          recipe.publisher
        }</span>. Please check out
        directions at their website.
        </p>
        <a
        class="btn--small recipe__btn"
        href='${recipe.sourceUrl}'
        target="_blank"
        >
        <span>Directions</span>
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
        </svg>
        </a>
    </div>`;
  }

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => addEventListener(ev, handler));
  }

  addHandlerUpdateRecipe(handler) {
    document.querySelectorAll('.btn--tiny').forEach(item => {
      item.addEventListener('click', ev => {
        const btn = ev.target.closest('.btn--tiny');
        if (btn.classList.contains('btn--increase-servings')) {
          handler(this._data.servings + 1);
        }
        if (btn.classList.contains('btn--decrease-servings')) {
          if (this._data.servings - 1 < 1) return;
          handler(this._data.servings - 1);
        }
      });
    });
  }

  addHandlerAddBookMark(handler) {
    this._parentElement.addEventListener('click', ev => {
      const btn = ev.target.closest('.btn--bookmark');
      if (btn === null) return;
      handler(this._data);
    });
  }
}

export default new RecipeView();
