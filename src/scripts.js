import $ from 'jquery';
// import users from './data/users-data';
// import recipeData from  './data/recipe-data';
// import ingredientData from './data/ingredient-data';
import domUpdates from './domUpdates';

import './images/apple-logo.png';
import './images/apple-logo-outline.png';
import './images/seasoning.png';
import './images/cookbook.png';
import './images/search.png';

import './css/base.scss';
import './css/styles.scss';

import User from './user';
import Recipe from './recipe';

let fullRecipeInfo = document.querySelector(".recipe-instructions");
let pantryInfo = [];
let recipes = [];
let searchInput = document.querySelector("#search-input");
let tagList = document.querySelector(".tag-list");
let user;
let allIngredients;

window.addEventListener("load", generateUser);
window.addEventListener("load", fetchRecipes);

$('.show-all-btn').on("click", showAllRecipes);
$('.filter-btn').on("click", findCheckedTags);
$('main').on("click", addToMyRecipes);
$('.my-pantry-btn').on("click", domUpdates.toggleMenu);
$('.saved-recipes-btn').on("click", showSavedRecipes);
$('.search-btn').on("click", searchRecipes);
$('.show-pantry-recipes-btn').on("click", findCheckedPantryBoxes);
$('#search').on("submit", pressEnterSearch);

// GENERATE A USER ON LOAD
function generateUser() {
  let ingredientInfo = null;

  fetch('https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/users/wcUsersData')
    .then(response => response.json())
    .then(data => {

      let randNum = Math.floor(Math.random() * data.wcUsersData.length);
      user = new User(data.wcUsersData[randNum]);

      domUpdates.displayFirstName(user);
      fetchIngredientInfo();
    })
    .catch(error => console.log(error.message));
}

function fetchIngredientInfo() {
  fetch('https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/ingredients/ingredientsData')
    .then(response => response.json())
    .then(data => {
      allIngredients = data.ingredientsData;
      domUpdates.displayPantryInfo(allIngredients, user.pantry.ingredients.sort());
    })
    .catch(error => console.log(error.message));
}


// CREATE RECIPE CARDS
function fetchRecipes() {
  fetch('https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/recipes/recipeData')
    .then(response => response.json())
    .then(data => {
      createCards(data);
      findTags(data);
    })
    .catch(error => console.log(error.message))
}

const createCards = (data) => {
  data.recipeData.forEach(recipe => {
    let recipeInfo = new Recipe(recipe);
    let shortRecipeName = recipeInfo.name;
    recipes.push(recipeInfo);
    if (recipeInfo.name.length > 40) {
      shortRecipeName = recipeInfo.name.substring(0, 40) + "...";
    }
    domUpdates.addToDom(recipeInfo, shortRecipeName);
  });
}

// FILTER BY RECIPE TAGS
const findTags = (data) => {
  let tags = [];
  data.recipeData.forEach(recipe => {
    recipe.tags.forEach(tag => {
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    });
  });
  tags.sort();

  domUpdates.listTags(tags);
}

function findCheckedTags() {
  let checkedTags = [...$('.checked-tag:checked')];
  findTaggedRecipes(checkedTags);
}

function findTaggedRecipes(selected) {
  fetch('https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/recipes/recipeData')
    .then(response => response.json())
    .then(data => {
      let selectedTags = selected.map(tag => tag.id);
      let matchedRecipes = data.recipeData.filter(recipe => recipe.tags.some(tag => selectedTags.includes(tag)));
      displayRecipes(matchedRecipes);
    })
    .catch(error => console.log(error.message));
}

function filterRecipes(filtered) {
  let foundRecipes = recipes.filter(recipe => {
    return !filtered.includes(recipe);
  });
  hideUnselectedRecipes(foundRecipes)
}

function hideUnselectedRecipes(foundRecipes) {
  foundRecipes.forEach(recipe => {
    let domRecipe = document.getElementById(`${recipe.id}`);
    domRecipe.style.display = "none";
  });
}

// FAVORITE RECIPE FUNCTIONALITY
function addToMyRecipes() {
  if (event.target.className === "card-apple-icon") {
    let cardId = parseInt(event.target.closest(".recipe-card").id)
    if (!user.favoriteRecipes.includes(cardId)) {
      event.target.src = "./images/apple-logo.png";
      user.saveRecipe(cardId);
    } else {
      event.target.src = "./images/apple-logo-outline.png";
      user.removeRecipe(cardId);
    }
  } else if (event.target.id === "exit-recipe-btn") {
    domUpdates.exitRecipe(fullRecipeInfo);
  } else if (isDescendant(event.target.closest(".recipe-card"), event.target)) {
    openRecipeInfo(event);
  }
}

