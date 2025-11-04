// Function to get URL parameters
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    // Log the URL and parsed ID for debugging
    console.log('Current URL:', window.location.href);
    console.log('Parsed product ID:', id);

    return { id };
}

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

// Function to update product details in the page
function updateProductDetails(product) {
    if (!product) return;

    // Update product title
    const titleElement = document.querySelector('.ul-product-details-title');
    if (titleElement) titleElement.textContent = product.title;

    // Update product price
    const priceElement = document.querySelector('.ul-product-details-price');
    if (priceElement) priceElement.textContent = product.price;

    // Update product description
    const descrElement = document.querySelector('.ul-product-details-descr');
    if (descrElement) descrElement.textContent = product.Item_Description;

    // Update product images in the slider
    const swiperWrapper = document.querySelector('.swiper-wrapper');
    if (swiperWrapper) {
        swiperWrapper.innerHTML = `
            <div class="swiper-slide"><img src="${product.image}" alt="${product.title}"></div>
            <div class="swiper-slide"><img src="${product.image1}" alt="${product.title}"></div>
             <div class="swiper-slide"><img src="${product.image2}" alt="${product.title}"></div>
        `;
    }

    // Update the breadcrumb title
    const breadcrumbTitle = document.querySelector('.ul-breadcrumb-title');
    if (breadcrumbTitle) breadcrumbTitle.textContent = product.title;

    // Update product sizes
    if (product.sizes) {
        const sizes = product.sizes.split(' – ');
        const sizesContainer = document.querySelector('.variants');
        if (sizesContainer) {
            sizesContainer.innerHTML = sizes.map((size, index) => `
                <label for="ul-product-details-size-${index + 1}">
                    <input type="radio" name="product-size" id="ul-product-details-size-${index + 1}"
                        ${index === 0 ? 'checked' : ''} hidden>
                    <span class="size-btn">${size}</span>
                </label>
            `).join('');
        }
    }

    // Update long description
    const longDescr = document.querySelector('.ul-product-details-long-descr-wrapper p');
    if (longDescr) {
        longDescr.textContent = product.Item_Description;
    }

    // --- DYNAMIC OG META TAGS FOR SHARING ---
    const ogTitle = document.getElementById('og-title');
    const ogDesc = document.getElementById('og-description');
    const ogImg = document.getElementById('og-image');
    const ogUrl = document.getElementById('og-url');
    if (ogTitle) ogTitle.setAttribute('content', product.title);
    if (ogDesc) ogDesc.setAttribute('content', product.Item_Description);
    if (ogImg) {
        let imgUrl = '';
        if (product.image) {
            imgUrl = product.image.startsWith('https') ? product.image : new URL(product.image, window.location.origin).href;
        } else {
            imgUrl = 'https://i.ibb.co/bMN3LPt6/Untitled-1.jpg';
        }
        ogImg.setAttribute('content', imgUrl);
    }
    if (ogUrl) ogUrl.setAttribute('content', window.location.href);

    // Initialize/reinitialize Swiper after updating images
    if (typeof Swiper !== 'undefined') {
        new Swiper('.ul-product-details-img-slider', {
            navigation: {
                nextEl: '#ul-product-details-img-slider-nav .next',
                prevEl: '#ul-product-details-img-slider-nav .prev',
            },
        });
    }

    // Set up quantity controls
    const quantityInput = document.getElementById('ul-product-details-quantity');
    const increaseBtn = document.querySelector('.quantityIncreaseButton');
    const decreaseBtn = document.querySelector('.quantityDecreaseButton');

    if (increaseBtn && decreaseBtn && quantityInput) {
        increaseBtn.onclick = () => {
            quantityInput.value = parseInt(quantityInput.value) + 1;
        };
        decreaseBtn.onclick = () => {
            if (parseInt(quantityInput.value) > 1) {
                quantityInput.value = parseInt(quantityInput.value) - 1;
            }
        };
    }

    // --- ORDER NOW BUTTON ---
    setTimeout(() => {
        const orderBtn = document.querySelector('.add-to-cart');
        if (orderBtn) {
            orderBtn.onclick = function (e) {
                e.preventDefault();
                // Get product name
                const productName = product.title;
                // Get selected size
                let selectedSize = '';
                const checkedSize = document.querySelector('.variants input[type="radio"]:checked');
                if (checkedSize) {
                    const sizeLabel = checkedSize.parentElement.querySelector('.size-btn');
                    if (sizeLabel) selectedSize = sizeLabel.textContent.trim();
                }
                // WhatsApp message with product image (make absolute URL and encode message)
                const phone = '212767596530'; // Morocco number, no + or spaces
                // Build an absolute image URL (handle relative paths and missing images)
                let imgUrl = '';
                if (product.image) {
                    imgUrl = product.image.startsWith('http') ? product.image : new URL(product.image, window.location.origin).href;
                } else {
                    // fallback placeholder
                    imgUrl = 'https://i.ibb.co/bMN3LPt6/Untitled-1.jpg';
                }
                // Prepare a readable message and encode it so spaces/newlines are safe in the URL
                const rawMsg = `Hello, I want to order this product:\n\n*${productName}*\nSize: ${selectedSize}\n${imgUrl}`;
                const encodedMsg = encodeURIComponent(rawMsg);
                window.open(`https://wa.me/${phone}?text=${encodedMsg}`, '_blank');
            };
        }
    }, 100);
}

// Main initialization function
async function initProductDetails() {
    try {
        const { id } = getUrlParams();
        if (!id) {
            console.error('No product ID provided');
            return;
        }

        // Show loading state
        const preloader = document.querySelector('.preloader');
        if (preloader) preloader.classList.add('active');

        const products = await fetchProductData();
        const product = products.find(p => p.id === parseInt(id));

        if (product) {
            updateProductDetails(product);
            // Update page title
            document.title = `${product.title} - Maktouma`;
        } else {
            console.error('Product not found');
            alert('Product not found');
        }
    } catch (error) {
        console.error('Error loading product details:', error);
        alert('Error loading product details. Please try again.');
    } finally {
        // Hide loading state
        const preloader = document.querySelector('.preloader');
        if (preloader) preloader.classList.remove('active');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initProductDetails);