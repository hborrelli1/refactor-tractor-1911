import $ from 'jquery';
import users from './data/users-data';
import recipeData from  './data/recipe-data';
import ingredientData from './data/ingredient-data';
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
window.addEventListener("load", createCards);
window.addEventListener("load", findTags);

$('.show-all-btn').on("click", showAllRecipes);
$('.filter-btn').on("click", findCheckedBoxes);
$('main').on("click", addToMyRecipes);
$('.my-pantry-btn').on("click", domUpdates.toggleMenu);
$('.saved-recipes-btn').on("click", showSavedRecipes);
$('.search-btn').on("click", searchRecipes);
// $('.show-pantry-recipes-btn').on("click", findCheckedPantryBoxes);
$('#search').on("submit", pressEnterSearch);

// GENERATE A USER ON LOAD
// function generateUser() {
//   user = new User(users[Math.floor(Math.random() * users.length)]);
//   let firstName = user.name.split(" ")[0];
//   let welcomeMsg = `
//     <div class="welcome-msg">
//       <h1>Welcome ${firstName}!</h1>
//     </div>`;
//   $(".banner-image").append(welcomeMsg);
//   findPantryInfo(user);
// }
function generateUser() {
  let ingredientInfo = null;

  // grabUserInfo()

  fetch('https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/users/wcUsersData')
    .then(response => response.json())
    .then(data => {

      let randNum = Math.floor(Math.random() * data.wcUsersData.length);
      user = new User(data.wcUsersData[randNum]);

      domUpdates.displayFirstName(user);
      fetchIngredientInfo();

      // domUpdates.displayPantryInfo(pantryInfo.sort((a, b) => a.name.localeCompare(b.name)));
      // findPantryInfo(user);
    })
    .catch(error => console.log(error.message));
}

function fetchIngredientInfo() {
  fetch('https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/ingredients/ingredientsData')
    .then(response => response.json())
    .then(data => {
      allIngredients = data.ingredientsData;
      console.log('userPantry: ', user.pantry.ingredients.sort());
      domUpdates.displayPantryInfo(allIngredients, user.pantry.ingredients.sort());
      // console.log(allIngredients);
    })
    .catch(error => console.log(error.message));
}


// CREATE RECIPE CARDS
function createCards() {
  recipeData.forEach(recipe => {
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
function findTags() {
  let tags = [];
  recipeData.forEach(recipe => {
    recipe.tags.forEach(tag => {
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    });
  });
  tags.sort();

  domUpdates.listTags(tags);
}

function findCheckedBoxes() {
  let tagCheckboxes = document.querySelectorAll(".checked-tag");
  let checkboxInfo = Array.from(tagCheckboxes)
  let selectedTags = checkboxInfo.filter(box => {
    return box.checked;
  })
  findTaggedRecipes(selectedTags);
}

function findTaggedRecipes(selected) {
  let filteredResults = [];
  selected.forEach(tag => {
    let allRecipes = recipes.filter(recipe => {
      return recipe.tags.includes(tag.id);
    });
    allRecipes.forEach(recipe => {
      if (!filteredResults.includes(recipe)) {
        filteredResults.push(recipe);
      }
    })
  });
  showAllRecipes();
  if (filteredResults.length > 0) {
    filterRecipes(filteredResults);
  }
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
  let unsavedRecipes = recipes.filter(recipe => {
    return !user.favoriteRecipes.includes(recipe.id);
  });
  unsavedRecipes.forEach(recipe => {
    let domRecipe = document.getElementById(`${recipe.id}`);
    domRecipe.style.display = "none";
  });
  domUpdates.showMyRecipesBanner();
}

// CREATE RECIPE INSTRUCTIONS
function openRecipeInfo(event) {
  fullRecipeInfo.style.display = "inline";
  let recipeId = event.path.find(e => e.id).id;
  let recipe = recipeData.find(recipe => recipe.id === Number(recipeId));
  domUpdates.generateRecipeTitle(recipe, generateIngredients(recipe));
  domUpdates.addRecipeImage(recipe);
  domUpdates.generateInstructions(recipe);
  fullRecipeInfo.insertAdjacentHTML("beforebegin", "<section id='overlay'></div>");
}

function generateIngredients(recipe) {
  return recipe && recipe.ingredients.map(i => {
    return `<li>${domUpdates.capitalize(i.name)} (${i.quantity.amount} ${i.quantity.unit})</li>`
  }).join("");
}

// SEARCH RECIPES
function pressEnterSearch(event) {
  event.preventDefault();
  searchRecipes();
}

function searchRecipes() {
  showAllRecipes();
  let searchedRecipes = recipeData.filter(recipe => {
    return recipe.name.toLowerCase().includes(searchInput.value.toLowerCase());
  });
  filterNonSearched(createRecipeObject(searchedRecipes));
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
  recipes.forEach(recipe => {
    let domRecipe = document.getElementById(`${recipe.id}`);
    domRecipe.style.display = "block";
  });
  domUpdates.showWelcomeBanner();
}

// CREATE AND USE PANTRY
function findPantryInfo(user) {
  // user.pantry.forEach(item => {
  //   let itemInfo = ingredientData.find(ingredient => {
  //     return ingredient.id === item.ingredient;
  //   });
  //   let originalIngredient = pantryInfo.find(ingredient => {
  //     if (itemInfo) {
  //       return ingredient.name === itemInfo.name;
  //     }
  //   });
  //   if (itemInfo && originalIngredient) {
  //     originalIngredient.count += item.amount;
  //   } else if (itemInfo) {
  //     pantryInfo.push({name: itemInfo.name, count: item.amount});
  //   }
  // });
  // domUpdates.displayPantryInfo(pantryInfo.sort((a, b) => a.name.localeCompare(b.name)));
}
//
// function findCheckedPantryBoxes() {
//   let pantryCheckboxes = document.querySelectorAll(".pantry-checkbox");
//   let pantryCheckboxInfo = Array.from(pantryCheckboxes)
//   let selectedIngredients = pantryCheckboxInfo.filter(box => {
//     return box.checked;
//   })
//   showAllRecipes();
//   if (selectedIngredients.length > 0) {
//     findRecipesWithCheckedIngredients(selectedIngredients);
//   }
// }
//
// function findRecipesWithCheckedIngredients(selected) {
//   let recipeChecker = (arr, target) => target.every(v => arr.includes(v));
//   let ingredientNames = selected.map(item => {
//     return item.id;
//   })
//   recipes.forEach(recipe => {
//     let allRecipeIngredients = [];
//     recipe.ingredients.forEach(ingredient => {
//       allRecipeIngredients.push(ingredient.name);
//     });
//     if (!recipeChecker(allRecipeIngredients, ingredientNames)) {
//       let domRecipe = document.getElementById(`${recipe.id}`);
//       domRecipe.style.display = "none";
//     }
//   })
// }
