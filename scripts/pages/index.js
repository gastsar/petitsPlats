import { recipes } from "../../data/recipes.js";
import { displayRecipeCard } from "../templates/cards.js";
import { createDeleteIconOne,createDeleteIconTwo,createListItem, capitalizeFirstLetter} from "../utils/composant.js";
// Éléments du DOM
const elements = {
  searchInput: document.getElementById("searchInput"),
  recipeContainer: document.getElementById("recipe-container"),
  ingredientListContainer: document.getElementById("ingredients-list"),
  ustensilListContainer: document.getElementById("ustensils-list"),
  applianceListContainer: document.getElementById("appliances-list"),
  errorElement: document.getElementById("error-message"),
  totalRecipesCountElement: document.getElementById("total-recipes-count"),
};

// Point d'entrée
function init() {
  searchRecipesEvent();
  setupDropdowns();
  setupListeners();
  displayRecipes(recipes);
}

// Affiche les recettes dans la liste
function displayRecipes(recipesToDisplay) {
  const recipeList = document.querySelector(".recipe-cards");
  recipeList.innerHTML = '';

  recipesToDisplay.forEach((recipe) => {
    displayRecipeCard(recipe);
  });

  updateTotalRecipesCount(recipesToDisplay.length);

  const { allIngredients, allAppliances, allUstensils } = collectAllItems(recipesToDisplay);
  displayUniqueList("ingredients-list", allIngredients);
  displayUniqueList("appliances-list", allAppliances);
  displayUniqueList("ustensils-list", allUstensils);
}

// Objets pour stocker les éléments sélectionnés
const selectedItems = {
  ingredients: [],
  ustensils: [],
  appliances: [],
};

// Collecte tous les ingrédients, ustensiles et appareils uniques
function collectAllItems(recipesToDisplay) {
  const allIngredients = [];
  const allAppliances = [];
  const allUstensils = [];

  recipesToDisplay.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      allIngredients.push(ingredient.ingredient);
    });
    allAppliances.push(recipe.appliance);
    allUstensils.push(...recipe.ustensils);
  });

  return { allIngredients, allAppliances, allUstensils };
}

// Affiche une liste unique d'éléments dans un conteneur spécifié
function displayUniqueList(containerId, items) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  const uniqueTags = [...new Set(items.map(item => capitalizeFirstLetter(item.toLowerCase())))];
  uniqueTags.sort();

  uniqueTags.forEach(item => {
    const listItem = createListItem(item);

    if (selectedItems.ingredients.includes(item) ||
        selectedItems.ustensils.includes(item) ||
        selectedItems.appliances.includes(item)) {
      const deleteIcon = createDeleteIconOne();
      listItem.classList.add('selected','d-flex');
      listItem.appendChild(deleteIcon);
 
    }
    container.appendChild(listItem);

    listItem.addEventListener('click', toggleSelectedItem);
  });
}

// Supprime un élément sélectionné
function removeSelectedItem(item) {
  if (selectedItems.ingredients.includes(item)) {
    const index = selectedItems.ingredients.indexOf(item);
    if (index !== -1) {
      selectedItems.ingredients.splice(index, 1);
    }
  } else if (selectedItems.ustensils.includes(item)) {
    const index = selectedItems.ustensils.indexOf(item);
    if (index !== -1) {
      selectedItems.ustensils.splice(index, 1);
    }
  } else if (selectedItems.appliances.includes(item)) {
    const index = selectedItems.appliances.indexOf(item);
    if (index !== -1) {
      selectedItems.appliances.splice(index, 1);
    }
  }
}
function addSelectedTag(item) {
  const selectedItemsList = document.getElementById("selected-items-list");
  const listItem = document.createElement("li");
  listItem.textContent = item;
  listItem.className = "tag-list";
  const deleteIcon = createDeleteIconTwo();
  listItem.appendChild(deleteIcon);
  selectedItemsList.appendChild(listItem);

  deleteIcon.addEventListener("click", function () {
    selectedItemsList.removeChild(listItem);
    removeSelectedItem(item);
    searchRecipes(); // Appel de la fonction de recherche pour mettre à jour les recettes filtrées
  });
}

