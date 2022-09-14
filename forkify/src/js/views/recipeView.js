const icons = new URL('../../img/icons.svg', import.meta.url);
import { Fraction } from "fractional"

class recipeView {
    _parentEL = document.querySelector('.recipe')
    #data
    #errorMessage = "we could not find the recipe, please try another one."
    #generateMakeup() {
        return `<figure class="recipe__fig">
        <img src=${this.#data.image_url} alt=${this.#data.title} class="recipe__img" />
        <h1 class="recipe__title">
          <span>${this.#data.title}</span>
        </h1>
      </figure>
      
      <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons.pathname}#icon-clock"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">${this.#data.cooking_time}</span>
          <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons.pathname}#icon-users"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">${this.#data.servings}</span>
          <span class="recipe__info-text">servings</span>
      
          <div class="recipe__info-buttons">
            <button class="btn--tiny btn--decrease-servings">
              <svg>
                <use href="${icons.pathname}#icon-minus-circle"></use>
              </svg>
            </button>
            <button class="btn--tiny btn--increase-servings">
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
        <button class="btn--round">
          <svg class="">
            <use href="${icons.pathname}#icon-bookmark-fill"></use>
          </svg>
        </button>
      </div>
      
      <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
        ${this.#data.ingredients.map(this.#generateMakeupIngredient).join("")}
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
          href=${this.#data.source_url}
          target="_blank"
        >
          <span>Directions</span>
          <svg class="search__icon">
            <use href="${icons.pathname}#icon-arrow-right"></use>
          </svg>
        </a>
      </div>`
    }

    #generateMakeupIngredient(ingredient) {

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

    renderSpinner() {
        const makeup = `
        <div class="spinner">
          <svg>
            <use href="${icons.pathname}#icon-loader"></use>
          </svg>
        </div>`
        this.#clear()
        this._parentEL.insertAdjacentHTML("afterbegin", makeup)
    }

    renderError(message = this.#errorMessage) {
        const makeup = `<div class="error">
        <div>
          <svg>
            <use href="${icons.pathname}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>`
        this.#clear()
        this._parentEL.insertAdjacentHTML("afterbegin", makeup)
    }

    render = function (recipe) {
        this.#data = recipe;
        this.#clear()
        this._parentEL.insertAdjacentHTML("afterbegin", this.#generateMakeup())
    }

    #clear() { this._parentEL.innerHTML = "" }

    addHandleRender(handler) {
        ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
    }
}

export default recipeView = new recipeView()