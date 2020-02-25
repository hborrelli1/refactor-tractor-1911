class Pantry {
  constructor(ingredients) {
    this.ingredients = this.clean(ingredients);
  }

  clean(data) {
    let cleanedData = data.reduce((list, item) => {
      let exists = list.find(i => i.ingredient === item.ingredient);
      let index = list.indexOf(exists);
      exists?
        list[index].amount += item.amount:
        list.push(item);
      return list;
    }, [])
    return cleanedData.filter(item => item.amount > 0);
  }

  findMatchingIngredient(ingredient) {
    return this.ingredients.find(item => item.ingredient === ingredient.id);
  }

  findMissingIngredients(recipe) {
    let requiredIngredients = recipe.ingredients
      .map(ingredient => {
        let requiredAmount = ingredient.quantity.amount;
        let amountOnHand = this.findMatchingIngredient(ingredient) ?
          this.findMatchingIngredient(ingredient).amount :
          0;
        ingredient.amountNeeded = requiredAmount - amountOnHand;
        return ingredient;
      });
    return requiredIngredients.filter(item => item.amountNeeded > 0);
  }

  calculateCost(recipe, database) {
    let missingIngredients = this.findMissingIngredients(recipe);
    let cents = missingIngredients.reduce((sum, item) => {
      let match = database.find(ingredient => ingredient.id === item.id);
      let cost = match.estimatedCostInCents * item.amountNeeded;
      return sum + cost;
    }, 0);
    return '$' + (cents / 100).toFixed(2);
  }

  addRequiredIngredients(recipe) {
    recipe.ingredients.forEach(ingredient => {
      let matchingIngredient = this.findMatchingIngredient(ingredient);
      let ingredientIndex = this.ingredients.indexOf(matchingIngredient);
      let newAmount = ingredient.quantity.amount;
      matchingIngredient ?
        this.ingredients[ingredientIndex].amount = newAmount:
        this.ingredients.push({ingredient: ingredient.id, amount: ingredient.quantity.amount});
    });
  }

  cookRecipe(recipe) {
    let hasAllIngredients = this.findMissingIngredients(recipe).length === 0;
    if (hasAllIngredients) {
      recipe.ingredients.forEach(ingredient => {
        let matchingIngredient = this.findMatchingIngredient(ingredient);
        let ingredientIndex = this.ingredients.indexOf(matchingIngredient);
        let newAmount = matchingIngredient.amount - ingredient.quantity.amount;
        newAmount > 0 ?
          this.ingredients[ingredientIndex].amount = newAmount:
          this.ingredients.splice(ingredientIndex, 1);;
      });
    }
  }
}

export default Pantry;
