// function for buttons--- 
const clothes = document.getElementById('clothes-container');
clothes.addEventListener('mouseover', (e) => {
  e.target.style.color = 'black';
  
});
clothes.addEventListener('mouseout', (e) => {
  e.target.style.color = '';
});

window.addEventListener('load', () => {
  const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
  const checkOutState = localStorage.getItem('checkOutState');  // Check if there's a checkout state saved
  const userName = getCookie('userName');

  if (userName !== '' && userName !== null && cartItems && checkOutState === 'true') {    // If checkOutState === 'true', meaning the user has previously reached the checkout stage.

    checkOut();  // Display the checkout state if it's stored
    backToHome(); 
  }
});

// Main function to execute the Items!!!
function displayItems(id) {

  const userName = getCookie('userName');
  if(userName !== '' && userName !== null) {
    if(localStorage.getItem('finalHTML') !== null) {
      document.getElementById('main-container').innerHTML = localStorage.getItem('finalHTML');
      document.getElementById('main-container').classList.add('overlay-container');
    }
  }
  
  // Fetching the json file through fetch..works bettr thn AJAX!
  fetch('myProducts.json').then(response => response.json())
  .then((myObjects) => {

    // Filtering the user clicked filter-id's products in our json file
    const productOfProducts = myObjects.filter(product => product['filter-id'] === id).map(product => product.products).flat();

    // Modifing the collection of arrays of obj's into a HTML bootstrap Cards!
    const productInHtml = productOfProducts.map(displayProduct).join('');
    const block = document.querySelector('#main-block');
    block.innerHTML = productInHtml;

    // Making empty the html page before fetching--
    document.querySelector('.global-view').style.display = 'none';

    // Altering the image's size using loop!
    const allImg = block.querySelectorAll('img');
    allImg.forEach((img) => {
      img.style.cssText = `height: 270px; border: 1px solid rgba(211, 211, 211, 0.511); box-shadow: 0px 1px 3px 2px rgba(211, 211, 211, 0.511); border-radius: 50px;`;
    });
  })
  .catch((error) => {
    console.log('Error fetched data: ', error);
    const block = document.getElementById('main-block');
    block.innerHTML = `<h1>Error: Could not load the product data</h1>`;
  }); 
}

// Making Function for Input-search results---
document.getElementById('form').addEventListener('submit', (e) => {
  e.preventDefault();

  const userValue = document.getElementById('search').value.toLowerCase();  // userValue.toLowerCase() prevent from case-sensitive by making user's value as case-insensitive

  fetch('myProducts.json').then(response => response.json())
  .then(myObjects => {
     const matchedProductsList = myObjects.filter(object => object.keywords && object.keywords.some(keyword => keyword.toLowerCase().includes(userValue))).map(object => object.products).flat();
    
     // if matched means,...modifying that array into an html content using .map()
    if((matchedProductsList.length > 1) && (userValue !== '')) {
      const productHTML = matchedProductsList.map(displayProduct).join('');
      const block = document.querySelector('#main-block');
      block.innerHTML = productHTML;

      // Making empty the html page before fetching--
      document.querySelector('.global-view').style.display = 'none';
    }
    else {
      const block = document.querySelector('#main-block');
      block.innerHTML = `<div class="empty-dashboard-div">
                           <i id="empty-file" class="fa-regular fa-folder-open"></i>
                           <p>Sorry, there are no matches for "${userValue}"</p>
                         </div>
                         <div style="text-align:center; font-size: 25px; margin: 25px; margin-bottom: 35px;">Also You can Check the other related products</div>`;
    }

    const allImgTag = document.querySelectorAll('#main-block img');
    allImgTag.forEach(img => {
      img.style.cssText = `height: 270px; border: 1px solid rgba(211, 211, 211, 0.511); box-shadow: 0px 1px 3px 2px rgba(211, 211, 211, 0.511); border-radius: 50px;`;
    });

    document.getElementById('search').value = '';
  });
});


