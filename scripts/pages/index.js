import { recipes } from "../../data/recipes.js";
import { displayRecipeCard } from "../templates/cards.js";
import { createDeleteIconOne,createDeleteIconTwo,createListItem, capitalizeFirstLetter} from "../utils/composant.js";
// Éléments du DOM

function getElementById(id) {
	return document.getElementById(id);
}
const elements = {
	searchInput: getElementById("searchInput"),
	recipeContainer: getElementById("recipe-container"),
	ingredientListContainer:getElementById("ingredients-list"),
	ustensilListContainer: getElementById("ustensils-list"),
	applianceListContainer: getElementById("appliances-list"),
	errorElement: getElementById("error-message"),
	totalRecipesCountElement:getElementById("total-recipes-count"),
};

const searchButtons = {
	ingredients: getElementById("ingredients-search-button"),
	ustensils: getElementById("ustensils-search-button"),
	appliances: getElementById("appliances-search-button"),
};

// Point d'entrée
function init() {
	searchRecipesEvent();
	setupDropdowns();
	setupListeners();
	displayRecipes(recipes);
}

// Objets pour stocker les éléments sélectionnés
const selectedItems = {
	ingredients: [],
	ustensils: [],
	appliances: [],
};

// Affiche les recettes dans la liste
function displayRecipes(recipesToDisplay) {
	// Sélectionne l'élément HTML de la liste de recettes
	const recipeList = document.querySelector(".recipe-cards");
	// Vide la liste actuelle
	recipeList.innerHTML = "";

	// Parcourt toutes les recettes à afficher et les affiche individuellement
	recipesToDisplay.forEach((recipe) => {
		displayRecipeCard(recipe);
	});

	// Met à jour le nombre total de recettes affichées
	updateTotalRecipesCount(recipesToDisplay.length);

	// Collecte tous les ingrédients, appareils et ustensiles uniques des recettes
	const { allIngredients, allAppliances, allUstensils } = collectAllItems(recipesToDisplay);
	// Affiche les listes d'ingrédients, appareils et ustensiles uniques
	displayUniqueList("ingredients-list", allIngredients);
	displayUniqueList("appliances-list", allAppliances);
	displayUniqueList("ustensils-list", allUstensils);
}

// Collecte tous les ingrédients, ustensiles et appareils uniques
function collectAllItems(recipesToDisplay) {
	const allIngredients = [];
	const allAppliances = [];
	const allUstensils = [];

	// Parcourt toutes les recettes à afficher
	recipesToDisplay.forEach((recipe) => {
		// Collecte les ingrédients de chaque recette
		recipe.ingredients.forEach((ingredient) => {
			allIngredients.push(ingredient.ingredient);
		});
		// Collecte l'appareil de chaque recette
		allAppliances.push(recipe.appliance);
		// Collecte les ustensiles de chaque recette
		allUstensils.push(...recipe.ustensils);
	});

	return { allIngredients, allAppliances, allUstensils };
}

// Affiche une liste unique d'éléments dans un conteneur spécifié
function displayUniqueList(containerId, items) {
	const container = document.getElementById(containerId);
	container.innerHTML = "";

	const uniqueListItem = [...new Set(items.map(item => capitalizeFirstLetter(item.toLowerCase())))];
	uniqueListItem.sort();

	uniqueListItem.forEach(item => {
		const listItem = createListItem(item);

		if (selectedItems.ingredients.includes(item) ||
        selectedItems.ustensils.includes(item) ||
        selectedItems.appliances.includes(item)) {
			const deleteIcon = createDeleteIconOne();
			listItem.classList.add("selected","d-flex");
			listItem.appendChild(deleteIcon);
 
		}
		container.appendChild(listItem);

		listItem.addEventListener("click", toggleSelectedItem);
	});
}


function updateSelectedTag(item, action) {
	const selectedTag = document.getElementById("selected-items-list");
	const existingTag = Array.from(selectedTag.querySelectorAll("li")).find(tag => tag.textContent === item);

	if (action === "add" && !existingTag) {
		const listTag = document.createElement("li");
		listTag.textContent = item;
		listTag.className = "tag-list";
		const deleteIcon = createDeleteIconTwo();
		listTag.appendChild(deleteIcon);
		selectedTag.appendChild(listTag);

		deleteIcon.addEventListener("click", function () {
			selectedTag.removeChild(listTag);
			removeSelectedItem(item);
			searchRecipes();
		});
	} else if (action === "remove" && existingTag) {
		selectedTag.removeChild(existingTag);
	}
}
// Fonction pour supprimer un élément sélectionné
function removeSelectedItem(item) {
	for (const property of Object.keys(selectedItems)) {
		if (selectedItems[property].includes(item)) {
			const index = selectedItems[property].indexOf(item);
			if (index !== -1) {
				selectedItems[property].splice(index, 1);
			}
			return; // Quitte la fonction après avoir supprimé l'élément
		}
	}
}

