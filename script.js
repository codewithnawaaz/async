'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

/////////////////////////////////////

const rendorCountryData = function (data, className = '') {
  const flag = data.flags.png;
  const countryName = data.name.common;
  const languages = Object.values(data.languages)[0];
  const currencies = Object.values(data.currencies)[0].name;
  const html = `
  <article class="country ${className}">
   <img class="country__img" src="${flag}" />
  <div class="country__data">
    <h3 class="country__name">${countryName}</h3>
    <h4 class="country__region">${data.region}</h4>
    <p class="country__row"><span>👫</span>${
      +data.population / 1000000
    } million</p>
    <p class="country__row"><span>🗣️</span>${languages}</p>
    <p class="country__row"><span>💰</span>${currencies}</p>

  </div>
</article>`;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  // countriesContainer.style.opacity = 1;
};
/*
const getDataCountryAndNeigbour = function (country) {
  const request = new XMLHttpRequest();
  request.open('get', `https://restcountries.com/v3.1/name/${country}`);
  request.send();
  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);
    // rendring country1
    rendorCountryData(data);
    console.log(data);

    // check neigbour in the country json
    const neigbour = data.borders?.[0];

    const request2 = new XMLHttpRequest();
    request2.open('get', `https://restcountries.com/v3.1/alpha/${neigbour}`);
    request2.send();
    request2.addEventListener('load', function () {
      const [data2] = JSON.parse(this.responseText);
      console.log(data2);
      rendorCountryData(data2, 'neighbour');
    });
  });
};

getDataCountryAndNeigbour('america');*/

// const getCountryData = function (country) {
//   fetch(`https://restcountries.com/v3.1/name/${country}`).then(function (
//     response
//   ) {
//     return response.json().then(function (data) {
//       console.log(data);
//       rendorCountryData(data[0]);
//     });
//   });
// };
// getCountryData('america');
const rendorErr = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  // countriesContainer.style.opacity = 1;
};
const getJson = function (url, errorMsg = 'something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(`${errorMsg} ${response.status}`);
    }
    return response.json();
  });
};
const getCountryData = function (country) {
  // country 1
  getJson(`https://restcountries.com/v3.1/name/${country}`, 'country not found')
    .then(data => {
      rendorCountryData(data[0]);

      const neigbour = data[0].borders?.[0];
      console.log(neigbour);
      if (!neigbour) throw new Error('no nighbour found');
      // country 2 nighbour
      return fetch(`https://restcountries.com/v3.1/name/${neigbour}`);
    })
    .then(response => response.json())
    .then(data => rendorCountryData(data[0], 'neighbour'))
    .catch(err => rendorErr(`something went wrong ${err}`))
    .finally(() => (countriesContainer.style.opacity = 1));
};

btn.addEventListener('click', function () {
  getCountryData('Australia');
});
