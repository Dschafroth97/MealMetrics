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
    getItemById: function(id) {
      // Null var for comparison
      let found = null;

      // Loop through items
      state.items.forEach(function(item){
        if(item.id === id){
          found = item;
        }
      });
      return found;
    },
    setCurrentItem: function(item){
      state.currentItem = item;
    },
    getCurrentItem: function(){
      return state.currentItem;

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
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
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
    clearInput: function () {

      // Clear name after submit
      document.querySelector(UISelectors.itemNameInput).value = '';

      // Clear calories after submit
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    addItemToForm: function(){
      
      // Set name of item to edit
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;

      // Set calories of item to edit
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;

      // Show edit state
      UICtrl.showEditState();
    },
    hideList: function () {

      // hide UL
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function (totalCalories) {

      // display total calories
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: function(){

      // clear input fields
      UICtrl.clearInput();

      // hide buttons
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';

      // Display add button
      document.querySelector(UISelectors.addBtn).style.display = 'inline';

    },
    showEditState: function(){

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

    // Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemUpdateEdit);
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
  
  const itemUpdateEdit = function(e){
    if(e.target.classList.contains('edit-item')){
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