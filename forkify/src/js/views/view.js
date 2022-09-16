const icons = new URL('../../img/icons.svg', import.meta.url);

export default class View {
  _data
  _parentEL

  renderSpinner() {
    const makeup = `
        <div class="spinner">
          <svg>
            <use href="${icons.pathname}#icon-loader"></use>
          </svg>
        </div>`
    this._clear()
    this._parentEL.insertAdjacentHTML("afterbegin", makeup)
  }

  renderError(message = this._errorMessage) {
    const makeup = `<div class="error">
        <div>
          <svg>
            <use href="${icons.pathname}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>`
    this._clear()
    this._parentEL.insertAdjacentHTML("afterbegin", makeup)
  }

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();
    this._data = data;
    this._clear()
    console.log("cleared");
    this._parentEL.insertAdjacentHTML("afterbegin", this._generateMakeup())
  }

  update(data) {
    this._data = data;

    const newMakeup = this._generateMakeup();
    const newDom = document.createRange().createContextualFragment(newMakeup)
    const newElements = Array.from(newDom.querySelectorAll("*"))
    const curElements = Array.from(this._parentEL.querySelectorAll("*"))
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));

      // Updates changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log('💥', newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      // Updates changed ATTRIBUES
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  _clear() { this._parentEL.innerHTML = "" }

}