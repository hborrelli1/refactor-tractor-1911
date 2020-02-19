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
  }

  // showAllRecipes(recipes) {
  //   recipes.forEach(recipe => {
      // let domRecipe = `#${recipe.id}`;
      // $(domRecipe).css("display", "block");
  //   });
  //   this.showWelcomeBanner();
  // }

  // findCheckedBoxes() {
  //   let tagCheckboxes = $(".checked-tag");
  //   let checkboxInfo = Array.from(tagCheckboxes)
  //   let selectedTags = checkboxInfo.filter(box => {
  //     return box.checked;
  //   })
  //   this.findTaggedRecipes(selectedTags);
  // },

  // findTaggedRecipes(selected) {
  //   let filteredResults = [];
  //   selected.forEach(tag => {
  //     let allRecipes = recipes.filter(recipe => {
  //       return recipe.tags.includes(tag.id);
  //     });
  //     allRecipes.forEach(recipe => {
  //       if (!filteredResults.includes(recipe)) {
  //         filteredResults.push(recipe);
  //       }
  //     })
  //   });
  //   this.showAllRecipes();
  //   if (filteredResults.length > 0) {
  //     filterRecipes(filteredResults);
  //   }
  // },

  // hideUnselectedRecipes(foundRecipes) {
  //   foundRecipes.forEach(recipe => {
  //     let recipeId = '#' + recipe.id;
  //     // domRecipe.style.display = "none";1
  //     $(recipeId).css('display', 'none');
  //   });
  // }



};

export default  domUpdates;
