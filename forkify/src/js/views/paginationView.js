import View from "./view";
const icons = new URL('../../img/icons.svg', import.meta.url);

class PaginationView extends View {
    _parentEL = document.querySelector(".pagination")

    _generateMakeup() {
        const totalPages = Math.ceil(this._data.results.length / this._data.resultPerPage)
        console.log(this._data.curPage);
        console.log(totalPages);
        if (this._data.curPage === 1 && totalPages > 1) return `
        <button class="btn--inline pagination__btn--next">
          <span>Page ${this._data.curPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons.pathname}#icon-arrow-right"></use>
          </svg>
        </button>`

        if (this._data.curPage === totalPages && totalPages > 1) return `
        <button class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons.pathname}#icon-arrow-left"></use>
        </svg>
        <span>Page ${this._data.curPage - 1}</span>
        </button>`

        if (this._data.curPage > 1 && this._data.curPage < totalPages && totalPages > 1) return `
        <button class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons.pathname}#icon-arrow-left"></use>
        </svg>
        <span>Page ${this._data.curPage - 1}</span>
        </button>
        <button class="btn--inline pagination__btn--next">
          <span>Page ${this._data.curPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons.pathname}#icon-arrow-right"></use>
          </svg>
        </button>`

        if (totalPages === 1) return ""
    }

    addHandleClick(handle) {
        this._parentEL.addEventListener("click", function (e) {
            e.preventDefault();
            const btn = e.target.closest(".btn--inline")
            if (!btn) return
            const gotPage = +btn.querySelector("span").textContent.split(" ")[1]
            handle(gptoPage)
        })
    }

}

export default new PaginationView()