// Making function for the list of products....that how we  going to print!
function displayProduct(product) {   // Creating a dummy attri! (data-id) is for identifying the current Product-card!!!
  return `  <div data-id="${product['product-id']}" class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <div class="card shadow-sm" style="width: 100%;">
              <img src="${product.imgSrc}" class="card-img-top rounded" alt="${product.imgSrc}">
              <div class="card-body mb-2">
                <h5 class="card-title text-dark">${product['product-name']}</h5>
                <p class="card-text display-6">&#8377;${product.price}</p>
                <button class="btn bg-dark text-light" onclick= "addToCart(${product['product-id']},'${product['product-name']}','${product.imgSrc}',${product.price})">Add to Cart</button>
                 <span class= "greeting-msg"></span>
              </div>
            </div>
          </div> `;
          // in addToCart btn...we want ensure with adding single quotes('') inside the onclick function only for Alphabetic letters..not for 'product-id' and 'product-price' bcoz these are numbers by nature!
}

// Making function for the Home list-item to extract and print the all products of items in the O/P;
 function backToHome() {

  const userName = getCookie('userName');
  if(userName !== '' && userName !== null) {
    if(localStorage.getItem('finalHTML') !== null) {
      document.getElementById('main-container').innerHTML = localStorage.getItem('finalHTML');
      document.getElementById('main-container').classList.add('overlay-container');
    }
  }

   fetch('myProducts.json').then(response => response.json())
   .then((arrayOfObjects) => {
     // While this time.. there is no need to filter in "id" wise using filter() method...we can directly import all products and make modify into HTML cards..using the callBack function that we maked before!
     const allProducts = arrayOfObjects.map(product => product.products).flat()
     const allProductsHtml = allProducts.map(displayProduct).join('');
     const mainBlock = document.querySelector('#main-block');
     mainBlock.innerHTML = allProductsHtml;

    // Making empty the html page before fetching--
    document.querySelector('.global-view').style.display = 'none';

     // After importing all products from json file....alteru=ing the all the img tag in the "main-block" to have a same Height!!
     const allImg = mainBlock.querySelectorAll('img');
     allImg.forEach((img) => {
      img.style.cssText = `height: 270px; border: 1px solid rgba(211, 211, 211, 0.511); box-shadow: 0px 1px 3px 2px rgba(211, 211, 211, 0.511); border-radius: 50px;`;
     });
   })
   .catch((error) => {
    console.log('Error fetched data: ', error);
    const block = document.getElementById('main-block');
    block.innerHTML = `<h1>Error: Could not load the product data</h1>`;
  });
 }

 // Function for Add to Cart!    // inside the function arg, it's just an refferal to use inside the function! 
