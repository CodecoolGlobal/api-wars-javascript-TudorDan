let urlApi = 'https://swapi.dev/api/planets/?page=1';
let prevUrl;
let nextUrl;
const nextButton = document.querySelector('#nextButton');
const prevButton = document.querySelector('#prevButton');
let allPersons = [];
let modalTitle = document.querySelector('#modalTitle');
let modalBody = document.querySelector('.modal-body');
let table = document.querySelector('#planets-table');
let logged = table.dataset.loggedIn === 'True';
let userId = Number(table.dataset.userId);
let nrOfPages = 0;

async function getPlanets(page, votes) {
    let response = await fetch(page);
    let data = await response.json();

    prevUrl = data.previous === null ? data.previous : 'https' + data.previous.slice(4);
    nextUrl = data.next === null ? data.next : 'https' + data.next.slice(4);

    setPagination(prevUrl, nextUrl);
    displayPlanets(data.results, votes);
}

function displayPlanets(planets, votes) {
    if (planets) {
        let tbody = table.querySelector('tbody');
        tbody.innerHTML = '';
        for (let planet of planets) {
            planet.url = 'https' + planet.url.slice(4);
            let planetId;
            if (planet.url.charAt(planet.url.length - 3) === '/') {
                planetId = Number(planet.url.slice(planet.url.length - 2, planet.url.length - 1));
            } else {
                planetId = Number(planet.url.slice(planet.url.length - 3, planet.url.length - 1));
            }
            // Check if user login
            let voteButton = '';
            if (logged) {
                // Check if planet was voted
                let voted = false;
                for (let element of votes) {
                    if (element.planet_id === planetId && element.user_id === userId) {
                        voted = true;
                        break;
                    }
                }
                if (voted) {
                    voteButton = `
                    <td>
                        <button  class="btn btn-outline-success" disabled>Voted!</button>
                    </td>
                    `;
                } else {
                    voteButton = `
                    <td>
                        <button type="submit" class="btn btn-outline-secondary" 
                        onclick="showVote('${planet.name}','${planetId}')">Vote</button>
                    </td>
                    `;
                }
            }
            // Check if planet has residents
            let residentsButton = 'No known residents';
            if (planet.residents.length > 0) {
                residentsButton = `
                <button type="button" class="btn btn-outline-secondary" 
                onclick="showModal('${planet.url}', '${planet.name}')">${planet.residents.length} resident(s)</button>
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
    fetch('/api/get-votes')
        .then(votes => votes.json())
        .then(votes => {
            if (nextUrl !== 'null') {
                getPlanets(nextUrl, votes);
            }
        });
}

function prevClick() {
    fetch('/api/get-votes')
        .then(votes => votes.json())
        .then(votes => {
            if (prevUrl !== 'null') {
                getPlanets(prevUrl, votes);
            }
        });
}

function showModal(planetUrl, planetName) {
    let specificPlanetResidents = []
    for (let person of allPersons) {
        person.homeworld = 'https' + person.homeworld.slice(4);
        if (person.homeworld === planetUrl) {
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
    modalTitle.innerHTML = `Residents of ${planetName}`;
    modalBody.innerHTML = `
    <table class="table table-bordered table-light table-striped table-responsive-md text-center">
        <thead class="table-secondary">
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
    $('#modalComponent').modal('show').on('hidden.bs.modal', () => {
        window.location.reload();
    });
}

function getAllPersons() {
    let urlPersons = '//swapi.dev/api/people/?page=';
    let temp = '';
    for (let i = 1; i <= nrOfPages; i++) {
        temp = urlPersons.concat(`${i}`);
        getOnePagePersons(temp);
    }
}

function getResidentsMetadata() {
    // get number of pages starting with "swapi.dev/api/people/?page="
    fetch('//swapi.dev/api/people')
        .then(info => info.json())
        .then(info => {
            let totalRes = Number(info.count);
            let resPerPag = Number(info.results.length);
            if (resPerPag !== 0) {
                nrOfPages = Math.floor(totalRes / resPerPag);
                if (totalRes % resPerPag !== 0) {
                    nrOfPages += 1;
                }
            }
            getAllPersons();
        });
}

function getOnePagePersons(urlPersons) {
    fetch(urlPersons)
        .then(data => data.json())
        .then(data => {
            let persons = data.results;
            for (let person of persons) {
                allPersons.push(person);
            }
        })
}

function showStatistics() {
    fetch('/api/get-statistics')
        .then(info => info.json())
        .then(stats => {
            let planetDict = {};
            for (let dictionary of stats) {
                if (planetDict[dictionary.planet_name] === undefined) {
                    planetDict[dictionary.planet_name] = 1;
                } else {
                    planetDict[dictionary.planet_name]++;
                }
            }

            let body = '';
            for (let [key, value] of Object.entries(planetDict)) {
                body += `
                <tr>
                    <td>${key}</td>
                    <td>${value}</td>
                </tr>
                `;
            }
            modalTitle.innerHTML = 'Statistics';
            modalBody.innerHTML = `
            <table class="table table-bordered table-light table-striped table-responsive-md text-center">
                <thead class="table-dark">
                    <tr>
                        <th>Planet Name</th>
                        <th>Number of Votes</th>
                    </tr>
                </thead>
                <tbody>
                    ${body}
                </tbody>
            </table>
            `;
            $('#modalComponent').modal('show');
        })
}

function showVote(planetName, planetId) {
    let data = {
        'planet_id': planetId,
        'planet_name': planetName
    }

    let settings = {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data),
    }

    let button = event.target;
    fetch('/api/insert-vote', settings)
        .then((serverResponse) => {
            return serverResponse.json();
        })
        .then((jsonResponse) => {
            if (jsonResponse['success']) {
                modalTitle.innerHTML = 'Voting ';
                modalBody.innerHTML = `${planetName} was voted!`;
                $('#modalComponent').modal('show');

                button.classList.remove('btn-outline-secondary');
                button.classList.add('btn-outline-success');
                button.setAttribute('disabled', '');
                button.innerText = 'Voted!';
                button.removeAttribute('onclick');
            }
        })
}

function getPageData() {
    fetch('/api/get-votes')
        .then(votes => votes.json())
        .then(votes => {
            getPlanets(urlApi, votes);
        })
}

function init() {
    getPageData();

    nextButton.addEventListener('click', nextClick);
    prevButton.addEventListener('click', prevClick);

    getResidentsMetadata();

    if (logged) {
        const statisticsButton = document.querySelector('#statistics');
        statisticsButton.addEventListener('click', showStatistics);
    }
}

init();