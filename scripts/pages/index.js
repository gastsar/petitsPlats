import { recipes } from "../../data/recipes.js";
import { displayRecipeCard } from "../templates/cards.js";

function displayRecipes(filteredRecipes = recipes) {
    const recipesContainer = document.getElementById('recipe-container');
    recipesContainer.innerHTML = ''; // Efface le contenu actuel

    for (const recipe of filteredRecipes) {
        displayRecipeCard(recipe);
    }

    const recipeCount = document.getElementById('totalRecipeCount');
    recipeCount.textContent = `Nombre de recettes affichées : ${filteredRecipes.length}`;
}

displayRecipes();

    // Ajouter des écouteurs d'événements pour les boutons de menu déroulant
    const dropdownBtns = document.querySelectorAll(".dropdown-btn");
    dropdownBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            const parentContainer = this.closest(".menu-container");
            parentContainer.classList.toggle("open");
        });
    });

