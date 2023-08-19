import { recipes } from "../../data/recipes.js"; // Import des données de recettes depuis le fichier
import { displayRecipeCard } from "../templates/cards.js"; // Import de la fonction pour afficher les cartes de recettes

// Fonction pour afficher les recettes dans le conteneur
function displayRecipes(filteredRecipes) {
    const recipesContainer = document.getElementById('recipe-container');
    recipesContainer.innerHTML = ''; // Efface le contenu actuel

    // Parcours de toutes les recettes et affichage de chaque carte
    for (const recipe of filteredRecipes) {
        displayRecipeCard(recipe);
    }

    // Mise à jour du compteur de recettes affichées
    const recipeCount = document.getElementById('totalRecipeCount');
    recipeCount.textContent = `Nombre de recettes affichées : ${filteredRecipes.length}`;
}

// Fonction pour filtrer les recettes en fonction du texte de recherche
function filterRecipes(searchText) {
    const filtered = [];

    const searchTerm = searchText.toLowerCase();
    let i = 0;
    while (i < recipes.length) {
        const recipe = recipes[i];
        const name = recipe.name.toLowerCase();
        const description = recipe.description.toLowerCase();
        
        // Vérification si le nom ou la description de la recette contient le terme de recherche
        if (name.includes(searchTerm) || description.includes(searchTerm)) {
            filtered.push(recipe);
        } else {
            let ingredientMatch = false;
            let j = 0;
            const ingredients = recipe.ingredients;
            while (j < ingredients.length) {
                const ingredient = ingredients[j].ingredient.toLowerCase();
                // Vérification si un ingrédient contient le terme de recherche
                if (ingredient.includes(searchTerm)) {
                    ingredientMatch = true;
                    break;
                }
                j++;
            }
            if (ingredientMatch) {
                filtered.push(recipe);
            }
        }
        i++;
    }

    return filtered;
}

// Événement lorsque le DOM est complètement chargé
document.addEventListener('DOMContentLoaded', function() {
    const searchBar = document.getElementById('searchInput');
    searchBar.addEventListener('input', function() {
        const searchText = searchBar.value.trim();
        if (searchText.length >= 3) {
            const filteredRecipes = filterRecipes(searchText);
            displayRecipes(filteredRecipes);
        } else {
            displayRecipes(recipes); // Afficher toutes les recettes si la recherche est vide ou a moins de 3 caractères
        }
    });

    displayRecipes(recipes); // Afficher toutes les recettes au démarrage

    // Gestion des événements des boutons de menu déroulant
    const dropdownBtns = document.querySelectorAll(".dropdown-btn");
    for (const btn of dropdownBtns) {
        btn.addEventListener("click", function () {
            const parentContainer = this.closest(".menu-container");
            
            switch (parentContainer.classList.contains("open")) {
                case true:
                    parentContainer.classList.remove("open");
                    break;
                case false:
                    parentContainer.classList.add("open");
                    break;
            }
        });
    }

    // Reste de votre code ici
});
