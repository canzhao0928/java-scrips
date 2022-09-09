'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
/* const getCountry = function (country) {
    const request = new XMLHttpRequest();
    request.open("GET", `https://restcountries.com/v3.1/name/${country}`)
    request.send()

    request.addEventListener("loadend", function () {
        const [data] = JSON.parse(this.responseText);
        console.log(data);
        const [key] = Object.keys(data.currencies)
        const { [key]: { name: name, symble: symble } } = data.currencies;
        console.log(name);
        console.log(data.currencies.USD);
        const html = `<article class="country">
    <img class="country__img" src="${data.flags.svg}" />
    <div class="country__data">
      <h3 class="country__name">${data.name.common}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(1)}</p>
      <p class="country__row"><span>🗣️</span>${data.languages.eng}</p>
      <p class="country__row"><span>💰</span>${name}</p>
    </div>
  </article>`;

        countriesContainer.insertAdjacentHTML("beforeend", html)

        countriesContainer.style.opacity = 1;

    })
}

getCountry("usa");
getCountry("australia");
getCountry("china"); */

const renderCountry = function (data) {
    const [key] = Object.keys(data.currencies)
    const { [key]: { name: name, symble: symble } } = data.currencies;
    console.log(name);
    console.log(data.currencies.USD);
    const html = `<article class="country">
<img class="country__img" src="${data.flags.svg}" />
<div class="country__data">
  <h3 class="country__name">${data.name.common}</h3>
  <h4 class="country__region">${data.region}</h4>
  <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(1)}</p>
  <p class="country__row"><span>🗣️</span>${data.languages.eng}</p>
  <p class="country__row"><span>💰</span>${name}</p>
</div>
</article>`;

    countriesContainer.insertAdjacentHTML("beforeend", html)

    countriesContainer.style.opacity = 1;
}


const getCountrydata = function (country) {
    fetch(`https://restcountries.com/v3.1/name/${country}`).then(
        response => response.json()
    ).then((data) => renderCountry(data[0]))
}

getCountrydata("usa")