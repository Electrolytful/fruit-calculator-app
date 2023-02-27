const { getEventListeners } = require("events");

const fruitForm = document.querySelector("#inputSection form");
const fruitList = document.querySelector("#fruitSection ul");

fruitForm.addEventListener("submit", extractFruit);

function addFruit(fruit) {
    // create list item
    const li = document.createElement('li');

    // assign text to list item
    li.textContent = fruit;
    // append list item to the htmll list
    fruitList.appendChild(li);
    // add event listener to remove fruit item when clicked
    li.addEventListener("click", removeFruit, {once: true});

};

function extractFruit(e)  {
    e.preventDefault();
    let fruitInput = e.target.fruitInput.value;

    if(fruitInput) {
        addFruit(fruitInput);
    }
    e.target.reset();
};

function removeFruit(e) {
    e.target.remove();
}



