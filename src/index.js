
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import "notiflix/dist/notiflix-3.2.5.min.css"
import './css/styles.css';


const DEBOUNCE_DELAY = 300;

const refs = { 
    input: document.querySelector('#search-box'),
    list: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
}
  

refs.input.addEventListener('input', debounce(onChange, DEBOUNCE_DELAY))

function onChange(e) {
    htmlClear();
    let countryName = e.target.value.trim();
    if (e.target.value !== '') {
        countryApiSearch(countryName)
            .then(country => createList(country))
            .catch(error => {
                Notiflix.Notify.failure("Oops, there is no country with that name")  
        })  
    }
        

}



function countryApiSearch(countryName) {
    return fetch(`https://restcountries.com/v3.1/name/${countryName}?fields=name,capital,population,flags,languages`)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json()});
}

function createList(array) {
    if (array.length <= 10 && array.length !== 1) {
        htmlClear()
        createListItemMarkUp(array);
        refs.list.classList.remove('with-one-item')

    } else if (array.length > 10) {
        Notiflix.Notify.info("Too many matches found. Please enter a more specific name.")
        refs.list.classList.remove('with-one-item')

    } else if (array.length === 1) {
        htmlClear()
        createListItemMarkUp(array);
        createInfoListMarkUp(array);
        refs.list.classList.add('with-one-item')
    }

}

function htmlClear() {
    refs.list.innerHTML = '';
    refs.countryInfo.innerHTML = '';
}

function createListItemMarkUp(array) {
    const listPattern = array
        .map(country => 
             `<li class='list-item'><img src='${country.flags.svg}'></img><p>${country.name.official}</p></li>`
        )
        .join('')
        
        refs.list.insertAdjacentHTML('afterbegin', listPattern);
}

function createInfoListMarkUp(array) {
        let infoPattern = 
            `<ul class='info-list'>
                <li>Capital: <span>${array[0].capital}</span></li>
                <li>Population: <span>${array[0].population}</span></li>
                <li>Languages: <span>${Object.values(array[0].languages)}</span></li>
            </ul>`
         
        refs.countryInfo.insertAdjacentHTML('afterbegin', infoPattern);
}