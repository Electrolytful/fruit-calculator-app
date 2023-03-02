const { getEventListeners } = require("events");
require('dotenv').config();

// selecting DOM elements to add content to dynamically 
const fruitForm = document.querySelector("#searchSection form");
const fruitFormPost = document.querySelector("#inputSectionPost form");
const fruitList = document.querySelector("#fruitListSection div");
const fruitNutrition = document.querySelector("#calorieCount");

// global variables
const APIkey = "33986188-7c2c501da5f77845a5bf70b41";    //SHOULD BE KEPT SECRET - Bug - Does not work with .env file
let calorie = 0;

// event listeners for the submit buttons
fruitForm.addEventListener("submit", extractFruit);
fruitFormPost.addEventListener("submit", createNewFruit);

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
        const resp = await fetch(`http://127.0.0.1:3000/fruits/${fruit}`);           //http://127.0.0.1:3000/fruits/ - https://fruit-api-dv5n.onrender.com/fruits/
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
    // create elements to be included in each fruit div
    const div = document.createElement('div');
    const p = document.createElement('p');
    const img = document.createElement('img');
    const calorie = document.createElement('p');

    // assign name and image to p and img elements created
    p.textContent = `Name: ${fruitData.name}`;
    img.src = imgData.hits[Math.floor(Math.random() * imgData.hits.length)].largeImageURL;
    img.alt = fruitData;
    img.height = 250;
    img.width = 250;
    calorie.textContent = `Calories: ${fruitData.nutritions.calories}`;

    // append name and img elements to the div element then append that div to the DOM
    div.appendChild(img);
    div.appendChild(p);
    div.append(calorie);
    fruitList.appendChild(div);

    // update calorie count depending on fruit added
    fruitNutrition.textContent = calorieCount(fruitData, "add");

    // add event listener to remove the fruit div if clicked
    div.addEventListener("click", (e) => {
        const item = e.target.closest("div");
        item.remove();
        fruitNutrition.textContent = calorieCount(fruitData, "remove");
    });
};

// send form data of new fruit to server
async function createNewFruit(e) {
    e.preventDefault();

    const data = {name: e.target.fruitInputCreate.value, nutritions: {calories: e.target.fruitInputCalorie.value}};
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }

    const response = await fetch("https://fruit-api-dv5n.onrender.com/fruits", options);

    if(response.status === 201) {
        e.target.reset();
    }

}

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
