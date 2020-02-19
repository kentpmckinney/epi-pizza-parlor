/* ****************************************************************************************
  BUSINESS LOGIC
*/

// Collection of item types
function Catalog() {
  this.types = [];
  this.new = function(id, name, description, baseCost, addOns){
    const type = new Type(id, name, description, baseCost, addOns);
    this.types.push(type);
    return type;
  }
  this.find = function(name) {
    let matchingType = {};
    this.types.forEach(function(type){
      if (type.name == name) matchingType = type;
    });
    return matchingType;
  }
  this.list = function(){
    console.table(this.types);
  }
}

// Defines an item type
function Type(id, name, description, baseCost, addOns) {
  this.id = id;
  this.name = name;
  this.isTaxable;
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
  this.list = function() {
    console.table(this.orders);
  }
}

// Defines an order, collection of items
function Order(number) {
  this.number = number;
  this.items = [];
  this.tax = 0;
  this.tip = 0;
  this.deliveryFee = 0;
  this.isDineIn = false;
  this.totalDue = 0;
  this.paymentCollected = 0;
  this.add = function(type){
    const item = new Item(type);
    this.items.push(item);
    return item;
  }
  this.list = function() {
    console.table(this);
  }
}

// Defines an item
function Item(type) {
  this.name = type.name;
  this.typeId = type.id;
  this.taxable = type.isTaxable;
  this.baseCost = type.baseCost;
  this.selectedAddOns = {};
  this.total = 0;
  this.prepNotes = "";
  this.add = function(addOn) {

  }
  this.remove = function(addOn) {

  }
}

/*
  Calculates the cost of an item
*/
Item.prototype.calculateTotal = function() {
  this.total = this.baseCost + Object.values(this.selectedAddOns).reduce(function(a, b){ a + b });
}

// Create the different products for sale
const catalog = new Catalog();
catalog.new(101, "Pepperphony Pizza", "Decadent melted faux cheese with crispy meatless pepperoni", 10.95,
  {
   "extra cheese" : 2.00
  });
catalog.new(202, "Sparkling Water", "Ice-cold pure refreshment, naturally calorie-free", 1.95);
catalog.list();

// Create the orders object
const orders = new Orders();

// Debug testing of orders
const order = orders.new();
const type = catalog.find("Pepperphony Pizza");
const availableAddOns = type.availableAddOns;
console.log(availableAddOns);
const item = order.add(type);
item.selectedAddOns = availableAddOns;
item.calculateTotal();
order.list();

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


});