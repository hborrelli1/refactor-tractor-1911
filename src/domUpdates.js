import $ from 'jquery';

let domUpdates = {
  menuOpen: false,

  addToDom(recipeInfo, shortRecipeName) {
    let cardHtml = `
      <div class="recipe-card" id=${recipeInfo.id}>
        <h3 maxlength="40">${shortRecipeName}</h3>
        <div class="card-photo-container">
          <img src=${recipeInfo.image} class="card-photo-preview" alt="${recipeInfo.name} recipe" title="${recipeInfo.name} recipe">
          <div class="text">
            <div>Click for Instructions</div>
          </div>
        </div>
        <h4>${recipeInfo.tags[0]}</h4>
        <img src="./images/apple-logo-outline.png" alt="unfilled apple icon" class="card-apple-icon">
      </div>`
    $('main').append(cardHtml);
  },

  displayFirstName(user) {
    let welcomeMsg = `
    <div class="welcome-msg">
    <h1>Welcome ${user.displayFirstName()}!</h1>
    </div>`;

    $('.banner-image').append(welcomeMsg);
  },

  listTags(allTags) {
    allTags.forEach(tag => {
      let tagHtml = `<li><input type="checkbox" class="checked-tag" id="${tag}">
        <label for="${tag}">${this.capitalize(tag)}</label></li>`;
      $('.tag-list').append(tagHtml);
    });
  },

  capitalize(words) {
    return words.split(" ").map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(" ");
  },

  showWelcomeBanner() {
    $(".welcome-msg").css("display", "flex");
    $(".my-recipes-banner").css("display", "none");
  },

  displayPantryInfo(allIngredients, pantry) {
    $('.pantry-list').empty();

    pantry.forEach(i => {
      let ingredientName = allIngredients.find(ing => i.ingredient === ing.id).name;
      let ingredientHtml = `<li><input type="checkbox" class="pantry-checkbox" data-id="${i.ingredient}" id="${ingredientName}">
        <label for="${ingredientName}">${ingredientName}, ${i.amount}</label></li>`;
      $(".pantry-list").append(ingredientHtml);
    });
  },

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    if (this.menuOpen) {
      $('.drop-menu').css("display", "block");
    } else {
      $('.drop-menu').css("display", "none");
    }
  },

  showMyRecipesBanner() {
    $(".welcome-msg").css("display", "none");
    $(".my-recipes-banner").css("display", "block");
  },

  generateRecipeTitle(recipe, ingredients) {
    let recipeTitle = `
      <button id="exit-recipe-btn">X</button>
      <h3 id="recipe-title">${recipe.name}</h3>
      <h4>Ingredients</h4>
      <ul>${ingredients}</ul>`
    $('.recipe-instructions').append(recipeTitle);
  },

  addRecipeImage(recipe) {
    let background = recipe.image;
    $("#recipe-title").css("background-image", "url('" + background + "')");
  },

  generateInstructions(recipe) {
    let instructionsList = "";
    let instructions = recipe.instructions.map(i => {
      return i.instruction
    });
    instructions.forEach(i => {
      instructionsList += `<li>${i}</li>`
    });
    $('.recipe-instructions').append("<h4>Instructions</h4>");
    $('.recipe-instructions').append(`<ol>${instructionsList}</ol>`);
  },

  exitRecipe(fullRecipeInfo) {
    fullRecipeInfo.firstChild
      && fullRecipeInfo.removeChild(fullRecipeInfo.firstChild);
    $('.recipe-instructions').css('display', 'none');
    $("#overlay").remove();
  },

  generateMissingIngredients(user, recipe, allIngredients) {
    let missingIngredients = user.pantry.findMissingIngredients(recipe);
    let missingIngredientInfo = '';
    let cookButtonEnabled = (missingIngredients.length >= 1) ? `disabled="true"` : '';
    let ingredientsEnabled = (missingIngredients.length >= 1) ? '' : `disabled="true"`;
    let missingIngredientsTotal = user.pantry.calculateCost(recipe, allIngredients);

    missingIngredients.forEach(ing => {
      let name = allIngredients.find(ingredient => ingredient.id === ing.id).name;
      missingIngredientInfo += `<li>${this.capitalize(name)}: (<strong>${ing.amountNeeded} ${ing.quantity.unit}</strong>)</li>`;
    });

    this.updateRecipeModal(recipe, missingIngredientInfo, ingredientsEnabled, cookButtonEnabled, missingIngredientsTotal);
  },

  updateRecipeModal(recipe, missingIngredientInfo, ingredientsEnabled, cookButtonEnabled, missingIngredientsTotal) {
    $('.missing-ingredient-title, .recipe-missing-ingredients').remove();
    $(`button#${recipe.id}`).remove();
    $(`button[data-id='${recipe.id}']`).remove();

    $('.recipe-instructions').append("<h4 class='missing-ingredient-title'>Missing Ingredients</h4>");
    $('.recipe-instructions').append(`<ul class="recipe-missing-ingredients">${missingIngredientInfo}</ul>`);
    $('.recipe-instructions').append(`<button id="${recipe.id}" class='purchase-ingredients' ${ingredientsEnabled}>Buy Missing Ingredients <span>${missingIngredientsTotal}</span></button>`);
    $('.recipe-instructions').append(`<button data-id="${recipe.id}" class='cook-recipe' ${cookButtonEnabled}>Cook Recipe</button>`);
  }

};

export default  domUpdates;