function addToCart(id, name, imgSrc, price) {
  // Checking the user's cookie!
  const userName = getCookie('userName');   // passing "userName" arg to getCookie()
  if(userName !== '' && userName !== null) {

    // Retrieve items from the localStorage and if not means retrieving the empty array[]
    let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');  
    // Note: Json.parse() => converts str into an array!..therefore, if I include an empty array means it returned as an empty srting array...to avoid this I maked an empty str array to include so, it returns as an non-string array!
  
    // This codition Intentionally make the extracted item from localStorage to an array!----
    if (!Array.isArray(cartItems)) {
      cartItems = [];  // Reset to an empty array if it's not
    }
  
    let isMatchingId = false;

    // In this condition .some() is an array method...before using this make sure the Items that we get from localStorage is an Array[];  If not means...,Foolow the above step to convert it into an array before processing!
    cartItems.forEach(item => {
      if(item.id === id) {
        alert(`The Product ${name} is already in the cart!`);
        isMatchingId = true;
        return;
      }
    });

    if(!isMatchingId) {
      cartItems.push({
        id : id,
        name : name,
        price: price,
        img : imgSrc,
        quantity : 1
      });          // if not means that id is push at the end of the localStorage
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }

     // Apply greeting msg---Better try..but this below part is only not working for 1st click...other than it's Good!!!
     const CartGreeetingMsg = document.querySelector(`[data-id="${id}"] .greeting-msg`);

     let interval = null;
      interval = setInterval(() => {
        if(CartGreeetingMsg) {
          CartGreeetingMsg.innerHTML = `<i class="fa-solid fa-circle-check"></i> Cart added!`;
          CartGreeetingMsg.style.opacity = '1';
        }
      }, 0);

      setTimeout(() => {
        clearInterval(interval);
        CartGreeetingMsg.innerHTML = '';
        CartGreeetingMsg.style.opacity = '0';
      }, 1000);


    // Create a HTML generated block to display the user clicked product's cart details in the cartItems!!!
    const overlayContainer = document.querySelector('#main-container');
    const existedCart = overlayContainer.querySelector(`#product-${id}`);     // Using querySelector..it gets the first matched "ID"!! (NOTE: It not works in id that starts with (numeric!) That's y? I used (product-id) ==>(product-10) using this way not affect the process)   
    if(existedCart) {
      return
    }

    if(overlayContainer) {
    overlayContainer.classList.add('overlay-container');
    };

  
    // Making an <h1> element with <span> to Display cookie value!
    if(!(document.getElementById('cookie-h1'))) {
      const headOne = document.createElement('h1');
      const cookieSpan = document.createElement('span');

      headOne.id = 'cookie-h1';
      headOne.setAttribute('class', 'col-12 text-center mb-4');
      cookieSpan.id = 'cookie-name';

      headOne.innerHTML = 'Welcome Mr.';
      cookieSpan.innerHTML = `${userName}`;

      headOne.appendChild(cookieSpan);
      overlayContainer.appendChild(headOne);
    }
  
    // Creating an element <div class="cart-container">
    const cartContainer = document.createElement('div');
    cartContainer.id = `product-${id}`;
    cartContainer.setAttribute("class","cart-container");
    cartContainer.innerHTML = ` <p id="para-name">Product Name: <span id="product-name">${name}</span></p>
                                 <label id="quantity">Quantity: <button id="minus-btn" onclick="subQuantity(${id})">-</button> <span class="items">1</span> <button id="plus-btn" onclick="plusQuantity(${id})">+</button></label>
                                <p id="para-price">Price: <span id="price">&#8377;${price}</span></p>
                                 <button id="delBtn" onclick="removeItem(${id},'${name}',${price},'${imgSrc}')">Delete</button>`;
  
    // Creating the Last 2 btns (Clear All) and (Check-Out)  Dynamically 
    const lastBtns1 = document.getElementById('last-btns');     // for checking if the 2 btns are there in the overlay..it ensure to avoide the duplicates!
    if(!lastBtns1) {                        // if not means
      const lastBtns = document.createElement('div');     // Creating a div and setting an id for that i.e:(<div id="last-btns">)
      lastBtns.id = 'last-btns'                           // After creating we need to make the HTML btn content to print!
      lastBtns.innerHTML = ` <button id="del-all" onclick="clearAll()">Clear All</button>
                             <button id="check" onclick="checkOut()">Check-Out</button>`;
  
      // And finally append that btns to the overlayContainer---                       
      overlayContainer.appendChild(lastBtns); 
    }
    
    // Appending the cartContainer div to overlay div!!!
     overlayContainer.insertBefore(cartContainer, document.getElementById('last-btns'));  
                                        
    // This div was the cart div.....we must update other div in below this!!!!!        
    localStorage.setItem("finalHTML", document.getElementById('main-container').innerHTML); 

    populateQuantity(id); 
  }
 else{
   const uName = prompt('Please Ensure your Name to make further Actions!!!');
 
   if(uName !== '' && uName !== null) {
      setCookie('userName', uName);
  
      // When a new user login via Prompt...It's better to clear all the existing data in localStorage related to this Shopping Website!!!
      localStorage.setItem('cartItems','');
      localStorage.setItem('finalHTML',''); 
      localStorage.setItem('checkOutState', '');
  
      let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
  
      if(!Array.isArray(cartItems)) {
        cartItems = [];
      }
  
      let isMatchingId = false;

      // In this condition .some() is an array method...before using this make sure the Items that we get from localStorage is an Array[];  If not means...,Foolow the above step to convert it into an array before processing!
      cartItems.forEach(item => {
        if(item.id === id) {
          alert(`The Product ${name} is already in the cart!`);
          isMatchingId = true;
          return;
        }
      });
  
  
      if(!isMatchingId) {
        cartItems.push({
          id : id,
          name : name,
          price: price,
          img : imgSrc,
          quantity : 1
        });
      }
  
      // After entering userName via Prompt!...insert the cartItems....dynamically
      const userName = getCookie('userName');
      document.getElementById('main-container').classList.add('overlay-container');
      const returnCartHTML = ` <h1 id="cookie-h1" class="col-12 text-center mb-4 h">Welcome Mr.<span id="cookie-name">${userName}</span></h1>
                                  <div id="product-${id}" class="cart-container">
                                    <p id="para-name">Product Name: <span id="product-name">${name}</span></p>
                                     <label id="quantity">Quantity: <button id="minus-btn" onclick="subQuantity(${id})">-</button> <span class="items">1</span> <button id="plus-btn" onclick="plusQuantity(${id})">+</button></label>
                                    <p id="para-price">Price: <span id="price">&#8377;${price}</span></p>
                                    <button id="delBtn" onclick="removeItem(${id},'${name}',${price},'${imgSrc}')">Delete</button>
                                  </div>
                        
                                  <div id="last-btns">
                                    <button id="del-all" onclick="clearAll()">Clear All</button>
                                    <button id="check" onclick="checkOut()">Check-Out</button>
                                  </div>`;
  
      localStorage.setItem('cartItems', JSON.stringify(cartItems));      
      localStorage.setItem('finalHTML', returnCartHTML);
      document.getElementById('main-container').innerHTML = returnCartHTML;
   
      populateQuantity(id);           
    }

  }

}

