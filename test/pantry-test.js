import { expect } from 'chai';

import Pantry from '../src/pantry';
import data from '../src/data/users-data';
import ingredientsData from '../src/data/ingredient-data';

describe('Pantry', function() {
  let pantry;
  let userInfo;
  let recipe;
  let recipe2;

  before(function() {
    userInfo = data[0].pantry;
    pantry = new Pantry(userInfo);

    recipe = {
      name: 'Chicken Parm',
      ingredients: [
        {
          "name": "all purpose flour",
          "id": 20081,
          "quantity": {
            "amount": 18.5,
            "unit": "c"
          }
        },
        {
          "name": "baking soda",
          "id": 18372,
          "quantity": {
            "amount": 0.5,
            "unit": "tsp"
          }
        }
      ]};

    recipe2 = {
      name: 'Chicken Parm',
      ingredients: [
        {
          "name": "all purpose flour",
          "id": 20081,
          "quantity": {
            "amount": 6.5,
            "unit": "c"
          }
        },
        {
          "name": "baking soda",
          "id": 18372,
          "quantity": {
            "amount": 0.5,
            "unit": "tsp"
          }
        }
      ]};
  });

  it('should be a function', function() {
    expect(Pantry).to.be.a('function');
  });

  it('should initialize with ingredients', function() {
    expect(pantry.ingredients[0].ingredient).to.eq(11477);
  });

  it('can match an ingredient from a recipe to one from a recipe', function() {
    console.log(pantry.findMatchingIngredient(recipe.ingredients[0]));
    expect(pantry.findMatchingIngredient(recipe.ingredients[0])).to.equal(pantry.ingredients[6]);
  })

  it('can find the ingredients still needed for a recipe', function() {
    expect(pantry.findMissingIngredients(recipe)[0].amountNeeded).to.equal(2.5);
  });

  it('can calculate the cost of missing ingredients', function() {
    expect(pantry.calculateCost(recipe, ingredientsData)).to.equal('$3.55');
  });

  it('can add missing ingredients to the pantry for a recipe', function() {
    pantry.addRequiredIngredients(recipe);
    expect(pantry.findMatchingIngredient(recipe.ingredients[0]).amount).to.equal(18.5);
  });

  it('can remove ingredients to cook a recipe', function() {
    pantry.addRequiredIngredients(recipe);
    pantry.cookRecipe(recipe);
    expect(pantry.findMatchingIngredient(recipe.ingredients[0])).to.equal(undefined);
  });
});
