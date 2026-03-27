// بيانات المنتجات الأساسية
let defaultProducts = [
    { id: 1, name: "تيشرت جرافيك متقان", price: 450, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500" },
    { id: 2, name: "أوفيرسايز نيون", price: 550, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500" }
];

// دمج المنتجات من لوحة التحكم مع المنتجات الأساسية
let products = JSON.parse(localStorage.getItem('metqanProducts')) || defaultProducts;
let cart = JSON.parse(localStorage.getItem('metqanCart')) || [];

function displayProducts() {
    const list = document.getElementById('products-list');
    if (!list) return;
    list.innerHTML = '';

    products.forEach(p => {
        list.innerHTML += `
            <div class="product-card">
                <div class="product-image" style="background-image: url('${p.image}')"></div>
                <h3>${p.name}</h3>
                <p class="price">${p.price} EGP</p>
                <select id="size-${p.id}" class="size-select">
                    <option value="M">Medium (M)</option>
                    <option value="L">Large (L)</option>
                    <option value="XL">X-Large (XL)</option>
                    <option value="XXL">XXL</option>
                </select>
                <button class="btn-primary" style="width:100%" onclick="addToCart(${p.id})">أضف للسلة</button>
            </div>
        `;
    });
    if(window.lucide) lucide.createIcons();
}

function addToCart(id) {
    const product = products.find(p => p.id == id);
    const size = document.getElementById(`size-${id}`).value;
    cart.push({ ...product, size: size });
    updateCart();
    toggleCart(true);
}

function updateCart() {
    localStorage.setItem('metqanCart', JSON.stringify(cart));
    document.getElementById('cart-count').innerText = cart.length;
    const container = document.getElementById('cart-items-container');
    container.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += parseInt(item.price);
        container.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" width="50">
                <div class="cart-item-info">
                    <h4>${item.name} (${item.size})</h4>
                    <span>${item.price} EGP</span>
                    <button class="remove-item" onclick="removeFromCart(${index})">حذف</button>
                </div>
            </div>
        `;
    });
    document.getElementById('cart-total-amount').innerText = total;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function toggleCart(open) {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    if (open === true) {
        sidebar.classList.add('open');
        overlay.classList.add('show');
    } else {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
    }
}

// وظيفة إرسال الطلب للواتساب
function checkoutWhatsApp() {
    if (cart.length === 0) return alert("السلة فارغة!");
    
    let phoneNumber = "01121067337"; // رقم الواتساب الخاص بك
    let text = "مرحباً متقان، أريد طلب المنتجات التالية:\n\n";
    let total = 0;
    
    cart.forEach((item, i) => {
        text += `${i+1}. ${item.name} | مقاس: ${item.size} | سعر: ${item.price} EGP\n`;
        total += parseInt(item.price);
    });
    
    text += `\nإجمالي المبلغ: ${total} EGP`;
    
    // 1. فتح رابط الواتساب في نافذة جديدة
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, '_blank');
    
    // 2. تفريغ السلة من المتصفح
    cart = [];
    localStorage.removeItem('metqanCart');
    updateCart();
    
    // 3. التوجيه لصفحة "تم استلام الطلب" بعد ثانية واحدة
    setTimeout(() => {
        window.location.href = 'success.html';
    }, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    updateCart();
    document.querySelector('.cart-icon').onclick = () => toggleCart();
    document.getElementById('close-cart').onclick = () => toggleCart();
    document.getElementById('cart-overlay').onclick = () => toggleCart();
});