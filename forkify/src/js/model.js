import { async } from "regenerator-runtime"
import { API_URL, RESULT_PER_PAGE } from "./config"
import { getJSON } from "./helper"

export const state = {
    // clicked,
    search: {
        query: "",
        results: [],
        curPage: 1,
        resultPerPage: RESULT_PER_PAGE,
    },
    // curPage,
    // resultPerPage: 10,
    recipe: {}
}

export const loadRecipe = async function (rid) {
    try {
        const data = await getJSON(`${API_URL}/${rid}`)
        state.recipe = data.data.recipe;

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