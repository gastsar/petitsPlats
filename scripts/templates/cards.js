// Import des données de recettes depuis le fichier recipes.js
  //Template cards
  export function displayRecipeCard(recipe) {
    const article = document.createElement('article');
    
    article.className = 'col ';
    article.setAttribute('role', 'article');
    article.setAttribute('tabIndex', '0');
    const card = document.createElement('div');
    card.className = 'card h-100 rounded-4';
    card.setAttribute('data-recipe-id', recipe.id); 
    article.appendChild(card);
  
    const image = document.createElement('img');
    image.className = 'card-img-top rounded-top-4';
    image.src = `assets/images/${recipe.image}`;
    image.alt =  `Image du ${recipe.name}`;
     card.appendChild(image);
  
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
  
    const name = document.createElement('h2');
    name.className = 'card-title fs-5 fw-semibold';
    name.textContent = recipe.name;
    name.setAttribute('role', 'heading');
name.setAttribute('aria-level', '2');
name.setAttribute('id', `recipe-name-${recipe.id}`);
    cardBody.appendChild(name);
  
    card.appendChild(cardBody);
     
    const recetteTitre = document.createElement('h3');
    recetteTitre.className = 'text-muted text-uppercase fs-6'; 
    recetteTitre.textContent = "recette";
    recetteTitre.setAttribute('role', 'heading');
recetteTitre.setAttribute('aria-level', '3');
    cardBody.appendChild(recetteTitre);
    const description = document.createElement('p');
    description.className = 'description card-text'; 
    description.textContent = recipe.description;
    cardBody.appendChild(description);


    const ingrediensTitre = document.createElement('h3');
    ingrediensTitre .className = 'text-muted text-uppercase fs-6'; 
    ingrediensTitre .textContent = "Ingrédient";
    ingrediensTitre.setAttribute('role', 'heading');
ingrediensTitre.setAttribute('aria-level', '3');
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
    time.className = 'time position-absolute top-0 end-0 m-2 bg-warning p-2 rounded-5'; 
    time.textContent = `${recipe.time} min`;
    time.setAttribute('aria-label', `Temps de préparation : ${recipe.time} minutes`);

    card.appendChild(time);
  
    document.querySelector('.recipe-cards').appendChild(article);

  };
  // Affiche un message d'erreur et des suggestions
export function displayErrorAndSuggest(searchTerm) {
  const suggestionContainer = document.createElement("div");
  suggestionContainer.classList.add(
    "p-2",
    "rounded",
    "d-flex",
    "position-absolute",
    "bottom-50",
    "end-50",
    "flex-column",
    "justify-content-center",
    "bg-info",
    "align-items-center"
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
