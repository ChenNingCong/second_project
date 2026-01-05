let pagination = null
const prevButn = document.getElementById("prev-btn")
const nextButn = document.getElementById("next-btn")
const filterButn = document.getElementById("apply-filters")
const productGrid = document.getElementById("product-grid")
const noProductGrid = document.getElementById("no-products")
// when we click the navigation button, always disable the button to prevent 
function debounce() {
    prevButn.disabled = true
    nextButn.disabled = true
    filterButn.disabled = true
}

document.getElementById("apply-filters").onclick = () => {
    renderPagedProductsWithFilter(1)
}

document.getElementById("prev-btn").onclick = () => {
    if (pagination.hasPrevPage) {
        debounce()
        renderPagedProductsWithFilter(pagination.prevPage)
    }
}

document.getElementById("next-btn").onclick = () => {
    if (pagination.hasNextPage) {
        debounce()
        renderPagedProductsWithFilter(pagination.nextPage)
    }
}

async function renderFavorite() {
    const response = await fetch('/api/favorites')
    const json = await response.json()
    const favoritesList = document.getElementById('favorites-list');
    const fragment = document.createDocumentFragment();
    const template = document.createElement('template');

    json.data.forEach(item => {
        // 1. Define the HTML as a string
        const liString = `<li>
        <span>${item.title}</span>
        <button class="unfavorite-btn" data-id="${item._id}">Remove</button>
    </li>`;

        // 2. Convert string to a real DOM node using the template element
        template.innerHTML = liString.trim();
        const liNode = template.content.firstChild;

        // 3. Append the node to the fragment
        fragment.appendChild(liNode);
    });

    // 4. Batch update the DOM
    favoritesList.replaceChildren(fragment);
}

async function initProductFilterList() {
    const response = await fetch('/api/products/filters')
    const json = await response.json()
    const data = json.data
    const form = document.getElementById('filter-form');
    const groupTemplate = document.getElementById('filter-form-template');
    const optionTemplate = document.getElementById('filter-form-template-option');
    const applyButton = document.getElementById('apply-filters');

    Object.entries(data).forEach(([groupName, options]) => {
        const groupClone = groupTemplate.content.cloneNode(true);
        const container = groupClone.querySelector('div');
        groupClone.querySelector('h4').textContent = groupName;

        options.forEach(optionValue => {
            const optionClone = optionTemplate.content.cloneNode(true);
            const checkbox = optionClone.querySelector('input');
            const label = optionClone.querySelector('label');

            checkbox.name = groupName;
            checkbox.value = optionValue;
            label.appendChild(document.createTextNode(optionValue));

            container.appendChild(optionClone);
        });

        form.insertBefore(groupClone, applyButton);
    });
}

function setPagination() {
    prevButn.disabled = !pagination.hasPrevPage
    nextButn.disabled = !pagination.hasNextPage
    filterButn.disabled = false
    document.getElementById("page-indicator").textContent = `Page ${pagination.currentPage}`
    document.getElementById("total-page-indicator").textContent = `Total Page ${pagination.totalPages}`
}

function readFilterOptions() {
    const form = document.getElementById('filter-form');
    const formData = new FormData(form);
    const filterObject = {};

    // Iterate through the form data
    for (const [key, value] of formData.entries()) {
        if (!filterObject[key]) {
            // First time seeing this key, start the string
            filterObject[key] = value;
        } else {
            // Append with a semicolon
            filterObject[key] += `;${value}`;
        }
    }

    console.log(filterObject);
    return filterObject
}

async function renderPagedProductsWithFilter(page) {
    const params = { ...readFilterOptions(), page: page };
    const url = new URL('/api/products', location);
    url.search = new URLSearchParams(params);
    try {
        const response = await fetch(url)
        if (!response.ok) {
            // Create and throw an error for bad HTTP statuses
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json()
        const data = json.data
        pagination = data.pagination
        const products = data.products
        if (products.length == 0) {
            productGrid.classList.add("hidden")
            noProductGrid.classList.remove("hidden")
        } else {
            productGrid.classList.remove("hidden")
            noProductGrid.classList.add("hidden")
            const fragment = document.createDocumentFragment()
            const template = document.getElementById("product-grid-item-template")
            for (const item of products) {
                const node = template.content.cloneNode(true);
                node.querySelector('h4').textContent = item.title;
                node.querySelector('img').src = item.image_url;
                node.querySelector('a').href = `/products/details/${item._id}`
                fragment.appendChild(node)
            }
            productGrid.replaceChildren(fragment)
        }
    } finally {
        setPagination()
    }
}

// async function renderProductFilterList(filterList) {

// }

// async function updateFilterList() {

// }

// async function fetchNextPage(page) {

// }

(async () => {
    await initProductFilterList()
    await renderPagedProductsWithFilter(1)
    await renderFavorite()
})()