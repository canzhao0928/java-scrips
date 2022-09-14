import { async } from "regenerator-runtime"
import { API_URL } from "./config"
import { getJSON } from "./helper"

export const state = {
    // clicked,
    // searchResults,
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