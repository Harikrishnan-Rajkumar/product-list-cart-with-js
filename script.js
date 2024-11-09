let cartItems = [];
let selectedItems = [];       
let addToCartContainers = document.querySelectorAll('.add-cart-container');

document.querySelectorAll('.add-cart-container').forEach(function(container) {
  let btn = container.querySelector('.add-to-cart');
  let selectedBtn = container.querySelector('.add-to-cart-selected');
  let img = container.closest('.img-conatiner').querySelector('.dessert-img');
  let title = container.closest('.img-conatiner').querySelector('.title').textContent;
  let price = container.closest('.img-conatiner').querySelector('.price').textContent;           
  
  
  btn.onclick = function() {
    btn.classList.add('d-none');
    selectedBtn.classList.remove('d-none');
    selectedBtn.classList.add('selected');
    img.classList.add('brd');
    
    let thumbnail = container.closest('.img-conatiner').querySelector('.thumbnail-img').src;
    
    let existingItem = cartItems.find(item => item.title === title && item.price === price);
    if (existingItem) {
      existingItem.qty++; 
    } else{
      cartItems.push({ title, price, qty: 1, thumbnail });
    }
    updateCart();
  };
  
  selectedBtn.querySelector('.increaseBtn').onclick = function() {
    let item = cartItems.find(function(i) {
      return i.title === title && i.price === price;
    });
    item.qty++;
    selectedBtn.querySelector('.itemCount').textContent = item.qty;
    updateCart();
  };
  
  selectedBtn.querySelector('.decreaseBtn').onclick = function() {
    let item = cartItems.find(function(i) {
      return i.title === title && i.price === price;
    });
    if (item.qty > 1) {
      item.qty--;
      selectedBtn.querySelector('.itemCount').textContent = item.qty;
    } else{
      item.qty=0;
      selectedBtn.classList.add('d-none');
      selectedBtn.classList.remove('selected');
      btn.classList.remove('d-none');   
      img.classList.remove('brd');       
    }         
    updateCart();
  };
  
  function updateCart() {
    cartItems = cartItems.filter(i => i.qty > 0);
    let totalItemCount = cartItems.reduce((total, item) => total + item.qty, 0);
    document.getElementById('cartCount').textContent = totalItemCount;
    
    let cartListContainer = document.querySelector('.cart-list');
    let emptyCartImgContainer = document.querySelector('.empty-cart-img-conatiner');
    let confirmBtnContainerEl = document.querySelector('.confirmBtn-container');
    let carbonNeutralContainerEl = document.querySelector('.carbon-neutral-container');
    let grandTotalBoxEl = document.querySelector('.totalBox');
    let grandTotalAmountEl = document.querySelector('.grandTotalAmount');
    cartListContainer.innerHTML = '';
    
    if (cartItems.length > 0) {
      cartListContainer.classList.remove('d-none');
      emptyCartImgContainer.classList.add('d-none');          
      confirmBtnContainerEl.classList.remove('d-none');
      carbonNeutralContainerEl.classList.remove('d-none');
      document.getElementById('cartContent').textContent = ''; 
      
      let grandTotal = 0;
      cartItems.forEach((item, index) => {
        let itemTotal = item.qty * parseFloat(item.price.slice(1)); 
        grandTotal += itemTotal;
        
        let cartListItem = document.createElement('div');
        cartListItem.classList.add('cart-list-item');
        cartListItem.innerHTML = `
        <div>
        <p class="cart-list-item-name">${item.title}</p>
        <p>
        <span class="item-qty">${item.qty}x</span> 
        <span class="rate">@${item.price}</span> 
        <span class="total-amount">$${(item.qty * parseFloat(item.price.slice(1))).toFixed(2)}</span>
        </p>
        </div>              
        <div class="removeBtn-container">
        <button class="removeBtn" data-index="${index}">
        </button>
        </div>
        `;
        
        cartListContainer.appendChild(cartListItem);
        let hr = document.createElement('hr');
        cartListContainer.appendChild(hr);
        grandTotalAmountEl.textContent = `$${grandTotal.toFixed(2)}`;
        
        cartListItem.querySelector('.removeBtn').addEventListener('click', (event) => {
          let itemIndex = event.target.closest('.removeBtn').getAttribute('data-index');
          cartItems.splice(itemIndex  , 1);
          
          let itemContainer = Array.from(addToCartContainers).find(container => {
            let title = container.closest('.img-conatiner').querySelector('.title').textContent;
            let price = container.closest('.img-conatiner').querySelector('.price').textContent;
            return item.title === title && item.price === price;
          });
          let btn = itemContainer.querySelector('.add-to-cart');
          let img = itemContainer.closest('.img-conatiner').querySelector('.dessert-img');
          let selectedBtn = itemContainer.querySelector('.add-to-cart-selected');
          
          selectedBtn.classList.add('d-none');  
          selectedBtn.classList.remove('selected');
          btn.classList.remove('d-none');  
          img.classList.remove('brd'); 
          updateCart();
        });
      });
      grandTotalBoxEl.classList.remove('d-none');
      grandTotalAmountEl.textContent = `$${grandTotal.toFixed(2)}`;
      
      let modalGrandTotalAmountEl = document.querySelector('.modal .grandTotalAmount');
      if (modalGrandTotalAmountEl) {
        modalGrandTotalAmountEl.textContent = `$${grandTotal.toFixed(2)}`;
      }
      
    } else {
      emptyCartImgContainer.classList.remove('d-none');          
      confirmBtnContainerEl.classList.add('d-none');
      carbonNeutralContainerEl.classList.add('d-none');
      document.getElementById('cartContent').textContent = "Your added items will appear here";
      cartListContainer.classList.add('d-none')
      grandTotalBoxEl.classList.add('d-none');;
    }
    updateModalCart();
  }
  function updateModalCart() {
    let modalCartListContainer = document.querySelector('.modal .cart-list');
    modalCartListContainer.innerHTML = '';
    
    cartItems.forEach(item => {
      let itemTotal = item.qty * parseFloat(item.price.slice(1));
      let cartListItem = document.createElement('div');
      cartListItem.classList.add('cart-list-item');
      cartListItem.innerHTML = `                      
      <div class="cart-thumbnail-container">
        <img class="cart-thumbnail-img" src="${item.thumbnail}">
      </div> 
      <div class="cart-item d-flex flex-column">
        <p>${item.title}</p>
        <p><span class="item-qty modal-item-qty">${item.qty}x</span><span class="rate">@${item.price}</span></p>
      </div>
      <div class="itemTotal-container">
        <span class="total-amount modal-total-amount">$${itemTotal.toFixed(2)}</span>
      </div>
      `;
      modalCartListContainer.appendChild(cartListItem);
      let hr = document.createElement('hr');
      modalCartListContainer.appendChild(hr);
    });
    let modalGrandTotalAmountEl = document.querySelector('.modal .grandTotalAmount');
    let grandTotal = cartItems.reduce((total, item) => total + item.qty * parseFloat(item.price.slice(1)), 0);
    modalGrandTotalAmountEl.textContent = `$${grandTotal.toFixed(2)}`;  
  }
  
  document.querySelector('.startNewOrderBtn').addEventListener('click', function() {
    cartItems = [];
    updateCart();
    document.querySelectorAll('.add-cart-container').forEach(function(container) {
      let btn = container.querySelector('.add-to-cart');
      let selectedBtn = container.querySelector('.add-to-cart-selected');
      let img = container.closest('.img-conatiner').querySelector('.dessert-img');    
      
      btn.classList.remove('d-none');
      selectedBtn.classList.add('d-none');
      selectedBtn.classList.remove('selected');
      img.classList.remove('brd');
    });
  });
});