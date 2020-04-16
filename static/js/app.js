async function getPlanets(page) {
    let response = await fetch(page);
    let data = await response.json();

    setPagination(data.previous, data.next);
    displayPlanets(data.results);
}

function displayPlanets(planets) {
    if (planets) {
        let table = document.querySelector('#planets-table');
        let tbody = table.querySelector('tbody');
        let logged = table.dataset.loggedIn === 'True';
        tbody.innerHTML = '';
        for (let planet of planets) {
            let voteButton = '';
            if (logged) {
                voteButton = `
                <td><button type="button" class="btn btn-light">Vote</button></td>
                `;
            }
            let residentsButton = 'No known residents';
            if (planet.residents.length > 0) {
                residentsButton = `
                <button type="button" class="btn btn-outline-secondary">${planet.residents.length} resident(s)</button>
                `;
            }
            tbody.innerHTML += `
            <tr>
                <td>${planet.name}</td>
                <td>${planet.diameter} km</td>
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
    let prevButton = document.querySelector('#prevButton');
    let nextButton = document.querySelector('#nextButton');
    if (prevUrl !== null) {
        prevButton.classList.remove('disabled');
        prevButton.dataset.prevUrl = prevUrl;
    } else {
        prevButton.classList.add('disabled');
        prevButton.dataset.prevUrl = 'null';
    }
    if (nextUrl !== null) {
        nextButton.classList.remove('disabled');
        nextButton.dataset.nextUrl = nextUrl;
    } else {
        nextButton.classList.add('disabled');
        nextButton.dataset.nextUrl = 'null';
    }
}

function nextClick() {
    let nextButton = document.querySelector('#nextButton');
    let nextUrl = nextButton.dataset.nextUrl;
    if (nextUrl !== 'null') {
        getPlanets(nextUrl);
    }
}

function prevClick() {
    let prevButton = document.querySelector('#prevButton');
    let prevUrl = prevButton.dataset.prevUrl;
    if (prevUrl !== 'null') {
        getPlanets(prevUrl);
    }
}

function init() {
    getPlanets('http://swapi.dev/api/planets/?page=1');
    let nextButton = document.querySelector('#nextButton');
    let prevButton = document.querySelector('#prevButton');

    nextButton.addEventListener('click', nextClick);
    prevButton.addEventListener('click', prevClick);
}

init();