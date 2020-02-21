/* ****************************************************************************************
  BUSINESS LOGIC
*/

/* Menu() -a collection of the types of items for sale */
function Menu() {
  this.types = [];
  this.new = (id, name, description, size, baseCost, addOns) => {
    const type = new Type(id, name, description, size, baseCost, addOns);
    this.types.push(type);
    return type;
  }
  this.find = id => {
    let matchingType;
    this.types.forEach(type => { if (type.id == id) matchingType = type; });
    return matchingType;
  }
  this.getTypes = () => { return this.types; }
}

/* Type() - a template for the items which are for sale */
function Type(id, name, description, size, baseCost, addOns) {
  this.id = id;
  this.name = name;
  this.size = size;
  this.description = description;
  this.baseCost = baseCost;
  this.availableAddOns = addOns;
}

/* Orders() - a container object to manage orders */
function Orders() {
  this.orders = []
  this.index = 1000;
  this.new = () => {
    const order = new Order(this.index++);
    this.orders.push(order);
    return order;
  };
  this.list = () => console.table(this.orders);
}

/* Order() - manages items being ordered */
function Order(number) {
  this.number = number;
  this.created = (new Date()).toLocaleDateString("en-US", 
    { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' });
  this.itemIndex = 100000;
  this.items = [];
  this.subTotal = 0;
  this.add = type => {
    const item = new Item(type);
    item.itemId = this.itemIndex++;
    this.items.push(item);
    this.updateTotal();
    return item;
  }
  this.remove = id => {
    this.items = this.items.filter(item => {
      if (item.itemId == id) return false;
      return true;
    });
    this.updateTotal();
  }
  this.updateTotal = () => {
    let total = 0;
    this.items.forEach(item => total += parseFloat(item.total));
    this.subTotal = total;
  }
  this.getItemById = id => {
    let matchingItem;
    this.items.forEach(item => { if (item.itemId == id) { matchingItem = item;} });
    return matchingItem;
  }
  this.getSubTotal = () => { return this.subTotal.toFixed(2); }
  this.getOrderNumber = () => { return this.number; }
  this.getTimeCreated = () => { return this.created; }
}

/* Item() - an item for sale */
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
  this.add = key => {
    const availableKeys = Object.keys(this.availableAddOns);
    if (availableKeys.includes(key)) {
      this.selectedAddOns[key] = this.availableAddOns[key];
      this.updateTotal();
    }
  }
  this.remove = key => {
    delete this.selectedAddOns[key];
    this.updateTotal();
  }
  this.getAvailableAddOns = () => { if (this.availableAddOns) return Object.keys(this.availableAddOns); }
}

/* Item.prototype.updateTotal() - calculates the cost of an item */
Item.prototype.updateTotal = function() {
  this.total = this.baseCost;
  let values = Object.values(this.selectedAddOns);
  if (Array.isArray(values) && values.length)
    this.total += parseFloat(values.reduce((a, b) => { return parseFloat(a) + parseFloat(b) }));
  this.total *= this.quantity;
}

/* Instantiate the menu object in global scope */
const menu = new Menu();

/* Populate the menu with items for sale */
menu.new(101, "Pepperphony Pie", "Decadent melted faux cheese with crispy meatless pepperoni", "small", 10.95,
  { "extra cheese" : "2.00", "extra pepperphony" : "1.00", "artichokes" : "1.00", "mushrooms" : "1.00" });
menu.new(102, "Pepperphony Pie", "Decadent melted faux cheese with crispy meatless pepperoni", "med", 16.95,
  { "extra cheese" : "2.00", "extra pepperphony" : "1.00", "artichokes" : "1.00", "mushrooms" : "1.00" })
menu.new(103, "Pepperphony Pie", "Decadent melted faux cheese with crispy meatless pepperoni", "large", 23.95,
  { "extra cheese" : "2.00", "extra pepperphony" : "1.00", "artichokes" : "1.00", "mushrooms" : "1.00" });
menu.new(104, "Veggie Pie", "Decadent melted faux cheese loaded with delicious vegetables", "small", 10.95,
  { "extra cheese" : "2.00", "extra pepperphony" : "1.00", "artichokes" : "1.00", "mushrooms" : "1.00" });
menu.new(105, "Veggie Pie", "Decadent melted faux cheese loaded with delicious vegetables", "med", 16.95,
  { "extra cheese" : "2.00", "extra pepperphony" : "1.00", "artichokes" : "1.00", "mushrooms" : "1.00" })
menu.new(106, "Veggie Pie", "Decadent melted faux cheese loaded with delicious vegetables", "large", 23.95,
  { "extra cheese" : "2.00", "extra pepperphony" : "1.00", "artichokes" : "1.00", "mushrooms" : "1.00" });
menu.new(201, "Sparkling Water", "Ice-cold pure refreshment, naturally calorie-free", "16oz", 1.95,
  { "cherry flavor" : "0.00", "strawberry flavor" : "0.00", "key lime flavor" : "0.00", "lemon flavor" : "0.00"});
menu.new(202, "Drip Coffee", "Rich, luxurious medium-roast fair-trade", "8oz", 1.95);
menu.new(203, "Drip Coffee", "Rich, luxurious medium-roast fair-trade", "12oz", 2.45);

/* Instantiate the orders object in global scope */
const orders = new Orders();

/* Instantiate the first order in global scope */
let order = orders.new();


/* ****************************************************************************************
  USER INTERFACE
*/

/* updateOrderUI() - update order information in the user interface */
function updateOrderUI() {
  $("#sub-total").text(order.getSubTotal());
  $("#order-number").text(order.getOrderNumber());
  $("#created-time").text(order.getTimeCreated());
}

/* $(document).ready() executes after the page loads */
$(document).ready(() => {

  /* Respond to presses of the submit button */
  $("#submit").click(e => {
    order = orders.new();
    $("#order-items").empty();
    updateOrderUI();
  });

  /* Populate the user interface */
  const types = menu.getTypes();
  types.forEach(type => {
    $("#menu-items").append(`
      <div>
        <span>${type.name} (${type.size}) ... ${type.baseCost}</span>
        <button class="add-button" id="${type.id}" value="${type.name}">Add</button>
      </div>
      <div class="menu-description">${type.description}</div>
    `);
  });

  /* Respond to the add button on menu items */
  $(".add-button").click(function(e){
    const name = this.value;
    const type = menu.find(this.id);
    const item = order.add(type);
    item.updateTotal();
    order.updateTotal();
    updateOrderUI();

    /* Create HTML for an item */
    let addOnHTML = "";
    const availableAddOns = item.getAvailableAddOns();
    if (Array.isArray(availableAddOns) && availableAddOns.length)
      availableAddOns.forEach(addon =>
        addOnHTML += `<input class="addon-checkbox" type="checkbox" value="${item.itemId}" key="${addon}"> ${addon} (+${item.availableAddOns[addon]})<br>`
      );
    $("#order-items").append(`
      <div id="${item.itemId}" class="${item.itemId % 2 ? 'even-row' : 'odd-row'}">
        <div>${type.name} (${type.size}) [${type.baseCost}] <span class="remove-item" item="${item.itemId}">[remove]</span></div>
        <div>
          <div class="addon-list">${addOnHTML}</div>
        </div>
      </div>
    `);

    /* Set the onchange event handler for the add-on checkboxes */
    $(".addon-checkbox").change(function(){
      let item = order.getItemById(this.value);
      const key = $(this).attr("key");
      $(this).prop("checked") ? item.add(key) : item.remove(key);
      order.updateTotal();
      updateOrderUI();
    });

    /* Set the onclick event handler for the clickable [remove] tag */
    $(".remove-item").click(function(){
      const itemId = $(this).attr("item");
      let item = order.getItemById(itemId);
      order.remove(itemId);
      $(`#${itemId}`).remove();
      updateOrderUI();
    });
  });

});