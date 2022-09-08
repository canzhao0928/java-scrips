'use strict';


const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class Workout {
    date = new Date();
    id = (+new Date() + "").slice(-10);
    clicks = 0

    constructor(distance, duration, coords) {
        this.distance = distance;
        this.duration = duration;
        this.coords = coords;
    }

    _discription() {
        // prettier-ignore
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.content = `${this.type.charAt(0).toUpperCase() + this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`
    }

    click() { this.clicks++ }

}

class Running extends Workout {
    constructor(distance, duration, coords, cadence) {
        super(distance, duration, coords);
        this.cadence = cadence;
        this.type = "running"
        this.value3 = this.calPace()
        this.unit3 = "min/km"
        this.value4 = cadence
        this.unit4 = "spm"
        this.icon4 = "🦶🏼"
        this._discription();
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
        this.type = "cycling"
        this.value3 = this.calSpeed()
        this.unit3 = "km/h"
        this.value4 = elevationGain
        this.unit4 = "m"
        this.icon4 = "⛰"
        this._discription()
    }

    calSpeed() {
        //km/h
        this.speed = this.distance / (this.duration / 60);
        return this.speed;
    }

}

class App {
    #mapEvent;
    #map
    #workouts = [];
    constructor() {
        this._getPosition();
        form.addEventListener("submit", this._newWorkout.bind(this))
        inputType.addEventListener("change", this._toggleElevationField);
        containerWorkouts.addEventListener("click", (e) => {
            if (!e.target.closest(".workout")) return
            const workout = this.#workouts.find(workout => workout.id === e.target.closest(".workout").dataset.id)
            this.#map.setView(workout.coords, 13);
            //using the public interface
            workout.click();
            console.log(workout);
        })
        this._getLocalStorage()
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
        //render the marker
        this.#workouts.forEach(workout => {
            this._renderWorkoutMarker(workout)
        })
    }
    _showForm(mEvent) {
        this.#mapEvent = mEvent;
        form.classList.remove("hidden")
    }

    _hiddenForm() {
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = ""
        //hidden the form
        form.style.display = "none"
        form.classList.add("hidden")
        setTimeout(() => form.style.display = "grid", 1000)
    }

    _toggleElevationField() {
        inputCadence.closest(".form__row").classList.toggle("form__row--hidden")
        inputElevation.closest(".form__row").classList.toggle("form__row--hidden")
    }
    _newWorkout(e) {
        e.preventDefault();

        const validate = (...inputs) => inputs.every(inp => Number.isFinite(inp))
        const positiveValue = (...inputs) => inputs.every(inp => inp > 0)
        const distance = +inputDistance.value
        const duration = +inputDuration.value
        const cadence = +inputCadence.value
        const elevationGain = +inputElevation.value
        //get date from the form
        const { lat, lng } = this.#mapEvent.latlng;
        let workout;

        //judg workout type and data validate

        if (inputType.value === "running") {
            if (!validate(distance, duration, cadence) || !positiveValue(distance, duration, cadence)) return alert("Input should be positive value!")
            workout = new Running(inputDistance.value, inputDuration.value, [lat, lng], inputCadence.value)

        }
        if (inputType.value === "cycling") {
            if (!validate(distance, duration, elevationGain) || !positiveValue(distance, duration)) return alert("Input should be positive value!")
            workout = new Cycling(inputDistance.value, inputDuration.value, [lat, lng], inputElevation.value)
        }
        //add new workout to workout array
        this.#workouts.push(workout)
        //show marker on the map
        this._renderWorkoutMarker(workout)
        //render one record
        this._renderWorkout(workout)
        //update the input to null
        this._hiddenForm()
        //set local storage
        this._setLocalStorage()
    }
    _renderWorkoutMarker(workout) {
        L.marker(workout.coords).addTo(this.#map)
            .bindPopup(L.popup({
                maxWidth: 250,
                minWidth: 100,
                autoClose: false,
                closeOnClick: false,
                className: `${workout.type}-popup`
            }))
            .setPopupContent(`${workout.type === "running" ? "🏃🏻‍♂️ " : "🚴🏻‍♀️ "} ${workout.content}`)
            .openPopup();
    }
    _renderWorkout(workout) {
        const html = `
        <li class="workout workout--${workout.type}" data-id="${workout.id}">
            <h2 class="workout__title" >${workout.content}</h2>
        <div class="workout__details">
          <span class="workout__icon">${workout.type === "running" ? "🏃🏻‍♂️" : "🚴🏻‍♀️"}</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
        </div >
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${workout.duration}</span>
          <span class="workout__unit">min</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.value3}</span>
          <span class="workout__unit">${workout.unit3}</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">${workout.icon4}</span>
          <span class="workout__value">${workout.value4}</span>
          <span class="workout__unit">${workout.unit4}</span>
        </div>
      </li > `
        form.insertAdjacentHTML("afterend", html)
    }

    _setLocalStorage() {
        localStorage.setItem("workouts", JSON.stringify(this.#workouts))
    }

    _getLocalStorage() {
        const data = JSON.parse(localStorage.getItem("workouts"))
        if (!data) return;
        this.#workouts = data;
        data.forEach(workout => {
            this._renderWorkout(workout)
        })
    }

    reset() {
        localStorage.removeItem("workouts")
        location.reload()
    }
}

const app = new App();




