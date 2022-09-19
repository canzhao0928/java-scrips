// import icons from '../img.icons.svg'
import * as model from "./model.js"
import recipeView from "./views/recipeView.js"
import searchView from "./views/searchView"
import resultView from "./views/ResultView"
import paginationView from "./views/PaginationView"
import bookmarkView from "./views/bookmarkView"
import "core-js/stable"
import "regenerator-runtime/runtime"
import { async } from "regenerator-runtime";
import searchView from "./views/searchView.js";
import resultView from "./views/ResultView"

const icons = new URL('../img/icons.svg', import.meta.url);
// if (model.hot) {
//   model.hot.accept();
// }

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1)
    if (!id) return
    //render spinner
    recipeView.renderSpinner()

    //update results view when hash change
    resultView.update(model.getSearchResultPage())
    //get the recipe detail
    await model.loadRecipe(id);
    //render recipe detail
    recipeView.render(model.state.recipe)
  } catch (error) {
    recipeView.renderError()
  }
}

const controlSearchResult = async function () {
  try {

    //get query value
    const query = searchView.getQuery()
    if (!query) return
    //get search result
    await model.loadSearchResult(query)

    //rend results
    resultView.render(model.getSearchResultPage())

    //rend pagination
    paginationView.render(model.state.search)

  } catch (error) {
  }
}

const controlPagination = function (gotopage) {
  //rend results
  resultView.render(model.getSearchResultPage(gotopage))
  //rend pagination
  paginationView.render(model.state.search)
}

const controlServing = function (servings) {

  model.updateServings(servings);
  recipeView.update(model.state.recipe)
}

const updateBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
  else model.removeBookmark(model.state.recipe.id)
  recipeView.update(model.state.recipe)
  bookmarkView.render(model.state.bookmark)
}


const initial = function () {
  recipeView.addHandleRender(controlRecipe)
  searchView.addHandleClick(controlSearchResult)
  paginationView.addHandleClick(controlPagination)
  recipeView.addHandleServings(controlServing)
  recipeView.addHandleBookmarkIcon(updateBookmark)
  bookmarkView.addHandleClick(controlRecipe)
}
initial()



