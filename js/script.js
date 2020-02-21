/* ****************************************************************************************
  BUSINESS LOGIC
*/

// Collection of the types of items for sale
function Menu() {
  this.types = [];
  this.new = function(id, name, description, size, baseCost, addOns){
    const type = new Type(id, name, description, size, baseCost, addOns);
    this.types.push(type);
    return type;
  }
  this.find = function(name) {
    let matchingType;
    this.types.forEach(function(type){ if (type.name == name) matchingType = type; });
    return matchingType;
  }
  this.getTypes = function() { return this.types; }
  this.list = function(){ console.table(this.types); }
}

// Defines an item type
function Type(id, name, description, size, baseCost, addOns) {
  this.id = id;
  this.name = name;
  this.size = size;
  this.description = description;
  this.baseCost = baseCost;
  this.availableAddOns = addOns;
}

// Collection of orders
function Orders() {
  this.orders = []
  this.index = 1000;
  this.new = function(){
    const order = new Order(this.index++);
    this.orders.push(order);
    return order;
  };
  this.list = function() { console.table(this.orders); }
}

// Defines an order, collection of items
function Order(number) {
  this.number = number;
  var options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  var today  = new Date();
  this.created = today.toLocaleDateString("en-US", options);
  this.itemCount = 100000;
  this.items = [];
  this.subTotal = 0;
  this.add = function(type){
    const item = new Item(type);
    item.itemId = this.itemCount++;
    this.items.push(item);
    this.updateTotal();
    return item;
  }
  this.remove = function(id) {
    this.items = this.items.filter(function(item){
      if (item.itemId == id) return false;
      return true;
    });
    this.updateTotal();
  }
  this.updateTotal = function() {
    let total = 0;
    this.items.forEach(function(item){ total += parseFloat(item.total); });
    this.subTotal = total;
  }
  this.getItemById = function(id){
    let matchingItem;
    this.items.forEach(function(item){ if (item.itemId == id) { matchingItem = item;} });
    return matchingItem;
  }
  this.getSubTotal = function(){ 
    return this.subTotal.toFixed(2);
   }
  this.list = function() { console.table(this); }
  this.getOrderNumber = function() { return this.number; }
  this.getTimeCreated = function() { return this.created; }
}

// Defines an item
function Item(type) {
  this.itemId;
  this.name = type.name;
  this.typeId = type.id;
  this.size = type.size;
  this.baseCost = type.baseCost;
  this.quantity = 1;
  this.availableAddOns = type.availableAddOns;
  this.selectedAddOns = {};
  this.total = 0;
  this.add = function(key) {
    const availableKeys = Object.keys(this.availableAddOns);
    if (availableKeys.includes(key)) {
      this.selectedAddOns[key] = this.availableAddOns[key];
      this.updateTotal();
    }
  }
  this.remove = function(key) {
    delete this.selectedAddOns[key];
    this.updateTotal();
  }
  this.getAvailableAddOns = function(){ return Object.keys(this.availableAddOns); }
  this.setQuantity = function(qty) {
    if (!isNaN(qty) && qty >= 0 && qty <= 100) this.quantity = qty;
    this.updateTotal();
  }
}

/*
  Calculates the cost of an item
  Implemented as a prototype to satisfy project requirements
*/
Item.prototype.updateTotal = function() {
  this.total = this.baseCost;
  let values = Object.values(this.selectedAddOns);
  if (Array.isArray(values) && values.length)
    this.total += parseFloat(values.reduce(function(a, b){ return parseFloat(a) + parseFloat(b) }));
  this.total *= this.quantity;
}

// Populate the menu with items for sale
const menu = new Menu();
menu.new(101, "Pepperphony Pizza", "Decadent melted faux cheese with crispy meatless pepperoni", "small", 10.95,
  { "extra cheese" : "2.00", "extra pepperphony" : "1.00", "artichokes" : "1.00", "mushrooms" : "1.00" });
menu.new(201, "Sparkling Water", "Ice-cold pure refreshment, naturally calorie-free", "16oz", 1.95,
  { "cherry flavor" : "0.00", "strawberry flavor" : "0.00", "key lime flavor" : "0.00", "lemon flavor" : "0.00"});

// Create the orders object
const orders = new Orders();
let order = orders.new();


/* ****************************************************************************************
  USER INTERFACE
*/

function updateUI() {
  $("#sub-total").text(order.getSubTotal());
  $("#order-number").text(order.getOrderNumber());
  $("#created-time").text(order.getTimeCreated());
}

/*
  $(document).ready() executes after the page loads
*/
$(document).ready(function(){

  /*
    Responds to presses of the submit button
  */
  $("#submit").click(function(e){
    order = orders.new();
    $("#order-items").empty();
    updateUI();
  });

  // Populate the user interface
  const types = menu.getTypes();
  types.forEach(function(type){
    $("#menu-items").append(`
      <div>
        <span>${type.name} (${type.size}) ... ${type.baseCost}</span>
        <button class="add-button" id="${type.id}" value="${type.name}">Add</button>
      </div>
      <div class="menu-description">${type.description}</div>
    `);
  });

  // Responds to the add button on menu items
  $(".add-button").click(function(e){
    const name = this.value;
    const type = menu.find(name);
    const item = order.add(type);
    item.updateTotal();
    order.updateTotal();
    const availableAddOns = item.getAvailableAddOns();
    let addOnHTML = "";
    availableAddOns.forEach(function(addon){ addOnHTML += `<input class="addon-checkbox" type="checkbox" value="${item.itemId}" key="${addon}"> ${addon} (+${item.availableAddOns[addon]})<br>` });
    updateUI();
    $("#order-items").append(`
      <div id="${item.itemId}">
        <div>${type.name} (${type.size}) [${type.baseCost}] <span class="remove-item" item="${item.itemId}">[remove]</span></div>
        <div>
          <div class="addon-list">${addOnHTML}</div>
        </div>
      </div>
    `);

    $(".addon-checkbox").change(function(){
      let item = order.getItemById(this.value);
      const key = $(this).attr("key");
      $(this).prop("checked") ? item.add(key) : item.remove(key);
      order.updateTotal();
      updateUI();
    });

    $(".remove-item").click(function(){
      const itemId = $(this).attr("item");
      let item = order.getItemById(itemId);
      order.remove(itemId);
      $(`#${itemId}`).remove();
      updateUI();
    });
  });

});