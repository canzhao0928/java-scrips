const icons = new URL('../../img/icons.svg', import.meta.url);
import View from "./view";
import { Fraction } from "fractional"

class recipeView extends View {
  _parentEL = document.querySelector('.recipe')
  _errorMessage = "we could not find the recipe, please try another one."

  _generateMakeup() {
    return `<figure class="recipe__fig">
        <img src=${this._data.image_url} alt=${this._data.title} class="recipe__img" />
        <h1 class="recipe__title">
          <span>${this._data.title}</span>
        </h1>
      </figure>
      
      <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons.pathname}#icon-clock"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">${this._data.cooking_time}</span>
          <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons.pathname}#icon-users"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">${this._data.servings}</span>
          <span class="recipe__info-text">servings</span>
      
          <div class="recipe__info-buttons">
            <button class="btn--tiny btn--decrease-servings" data-update-to=${this._data.servings - 1}>
              <svg>
                <use href="${icons.pathname}#icon-minus-circle"></use>
              </svg>
            </button>
            <button class="btn--tiny btn--increase-servings" data-update-to=${this._data.servings + 1}>
              <svg>
                <use href="${icons.pathname}#icon-plus-circle"></use>
              </svg>
            </button>
          </div>
        </div>
      
        <div class="recipe__user-generated">
          <svg>
            <use href="${icons.pathname}#icon-user"></use>
          </svg>
        </div>
        <button class="btn--round btn--bookmark">
          <svg class="">
            <use href="${icons.pathname}#icon-bookmark${this._data.bookmarked ? "-fill" : ""}"></use>
          </svg>
        </button>
      </div>
      
      <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
        ${this._data.ingredients.map(this._generateMakeupIngredient).join("")}
        </ul>
      </div>
      
      <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__publisher">${this._data.publisher}</span>. Please check out
          directions at their website.
        </p>
        <a
          class="btn--small recipe__btn"
          href=${this._data.source_url}
          target="_blank"
        >
          <span>Directions</span>
          <svg class="search__icon">
            <use href="${icons.pathname}#icon-arrow-right"></use>
          </svg>
        </a>
      </div>`
  }

  _generateMakeupIngredient(ingredient) {

    return `<li class="recipe__ingredient">
          <svg class="recipe__icon">
            <use href="${icons.pathname}#icon-check"></use>
          </svg>
          <div class="recipe__quantity">${ingredient.quantity ? new Fraction(ingredient.quantity).toString() : ""}</div>
          <div class="recipe__description">
            <span class="recipe__unit">${ingredient.unit}</span>
            ${ingredient.description}
          </div>
        </li>`
  }

  addHandleRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  addHandleServings(handler) {
    this._parentEL.addEventListener("click", (e) => {
      if (!e.target.closest(".btn--tiny")) return
      const newServings = +e.target.closest(".btn--tiny").dataset.updateTo;

      if (newServings > 0) handler(newServings)
    })
  }

  addHandleBookmarkIcon(handler) {
    this._parentEL.addEventListener("click", (e) => {
      if (!e.target.closest(".btn--bookmark")) return
      handler(this._data)

    })
  }
}

export default new recipeView()