function toggleSelectedItem(event) {
	const listItem = event.target;
	const selectedItem = listItem.getAttribute("data-item");
	const parentListId = listItem.parentElement.id;

	const idToPropertyMap = {
		"ingredients-list": "ingredients",
		"ustensils-list": "ustensils",
		"appliances-list": "appliances",
	};

	if (parentListId && idToPropertyMap[parentListId]) {
		const selectedProperty = idToPropertyMap[parentListId];

		if (!selectedItems[selectedProperty].includes(selectedItem)) {
			selectedItems[selectedProperty].push(selectedItem);
			updateSelectedTag(selectedItem, "add");
		} else {
			removeSelectedItem(selectedItem);
			updateSelectedTag(selectedItem, "remove");
		}

		displayUniqueList(parentListId, selectedItems[selectedProperty]);
		searchRecipes();
	}
}



// Gère la saisie dans la barre de recherche principale
function handleSearchInputChange(searchType) {
	return function (event) {
		const searchTerm = event.target.value.toLowerCase();
		const searchInput = document.getElementById(`${searchType}-search`);
		const listItems = document.querySelectorAll(`#${searchType}-list .list-item`);
		const buttonDelete = document.getElementById(`${searchType}-delete`);

		buttonDelete.style.display = searchTerm ? "block" : "none";

		listItems.forEach(item => {
			const itemName = item.getAttribute("data-item").toLowerCase();

			if (itemName.includes(searchTerm)) {
				item.style.display = "block";
			} else {
				item.style.display = "none";
			}
		});

		// Gestion du clic sur le bouton de suppression
		buttonDelete.addEventListener("click", function () {
			searchInput.value = ""; // Réinitialiser la valeur du champ de recherche
			buttonDelete.style.display = "none";

			// Restaurer la visibilité de tous les éléments de la liste
			listItems.forEach(item => {
				item.style.display = "block";
			});
		});
	};
}
// Gère le clic sur le bouton de recherche pour les ingrédients, ustensiles et appareils
function handleSearchButtonClick(searchType) {
	return function (event) {
		event.preventDefault(); // Empêche l'actualisation de la page

		const searchInput = document.getElementById(`${searchType}-search`);
		const searchValue = searchInput.value.trim();

		// Vérifie si la valeur est composée uniquement de caractères alphanumériques
		if (/^[a-zA-Z0-9\s]+$/.test(searchValue)) {
			selectedItems[searchType].push(searchValue);

			// Utilise la nouvelle fonction pour gérer le clic sur le bouton de suppression
			handleDeleteSelectedItem(searchValue)();

			searchRecipes(); // Appel de la fonction de recherche pour mettre à jour les recettes filtrées
		} 
	};
}


// Fonction qui gère le clic sur le bouton de suppression d'un élément sélectionné
function handleDeleteSelectedItem(item) {
	return function () {
		const selectedTag = document.getElementById("selected-items-list");
		const listTag = document.createElement("li");
		listTag.textContent = `${item}`;
		listTag.className = "tag-list";
		const deleteIcon = createDeleteIconTwo();
		listTag.appendChild(deleteIcon);
		listTag.appendChild(deleteIcon);
		selectedTag.appendChild(listTag);

		deleteIcon.addEventListener("click", function () {
			selectedTag.removeChild(listTag);
			removeSelectedItem(item);
			searchRecipes(); // Appel de la fonction de recherche pour mettre à jour les recettes filtrées
		});
	};
}

