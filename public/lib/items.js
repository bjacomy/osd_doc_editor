

export function getSelectedItems(items) {
  return items.filter(item => isItemSelected(item))
}

export function isItemSelected(item) {
  return item.selected || false
}

export function areAllCurrentPageItemsSelected(items) {
  
  if (!items.length) {
    return false
  }

  const unselectedItem = items.find(item => !isItemSelected(item))
  // return true if all items of the page are selected
  return unselectedItem === undefined
}

export function areAtLeastOneCurrentPageItemsSelected(items) {
  const selectedItem = items.find(item => isItemSelected(item))
  // return true if all items of the page are selected
  return selectedItem !== undefined
}
  


