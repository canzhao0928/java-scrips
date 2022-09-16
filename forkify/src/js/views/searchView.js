class SearchView {
    #parentEL = document.querySelector('.search')

    getQuery() {
        const query = this.#parentEL.querySelector(".search__field").value
        this.#clearInput();
        return query;
    }
    #clearInput() { this.#parentEL.querySelector(".search__field").value = "" }

    addHandleClick(handle) {
        this.#parentEL.addEventListener("submit", function (e) {
            e.preventDefault();
            handle();
        })
    }
    

}

export default new SearchView()