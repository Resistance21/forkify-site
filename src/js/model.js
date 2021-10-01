import { async } from 'regenerator-runtime';
import { API_URL, API_SEARCH_URL, RESULTS_PER_PAGE, API_KEY } from './config';
import { getJSON, sendJSON } from './helper';
import recipeView from './views/recipeView';

export const state = {
  recipe: {},
  bookMarks: [],
  userUpload: [],
  search: {
    query: '',
    result: [],
    page: 2,
    resultsPerPage: RESULTS_PER_PAGE,
  },
};

export const loadRecipe = async () => {
  try {
    const recipeID = window.location.hash.slice(1);
    const data = await getJSON(`${API_URL}${recipeID}?key=${API_KEY}`);
    state.recipe = {};
    convertReturnData(data);
    if (state.bookMarks.some(bookmark => bookmark.id === recipeID))
      state.recipe.bookMarked = true;
    else state.recipe.bookMarked = false;
  } catch (err) {
    throw err;
  }
};

export const search = async query => {
  try {
    const data = await getJSON(`${API_SEARCH_URL}${query}&key=${API_KEY}`);
    state.search.query = query;
    if (data.data.recipes.length === 0) throw 'recipe length 0';
    state.search.result = data.data.recipes.map(el => {
      return {
        imageUrl: el.image_url,
        publisher: el.publisher,
        id: el.id,
        title: el.title,
        ...(el.key && { key: el.key }),
      };
    });
    return state.search.result;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = (page = state.search.page) => {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.result.slice(start, end);
};

export const updateServingSize = amount => {
  state.recipe.ingredients.forEach(item => {
    if (item.quantity !== null) {
      item.quantity = (item.quantity * amount) / state.recipe.servings;
    }
  });
  state.recipe.servings = amount;
};

export const addBookMark = recipe => {
  state.bookMarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookMarked = true;
  persistBookmarks();
};

export const deleteBookMark = id => {
  state.bookMarks.forEach((bm, i) => {
    if (bm.id === id) {
      state.bookMarks.splice(i, 1);
    }
  });
  if (id === state.recipe.id) state.recipe.bookMarked = false;
  persistBookmarks();
};

const persistBookmarks = () => {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookMarks));
};

const convertReturnData = data => {
  const { recipe } = data.data;
  const keys = Object.keys(recipe);
  keys.forEach(key => {
    if (key.includes('_')) {
      const tempI = key.split('').findIndex(el => el === '_');
      const keyEdit = key.replace(/_./, key.charAt(tempI + 1).toUpperCase());
      state.recipe[keyEdit] = recipe[key];
    } else {
      state.recipe[key] = recipe[key];
    }
  });
};

export const uploadedRecipe = async data => {
  try {
    const ing = Object.entries(data)
      .filter(item => item[0].startsWith('ingredient') && item[1])
      .map(item => {
        const ingArray = item[1].replaceAll(' ', '').split(',');
        if (ingArray.length !== 3)
          throw new Error(
            'Wrong Ingredient format! Format: "Quantnity", "Unit", "Description"'
          );
        const [quantity, unit, description] = ingArray;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      cooking_time: +data.cookingTime,
      image_url: data.image,
      ingredients: ing,
      publisher: data.publisher,
      servings: +data.servings,
      source_url: data.sourceUrl,
      title: data.title,
    };
    const returnData = await sendJSON(`${API_URL}?key=${API_KEY}`, recipe);
    convertReturnData(returnData);
    addBookMark(state.recipe);
  } catch (err) {
    throw err;
  }
};

const init = () => {
  if (localStorage.getItem('bookmarks'))
    state.bookMarks = JSON.parse(localStorage.getItem('bookmarks'));
  else localStorage.setItem('bookmarks', state.bookMarks);
};
init();