function removeSelectedTag(item) {
  const selectedItemsList = document.getElementById("selected-items-list");
  const tags = selectedItemsList.querySelectorAll("li");
  tags.forEach((tag) => {
    if (tag.textContent === item) {
      selectedItemsList.removeChild(tag);
    }
  });
}
// Gère le clic sur le bouton de recherche pour les ingrédients, ustensiles et appareils
function handleSearchButtonClick(searchType) {
  return function () {
    const searchInput = document.getElementById(`${searchType}-search`);
    const searchValue = searchInput.value.trim();

    if (searchValue) {
      selectedItems[searchType].push(searchValue);

      const selectedItemsList = document.getElementById("selected-items-list");
      const listItem = document.createElement("li");
      listItem.textContent = `${searchValue}`;
      listItem.className = "tag-list";
      const deleteIcon = createDeleteIconTwo();
  listItem.appendChild(deleteIcon);
      listItem.appendChild(deleteIcon);
      selectedItemsList.appendChild(listItem);

      deleteIcon.addEventListener("click", function () {
        selectedItemsList.removeChild(listItem);
        removeSelectedItem(searchValue);
        searchRecipes(); // Appel de la fonction de recherche pour mettre à jour les recettes filtrées
      });

      searchRecipes(); // Appel de la fonction de recherche pour mettre à jour les recettes filtrées
    }
  };
}

// Gère le clic sur un élément de liste pour le sélectionner ou le désélectionner
function toggleSelectedItem(event) {
  const listItem = event.target;
  const selectedItem = listItem.getAttribute('data-item');

  if (!selectedItems.ingredients.includes(selectedItem) &&
      !selectedItems.ustensils.includes(selectedItem) &&
      !selectedItems.appliances.includes(selectedItem)) {
    if (listItem.parentElement.id === 'ingredients-list') {
      selectedItems.ingredients.push(selectedItem);
    } else if (listItem.parentElement.id === 'ustensils-list') {
      selectedItems.ustensils.push(selectedItem);
    } else if (listItem.parentElement.id === 'appliances-list') {
      selectedItems.appliances.push(selectedItem);
    }
    // Ajoute le tag dans le conteneur
    addSelectedTag(selectedItem);
  } else {
    removeSelectedItem(selectedItem);
    // Supprime le tag correspondant du conteneur
    removeSelectedTag(selectedItem);
  }

  displayUniqueList('ingredients-list', selectedItems.ingredients);
  displayUniqueList('ustensils-list', selectedItems.ustensils);
  displayUniqueList('appliances-list', selectedItems.appliances);

  searchRecipes(); // Appel de la fonction de recherche pour mettre à jour les recettes filtrées
}

// Gère la saisie dans la barre de recherche principale
function handleSearchInputChange(searchType) {
  return function (event) {
    const searchTerm = event.target.value.toLowerCase();
    const searchInput = document.getElementById(`${searchType}-search`);
      const listItems = document.querySelectorAll(`#${searchType}-list .list-item`);
    const buttonDelete = document.getElementById(`${searchType}-delete`); // Remplacez 'votre-bouton' par l'ID réel de votre bouton
   
    buttonDelete.style.display = searchTerm ? 'block' : 'none';

    buttonDelete.addEventListener("click", function () {
      searchInput.value = ""; // Réinitialiser la valeur du champ de recherche
       buttonDelete.style.display = 'none';
    });
    
    
    listItems.forEach(item => {
      const itemName = item.getAttribute('data-item').toLowerCase();
      
      if (itemName.includes(searchTerm)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  };
}

// Met en place les écouteurs pour les dropdowns
function setupDropdowns() {
  const dropdownBtns = document.querySelectorAll(".dropdown-btn");

  dropdownBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const parentContainer = this.closest(".menu-container");
      parentContainer.classList.toggle("open");
    });

    btn.addEventListener("keydown", function (event) {
      if (event.key === " " || event.key === "Spacebar") {
        event.preventDefault();
        const parentContainer = this.closest(".menu-container");
        parentContainer.classList.toggle("open");
      }
    });
  });
}

// Met en place les écouteurs pour les dropdowns et la recherche
function setupListeners() {
  elements.searchInput.addEventListener("input", searchRecipes);
  document.getElementById("ingredients-search").addEventListener("input", handleSearchInputChange("ingredients"));
  document.getElementById("ustensils-search").addEventListener("input", handleSearchInputChange("ustensils"));
  document.getElementById("appliances-search").addEventListener("input", handleSearchInputChange("appliances"));
}

