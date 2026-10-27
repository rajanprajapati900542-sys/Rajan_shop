const products = [
  {id:1,name:"Pulse Wireless Headphones",category:"Tech",price:1999,oldPrice:2499,emoji:"🎧",bg:"#e6e0fb",badge:"BESTSELLER",rating:"4.8",description:"Comfortable everyday sound"},
  {id:2,name:"Pocket Smart Speaker",category:"Tech",price:1499,oldPrice:1899,emoji:"🔊",bg:"#dcebf0",badge:"POPULAR",rating:"4.6",description:"Big sound, compact size"},
  {id:3,name:"Everyday Runner Sneakers",category:"Style",price:2299,oldPrice:2799,emoji:"👟",bg:"#ffdfcf",badge:"NEW",rating:"4.7",description:"Comfort made for moving"},
  {id:4,name:"Classic Daily Backpack",category:"Style",price:1299,oldPrice:1599,emoji:"🎒",bg:"#e3e9d9",badge:"GREAT PICK",rating:"4.5",description:"Room for your daily essentials"},
  {id:5,name:"Minimal Desk Lamp",category:"Home",price:999,oldPrice:1299,emoji:"💡",bg:"#f8e9bb",badge:"SALE",rating:"4.6",description:"A softer glow for your space"},
  {id:6,name:"Leafy Ceramic Planter",category:"Home",price:599,oldPrice:799,emoji:"🪴",bg:"#dce9d6",badge:"FAVOURITE",rating:"4.9",description:"A little green goes a long way"},
  {id:7,name:"Smart Everyday Watch",category:"Tech",price:2799,oldPrice:3299,emoji:"⌚",bg:"#dfe7ed",badge:"TRENDING",rating:"4.4",description:"Keep your day in sync"},
  {id:8,name:"Weekend Travel Bottle",category:"Home",price:449,oldPrice:599,emoji:"🧴",bg:"#f4dfd7",badge:"UNDER ₹500",rating:"4.5",description:"Hydration for the go"}
];
const state = {category:"All",query:"",sort:"featured",cart:{}};
const $ = (selector) => document.querySelector(selector);
const money = (n) => "₹" + n.toLocaleString("en-IN");
const productGrid = $("#productGrid");

