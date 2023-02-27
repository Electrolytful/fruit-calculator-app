const { getEventListeners } = require("events");

const fruitForm = document.querySelector("#inputSection form");
const fruitList = document.querySelector("#fruitSection ul");
const fruitNutrition = document.querySelector("#nutritionSection p");
const APIkey = "33986188-7c2c501da5f77845a5bf70b41";

fruitForm.addEventListener("submit", extractFruit);

let calorie = 0;

function extractFruit(e)  {
    e.preventDefault();
    let fruitInput = e.target.fruitInput.value;

    if(fruitInput) {
        fetchFruitData(fruitInput);
    }
    e.target.reset();
};

// asynchronous function to get the fruit data from API when user hits submit
async function fetchFruitData(fruit) {
    try {
        const resp = await fetch(`https://fruity-api.onrender.com/fruits/${fruit}`);
        if(resp.ok) {
            const data = await resp.json();
            addFruit(data);
        } else {
            throw `Error: http status code = ${resp.status}`;
        }
    } catch(e) {
        console.log(e);
    }
}

function addFruit(fruit) {
    // create list item
    const li = document.createElement('li');
    // assign text to list item
    li.textContent = fruit.name;
    // append list item to the htmll list
    fruitList.appendChild(li);
    // update calorie count depending on fruit added
    fruitNutrition.textContent = calorieCount(fruit, "add");
    // add event listener to remove fruit item when clicked
    li.addEventListener("click", (e) => {
        removeFruit(e);
        fruitNutrition.textContent = calorieCount(fruit, "remove");
    }, {once: true});
};

function removeFruit(e) {
    e.target.remove();
}

function calorieCount(fruit, option) {
    if(option === "add") {
        calorie += fruit.nutritions.calories;
        return `Total calorie count = ${calorie}`;
    }
    if(option === "remove") {
        calorie -= fruit.nutritions.calories;
        return `Total calorie count = ${calorie}`;
    }
}
