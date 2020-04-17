let urlApi = 'http://swapi.dev/api/planets/?page=1';
let prevUrl;
let nextUrl;
const nextButton = document.querySelector('#nextButton');
const prevButton = document.querySelector('#prevButton');
let allPersons = [];

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
                <button type="button" class="btn btn-outline-secondary" 
                onclick="showModal('${planet.url}')">${planet.residents.length} resident(s)</button>
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

function showModal(planet) {
    console.log(allPersons);
    let specificPlanetResidents = []
    for (let person of allPersons) {
        if (person.homeworld === planet) {
            specificPlanetResidents.push(person)
        }
    }
    let body = '';
    for (let resident of specificPlanetResidents) {
        body += `
        <tr>
            <td>${resident.name}</td>
            <td>${resident.height / 100 + ' m'}</td>
            <td>${resident.mass === 'unknown' ? 'unknown' : (resident.mass + ' kg')}</td>
            <td>${resident.skin_color}</td>
            <td>${resident.hair_color}</td>
            <td>${resident.eye_color}</td>
            <td>${resident.birth_year}</td>
            <td>${resident.gender === 'unknown' ? 'unknown' : (resident.gender === 'female' ? '<i class="fas' +
            ' fa-female" aria-hidden="true"></i>' : '<i class="fas fa-male" aria-hidden="true"></i>')}</td>
        </tr>
        `;
    }
    document.querySelector('.modal-body').innerHTML = `
    <table class="table table-bordered table-light table-striped table-responsive-md">
        <thead>
            <tr>
                <th>Name</th>
                <th>Height</th>
                <th>Mass</th>
                <th>Skin Color</th>
                <th>Hair Color</th>
                <th>Eye Color</th>
                <th>Birth Year</th>
                <th>Gender</th>
            </tr>
        </thead>
        <tbody>
            ${body}
        </tbody>
    </table>
    `;
    $('#modalComponent').modal('show');
}

function getallPersons() {
    let urlPersons = 'http://swapi.dev/api/people/?page=';
    let temp = '';
    for (let i = 1; i < 10; i++) {
        temp = urlPersons.concat(`${i}`);
        getOnePagePeople(temp);
    }
}

function getOnePagePeople(urlPersons) {
    fetch(urlPersons)
        .then(data => data.json())
        .then(data => {
            let persons = data.results;
            for (let person of persons) {
                allPersons.push(person);
            }
        })
}

function init() {
    getPlanets(urlApi);

    nextButton.addEventListener('click', nextClick);
    prevButton.addEventListener('click', prevClick);

    getallPersons();
}

init();