function renderProducts(){
  let list = products.filter(p => (state.category==="All" || p.category===state.category) && (p.name+" "+p.category+" "+p.description).toLowerCase().includes(state.query.toLowerCase()));
  if(state.sort==="low") list.sort((a,b)=>a.price-b.price);
  if(state.sort==="high") list.sort((a,b)=>b.price-a.price);
  productGrid.innerHTML = list.length ? list.map(p=>`
    <article class="product-card">
      <div class="product-image" style="background:${p.bg}">
        <span class="product-badge">${p.badge}</span><span class="product-emoji" aria-hidden="true">${p.emoji}</span>
        <button class="add-button" data-add="${p.id}" aria-label="Add ${p.name} to cart">+</button>
      </div>
      <div class="product-meta"><span class="product-category">${p.category}</span><h3>${p.name}</h3>
        <div class="price-row"><span class="price">${money(p.price)}</span><span class="old-price">${money(p.oldPrice)}</span></div>
        <div class="rating">★ ${p.rating} <span style="color:#9aa198">· Demo rating</span></div>
      </div>
    </article>`).join("") : `<div class="empty-state"><strong>No products found.</strong><p>Try another search or category.</p></div>`;
}
function cartQuantity(){return Object.values(state.cart).reduce((sum,item)=>sum+item.qty,0)}
function renderCart(){
  $("#cartCount").textContent=cartQuantity();
  const entries=Object.values(state.cart);
  $("#cartItems").innerHTML=entries.length?entries.map(item=>`
    <div class="cart-item">
      <div class="cart-item-art" style="background:${item.bg}">${item.emoji}</div>
      <div><h3>${item.name}</h3><small>${money(item.price)} each</small>
        <div class="qty-controls"><button data-qty="${item.id}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button data-qty="${item.id}" data-delta="1" aria-label="Increase quantity">+</button></div>
        <button class="remove-item" data-remove="${item.id}">Remove</button>
      </div><strong>${money(item.price*item.qty)}</strong>
    </div>`).join(""):`<div class="empty-state"><div style="font-size:2rem">🛍</div><strong>Your bag is waiting.</strong><p>Add something you like from the shop.</p></div>`;
  $("#cartSubtotal").textContent=money(entries.reduce((sum,item)=>sum+item.price*item.qty,0));
}
function toast(message){
  const el=$("#toast");el.textContent=message;el.classList.add("show");
  clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),2400);
}
function addToCart(id){
  const p=products.find(item=>item.id===Number(id));if(!p)return;
  if(state.cart[p.id])state.cart[p.id].qty++;
  else state.cart[p.id]={...p,qty:1};
  renderCart();toast(`${p.name} added to your bag`);
}
function openCart(){
  $("#cartDrawer").classList.add("open");$("#cartDrawer").setAttribute("aria-hidden","false");$("#cartOverlay").hidden=false;document.body.style.overflow="hidden";$("#cartClose").focus();
}
function closeCart(){
  $("#cartDrawer").classList.remove("open");$("#cartDrawer").setAttribute("aria-hidden","true");$("#cartOverlay").hidden=true;document.body.style.overflow="";$("#cartOpen").focus();
}
productGrid.addEventListener("click",e=>{const btn=e.target.closest("[data-add]");if(btn)addToCart(btn.dataset.add)});
$("#filterGroup").addEventListener("click",e=>{
  const btn=e.target.closest("[data-category]");if(!btn)return;
  state.category=btn.dataset.category;
  document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b.dataset.category===state.category));
  renderProducts();$("#shop").scrollIntoView({behavior:"smooth",block:"start"});
});
document.querySelectorAll(".category-tile").forEach(btn=>btn.addEventListener("click",()=>{
  state.category=btn.dataset.category;
  document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b.dataset.category===state.category));
  renderProducts();$("#shop").scrollIntoView({behavior:"smooth"});
}));
$("#searchInput").addEventListener("input",e=>{state.query=e.target.value;renderProducts()});
$("#sortSelect").addEventListener("change",e=>{state.sort=e.target.value;renderProducts()});
$("#cartItems").addEventListener("click",e=>{
  const qty=e.target.closest("[data-qty]"),remove=e.target.closest("[data-remove]");
  if(qty){const id=Number(qty.dataset.qty);state.cart[id].qty+=Number(qty.dataset.delta);if(state.cart[id].qty<=0)delete state.cart[id];renderCart()}
  if(remove){delete state.cart[Number(remove.dataset.remove)];renderCart()}
});
$("#cartOpen").addEventListener("click",openCart);$("#cartClose").addEventListener("click",closeCart);$("#cartOverlay").addEventListener("click",closeCart);
document.addEventListener("keydown",e=>{if(e.key==="Escape" && $("#cartDrawer").classList.contains("open"))closeCart()});
$("#checkoutButton").addEventListener("click",()=>toast(cartQuantity()?"Demo only: no real payment is processed.":"Your cart is empty."));
$("#newsletterForm").addEventListener("submit",e=>{
  e.preventDefault();const email=$("#emailInput").value.trim();
  if(email){$("#formMessage").textContent="Thanks! This demo form is not connected to a mailing service.";e.target.reset()}
});
$("#menuToggle").addEventListener("click",()=>{
  const nav=$("#mainNav"),opened=nav.classList.toggle("open");$("#menuToggle").setAttribute("aria-expanded",String(opened));
});
$("#mainNav").querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{$("#mainNav").classList.remove("open");$("#menuToggle").setAttribute("aria-expanded","false")}));
$("#year").textContent=new Date().getFullYear();
renderProducts();renderCart();
