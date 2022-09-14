// import icons from '../img.icons.svg'
import * as model from "./model.js"
import recipeView from "./views/recipeView.js"
import "core-js/stable"
import "regenerator-runtime/runtime"
import { async } from "regenerator-runtime";

const icons = new URL('../img/icons.svg', import.meta.url);
const recipeContainer = document.querySelector('.recipe');
const searchField = document.querySelector(".search__field")
const searchBtn = document.querySelector(".search__btn")
const results = document.querySelector(".results")
const pageBtn = document.querySelector(".pagination")

let clicked;
let searchResults = []
let curPage
const resultPerPage = 10



// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
// render search result
const renderSearchResult = function (searchresult) {
  const html = `<li class="preview">
          <a class="preview__link" href=#${searchresult.id}>
            <figure class="preview__fig">
              <img src=${searchresult.image_url} alt="Test" />
            </figure>
            <div class="preview__data">
              <h4 class="preview__title">${searchresult.title} ...</h4>
              <p class="preview__publisher">${searchresult.publisher}</p>
              <div class="preview__user-generated">
                <svg>
                  <use href="${icons.pathname}#icon-user"></use>
                </svg>
              </div>
            </div>
          </a>
        </li>`
  results.insertAdjacentHTML("afterbegin", html)
}

const renderNextPageBtn = function (page) {
  const html = `
<button class="btn--inline pagination__btn--next">
  <span>Page ${page}</span>
  <svg class="search__icon">
    <use href="${icons.pathname}#icon-arrow-right"></use>
  </svg>
</button>`

  document.querySelector(".pagination").insertAdjacentHTML("beforeend", html)
}


const renderPrevPageBtn = function () {
  const html = `
  <button class="btn--inline pagination__btn--prev">
  <svg class="search__icon">
    <use href="${icons.pathname}#icon-arrow-left"></use>
  </svg>
  <span>Page 1</span>
</button>`

  document.querySelector(".pagination").insertAdjacentHTML("afterbegin", html)
}







const renderNextPage = function () {
  //update current Page
  curPage += 1
  //delete prev result
  document.querySelectorAll(".preview").forEach((preview) => preview.remove())

  if (searchResultsList.length <= curPage * resultPerPage) {
    console.log("render less than 10");
    //render results
    searchResultsList.slice(resultPerPage * (curPage - 1)).forEach(result => renderSearchResult(result));
    //delete next btn
    document.querySelector(".pagination__btn--next").remove()
  }
  if (searchResultsList.length > curPage * resultPerPage) {
    console.log("render");
    //render results
    const renderResult = searchResultsList.slice((curPage - 1) * resultPerPage, curPage * resultPerPage)
    renderResult.forEach(result => renderSearchResult(result));
    //update next btn
    document.querySelector(".pagination__btn--next span").textContent = `Page ${curPage + 1}`
  }
  //update pre btn
  if (curPage - 1 === 1) renderPrevPageBtn();
  if (curPage - 1 > 1) document.querySelector(".pagination__btn--prev span").textContent = `Page ${curPage - 1}`;
}

const renderPrevPage = function () {
  //update current Page
  curPage -= 1
  console.log(curPage);
  //delete prev result
  document.querySelectorAll(".preview").forEach((preview) => preview.remove())


  if (curPage === 1) {
    //render results
    searchResultsList.slice(0, curPage * resultPerPage).forEach(result => renderSearchResult(result));
    //delete prev btn
    document.querySelector(".pagination__btn--prev").remove()
  }
  if (curPage > 1) {
    //render results
    const renderResult = searchResultsList.slice((curPage - 1) * resultPerPage, curPage * resultPerPage)
    renderResult.forEach(result => renderSearchResult(result));
    //update prev btn
    document.querySelector(".pagination__btn--prev span").textContent = `Page ${curPage - 1}`
  }
  //update next btn
  console.log(searchResultsList.length);
  console.log(curPage * resultPerPage);
  console.log(curPage * resultPerPage >= searchResultsList.length);
  if ((curPage + 1) * resultPerPage >= searchResultsList.length) { renderNextPageBtn(curPage + 1); }
  else { document.querySelector(".pagination__btn--next span").textContent = `Page ${curPage + 1}`; }
}