// Fonction de recherche de recettes
function searchRecipes() {
	// Récupère le terme de recherche saisi par l'utilisateur et le convertit en minuscules
	const searchTerm = elements.searchInput.value.toLowerCase();

	// Vérifie si la longueur du terme de recherche est supérieure ou égale à 3 caractères
	if (searchTerm.length >= 3) {
		// Tableau pour stocker les recettes filtrées par la recherche
		const filteredBySearchRecipes = [];
    
		// Parcourt toutes les recettes
		for (let i = 0; i < recipes.length; i++) {
			const recipe = recipes[i];
			let isMatch = false;
			let j = 0;

			// Parcourt les ingrédients de la recette actuelle
			while (!isMatch && j < recipe.ingredients.length) {
				const ingredient = recipe.ingredients[j].ingredient.toLowerCase();

				// Vérifie si le terme de recherche se trouve dans le nom de la recette,
				// la description de la recette ou l'ingrédient actuel
				if (recipe.name.toLowerCase().indexOf(searchTerm) !== -1 ||
            recipe.description.toLowerCase().indexOf(searchTerm) !== -1 ||
            ingredient.indexOf(searchTerm) !== -1) {
					isMatch = true; // Indique qu'il y a une correspondance
				} else {
					j++; // Passe à l'ingrédient suivant
				}
			}

			// Si une correspondance est trouvée, ajoute la recette au tableau filtré
			if (isMatch) {
				filteredBySearchRecipes[filteredBySearchRecipes.length] = recipe; 
			}
		}

		// Filtrer davantage les recettes en fonction des éléments sélectionnés 
		const filteredRecipes = filterRecipesBySelectedItems(filteredBySearchRecipes);

		// Affiche les recettes filtrées
		displayRecipes(filteredRecipes);

		// Met à jour le nombre total de recettes affichées
		updateTotalRecipesCount(filteredRecipes.length);

		// Si aucune recette ne correspond à la recherche, affiche un message d'erreur
		if (filteredRecipes.length === 0) {
			displayErrorAndSuggest(searchTerm);
		} else {
			clearError(); // Efface tout message d'erreur précédent
		}
	} else {
		// Si le terme de recherche est trop court, affiche toutes les recettes filtrées par les éléments sélectionnés
		const filteredRecipesItems = filterRecipesBySelectedItems();
		displayRecipes(filteredRecipesItems);

		// Met à jour le nombre total de recettes affichées
		updateTotalRecipesCount(filteredRecipesItems.length);

		// Efface tout message d'erreur précédent
		clearError();
	}
}


// Filtrer les recettes en fonction des éléments sélectionnés
function filterRecipesBySelectedItems(searchFilteredRecipes) {
	// Vérifie si la liste de recettes filtrées est fournie, sinon utilise la liste de recettes complète.
	if (!searchFilteredRecipes) {
		searchFilteredRecipes = recipes; // Assurez-vous que la variable recipes est correctement définie.
	}

	// Convertit les éléments sélectionnés en minuscules pour une comparaison insensible à la casse.
	const selectedIngredients = selectedItems.ingredients.map((ingredient) =>
		ingredient.toLowerCase()
	);

	const selectedUstensils = selectedItems.ustensils.map((ustensil) =>
		ustensil.toLowerCase()
	);

	const selectedAppliances = selectedItems.appliances.map((appliance) =>
		appliance.toLowerCase()
	);

	// Filtre les recettes en fonction des éléments sélectionnés.
	const filteredRecipes = searchFilteredRecipes.filter((recipe) => {
		// Vérifie si tous les ingrédients sélectionnés sont inclus dans la recette.
		const ingredientsMatch = selectedIngredients.every((ingredient) =>
			recipe.ingredients.some((recipeIngredient) =>
				recipeIngredient.ingredient.toLowerCase().includes(ingredient)
			)
		);

		// Vérifie si tous les ustensiles sélectionnés sont inclus dans la recette.
		const ustensilsMatch = selectedUstensils.every((ustensil) =>
			recipe.ustensils.some((recipeUstensil) =>
				recipeUstensil.toLowerCase().includes(ustensil)
			)
		);

		// Vérifie si l'appareil sélectionné est inclus dans la recette.
		const appliancesMatch = selectedAppliances.every((appliance) =>
			recipe.appliance.toLowerCase().includes(appliance)
		);

		// Renvoie true si la recette satisfait tous les critères de sélection.
		return ingredientsMatch && ustensilsMatch && appliancesMatch;
	});

	// Renvoie la liste des recettes filtrées.
	return filteredRecipes;
}



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
		suggestionButton.className = ("suggestion border-0 rounded bg-warning" );
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
// Met en place les écouteurs pour les dropdowns et la recherche
function setupListeners() {
	elements.searchInput.addEventListener("input", searchRecipes);
	document.getElementById("ingredients-search").addEventListener("input", handleSearchInputChange("ingredients"));
	document.getElementById("ustensils-search").addEventListener("input", handleSearchInputChange("ustensils"));
	document.getElementById("appliances-search").addEventListener("input", handleSearchInputChange("appliances"));
}

for (const type in searchButtons) {
	const button = searchButtons[type];
	button.addEventListener("click", handleSearchButtonClick(type));
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
// Exécute l'initialisation lorsque la page est chargée
window.onload = init;