// Now Let's start making function for removeItem();
function removeItem(id, name, price, imgSrc) {

  // STEP-1  Getting items from the localStorage! and make them parsed--
 let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');

 if (!Array.isArray(cartItems)) {
  cartItems = [];  // Reset to an empty array if it's not 
}

 //  STEP-2  Need to filter the "product's id" and delete it frm Both array and localStorage---
 cartItems.forEach((item, index) => {
  if((item.id === id) && (item.name === name) && (item.price === price) && (item.img === imgSrc)) {
    cartItems.splice(index, 1);  
  }
 });

// Instantly Updating the changes of Respective Arrays [], into localStorage---
 localStorage.setItem('cartItems', JSON.stringify(cartItems));
 
 //  STEP-3 Now, Delete it from DOM!
 // Need to get the Product's ID to delete it out!
 const productId = document.getElementById(`product-${id}`);  // Ensure that to recieve function (arg) as an "id"  don't denote it in STRING!!
 if(productId) {
  productId.remove();
 }                    // This maeks delete the "cartContainer" from the DOM! now...

 //  STEP-4 Wants to Hide the overlayContainer---
 const overlayContainer = document.getElementById('main-container');
 const lastBtns = document.getElementById('last-btns');
 const allCartContainer = overlayContainer.querySelectorAll('.cart-container');

 // Making Perfect Condition to hide the overlayContainer only when the cartContainer.length gets === 0! 
 if(allCartContainer.length === 0) {
  overlayContainer.classList.remove('overlay-container');  // Removing the class from overlayContainer!!!
  overlayContainer.innerHTML = '';
  lastBtns.remove();                                       // Removed the lastBtnc(Check-out & Remove All) from the DOM after all the cartContainer lefts 0.
  document.cookie = "userName=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  localStorage.setItem('cartItems', '');
  localStorage.setItem('finalHTML', '');
 }
 else{
 // Atlast Save all the contents inside the overlayContainer to
 localStorage.setItem('finalHTML', document.getElementById('main-container').innerHTML);
  // Use innerHTML to save the main-container content to localStorage instead of the entire DOM node.
 }
}