const init = function () {
  let clicked = "";
  let searchResults = []
  let curPage = 1
  let recipe
  //delete prev result
  results.innerHTML = ""
  //delete prev btn
  pageBtn.innerHTML = ""
  //clear recipe detail
  recipeContainer.innerHTML = ""
  html = `<div class="message">
  <div>
    <svg>
      <use href="${icons.pathname}#icon-smile"></use>
    </svg>
  </div>
  <p>Start by searching for a recipe or an ingredient. Have fun!</p>
</div>`
  recipeContainer.insertAdjacentHTML("beforeend", html)
}

///////////////event handle//////////////////////////////
searchBtn.addEventListener("click", async (e) => {
  try {
    e.preventDefault();
    //init 
    init()
    //get recipes
    // const res = await fetch(`https://forkify-api.herokuapp.com/api/search?q=${searchField.value}`);
    const res = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes?search=${searchField.value}`);
    const searchResults = await res.json();
    //update current data
    curPage = 1
    searchResultsList = searchResults.data.recipes

    //render 10 recipes
    let renderResults = [];
    renderResults = searchResultsList.length > resultPerPage ? searchResultsList.slice(0, resultPerPage * curPage) : searchResultsList;
    renderResults.forEach(result => renderSearchResult(result));

    //render pagebtn
    if (searchResultsList.length > resultPerPage) renderNextPageBtn(curPage + 1);

  } catch (error) {
    console.error(error);
  }
})

//click change page button
pageBtn.addEventListener("click", (e) => {
  if (!e.target.closest(".pagination__btn--next") && !e.target.closest(".pagination__btn--prev")) return
  if (e.target.closest(".pagination__btn--next")) renderNextPage()
  if (e.target.closest(".pagination__btn--prev")) renderPrevPage()
})
//mouse move at search result
results.addEventListener("mouseover", (e) => {
  if (!e.target.closest(".preview__link")) return
  e.target.closest(".preview__link").classList.add("preview__link--active")
})

results.addEventListener("mouseout", (e) => {
  if (!e.target.closest(".preview__link")) return
  if (e.target.closest(".preview__link") === clicked) return
  e.target.closest(".preview__link").classList.remove("preview__link--active")
})
//click search result
results.addEventListener("click", async (e) => {


  //active the result
  if (clicked) clicked.classList.remove("preview__link--active")
  e.target.closest(".preview__link").classList.add("preview__link--active")
  clicked = e.target.closest(".preview__link");
})

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1)
    if (!id) return
    //render spinner
    recipeView.renderSpinner()
    //get the recipe detail
    await model.loadRecipe(id);
    //render recipe detail
    recipeView.render(model.state.recipe)
  } catch (error) {
    recipeView.renderError()
  }
}

const initial = function () { recipeView.addHandleRender(controlRecipe) }
initial()

recipeContainer.addEventListener("click", (e) => {
  const orgServing = model.state.recipe.servings;
  if (!e.target.closest(".btn--increase-servings") && !e.target.closest(".btn--decrease-servings")) return
  if (e.target.closest(".btn--increase-servings")) model.state.recipe.servings += 1;
  if (e.target.closest(".btn--decrease-servings")) model.state.recipe.servings -= 1;
  // console.log(recipe.servings);
  // console.log(recipe.servings === 1);

  if (model.state.recipe.servings <= 0) {
    model.state.recipe.servings = orgServing;
    // e.target.closest(".btn--decrease-servings svg").style.fill = "grey";
    throw new Error("servings can not be 0");
  }
  times = model.state.recipe.servings / orgServing
  model.state.recipe.ingredients.forEach((ing) => { ing.quantity *= times })
  // console.log();
  recipeView.renderRecipe(model.state.recipe)
})


