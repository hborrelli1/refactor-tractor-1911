let ingredientsDB = require('../src/data/ingredient-data');

class Recipe {
  constructor(recipe) {
    this.id = recipe.id;
    this.name = recipe.name;
    this.image = recipe.image;
    this.tags = recipe.tags;
    this.ingredients = recipe.ingredients;
    this.instructions = recipe.instructions;
  }
  calculateIngredientsCost() {
    let totalInCents = this.ingredients.reduce((total, item) => {
      let itemPrice = ingredientsDB.default.find(ingredient => ingredient.id === item.id).estimatedCostInCents;
      return total + itemPrice * item.quantity.amount;
    },0);
    let dollars = totalInCents / 100;

    return dollars = dollars.toLocaleString("en-US", { style: "currency", currency: "USD" });
  }
}

export default Recipe;
