const recipeContainer = document.querySelector('.recipe');
const searchField = document.querySelector(".search__field")
const searchBtn = document.querySelector(".search__btn")
const results = document.querySelector(".results")
const pageBtn = document.querySelector(".pagination")
let clicked;
let searchResults = []
let curPage
const resultPerPage = 10


const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
// render search result
const renderSearchResult = function (searchresult) {
  const html = `<li class="preview">
          <a class="preview__link" href=#${searchresult.recipe_id}>
            <figure class="preview__fig">
              <img src=${searchresult.image_url} alt="Test" />
            </figure>
            <div class="preview__data">
              <h4 class="preview__title">${searchresult.title} ...</h4>
              <p class="preview__publisher">${searchresult.publisher}</p>
              <div class="preview__user-generated">
                <svg>
                  <use href="src/img/icons.svg#icon-user"></use>
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
    <use href="src/img/icons.svg#icon-arrow-right"></use>
  </svg>
</button>`

  document.querySelector(".pagination").insertAdjacentHTML("beforeend", html)
}


const renderPrevPageBtn = function () {
  const html = `
  <button class="btn--inline pagination__btn--prev">
  <svg class="search__icon">
    <use href="src/img/icons.svg#icon-arrow-left"></use>
  </svg>
  <span>Page 1</span>
</button>`

  document.querySelector(".pagination").insertAdjacentHTML("afterbegin", html)
}

const renderIngredient = function (ingredient) {
  const html = `<li class="recipe__ingredient">
    <svg class="recipe__icon">
      <use href="src/img/icons.svg#icon-check"></use>
    </svg>
    <div class="recipe__quantity"></div>
    <div class="recipe__description">
      <span class="recipe__unit"></span>
      ${ingredient}
    </div>
  </li>`
  document.querySelector(".recipe__ingredient-list").insertAdjacentHTML("beforeend", html)

}

const clearRecipeDetail = function () {
  if (document.querySelector(".recipe__fig")) document.querySelector(".recipe__fig").remove();
  if (document.querySelector(".recipe__details")) document.querySelector(".recipe__details").remove();
  if (document.querySelector(".recipe__ingredients")) document.querySelector(".recipe__ingredients").remove();
  if (document.querySelector(".recipe__directions")) document.querySelector(".recipe__directions").remove();

}
const renderRecipe = function (recipe) {
  //if show recipe, clear the last recipe
  clearRecipeDetail()

  const ingredients = recipe.ingredients;
  const html = `<figure class="recipe__fig">
  <img src=${recipe.image_url} alt="Tomato" class="recipe__img" />
  <h1 class="recipe__title">
    <span>${recipe.title}</span>
  </h1>
</figure>

<div class="recipe__details">
  <div class="recipe__info">
    <svg class="recipe__info-icon">
      <use href="src/img/icons.svg#icon-clock"></use>
    </svg>
    <span class="recipe__info-data recipe__info-data--minutes">45</span>
    <span class="recipe__info-text">minutes</span>
  </div>
  <div class="recipe__info">
    <svg class="recipe__info-icon">
      <use href="src/img/icons.svg#icon-users"></use>
    </svg>
    <span class="recipe__info-data recipe__info-data--people">4</span>
    <span class="recipe__info-text">servings</span>

    <div class="recipe__info-buttons">
      <button class="btn--tiny btn--increase-servings">
        <svg>
          <use href="src/img/icons.svg#icon-minus-circle"></use>
        </svg>
      </button>
      <button class="btn--tiny btn--increase-servings">
        <svg>
          <use href="src/img/icons.svg#icon-plus-circle"></use>
        </svg>
      </button>
    </div>
  </div>

  <div class="recipe__user-generated">
    <svg>
      <use href="src/img/icons.svg#icon-user"></use>
    </svg>
  </div>
  <button class="btn--round">
    <svg class="">
      <use href="src/img/icons.svg#icon-bookmark-fill"></use>
    </svg>
  </button>
</div>

<div class="recipe__ingredients">
  <h2 class="heading--2">Recipe ingredients</h2>
  <ul class="recipe__ingredient-list">
  </ul>
</div>

<div class="recipe__directions">
  <h2 class="heading--2">How to cook it</h2>
  <p class="recipe__directions-text">
    This recipe was carefully designed and tested by
    <span class="recipe__publisher">The Pioneer Woman</span>. Please check out
    directions at their website.
  </p>
  <a
    class="btn--small recipe__btn"
    href=${recipe.source_url}
    target="_blank"
  >
    <span>Directions</span>
    <svg class="search__icon">
      <use href="src/img/icons.svg#icon-arrow-right"></use>
    </svg>
  </a>
</div>`
  document.querySelector(".recipe").insertAdjacentHTML("beforeend", html)
  ingredients.forEach(ing => { renderIngredient(ing) })
}

const getRecipeDetail = async function (rid) {
  try {
    const res = await fetch(`https://forkify-api.herokuapp.com/api/get?rId=${rid}`);
    const detail = await res.json();
    const { recipe } = detail;
    return recipe;

  } catch (error) {
    console.error(error);
  }
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
  //delete prev result
  document.querySelectorAll(".preview").forEach((preview) => preview.remove())
  //delete prev btn
  if (document.querySelector(".pagination__btn--next")) document.querySelector(".pagination__btn--next").remove()
  if (document.querySelector(".pagination__btn--prev")) document.querySelector(".pagination__btn--prev").remove()
  //clear recipe detail
  clearRecipeDetail()

}

///////////////event handle//////////////////////////////
searchBtn.addEventListener("click", async (e) => {
  try {
    e.preventDefault();
    //init 
    init()
    //get recipes
    const res = await fetch(`https://forkify-api.herokuapp.com/api/search?q=${searchField.value}`);
    const searchResults = await res.json();
    //update current data
    curPage = 1
    searchResultsList = searchResults.recipes

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

  const target = e.target.closest(".preview__link").href.split("#")[1];
  if (!target) return
  //get the recipe detail
  const recipe = await getRecipeDetail(target);
  //render recipe detail
  renderRecipe(recipe)
  //active the result
  if (clicked) clicked.classList.remove("preview__link--active")
  e.target.closest(".preview__link").classList.add("preview__link--active")
  clicked = e.target.closest(".preview__link");
})


