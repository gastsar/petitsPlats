// Fonction pour créer un élément de menu
function createMenuContainer(title, idPrefix) {
    const container = document.createElement('div');
    container.classList.add('menu-container', 'rounded', 'bg-white', 'm-2');
  
    const dropdownBtn = document.createElement('div');
    dropdownBtn.id = `${idPrefix}-btn`;
    dropdownBtn.classList.add('p-2', 'dropdown-btn', 'd-flex', 'justify-content-between');
  dropdownBtn.setAttribute('role', 'button');
  dropdownBtn.setAttribute('aria-expanded', 'false');
  dropdownBtn.setAttribute('tabIndex', '0');
    const span = document.createElement('span');
    span.textContent = title;
  
    const chevronDown = document.createElement('i');
    chevronDown.classList.add('bi', 'bi-chevron-down');
  
    dropdownBtn.appendChild(span);

    dropdownBtn.appendChild(chevronDown);
  
    const dropdownContent = document.createElement('div');
    dropdownContent.classList.add('dropdown-content');
  
    const listSearch = document.createElement('div');
    listSearch.className ="list_search p-2 d-flex position-relative align-items-center justify-content-end";
  
    const input = document.createElement('input');
    input.classList.add('searchFiltre');
    input.type = 'search';
    input.id = `${idPrefix}-search`;
    input.placeholder = title.toLowerCase();
    input.setAttribute('aria-label', `Rechercher un ${idPrefix}`);
    input.setAttribute('pattern', `[a-zA-Z\s]+`);
  
    const contentButton= document.createElement('div');
    contentButton.className =" d-flex position-absolute"
    const buttonDelete = document.createElement('button');
    buttonDelete.id = `${idPrefix}-delete`;
    buttonDelete.classList.add('mr-6','rounded','btn-delete', 'border-0','bg-transparent');
    buttonDelete.setAttribute('aria-label', 'vider champs');
    const deleteIcone = document.createElement('i');
    deleteIcone.classList.add('bi', 'bi-x');
    buttonDelete.appendChild(deleteIcone);


    const buttonSearch = document.createElement('button');
    buttonSearch.type = 'submit';
    buttonSearch.id = `${idPrefix}-search-button`;
    buttonSearch.classList.add('m-1','rounded', 'border-0', 'btnFiltre','bg-transparent');
    buttonSearch.setAttribute('aria-label', 'rechercher');
    const searchIcon = document.createElement('i');
    searchIcon.classList.add('bi', 'bi-search');
 buttonSearch.appendChild(searchIcon);

  contentButton.appendChild(buttonDelete);
    contentButton.appendChild(buttonSearch);

   
    listSearch.appendChild(input);
    listSearch.appendChild(contentButton);
    
  
    const list = document.createElement('div');
    list.classList.add(`${idPrefix}-list`, 'liste-element');
    list.setAttribute('role','list');
    list.setAttribute('aria-live','polite');
    list.setAttribute('aria-label',`Liste des ${title}`);
    const errorMsg = document.createElement('p');
    errorMsg.classList.add('no-results');
    const ul = document.createElement('ul');
    ul.id = `${idPrefix}-list`;
    list.classList.add(`list-group-item`);
    list.appendChild(ul);
    list.appendChild(errorMsg);
    dropdownContent.appendChild(listSearch);
    dropdownContent.appendChild(list);
    container.appendChild(dropdownBtn);
    container.appendChild(dropdownContent);
  
    return container;
  }
  
  // Créer les menus avec les titres et les préfixes ID correspondants
  const ingredientMenu = createMenuContainer('Ingrédient', 'ingredients');
  const applianceMenu = createMenuContainer('Appareils', 'appliances');
  const utensilMenu = createMenuContainer('Ustensiles', 'ustensils');

  // Ajouter les menus au conteneur principal
  const mainContainer = document.querySelector('.main-container'); // Remplacez par le sélecteur approprié
  mainContainer.appendChild(ingredientMenu);
  mainContainer.appendChild(applianceMenu);
  mainContainer.appendChild(utensilMenu);

  