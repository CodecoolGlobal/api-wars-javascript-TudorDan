let urlApi = 'http://swapi.dev/api/planets/?page=1';
let prevUrl = '';
let nextUrl = '';
const nextButton = document.querySelector('#nextButton');
const prevButton = document.querySelector('#prevButton');

async function getPlanets(page) {
    let response = await fetch(page);
    let data = await response.json();

    prevUrl = data.previous;
    nextUrl = data.next;

    setPagination(prevUrl, nextUrl);
    displayPlanets(data.results);
}

function displayPlanets(planets) {
    if (planets) {
        let table = document.querySelector('#planets-table');
        let tbody = table.querySelector('tbody');
        let logged = table.dataset.loggedIn === 'True';
        tbody.innerHTML = '';
        for (let planet of planets) {
            // Check if user login
            let voteButton = '';
            if (logged) {
                voteButton = `
                <td><button type="button" class="btn btn-outline-secondary">Vote</button></td>
                `;
            }
            // Check if residents number > 0
            let residentsButton = 'No known residents';
            if (planet.residents.length > 0) {
                residentsButton = `
                <button type="button" class="btn btn-outline-secondary">${planet.residents.length} resident(s)</button>
                `;
            }
            // Generate table
            tbody.innerHTML += `
            <tr>
                <td>${planet.name}</td>
                <td>${planet.diameter === 'unknown' ? 'unknown' : (planet.diameter + ' km')}</td>
                <td>${planet.climate}</td>
                <td>${planet.terrain}</td>
                <td>${planet.surface_water === 'unknown' ? 'unknown' : (planet.surface_water + ' %')}</td>
                <td>${planet.population === 'unknown' ? 'unknown' : (planet.population + ' people')}</td>
                <td>${residentsButton}</td>
                ${voteButton}
            </tr>
            `;
        }
    }
}

function setPagination(prevUrl, nextUrl) {
    if (prevUrl !== null) {
        prevButton.classList.remove('disabled');
        prevButton.classList.remove('btn-secondary');
        prevButton.classList.add('btn-primary');
    } else {
        prevButton.classList.add('disabled');
        prevButton.classList.remove('btn-primary');
        prevButton.classList.add('btn-secondary');
    }
    if (nextUrl !== null) {
        nextButton.classList.remove('disabled');
        nextButton.classList.remove('btn-secondary');
        nextButton.classList.add('btn-primary');
    } else {
        nextButton.classList.add('disabled');
        nextButton.classList.remove('btn-primary');
        nextButton.classList.add('btn-secondary');
    }
}

function nextClick() {
    if (nextUrl !== 'null') {
        getPlanets(nextUrl);
    }
}

function prevClick() {
    if (prevUrl !== 'null') {
        getPlanets(prevUrl);
    }
}

function init() {
    getPlanets(urlApi);

    nextButton.addEventListener('click', nextClick);
    prevButton.addEventListener('click', prevClick);
}

init();