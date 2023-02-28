const { getEventListeners } = require("events");
require('dotenv').config();

// selecting DOM elements to add content to dynamically 
const fruitForm = document.querySelector("#inputSection form");
const fruitList = document.querySelector("#fruitSection ul");
const fruitNutrition = document.querySelector("#calorieCount");
const fruitImage = document.querySelector("#imageSection");

// global variables
const APIkey = process.env.APIkey;     //SHOULD BE KEPT SECRET
let calorie = 0;

// event listener for the submit button calling the extract fruit function (see below)
fruitForm.addEventListener("submit", extractFruit);

// function checking to see whether a valid input is submitted then calling the fetch function below
function extractFruit(e)  {
    e.preventDefault();
    let fruitInput = e.target.fruitInput.value;

    if(fruitInput) {
        fetchFruitData(fruitInput);
    }
    e.target.reset();
};

// asynchronous function to get the fruit data from API when user hits submit, the data is then passed into the addFruit function below
async function fetchFruitData(fruit) {
    try {
        const resp = await fetch(`https://fruit-api-dv5n.onrender.com/fruits/${fruit}`);
        const resp2 = await fetch(`https://pixabay.com/api/?key=${APIkey}&q=${fruit}+fruit`);
        if(resp.ok && resp2.ok) {
            const fruitData = await resp.json();
            const imgData = await resp2.json();
            addFruit(fruitData, imgData);
        } else {
            throw `Error: http status code = ${resp.status}`;
        }
    } catch(e) {
        console.log(e);
    }
}

// function to get fruit and image data, creating a list and image element, as well as updating the total calorie count using the calorieCount function (add and remove)s
function addFruit(fruitData, imgData) {
    // create list item
    const li = document.createElement('li');
    const img = document.createElement('img');
    // assign text to list item and image data to the image src
    li.textContent = fruitData.name;
    img.src = imgData.hits[Math.floor(Math.random() * imgData.hits.length)].largeImageURL;
    img.alt = fruitData;
    img.height = 250;
    img.width = 250;
    // append list and image item to the DOM
    fruitList.appendChild(li);
    fruitImage.appendChild(img);
    // update calorie count depending on fruit added
    fruitNutrition.textContent = calorieCount(fruitData, "add");
    // add event listener to remove fruit item and image connected to that fruit item when clicked
    li.addEventListener("click", (e) => {
        e.target.remove();
        img.remove();
        fruitNutrition.textContent = calorieCount(fruitData, "remove");
    }, {once: true});
};

// function to malipulate the calorie count when fruit is added and removed, takes two params: fruit = the fruit item(data from API), option: either += calories or -= calories
function calorieCount(fruit, option) {
    if(option === "add") {
        calorie += fruit.nutritions.calories;
        return `${calorie}`;
    }
    if(option === "remove") {
        calorie -= fruit.nutritions.calories;
        return `${calorie}`;
    }
}