function clearAll() {
  const overlayContainer = document.getElementById('main-container');

  if(overlayContainer) {
    overlayContainer.innerHTML = '';
    overlayContainer.classList.remove('overlay-container');
    localStorage.setItem('cartItems','');
    localStorage.setItem('finalHTML','');
    localStorage.setItem('checkOutState','');
    document.cookie = "userName=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  }
}

// Function for Quantity incre--
function plusQuantity(productId) {
 
  // getting overlay-container-- for..making loop through and getting all plusBtn to modify---
  const overlayContainer = document.getElementById('main-container');

  // Using overlay-container..getting all the plus-btn inside it! for event listener---
  const plusBtn = overlayContainer.querySelectorAll('#plus-btn');

  // This step is IMPORTANT--using querySelector i'm getting the exact ".items" i.e: <span>....bcoz...btn trigger OKAY..but reaction that btn triggered span tag ku dhn nadakanum!!
  let itemCount = document.querySelector(`#product-${productId} .items`);

  // adding Event Listeners for '+' btn whenever it clicks in and out...this function will trigger!
  plusBtn.forEach(plus => {
    plus.addEventListener('mousedown',(e) => {
      if(e.target.id === 'plus-btn') {
        e.target.style.cssText = `transform: translateY(3px);`;
      }
    });
  
    plus.addEventListener('mouseup',(e) => {
      if(e.target.id === 'plus-btn') {
        e.target.style.transform = '';
      }
    });
  })
  
   let currentCount = Number(itemCount.textContent);
   if(currentCount) {
     currentCount++;
     itemCount.innerHTML = currentCount;
     populateQuantity(productId);
   }
  localStorage.setItem('finalHTML', document.getElementById('main-container').innerHTML);
}


function subQuantity(productId) {

  // NOTE: Never forget to include css selector while using querySelector...

  const overlayContainer = document.getElementById('main-container');
  const subBtn = overlayContainer.querySelectorAll('#minus-btn');
  let itemCount = document.querySelector(`#product-${productId} .items`); // .items => refers to <span> tag...I.E:  currently clicked btn's current (product's id)'s present <span> tag which is inside the cartContainer!!!


  subBtn.forEach(sub => {
    sub.addEventListener('mousedown', (e) => {
      if(e.target.id === 'minus-btn') {
        e.target.style.cssText = `transform: translateY(3px);`;
      }
    });

    sub.addEventListener('mouseup', (e) => {
      if(e.target.id === 'minus-btn') {
        e.target.style.transform = '';
      }
    });
  });

   let currentCount = Number(itemCount.textContent);
   if(currentCount === 1) {
     return;
   }
   else{
     currentCount--;
     itemCount.innerHTML = currentCount;
     populateQuantity(productId);
   }
  localStorage.setItem('finalHTML', document.getElementById('main-container').innerHTML);
}

function populateQuantity(productId) {
  // getting the "cartItems" from the localStorage...
  let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');

  // getting the current Quantity count from the DOM!
  let itemCount = Number(document.querySelector(`#product-${productId} .items`).textContent);

  let isMatchingId = false;   // Initially There is no matching/repeated Product ID exists, So, It sets to false

  if(!Array.isArray(cartItems)) {
    cartItems = [];
  }

  cartItems.forEach(item => {
    if (item.id === productId) {     // NOTE:  item => item.id === productId,  In this item.id  this "id" refers to the key name of obj inside an array...that we push into it in later steps!!!
      item.quantity = itemCount;
      isMatchingId = true;           // One matching ID is exists...so, the Flag is now sets to true!
    }
  });

  // Now the flag is True, means there is matching/existed ID of product....And We making it false to push the ID and Quantity in an Obj format into an Array!
  if (!isMatchingId) {
    cartItems.push({
      id : productId,
      quantity : itemCount
    });
  }
  localStorage.setItem('cartItems', JSON.stringify(cartItems));

  // very very Important!!! to save the changes that we made in cart list..I.E: cart-quantity-count!
  localStorage.setItem('finalHTML', document.getElementById('main-container').innerHTML);
}

// Making function for checkOut()
let totalMRP = 0;     // Globally Initializing the "totalMRP" as "0", so that can get acess easily everywhere!    

function checkOut() {
  if(checkOut) {
  const overlay = document.querySelector('.check-out-overlay');
  overlay.style.display = 'block';

  const myCart = document.querySelector('.myCart');
  myCart.style.display = 'block';

  const orderSummary = document.querySelector('.check-out-bill');
  orderSummary.style.display = 'block';

  document.querySelector('.empty-bag').style.display = 'none';

  // Retrieving Data from localStorage!
  let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
  if(cartItems !== null) {

    let generatedHTML = '';

    cartItems.forEach(product => {
      generatedHTML += ` <div id="products-${product.id}" class="list-of-products">
                            <div class="product-img">
                              <img src="${product.img}" alt="">
                            </div>
                    
                            <div class="product-details">
                              <p class="product-name">${product.name}</p>
                              <p class="product-price">&#8377;${product.price}</p>
                              <p class="product-quantity">
                                <label id="qty">Qty: <button class="decrease-btn" onclick="minusQuantity(${product.id})">-</button> <span class="item" id="counts">${product.quantity}</span> <button class="increase-btn" onclick="addQuantity(${product.id})">+</button></label>
                              </p>
                              <p class="delivery"><i class="fa-solid fa-truck-fast"></i> Standard Delivery Available • Pay and Pick Available</p><hr>
                              <div class="remove-this">
                                <button onclick="removeItem1(${product.id})">Remove</button>
                              </div>
                            </div>
                         </div>`
    });

    const flexProduct = document.querySelector('.flex-product');
    flexProduct.innerHTML = generatedHTML;

    let billGeneratedHTML = '';
    const shippingPrice = 100;

    updateBill();       // First of all, the Idea behind making this function to use it anywhere we wnat to render the product's price,quantity changes this will reflect on the totalMRP!

    billGeneratedHTML += `<h2>ORDER SUMMARY</h2><hr>
                           <p class="total-amount">Total MRP <span class="total-price">&#8377;${totalMRP}</span></p>
                           <p class="tax">Tax <span>&#8377;0</span></p>
                           <p class="shipping-charges">Shipping Charges <span class="shippings">&#8377;${shippingPrice}</span></p><hr>
                           <p class="final-amnt">Total Amount Payable <span class="amount-payable">&#8377;${totalMRP + shippingPrice}</span></p>
                           <button class="proceed-to-pay-btn" onclick="proceedToPay()">PROCEED TO PAY</button>`;

   const orderSummary = document.querySelector('.check-out-bill');
   orderSummary.innerHTML = billGeneratedHTML; 

   // I'M Trying to Storing this function only IMP! process in sessionStorage!

   const checkOutState = {
      cartItems: cartItems,
      totalMRP: totalMRP,
      shippingPrice: shippingPrice,
      generatedHTML: generatedHTML,
      billGeneratedHTML: billGeneratedHTML
   }
   localStorage.setItem('checkOutState', JSON.stringify(checkOutState));
  } 
 }
}

function removeItem1(productId) {
  let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');

  cartItems.forEach((item,index) => {
    if (item.id === productId) {
      cartItems.splice(index, 1);
    }
  });

  const product = document.getElementById(`products-${productId}`);
  if(product) {
    product.remove();
  }

  // const flexProduct = document.querySelectorAll(`.flex-product #products-${productId}`);    NOTE: This technique doesn't work!!! BCOZ...that is ID (Unique). so, if that unique item deleted means quickly....this condition get Executed!(display:none;)

   const flexProduct = document.querySelector('.flex-product');
   const allCheckOutProducts = flexProduct.querySelectorAll('.list-of-products');

  if(allCheckOutProducts.length === 0) {
    const orderSummary = document.querySelector('.check-out-bill');
    orderSummary.style.display = 'none';

    const emptyBag = document.querySelector('.empty-bag');
    emptyBag.style.display = 'block';

    document.cookie = "userName=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    localStorage.setItem('cartItems', '');
    localStorage.setItem('checkOutState', '');
    localStorage.setItem('finalHTML', '');
  }

  // If User clicks the remove btn in checkOut page...that clicked item will get deleted .... also..that same item in cart List..need deletes too!....for that we need to call that respective function for that cart List items..in order to delete!
  removeItem(productId);
  localStorage.setItem('cartItems', JSON.stringify(cartItems));

  updateBill();
}

function addQuantity(productId) {
  let itemCount = document.querySelector(`#product-${productId} .items`); // .items => refers to <span> tag...I.E:  currently clicked btn's current (product's id)'s present <span> tag which is inside the cartContainer!!!
  let spanCount = document.querySelector(`#products-${productId} .item`);
  const increaseBtn = document.querySelectorAll('.increase-btn');

  increaseBtn.forEach(button => {
    button.addEventListener('mousedown',(e) => {
      if(e.target.classList.contains('increase-btn')) {
        e.target.style.cssText = `transform: translateY(3px);`;
      }
    });
  
    button.addEventListener('mouseup',(e) => {
      if(e.target.classList.contains('increase-btn')) {
        e.target.style.transform = 'none';
      }
    });
  });

  let currentCount = Number(spanCount.textContent);
  let currentCount1 = Number(itemCount.textContent);

  if(currentCount || currentCount1) {
     currentCount++;
     currentCount1++;
     spanCount.innerHTML = currentCount;
     itemCount.innerHTML = currentCount1;
     populateQuantity(productId);
  }

  updateBill();
}


function minusQuantity(productId) {
  let itemCount = document.querySelector(`#product-${productId} .items`);
  let spanCount = document.querySelector(`#products-${productId} .item`);

  const decreaseBtn = document.querySelectorAll('.decrease-btn');

  decreaseBtn.forEach(button => {
    button.addEventListener('mousedown',(e) => {
      if(e.target.classList.contains('decrease-btn')) {
        e.target.style.cssText = `transform: translateY(3px);`;
      }
    });
  
    button.addEventListener('mouseup',(e) => {
      if(e.target.classList.contains('decrease-btn')) {
        e.target.style.transform = 'none';
      }
    });
  });

  let currentCount = Number(spanCount.textContent);
  let currentCount1 = Number(itemCount.textContent);
  if((currentCount === 1) || (currentCount1 === 1)) {
   return
  }
  else {
    currentCount--;
    currentCount1--;
    spanCount.innerHTML = currentCount;
    itemCount.innerHTML = currentCount1;
    populateQuantity(productId);
  }

  updateBill();
}

function updateBill() {   // NOTE: This totalMRP is already declared Globally!
  totalMRP = 0;          // Reseting totalMRP variable to '0' will update through looping over cartItems and update! 
  const shippingPrice = 100;

  let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');

  cartItems.forEach(summary => {
    let productCost = Number(summary.price) * Number(summary.quantity);
    totalMRP += productCost;
  });

  const totalCost = document.querySelector('.total-price');
  if(totalCost) {                                              // NOTE: It is Very Important to make check whether the DOM element is available or not through IF Condition!
    totalCost.innerHTML = `&#8377;${totalMRP}`;
  }
  const amountPayable = document.querySelector('.amount-payable');
  if(amountPayable) {
    amountPayable.innerHTML = `&#8377;${totalMRP + shippingPrice}`;
  }

  // let productMrp = totalMRP + shippingPrice;
  localStorage.setItem('cartItems', JSON.stringify(cartItems));

  // Note: Here I Setting/Storing the combined data of (totalMRP and 100) in localStorage--It Works, Whenever the the quant! changes or new Product added the Bill will Auto Syn!, and while pressing the "Proceed to pay" btn, I get retrieve the data(ProductMRP) and sent that data to other page!
  // localStorage.setItem('productMrp', JSON.stringify(productMrp));
}

function goBack() {
  const overlay = document.querySelector('.check-out-overlay');
  overlay.style.display = 'none';

  const myCart = document.querySelector('.myCart');
  myCart.style.display = 'none';
}

function continueShopping() {
  const emptyBag = document.querySelector('.empty-bag');
  emptyBag.style.display = 'none';

  const overlay = document.querySelector('.check-out-overlay');
  overlay.style.display = 'none';

  const myCart = document.querySelector('.myCart');
  myCart.style.display = 'none';

  window.location.href = 'ShopIn-main.html';
}

function proceedToPay() {
  if(proceedToPay) {
    localStorage.setItem('checkOutState', 'true');
    window.location.href = "ShopIn-check-out.html";           // If we want to Open in same location/tab means, can use this!
    // window.open("check-out.html", "_blank");         // If we want to Open in other location/tab means, can use this! 
  }
}

// Final Step!!!  Making Cookie for our Application! to ensue user login;
function setCookie(cName, cValue) {
  let myCookie = cName+ '=' +cValue;
  let date = new Date();
  // date.setMinutes(date.getMinutes() + 3);
  date.setHours(date.getHours() + 1);                      // Cookie setting to 1hour!
  document.cookie = `${myCookie};expires=${date.toUTCString()};path=/`;    // DON'T leave space inB/W while setting cookie!
}
function getCookie(cName) {
  let myCookie = cName+ '=';  // setting up myCookie to get search for...
  const decodedCookie = decodeURIComponent(document.cookie);
  // decoded cookie la iruka ; padi split pannren and that signifies as an array!

  // Making split up cookie with signing ";" ==> ,
  const cookieArray = decodedCookie.split(';');  // ['name=value', 'expires=date', 'path']

  // using loop to extract values! Bcoz all the key:value of document.cookie is now an Array!
  for(let i = 0; i < cookieArray.length; i++) {
    const currentCookie = cookieArray[i].indexOf(myCookie);
    if(currentCookie !== -1) {
      let value = cookieArray[i].substring(cookieArray[i].indexOf('=')+1);
      if(value === '') {
        continue;
      }
      else{
        return value;
      }
    }
  }
  return '';   // if empty means return that empty....only after the loop finishes!
}

// Making function for go-to top
const goToTop = document.getElementById('go-to-top-btn');

window.addEventListener('scroll', () => {
  if(window.scrollY > 250) {
    goToTop.style.display = 'block';
  }
  else {
    goToTop.style.display = 'none';
  }
});

function goToTopEvent() {
  window.scrollTo({
    top : 0,
    behavior : "smooth",
  });
}



// Making function for carousel to display food items
let currentIndex = 0;      // setting current index position as 0
const productPerView = 2;    // viewport of per slide is 1(product-item)
const ulFoodContainer = document.querySelector('.product-list');    // getting ul
let allFoodItems = document.querySelectorAll('.product-item');      // getting all li
const totalFoodItems = allFoodItems.length;    // getting li's total length


function moveCarousel(direction) {
 let FoodItemsWidth = document.querySelector('.product-item').offsetWidth + 14;  // get an element's width including padding and border

 if(direction === 'front') {
   if(currentIndex + productPerView < totalFoodItems) {
     currentIndex++;
     ulFoodContainer.style.transform = `translateX(-${currentIndex * FoodItemsWidth}px)`;
   }
 }
 else if(direction === 'back') {
   if(currentIndex > 0) {
    currentIndex--;
    ulFoodContainer.style.transform = `translateX(-${currentIndex * FoodItemsWidth}px)`;
   }
 }
}

// Making function for email-validation
let emailBox = document.querySelector('#email-box-last');
emailBox.addEventListener('input', (e) => {
  e.preventDefault();

  const userEmailValue = emailBox.value;
  let mailRegex = /^[a-zA-Z0-9.-_]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if(mailRegex.test(userEmailValue) && userEmailValue !== '') {
    document.querySelector('.email-validation-quotation').style.display = 'none';
  }
  else {
    document.querySelector('.email-validation-quotation').style.display = 'block';
  }
});

document.querySelector('#email-subs-btn').addEventListener('click', () => {
  if(document.querySelector('#email-subs-btn').innerHTML = 'Subscribe') {
    document.querySelector('#email-subs-btn').innerHTML = 'Subscribed';
  }
  else {
    document.querySelector('#email-subs-btn').innerHTML = 'Subscribe';
  }

  alert('Thank You for Subscription');
})