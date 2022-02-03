'use strict';

const states = {
	al: 'alabama',
	ak: 'alaska',
	az: 'arizona',
	ar: 'arkansas',
	ca: 'california',
	co: 'colorado',
	ct: 'connecticut',
	de: 'deleware',
	fl: 'florida',
	ga: 'georgia',
	hi: 'hawaii',
	id: 'idaho',
	il: 'illinois',
	in: 'indiana',
	ia: 'iowa',
	ks: 'kansas',
	ky: 'kentucky',
	la: 'louisiana',
	me: 'maine',
	md: 'maryland',
	ma: 'massachusetts',
	mi: 'michigan',
	mn: 'minnesota',
	ms: 'mississippi',
	mo: 'missouri',
	mt: 'montana',
	ne: 'nebraska',
	nv: 'nevada',
	nh: 'new hampshire',
	nj: 'new jersey',
	nm: 'new mexico',
	ny: 'new york',
	nc: 'north carolina',
	nd: 'north dakota',
	oh: 'ohio',
	ok: 'oklahoma',
	or: 'oregon',
	pa: 'pennsylvania',
	ri: 'rhode island',
	sc: 'south carolina',
	sd: 'south dakota',
	tn: 'tennessee',
	tx: 'texas',
	ut: 'utah',
	vt: 'vermont',
	va: 'virginia',
	wa: 'washington',
	wv: 'west virginia',
	wi: 'wisconsin',
	wy: 'wyoming',
};

const searchField = document.querySelector('.search-field');
const searchBtn = document.querySelector('.search-btn');
const cardsContainer = document.querySelector('.cards-container');
const messageBox = document.querySelector('.message-box');
const messageContent = document.querySelector('.message-content');

const OPEN_WEATHER_API_KEY = '8e93c0916dc4a3b8a6b4cc1481b9b9ca';

searchBtn.addEventListener('click', e => {
	e.preventDefault();
	processInput();
});

let cityState;

function formatLocation(arr, x) {
	const formattedLocation = arr.map(word => {
		if (word.indexOf(' ') > -1) {
			return word.split(' ').join(`${x}`);
		}
		return word;
	});

	return formattedLocation;
}

function processInput() {
	const userInput = searchField.value;
	// Splits the location into an array without whitepace
	const location = userInput
		.toLowerCase()
		.split(',')
		.map(word => word.trim());

	if (location.length > 1) {
		if (location[1].length === 2) {
			const enteredState = location[1];
			location.pop();
			location.push(states[enteredState]);
			console.log(location);
		}
	}

	// Calls weather API
	fetchWeather(formatLocation(location, '+'));
	searchField.value = '';
	searchField.blur();
	return (cityState = location);
}

async function fetchWeather([city, state]) {
	const response = await fetch(
		`https://api.openweathermap.org/data/2.5/weather?q=${city},${state}&units=imperial&appid=${OPEN_WEATHER_API_KEY}`
	);
	const data = await response.json();

	if (data?.message) {
		alert(`${data.message}`);
	} else {
		createCard(cityState, [city, state], data);
	}
}

// Formats all info to display properly, creates card and appends to container
const createCard = function (
	cityState,
	[city, state],
	{ main, weather, wind }
) {
	const cardId = `${formatLocation(cityState, '-').join('-')}`;
	const card = document.createElement('div');
	card.classList.add('card');
	card.setAttribute('id', `${cardId}`);
	const locationTitle = cityState
		.map(word => {
			if (word.indexOf(' ') > -1) {
				return word
					.split(' ')
					.map(w => {
						return w.replace(w[0], w[0].toUpperCase());
					})
					.join(' ');
			} else {
				return word.replace(word[0], word[0].toUpperCase());
			}
		})
		.join(', ');
	card.innerHTML = `
	        <h1 class="location-title">${locationTitle}</h1>
	        <img src="http://openweathermap.org/img/wn/${
						weather[0].icon
					}@2x.png" alt="">
            <h3 class='description'>${weather[0].description
							.split(' ')
							.map(word => {
								return word.replace(word[0], word[0].toUpperCase());
							})
							.join(' ')}</h3>
	        <h2 class="current-temp">${main.temp.toFixed(0)}&deg;F</h2>
	        <p class='feels-like'>Feels Like: ${main.feels_like.toFixed(0)}&deg;</p>
	        <div class="hi-lo">
	            <span class='hi'>Hi: ${main.temp_max.toFixed(
								0
							)}&deg;</span><span class='lo'>Lo: ${main.temp_min.toFixed(
		0
	)}&deg;</span>
	        </div>
	        <p class='wind'>Wind: ${wind.speed.toFixed(0)} mph ${calcWindDirection(
		wind.deg.toFixed(0)
	)}</p>
            <i class='fas fa-times'></i>
	`;
	messageBox.style.display = 'none';
	cardsContainer.appendChild(card);
	showCard(cardId);
	closeBtn();
};

function showCard(cardId) {
	const card = document.querySelector(`#${cardId}`);
	setTimeout(() => {
		card.classList.add('show');
	}, 100);
}

function closeBtn() {
	const closeBtns = document.querySelectorAll('.fas.fa-times');
	closeBtns.forEach(button => {
		button.addEventListener('click', e => {
			e.target.parentElement.remove();
			const cards = document.querySelectorAll('.card');
			if (cards.length === 0) {
				messageBox.style.display = 'block';
			}
		});
	});
}

function calcWindDirection(num) {
	let dir;
	if (num >= 11.26 && num <= 33.75) return (dir = 'NNE');
	if (num >= 33.76 && num <= 56.25) return (dir = 'NE');
	if (num >= 56.26 && num <= 78.75) return (dir = 'ENE');
	if (num >= 78.76 && num <= 101.25) return (dir = 'E');
	if (num >= 101.26 && num <= 123.75) return (dir = 'ESE');
	if (num >= 123.76 && num <= 146.25) return (dir = 'SE');
	if (num >= 146.26 && num <= 168.75) return (dir = 'SSE');
	if (num >= 168.76 && num <= 191.25) return (dir = 'S');
	if (num >= 191.26 && num <= 213.75) return (dir = 'SSW');
	if (num >= 213.76 && num <= 236.25) return (dir = 'SW');
	if (num >= 236.26 && num <= 258.75) return (dir = 'WSW');
	if (num >= 258.76 && num <= 281.25) return (dir = 'W');
	if (num >= 281.26 && num <= 303.75) return (dir = 'WNW');
	if (num >= 303.76 && num <= 326.25) return (dir = 'NW');
	if (num >= 326.25 && num <= 348.74) return (dir = 'NNW');
	if (num <= 11.25 || num >= 0 || num >= 348.75) return (dir = 'N');
}
