//Séparation des fonctions de filtrage 
import { recipes } from "../../data/recipes.js";

// Fonction de filtre des recettes en fonction du terme de recherche
function filterRecipes(searchTerm) {
    const filteredRecipes = [];

    // Parcourir chaque recette et vérifier si elle correspond au terme de recherche
    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        const recipeText = (recipe.name + " " + recipe.description + " " + getIngredientNames(recipe.ingredients)).toLowerCase();
    
        if (recipeText.indexOf(searchTerm.toLowerCase()) !== -1) {
            filteredRecipes.push(recipe);
        }
    }
    
    return filteredRecipes;
}

// Fonction pour gérer l'opération de recherche en tenant compte des éléments sélectionnés
export function searchRecipes() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.trim();

    // Filtrer les recettes en fonction du terme de recherche et des éléments sélectionnés
    const filteredRecipes = filterRecipes(searchTerm);

    // Afficher les recettes filtrées
    displayAllRecipes(filteredRecipes);
   

}