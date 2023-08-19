import { recipes } from "../../data/recipes.js"; // Import des données de recettes depuis le fichier
import { displayRecipeCard } from "../templates/cards.js"; // Import de la fonction pour afficher les cartes de recettes

// Fonction pour afficher les recettes dans le conteneur
function displayRecipes(filteredRecipes) {
    const recipesContainer = document.getElementById('recipe-container');
    recipesContainer.innerHTML = ''; // Efface le contenu actuel

    // Parcours de toutes les recettes et affichage de chaque carte
    for (let i = 0; i < filteredRecipes.length; i++) {
        displayRecipeCard(filteredRecipes[i]);
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
        if (name.indexOf(searchTerm) !== -1 || description.indexOf(searchTerm) !== -1) {
            filtered[filtered.length] = recipe;
        } else {
            let ingredientMatch = false;
            let j = 0;
            const ingredients = recipe.ingredients;
            while (j < ingredients.length) {
                const ingredient = ingredients[j].ingredient.toLowerCase();
                // Vérification si un ingrédient contient le terme de recherche (sans utiliser includes)
                if (ingredient.indexOf(searchTerm) !== -1) {
                    ingredientMatch = true;
                    break;
                }
                j++;
            }
            if (ingredientMatch) {
                // Ajout manuel de la recette au tableau filtré
                filtered[filtered.length] = recipe;
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
    for (let i = 0; i < dropdownBtns.length; i++) {
        const btn = dropdownBtns[i];
        btn.addEventListener("click", function () {
            const parentContainer = this.closest(".menu-container");
            
            // Gestion de l'état ouvert/fermé du menu déroulant (sans utiliser classList)
            if (parentContainer.className.indexOf("open") !== -1) {
                parentContainer.className = parentContainer.className.replace(" open", "");
            } else {
                parentContainer.className += " open";
            }
        });
    }

    // Reste de votre code ici
});
