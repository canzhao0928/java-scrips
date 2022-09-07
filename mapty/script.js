'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');


class App {
    #mapEvent;
    #map
    constructor() {
        this._getPosition();
        form.addEventListener("submit", this._newWorkout.bind(this))
        inputType.addEventListener("change", this._toggleElevationField);

    }
    _getPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), () => {
                alert("Can't get your location!")
            })
        }
    }
    _loadMap(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        this.#map = L.map('map').setView([latitude, longitude], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(this.#map);
        this.#map.on("click", this._showForm.bind(this))

    }
    _showForm(mEvent) {
        this.#mapEvent = mEvent;
        form.classList.remove("hidden")
    }
    _toggleElevationField() {
        inputCadence.closest(".form__row").classList.toggle("form__row--hidden")
        inputElevation.closest(".form__row").classList.toggle("form__row--hidden")
    }
    _newWorkout(e) {
        e.preventDefault();
        //update the input to null
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = ""

        //show marker on the map
        const { lat, lng } = this.#mapEvent.latlng;
        L.marker([lat, lng]).addTo(this.#map)
            .bindPopup(L.popup({
                maxWidth: 250,
                minWidth: 100,
                autoClose: false,
                closeOnClick: false,
                className: "running-popup"
            }))
            .setPopupContent("workout")
            .openPopup();
        //add one record
    }
}

const app = new App();


class Workout {
    date = new Date();
    id = (+new Date() + "").slice(-10);
    constructor(distance, duration, coords) {
        this.distance = distance;
        this.duration = duration;
        this.coords = coords;
    }
}

class Running extends Workout {
    constructor(distance, duration, coords, cadence) {
        super(distance, duration, coords);
        this.cadence = cadence;
        this.calPace();
    }

    calPace() {
        //min/km
        this.pace = this.duration / this.distance;
        return this.pace
    }
}

class Cycling extends Workout {
    constructor(distance, duration, coords, elevationGain) {
        super(distance, duration, coords);
        this.elevationGain = elevationGain;
        this.calSpeed();
    }

    calSpeed() {
        //km/h
        this.speed = this.distance / (this.duration / 60);
        return this.speed;
    }
}



