import { async } from "regenerator-runtime"
import { API_URL, RESULT_PER_PAGE } from "./config"
import { getJSON } from "./helper"

export const state = {
    search: {
        query: "",
        results: [],
        curPage: 1,
        resultPerPage: RESULT_PER_PAGE,
    },
    recipe: {},
    bookmark: []
}

export const loadRecipe = async function (rid) {
    try {
        const data = await getJSON(`${API_URL}/${rid}`)
        state.recipe = data.data.recipe;
        if (state.bookmark.some(bkmark => bkmark.id === rid)) state.recipe.bookmarked = true
        else (state.recipe.bookmarked = false)

    } catch (error) {
        console.error(error);
        throw error
    }
}


export const loadSearchResult = async function (searchField) {
    try {
        state.search.query = searchField;
        const res = await fetch(`${API_URL}?search=${searchField}`);
        const data = await res.json();
        state.search.results = data.data.recipes
        //initail curpage to 1
        state.search.curPage = 1
    } catch (error) {
        console.error(error);
        throw error
    }
}


export const getSearchResultPage = function (page = state.search.curPage) {
    state.search.curPage = page

    return this.state.search.results.slice(this.state.search.resultPerPage * (page - 1), this.state.search.resultPerPage * page)
}

export const updateServings = function (newServings) {
    const times = newServings / state.recipe.servings
    state.recipe.ingredients.forEach((ing) => { ing.quantity *= times })
    state.recipe.servings = newServings

}

export const updateBookmark = function (recipe) {
    const bookmark = {
        id: recipe.id,
        image_url: recipe.image_url,
        title: recipe.title,
        publisher: recipe.publisher
    }
    const included = state.bookmark.some(bkmark => bookmark.id = bkmark.id)
    if (icon === 'icon-bookmark-fill' && !included) {
        state.bookmark.push(bookmark);
    }
    if (icon === 'icon-bookmark' && included) {
        state.bookmark = state.bookmark.filter(bkmark => bkmark.id !== bookmark.id)
    }
}