import View from "./view";
const icons = new URL('../../img/icons.svg', import.meta.url);

class BookmarkView extends View {
  _parentEL = document.querySelector(".bookmarks__list")
  _generateMakeup() {
    console.log(this._data.bookmark);
    if (this._data.bookmark.length === 0)
      return ` <div class="message">
        <div>
          <svg>
            <use href="${icons.pathname}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>
          No bookmarks yet. Find a nice recipe and bookmark it :)
        </p>
      </div>`
    else {
      console.log(this._data.bookmark.map(this._generateBookmark).join(""));
      return this._data.bookmark.map(this._generateBookmark).join("")
    }


  }
  _generateBookmark(bookmark) {
    const id = window.location.hash.slice(1)
    return `<li class="preview">
      <a class="preview__link ${bookmark.id === id ? "preview__link--active" : ""}" href="#${bookmark.id}">
        <figure class="preview__fig">
          <img src=${bookmark.image_url} alt=${bookmark.title} />
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">
          ${bookmark.title} ...
          </h4>
          <p class="preview__publisher">${bookmark.publisher}</p>
        </div>
      </a>
    </li>`
  }

  addHandleMouseover(handler) {
    document.querySelector(".nav__btn--bookmarks").addEventListener("mouseover", handler)
  }

  addHandleClick(handler) {
    this._parentEL.addEventListener("click", handler)
  }
}

export default new BookmarkView()