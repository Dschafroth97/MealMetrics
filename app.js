// Storage Controller

// Item Controller
const ItemCtrl = (function () {

  // Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Data structure / State
  const state = {
    items: [
      // {id: 0, name: 'Bowl of Cereal & Fruit', calories: 500},
      // {id: 1, name: 'Blueberry Poptart', calories: 350},
      // {id: 2, name: 'Grilled Tofu w/ Rice n Beans', calories: 1000}
    ],
    currentItem: null,
    totalCalories: 0
  };

  // Public methods
  return {
    getItems: function () {
      return state.items;
    },
    addItem: function (name, calories) {
      // Create ID var
      let ID;

      // Create ID
      if (state.items.length > 0) {
        ID = state.items[state.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to number
      calories = parseInt(calories);

      // Create new item
      newItem = new Item(ID, name, calories);

      // Add to items array
      state.items.push(newItem);

      return newItem;
    },
    getItemById: function (id) {
      // Null var for comparison
      let found = null;

      // Loop through items
      state.items.forEach(function (item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: function (name, calories) {
      // Calories to num
      calories = parseInt(calories);

      // Init var to compare vs
      let found = null;

      // loop through items to find correct id
      state.items.forEach(function (item) {
        if (item.id === state.currentItem.id) {

          // Set data to be edited
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function (id) {
      // Get IDs
      const ids = state.items.map(function (item) {
        return item.id;
      });

      // Get Index
      const index = ids.indexOf(id);

      // Remove item
      state.items.splice(index, 1);
    },
    setCurrentItem: function (item) {
      state.currentItem = item;
    },
    getCurrentItem: function () {
      return state.currentItem;

    },
    clearAllItems: function () {
      state.items = [];
    },
    getTotalCalories: function () {

      // Init total var to add to
      let total = 0;

      // loop through items to find total calories
      state.items.forEach(function (item) {
        total += item.calories;
      });

      // set total cal in data structure
      state.totalCalories = total;

      // return total
      return state.totalCalories;
    },
    logData: function () {
      return state;
    }
  }
})();

// UI Controller
const UICtrl = (function () {

  // UI Selectors
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }

  // Public methods
  return {
    populateItemList: function (items) {
      // Creating empty string for li
      let html = '';

      // looping through items and adding to UL 
      items.forEach(function (item) {
        html += `<li class="collection-item" id="${item.id}">
        <strong>${item.name}:</strong>
        <em>${item.calories} Calories</em>
        <a href="" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>`;
      });

      // Insert LI's
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    addListItem: function (item) {
      // Show UL
      document.querySelector(UISelectors.itemList).style.display = 'block';

      // Create LI element
      const li = document.createElement('li');

      // Add class
      li.className = 'collection-item';

      // Add ID
      li.id = `item-${item.id}`;

      // Add HTMl
      li.innerHTML = `<strong>${item.name}:</strong>
      <em>${item.calories} Calories</em>
      <a href="" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
      </a>`;

      // Insert item to UI
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },
    updateListItem: function (item) {
      // Add all li's to var
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Convert Node list into array
      listItems = Array.from(listItems);

      listItems.forEach(function (listItem) {
        const itemID = listItem.getAttribute('id');

        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}:</strong>
          <em>${item.calories} Calories</em>
          <a href="" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>`;
        }

      });

    },
    deleteListItem: function (id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();

    },
    clearInput: function () {

      // Clear name after submit
      document.querySelector(UISelectors.itemNameInput).value = '';

      // Clear calories after submit
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    addItemToForm: function () {

      // Set name of item to edit
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;

      // Set calories of item to edit
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;

      // Show edit state
      UICtrl.showEditState();
    },
    removeItems: function () {
      // Get all Li
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // turn node list into array
      listItems = Array.from(listItems);

      listItems.forEach(function (item) {
        item.remove();
      });
    },
    hideList: function () {

      // hide UL
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function (totalCalories) {

      // display total calories
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: function () {

      // clear input fields
      UICtrl.clearInput();

      // hide buttons
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';

      // Display add button
      document.querySelector(UISelectors.addBtn).style.display = 'inline';

    },
    showEditState: function () {

      // show buttons
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';

      // Hide add button
      document.querySelector(UISelectors.addBtn).style.display = 'none';

    },
    getSelectors: function () {

      return UISelectors;
    }
  }
})();

// App Controller
const App = (function (ItemCtrl, UICtrl) {

  // Load Event listeners
  const loadEventListeners = function () {

    // Get UI selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Disable submit on enter
    document.addEventListener('keypress', function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }

    });

    // Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemUpdateEdit);

    // Update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    // Delete button event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    // Back button event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

    // Clear button event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
  }

  const itemAddSubmit = function (e) {

    // Get form input from UI Controller
    const input = UICtrl.getItemInput();

    // Check for name and calorie field input
    if (input.name && input.calories !== '') {

      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // Add item to UI list
      UICtrl.addListItem(newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Clear input fields
      UICtrl.clearInput();
    }

    // prevent default behavior
    e.preventDefault();
  };

  // Update item edit

  const itemUpdateEdit = function (e) {
    if (e.target.classList.contains('edit-item')) {
      // Get list item id
      const listID = e.target.parentNode.parentNode.id;

      // Break into an array
      const listIDArr = listID.split('-');

      // Get the ID #
      const id = parseInt(listIDArr[1]);

      // Get item
      const itemToEdit = ItemCtrl.getItemById(id);

      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to form
      UICtrl.addItemToForm();
    };

    e.preventDefault();
  };

  // Update item submit
  const itemUpdateSubmit = function (e) {
    // Get item input
    const input = UICtrl.getItemInput();

    // Update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // Update UI
    UICtrl.updateListItem(updatedItem);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Clear edit state
    UICtrl.clearEditState();

    e.preventDefault();
  };

  // Delete button event
  const itemDeleteSubmit = function (e) {
    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    // Delete from UI
    UICtrl.deleteListItem(currentItem.id);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Clear edit state
    UICtrl.clearEditState();

    e.preventDefault();
  };

  // Clear items event
  const clearAllItemsClick = function () {
    // Delete all items from state
    ItemCtrl.clearAllItems();

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Remove from UI
    UICtrl.removeItems();

    // Hide UL
    UICtrl.hideList();
  };

  // Public methods
  return {
    init: function () {

      // Clear Edit state on load
      UICtrl.clearEditState();

      // Fetch items from state
      const items = ItemCtrl.getItems();

      // Check if any items
      if (items.length === 0) {

        // Hide UL if empty
        UICtrl.hideList();
      } else {

        // Populate list with items
        UICtrl.populateItemList(items);
      }

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    }
  }
})(ItemCtrl, UICtrl);

// Initialize App
App.init();