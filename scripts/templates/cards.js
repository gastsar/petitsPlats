// Import des données de recettes depuis le fichier recipes.js
  //Template cards
  export function displayRecipeCard(recipe) {
    const article = document.createElement('article');
    
    article.className = 'col ';
    const card = document.createElement('div');
    card.className = 'card h-100 rounded-4';
    card.setAttribute('data-id', recipe.id); 
    article.appendChild(card);
  
    const image = document.createElement('img');
    image.className = 'card-img-top rounded-top-4';
    image.src = `assets/images/${recipe.image}`;
    image.alt = recipe.name;
    card.appendChild(image);
  
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
  
    const name = document.createElement('h2');
    name.className = 'card-title fs-5 fw-semibold';
    name.textContent = recipe.name;
    cardBody.appendChild(name);
  
    card.appendChild(cardBody);
     
    const recetteTitre = document.createElement('h3');
    recetteTitre.className = 'text-muted text-uppercase fs-6'; 
    recetteTitre.textContent = "recette";
    cardBody.appendChild(recetteTitre);
    const description = document.createElement('p');
    description.className = 'description card-text'; 
    description.textContent = recipe.description;
    cardBody.appendChild(description);

  /* const servings = document.createElement('p');
    servings.textContent = `Servings: ${recipe.servings}`;
    card.appendChild(servings); */
    const ingrediensTitre = document.createElement('h3');
    ingrediensTitre .className = 'text-muted text-uppercase fs-6'; 
    ingrediensTitre .textContent = "Ingrédient";
    cardBody.appendChild(ingrediensTitre);
    const ingredients = document.createElement('ul');
    ingredients.className = 'row row-cols-1 row-cols-md-2 g-4 '; 
    recipe.ingredients.forEach(ingredient => {
      const item = document.createElement('li');
      item.className ='d-flex flex-column ';
      const ingrediens = document.createElement('span');
      const quantite= document.createElement('span'); 
      quantite.className = 'text-muted'; 
      ingrediens.textContent = `${ingredient.ingredient}`;
      quantite.textContent = `${ingredient.quantity} ${ingredient.unit|| '' }`;
     
      item.appendChild(ingrediens);
      item.appendChild(quantite);
      ingredients.appendChild(item);
    });
    cardBody.appendChild(ingredients);
  
    const time = document.createElement('p');
    time.className = 'time'; 
    time.textContent = `${recipe.time} min`;
    card.appendChild(time);
  
    document.querySelector('.recipe-cards').appendChild(article);

  }

/* 
// Fonction pour créer et afficher une liste dans le DOM
  export function createAndDisplayList(items, elementId) {
    const listContainer = document.getElementById(elementId);

    // Créer la barre de recherche
    const searchInputTag = document.createElement("input");
   
    searchInputTag.classList="searchTag";
    searchInputTag.type = "text";
    searchInputTag.placeholder = "Rechercher...";
    
    listContainer.appendChild(searchInputTag);

    // Créer la liste
    const list = document.createElement("ul");
    listContainer.appendChild(list);

    for (const item of items) {
        const listItem = document.createElement("li");
      
        listItem.textContent = item;
        listItem.setAttribute("data-list-item", item);

        list.appendChild(listItem);
    }
}
 */