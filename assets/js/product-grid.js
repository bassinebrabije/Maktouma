// Function to fetch product data
async function fetchProductData() {
    try {
        const response = await fetch('products.json');
        const products = await response.json();
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

// Function to create product HTML
function createProductHTML(product) {
    return `
    <div class="col">
        <div class="ul-product" data-product-id="${product.id}">
         
            <div class="ul-product-img">
                <a href="shop-details.html?id=${product.id}" class="product-link">
                    <img src="${product.image}" alt="${product.title}">
                </a>
            </div>
            <div class="ul-product-txt">
             <div class="ul-product-bottom-txt">
                    <div class="ul-product-bottom-txt-left" >
                        <span class="ul-product-price" style="color :#EF2853">${product.price}</span>
                    </div>
                </div>
                <span class="ul-product-category"><a href="${product.category_link}">M a k t o u m a</a></span>
                <h4 class="ul-product-title">
                    <a href="shop-details.html?id=${product.id}" class="product-link">${product.title}</a>
                </h4>
              
            </div>
        </div>
    </div>`;
}

// Function to update product grid
async function updateProductGrid() {
    const productGrid = document.querySelector('#inner-products');
    if (!productGrid) {
        console.error('Product grid container not found');
        return;
    }

    const products = await fetchProductData();
    const productsHTML = products.map(product => createProductHTML(product)).join('');
    productGrid.innerHTML = productsHTML;
}

// Handle product clicks
function handleProductClick(e) {
    const link = e.target.closest('.product-link');
    if (!link) return;

    e.preventDefault();
    const productCard = link.closest('.ul-product');
    const productId = productCard.dataset.productId;
    window.location.href = `shop-details.html?id=${productId}`;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // First, make sure we can load products
    updateProductGrid().then(() => {
        // Add click handler to the container using event delegation
        const productContainer = document.querySelector('#inner-products');
        if (productContainer) {
            productContainer.addEventListener('click', handleProductClick);
        }
    }).catch(error => {
        console.error('Error initializing product grid:', error);
    });
});