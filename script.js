const API = 'https://dummyjson.com/products'
let products = [];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

const cartPanel = document.getElementById('cartPanel')
const cartToggle = document.getElementById('cartToggle')
const cartCount = document.getElementById('cartCount')

// get all products from API
async function getProducts() {
    const response = await fetch(API);
    const data = await response.json();
    products = data.products
    console.log(products);
    showProducts()
}

// show products on frontend
function showProducts() {

    const productDiv = document.getElementById('products')

    productDiv.innerHTML = '';

    products.forEach((product) => {
        productDiv.innerHTML +=
            `<div class='product'>
        <img src=${product.thumbnail}>
        <h4>${product.title}</h4>
        <h5>$${product.price}</h5>
        <button onclick='addToCart(${product.id})'>Add to cart</button>
        </div>`;
    });
}

// update local storage

function saveCart(){
    localStorage.setItem('cart', JSON.stringify(cart));
    showCart()
}

// add to cart
function addToCart(id) {
    const product = products.find((product) => product.id === id);

    const existingProduct = cart.find(item => item.id === id);

    if(existingProduct){
        existingProduct.quantity ++;
    } else{
        cart.push({
            id:product.id,
            title:product.title,
            price:product.price,
            thumbnail:product.thumbnail,
            quantity:1
        });
    }
    saveCart();
}

// show products on cart

function showCart() {
    const cartDiv = document.getElementById('cart');
    cartDiv.innerHTML = '';

    let total = 0;
    let count = 0;

    cart.forEach((product) => {
        total += product.price * product.quantity
        count += product.quantity
        cartDiv.innerHTML +=
    `<div class='cartItem'>
    <img src=${product.thumbnail}>
    <div>
    <h4>${product.title}</h4>
    <h5>$${product.price}</h5>

    <div>
    <button onclick="decrease(${product.id})">-</button>

    <span>Quantity: ${product.quantity}</span>

    <button onclick="increase(${product.id})">+</button>
    </div>

    <button onclick="removeItem(${product.id})">x</button>
    </div>`
    })
    document.getElementById('total').innerText = total.toFixed(2);
    cartCount.innerText = count;
}

// remove product
function removeItem(id){
    cart = cart.filter((product) => product.id !== id)
    saveCart()
}

//decrease
function decrease(id){
    const product = cart.find(item => item.id === id);
    product.quantity --;

    if(product.quantity === 0){
        removeItem(id);
    } else{
        saveCart();
    }
}

function increase(id){
    const product = cart.find(item => item.id === id);
    product.quantity ++;
    saveCart()
}

// open and close the cart panel
function setCartOpen(open){
    cartPanel.classList.toggle('is-closed', !open)
    cartToggle.setAttribute('aria-expanded', String(open))
}

cartToggle.addEventListener('click', () => {
    setCartOpen(cartPanel.classList.contains('is-closed'))
})

document.getElementById('cartClose').addEventListener('click', () => setCartOpen(false))

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setCartOpen(false)
})

getProducts();
showCart();
// Open by default on wide screens; start closed on small screens
setCartOpen(window.innerWidth > 900);