// Effectue la recherche de recettes
function searchRecipes() {
  const searchTerm = elements.searchInput.value.toLowerCase();

  if (searchTerm.length >= 3) {
    const filteredBySearchRecipes = recipes.filter((recipe) => {
      const nameMatch = recipe.name.toLowerCase().includes(searchTerm);
      const descriptionMatch = recipe.description.toLowerCase().includes(searchTerm);
      const ingredientMatch = recipe.ingredients.some(
        (ingredient) =>
          ingredient.ingredient.toLowerCase().includes(searchTerm)
      );

      return nameMatch || descriptionMatch || ingredientMatch;
    });

    const filteredRecipes = filterRecipesBySelectedItems(filteredBySearchRecipes);

    displayRecipes(filteredRecipes);
    updateTotalRecipesCount(filteredRecipes.length);

    if (filteredRecipes.length === 0) {
      displayErrorAndSuggest(searchTerm);
    } else {
      clearError();
    }
  } else {
    const filteredRecipes = filterRecipesBySelectedItems();
    displayRecipes(filteredRecipes);
    updateTotalRecipesCount(filteredRecipes.length);
    clearError();
  }
}

// Filtrer les recettes en fonction des éléments sélectionnés
function filterRecipesBySelectedItems(searchFilteredRecipes) {
  if (!searchFilteredRecipes) {
    searchFilteredRecipes = recipes;
  }

  const filteredRecipes = searchFilteredRecipes.filter((recipe) => {
    const selectedIngredients = selectedItems.ingredients.map((ingredient) =>
      ingredient.toLowerCase()
    );

    const selectedUstensils = selectedItems.ustensils.map((ustensil) =>
      ustensil.toLowerCase()
    );

    const selectedAppliances = selectedItems.appliances.map((appliance) =>
      appliance.toLowerCase()
    );

    const ingredientsMatch = selectedIngredients.every((ingredient) =>
      recipe.ingredients.some((recipeIngredient) =>
        recipeIngredient.ingredient.toLowerCase().includes(ingredient)
      )
    );

    const ustensilsMatch = selectedUstensils.every((ustensil) =>
      recipe.ustensils.some((recipeUstensil) =>
        recipeUstensil.toLowerCase().includes(ustensil)
      )
    );

    const appliancesMatch = selectedAppliances.every((appliance) =>
      recipe.appliance.toLowerCase().includes(appliance)
    );

    return ingredientsMatch && ustensilsMatch && appliancesMatch;
  });

  return filteredRecipes;
}

// Gestionnaires d'événements pour les boutons de recherche
const ingredientsSearchButton = document.getElementById("ingredients-search-button");
ingredientsSearchButton.addEventListener("click", handleSearchButtonClick("ingredients"));

const ustensilsSearchButton = document.getElementById("ustensils-search-button");
ustensilsSearchButton.addEventListener("click", handleSearchButtonClick("ustensils"));

const appliancesSearchButton = document.getElementById("appliances-search-button");
appliancesSearchButton.addEventListener("click", handleSearchButtonClick("appliances"));

// Met à jour le compteur total de recettes
function updateTotalRecipesCount(count) {
  const formattedCount = count < 10 ? `0${count}` : count;
  const recetteText = count === 0 ? "Recette" : "Recettes";
  elements.totalRecipesCountElement.textContent = `${formattedCount} ${recetteText}`;
}

// Efface le message d'erreur
function clearError() {
  elements.errorElement.textContent = "";
}

// Affiche un message d'erreur et des suggestions
function displayErrorAndSuggest(searchTerm) {
  const suggestionContainer = document.createElement("div");
  suggestionContainer.className= ("p-2 rounded d-flex position-absolute bottom-50 end-50 flex-column justify-content-center bg-info align-items-center"
  );

  const suggestionsParagraph = document.createElement("p");
  suggestionsParagraph.innerHTML = `Aucune recette ne contient <span class="fw-bolder">${searchTerm}</span>. Vous pouvez chercher les suggestions ou décocher le tag :`;

  const suggestionsButtonContainer = document.createElement("div");

  const suggestionButtonNames = ["Pizza", "Limonade", "Tarte au thon"];
  suggestionButtonNames.forEach((suggestionName) => {
    const suggestionButton = document.createElement("button");
    suggestionButton.classList.add(
      "suggestion",
      "border-0",
      "rounded",
      "bg-warning"
    );
    suggestionButton.textContent = suggestionName;
    suggestionsButtonContainer.appendChild(suggestionButton);
  });

  suggestionContainer.appendChild(suggestionsParagraph);
  suggestionContainer.appendChild(suggestionsButtonContainer);

  elements.errorElement.innerHTML = "";
  elements.errorElement.appendChild(suggestionContainer);

  const suggestionButtons = elements.errorElement.querySelectorAll(".suggestion");
  suggestionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      elements.searchInput.value = button.textContent;
    });
  });
}

// Ajoute un gestionnaire d'événements pour la recherche de recettes
function searchRecipesEvent() {
  const searchButton = document.getElementById("searchButton");
  searchButton.addEventListener("click", searchRecipes);
}

// Exécute l'initialisation lorsque la page est chargée
window.onload = init;
