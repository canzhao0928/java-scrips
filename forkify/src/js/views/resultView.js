const icons = new URL('../../img/icons.svg', import.meta.url);
import View from "./view";

class ResultView extends View {
    _parentEL = document.querySelector(".results")
    _errorMessage = "No recipes found for you query. Please try another one."

    _generateMakeup() {
        return this._data.map(this._generateMakeupResult).join("")
    }
    _generateMakeupResult(result) {
        const id = window.location.hash.slice(1)
        return `<li class="preview">
          <a class="preview__link ${result.id === id ? "preview__link--active" : ""}" href=#${result.id}>
            <figure class="preview__fig">
              <img src=${result.image_url} alt=${result.title} />
            </figure>
            <div class="preview__data">
              <h4 class="preview__title">${result.title} ...</h4>
              <p class="preview__publisher">${result.publisher}</p>
              <div class="preview__user-generated">
                <svg>
                  <use href="${icons.pathname}#icon-user"></use>
                </svg>
              </div>
            </div>   
          </a>
        </li>`
    }
}

export default new ResultView()