function isDescendant(parent, child) {
  let node = child;
  while (node !== null) {
    if (node === parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

function showSavedRecipes() {
  fetch('https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/recipes/recipeData')
    .then(response => response.json())
    .then(data => {
      let unsavedRecipes = data.recipeData.filter(recipe => {
        return !user.favoriteRecipes.includes(recipe.id);
      });
      unsavedRecipes.forEach(recipe => {
        let domRecipe = document.getElementById(`${recipe.id}`);
        domRecipe.style.display = "none";
      });
      domUpdates.showMyRecipesBanner();
    })
    .catch(err => console.log(err.message));
}

// CREATE RECIPE INSTRUCTIONS
function openRecipeInfo(event) {
  fetch('https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/recipes/recipeData')
    .then(response => response.json())
    .then(data => {
      fullRecipeInfo.style.display = "inline";
      let recipeId = event.path.find(e => e.id).id;
      let recipe = data.recipeData.find(recipe => recipe.id === Number(recipeId));

      domUpdates.generateRecipeTitle(recipe, generateIngredients(recipe));
      domUpdates.addRecipeImage(recipe);
      domUpdates.generateInstructions(recipe);
      fullRecipeInfo.insertAdjacentHTML("beforebegin", "<section id='overlay'></div>");
    })
    .catch(error => console.log(error.message));

}

function generateIngredients(recipe) {
  return recipe && recipe.ingredients.map(i => {
    let name = allIngredients.find(ing => ing.id === i.id).name;
    return `<li>${domUpdates.capitalize(name)} (${i.quantity.amount} ${i.quantity.unit})</li>`
  }).join("");
}

// SEARCH RECIPES
function pressEnterSearch(event) {
  event.preventDefault();
  searchRecipes();
}

function searchRecipes() {
  fetch('https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/recipes/recipeData')
    .then(response => response.json())
    .then(data => {
      let matchedRecipes = data.recipeData.filter(recipe => {
        return recipe.name.toLowerCase().includes(searchInput.value.toLowerCase());
      });
      displayRecipes(matchedRecipes);
    })
    .catch(error => console.log(error.message))
}

function filterNonSearched(filtered) {
  let found = recipes.filter(recipe => {
    let ids = filtered.map(f => f.id);
    return !ids.includes(recipe.id)
  })
  hideUnselectedRecipes(found);
}

function createRecipeObject(recipes) {
  recipes = recipes.map(recipe => new Recipe(recipe));
  return recipes
}

function showAllRecipes() {
  fetch('https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/recipes/recipeData')
    .then(response => response.json())
    .then(data => {
      displayRecipes(data.recipeData);
      domUpdates.showWelcomeBanner();
    })
    .catch(error => console.log(error.message));
}

function displayRecipes(recipesToDisplay) {
  $('.recipe-card').css('display', 'none');

  recipesToDisplay.forEach(recipe => {
    let domRecipe = '#' + recipe.id;
    $(domRecipe).css('display', 'block');
  });
}

// CREATE AND USE PANTRY
function findCheckedPantryBoxes() {
  let pantryCheckboxInfo = [...$('.pantry-checkbox:checked')].map(item => item.dataset.id);

  fetch('https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/recipes/recipeData')
    .then(response => response.json())
    .then(data => {
      let recipes = data.recipeData.filter(recipe => {
        return pantryCheckboxInfo.every(ingredient => {
          let ingredientIds = recipe.ingredients.map(ingredient => ingredient.id);
          return ingredientIds.includes(Number(ingredient));
        });
      });
      displayRecipes(recipes);
    })
    .catch(err => console.log(err.message));

}

function findRecipesWithCheckedIngredients(selected) {
  let recipeChecker = (arr, target) => target.every(v => arr.includes(v));
  let ingredientNames = selected.map(item => {
    return item.id;
  })
  recipes.forEach(recipe => {
    let allRecipeIngredients = [];
    recipe.ingredients.forEach(ingredient => {
      allRecipeIngredients.push(ingredient.name);
    });
    if (!recipeChecker(allRecipeIngredients, ingredientNames)) {
      let domRecipe = document.getElementById(`${recipe.id}`);
      domRecipe.style.display = "none";
    }
  })
}
