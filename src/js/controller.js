import icons from 'url:../img/icons.svg';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import searchResultsView from './views/searchResultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';
import { async } from 'regenerator-runtime';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

/* if (module.hot) {
  module.hot.accept();
} */

const controllerShowRecipe = async () => {
  try {
    const recipeID = window.location.hash.slice(1);

    if (!recipeID) return;
    recipeView.renderSpinner();
    await model.loadRecipe(recipeID);
    recipeView.render(model.state.recipe);
    recipeView.addHandlerUpdateRecipe(changeServingSize);
    searchResultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookMarks);
  } catch (err) {
    recipeView.displayErrorMessage(err);
  }
};

const controllerShowSearch = async () => {
  try {
    const query = searchView.getQuery();
    searchResultsView.renderSpinner();
    const searchResult = await model.search(query);
    if (!searchResult) return;
    model.state.search.page = 1;
    searchResultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (err) {
    searchResultsView.displayErrorMessage(err);
  }
};

const changePaginationPage = pageNum => {
  model.state.search.page = pageNum;
  searchResultsView.render(model.getSearchResultsPage());
  paginationView.render(model.state.search);
};

const changeServingSize = amount => {
  model.updateServingSize(amount);
  recipeView.update(model.state.recipe);
};

const controllerAddNewBookMark = () => {
  if (!model.state.recipe.bookMarked) model.addBookMark(model.state.recipe);
  else model.deleteBookMark(model.state.recipe.id);

  recipeView.update(model.state.recipe);
  controllerStoredBookmarks();
};

const controllerStoredBookmarks = () => {
  bookmarksView.render(model.state.bookMarks);
};

const controllerUploadRecipe = async uploadData => {
  try {
    addRecipeView.renderSpinner();
    await model.uploadedRecipe(uploadData);
    recipeView.render(model.state.recipe);
    addRecipeView.toggelWindow();
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    bookmarksView.render(model.state.bookMarks);
  } catch (err) {
    addRecipeView.displayErrorMessage(err);
  }
};

const init = () => {
  recipeView.addHandlerRender(controllerShowRecipe);
  recipeView.addHandlerAddBookMark(controllerAddNewBookMark);
  searchView.userSearch(controllerShowSearch);
  paginationView._addHandlerClick(changePaginationPage);
  bookmarksView.render(model.state.bookMarks);
  addRecipeView.addHandlerUpload(controllerUploadRecipe);
};
init();
