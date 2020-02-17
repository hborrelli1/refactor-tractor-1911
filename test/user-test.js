import { expect } from 'chai';

import User from '../src/user';
import data from '../src/data/users-data';

describe('User', function() {
  let user;
  let userInfo;
  let recipe;
  let recipe2;

  beforeEach(function() {
    userInfo = data.users[0];
    user = new User(userInfo)

    recipe = {name: 'Chicken Parm', type: ['italian', 'dinner']};
    recipe2 = {name: 'Pork Tacos', type: ['mexican', 'dinner']};
  });

  it('should be a function', function() {
    expect(User).to.be.a('function');
  });

  it('should initialize with an id', function() {
    expect(user.id).to.eq(1);
  });

  it('should initialize with a name', function() {
    expect(user.name).to.eq('Saige O\'Kon');
  });

  it('should initialize with a pantry', function() {
    expect(user.pantry[0].ingredient).to.eq(11477);
  });

  it('should initialize with an empty favoriteRecipes array', function() {
    expect(user.favoriteRecipes).to.deep.equal([]);
  });

  it('should initialize with an empty recipesToCook array', function() {
    expect(user.recipesToCook).to.deep.equal([]);
  });

  it('should be able to save a recipe to favoriteRecipes', function() {
    user.saveRecipe(recipe);
    expect(user.favoriteRecipes[0].name).to.equal('Chicken Parm');
  });

  it('should be able to decide to cook a recipe', function() {
    user.decideToCook(recipe);
    expect(user.recipesToCook[0].name).to.equal('Chicken Parm');
  });

  it('should be able to filter favoriteRecipes by type', function() {
    user.saveRecipe(recipe);

    expect(user.filterRecipes('italian', 'favoriteRecipes')).to.deep.equal([recipe]);
    expect(user.filterRecipes('mexican', 'favoriteRecipes')).to.deep.equal([]);
  });

  it('should be able to filter recipesToCook by type', function() {
    user.decideToCook(recipe2);

    expect(user.filterRecipes('italian', 'recipesToCook')).to.deep.equal([]);
    expect(user.filterRecipes('mexican', 'recipesToCook')).to.deep.equal([recipe2]);
  });

  it('should be able to search recipes by name or ingredient', function() {
    user.saveRecipe(recipe);
    expect(user.searchForRecipe('Chicken Parm')).to.deep.equal([recipe]);
  });
});
