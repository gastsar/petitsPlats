export function createListItem(item) {
	const listItem = document.createElement("li");
	listItem.textContent = item;
	listItem.classList.add("list-item", "mb-1");
	listItem.setAttribute("data-item", item);
	listItem.setAttribute("role", "listitem");
	return listItem;
}
export function createListTag(item) {
	const listTag = document.createElement("li");
	listTag.textContent = item;
	listTag.classList.add("tag-list", "mb-1");
	listTag.setAttribute("role", "listtag");
	return listTag;
}


export function createDeleteIconOne() {
	const deleteIcon = document.createElement("span");
	deleteIcon.style.pointerEvents = "none";
	deleteIcon.className = "delete-icon";
	deleteIcon.innerHTML = "<i class=\"bi bi-x-circle-fill\"></i>";
	return deleteIcon;
}
export function capitalizeFirstLetter(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
export function createDeleteIconTwo() {
	const deleteIcon = document.createElement("span");
	deleteIcon.className = "delete-icon";
	deleteIcon.innerHTML = "<i class=\"bi bi-x-lg\"></i>";
	return deleteIcon;
}


  
