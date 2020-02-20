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
  // this.isTaxable = true;
  this.description = description;
  this.baseCost = baseCost;
  this.availableAddOns = addOns;
}

// Collection of orders
function Orders() {
  this.orders = []
  this.index = 1000;
  // this.taxPercent = 0;
  this.new = function(){
    const order = new Order(this.index++);
    this.orders.push(order);
    return order;
  };
  this.list = function() { console.table(this.orders); }
  // this.setTaxPercent = function(tax) { if (!isNaN(tax) && tax >= 0 && tax <= 100) this.taxPercent = tax; }
}

// Defines an order, collection of items
function Order(number) {
  this.number = number;
  this.itemCount = 0;
  this.items = [];
  // this.tax = 0;
  // this.tip = 0;
  // this.deliveryFee = 0;
  // this.isDineIn = false;
  // this.totalDue = 0;
  this.subTotal = 0;
  // this.paymentCollected = 0;
  this.add = function(type){
    const item = new Item(type);
    item.itemId = this.itemCount++;
    this.items.push(item);
    this.updateTotal();
    return item;
  }
  this.remove = function(itemId) {
    // TODO
  }
  this.updateTotal = function() {
    let total = 0;
    this.items.forEach(function(item){
      console.log(`item.total: ${item.total}`)
      total += parseFloat(item.total);
    });
    this.subTotal = total;
    // this.totalDue = this.subTotal;
  }
  this.getItemById = function(id){
    let matchingItem;
    this.items.forEach(function(item){ if (item.itemId == id) { matchingItem = item;} });
    return matchingItem;
  }
  // this.getTotalDue = function(){ return this.totalDue; }
  this.getSubTotal = function(){ 
    console.log(`order.getSubTotal, this.subTotal: ${this.subTotal}`)
    return this.subTotal;
   }
  this.list = function() { console.table(this); }
  // this.setDineIn = function(bool) { if (typeof bool === boolean) this.isDineIn = bool; }
  // this.setTip = function(tip) { if (!isNaN(tip) && tip >= 0 && tip <= 100) this.tip = tip; }
  // this.setDeliveryFee = function(fee) { if (!isNaN(fee) && fee >= 0 && fee <= 10) this.fee = fee; }
}

// Defines an item
function Item(type) {
  this.itemId = 0;
  this.name = type.name;
  this.typeId = type.id;
  // this.taxable = type.isTaxable;
  this.size = type.size;
  this.baseCost = type.baseCost;
  this.quantity = 1;
  this.availableAddOns = type.availableAddOns;
  this.selectedAddOns = {};
  this.total = 0;
  // this.prepNotes = "";
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
  const values = Object.values(this.selectedAddOns);
  if (values && values.length > 0)
    values.reduce(function(a, b){ return a + parseInt(b) });
  this.total *= this.quantity;
}

// Populate the menu with items for sale
const menu = new Menu();
menu.new(101, "Pepperphony Pizza", "Decadent melted faux cheese with crispy meatless pepperoni", "small", 10.95,
  { "extra cheese" : 2.00, "extra pepperphony" : 1.00, "artichokes" : 1.00, "mushrooms" : 1.00 });
menu.new(201, "Sparkling Water", "Ice-cold pure refreshment, naturally calorie-free", "16oz", 1.95,
  { "cherry flavor" : 0.00, "strawberry flavor" : 0.00, "key lime flavor" : 0.00, "lemon flavor" : 0.00});
//  menu.list();

// Create the orders object
const orders = new Orders();

// Debug testing of orders
const order = orders.new();
// const type = menu.find("Pepperphony Pizza");
// const item = order.add(type);
// const availableAddOns = item.getAvailableAddOns();
// availableAddOns.forEach(function(key){ item.add(key); });
// item.remove("artichokes");
// item.add("artichokes");
// item.setQuantity(2);
// order.list();


/* ****************************************************************************************
  USER INTERFACE
*/

/*
  $(document).ready() executes after the page loads
*/
$(document).ready(function(){

  // respond to size and topping selections by continually updating the final cost in the user interface
  // create a pizza object with toppings and size properties
  // create a prototype method for the cost of the pizza, keeping it simple to start
  // create user interface to choose toppings and size

  /*
    Responds to presses of the submit button
  */
  $("#form").submit(function(e){

    // Prevent screen refresh on form submission
    e.preventDefault();
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
    order.list();
    const availableAddOns = item.getAvailableAddOns();
    let addOnHTML = "";
    availableAddOns.forEach(function(key){ addOnHTML += `<input class="addon-checkbox" type="checkbox" value="${item.itemId}" key="${key}"> ${key}<br>` });
    // item.setQuantity(2);
    updateUI();
    $("#order-items").append(`
      <div>
        <div>${type.name} (${type.size})</div>
        <div>
          <div class="addon-list">${addOnHTML}</div>
        </div>
      </div>
    `);
    $(".addon-checkbox").change(function(){
      let item = order.getItemById(this.value);
      const key = $(this).attr("key");
      $(this).prop("checked") ? item.add(key) : item.remove(key);
      updateUI();
    });
  });

  function updateUI() {
    $("#sub-total").text(order.getSubTotal());
  }

});