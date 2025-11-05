
const categories = ['best-selling', 'on-selling', 'top-rating'];

// Function to generate stars based on category
function generateStars(category) {
    const stars = category === 'top-rating' ? 5 : 3;
    let html = '';
    for (let i = 0; i < stars; i++) {
        html += `<span class="star"><i class="flaticon-star"></i></span>`;
    }
    return html;
}

// Function to create a horizontal product card
function createHorizontalProductCard(product, category) {
    const starsHtml = generateStars(category);
    return `
    <div class="mix col ${category}">
        <div class="ul-product-horizontal" data-product-id="${product.id}">
            <div class="ul-product-horizontal-img">
                <a href="shop-details.html?id=${product.id}" class="product-link">
                    <img src="${product.image}" alt="${product.title}">
                </a>
            </div>
            <div class="ul-product-horizontal-txt">
                <span class="ul-product-price">${product.price}</span>
                <h4 class="ul-product-title">
                    <a href="shop-details.html?id=${product.id}" class="product-link">${product.title}</a>
                </h4>
                <h5 class="ul-product-category">
                    <a href="${product.category_link}">Sizes: ${product.sizes}</a>
                </h5>
                <div class="ul-product-rating">
                    ${starsHtml}
                </div>
            </div>
        </div>
    </div>
    `;
}

const container = document.getElementById('horizontal-products');
const filterButtons = document.querySelectorAll('.ul-most-sell-filter-navs button');

// Load products from JSON
fetch('products.json')
    .then(response => response.json())
    .then(data => {
        // Render products
        let html = '';
        data.slice(0, 6).forEach((product, index) => {
            const category = categories[index % categories.length];
            html += createHorizontalProductCard(product, category);
        });
        container.innerHTML = html;

        // Filter function
        function filterProducts(category) {
            const items = container.querySelectorAll('.mix');
            items.forEach(item => {
                if (category === 'all' || item.classList.contains(category)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        }

        // Attach click events to buttons
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                filterProducts(filter);

                // Optional: highlight active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    })
    .catch(error => console.error('Error fetching products:', error));
