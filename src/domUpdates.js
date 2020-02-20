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

  displayPantryInfo(pantry) {
    pantry.forEach(ingredient => {
      let ingredientHtml = `<li><input type="checkbox" class="pantry-checkbox" id="${ingredient.name}">
        <label for="${ingredient.name}">${ingredient.name}, ${ingredient.count}</label></li>`;
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
    // document.querySelector(".welcome-msg").style.display = "none";
    $(".welcome-msg").css("display", "none");
    // document.querySelector(".my-recipes-banner").style.display = "block";
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
    while (fullRecipeInfo.firstChild &&
      fullRecipeInfo.removeChild(fullRecipeInfo.firstChild));
    $('.recipe-instructions').css('display', 'none');
    $("#overlay").remove();
  }
  
};

export default  domUpdates;