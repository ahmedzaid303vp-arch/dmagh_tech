// رابط ملف JSON الذي يحتوي على جميع المنتجات
const API_URL = 'products.json';
let allAccessories = [];

function buildSpecBadges(item) {
    const specs = [];
    if (item.color) specs.push(`<span class="spec-badge"><i class="fas fa-palette"></i> ${item.color}</span>`);
    if (item.warranty) specs.push(`<span class="spec-badge"><i class="fas fa-shield-alt"></i> ${item.warranty}</span>`);
    return specs.length ? `<div class="spec-row">${specs.join('')}</div>` : '';
}

function renderAccessories(items) {
    const container = document.getElementById('accessories-container');
    if (!container) return;

    if (Array.isArray(items) && items.length > 0) {
        let cardsHtml = '';

        items.forEach(item => {
            const itemImg = item.image || 'img/default.png';

            cardsHtml += `
                <div class="col-12 col-md-6 col-lg-4">
                    <div class="card product-card h-100 border-0">
                        <img src="${itemImg}" onerror="this.src='img/default.png';" class="card-img-top p-3 product-img" alt="${item.name}">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title fw-bold text-white">${item.name}</h5>
                            ${buildSpecBadges(item)}
                            <p class="card-text text-white small mb-3">${item.description || ''}</p>
                            <div class="mt-auto">
                                <div class="mb-3"><span class="fs-4 fw-bold text-accent">${Number(item.price).toLocaleString()} ج.م</span></div>
                                <a href="https://wa.me/201145263416?text=${encodeURIComponent('أهلاً دماغ.تك، عايز أستفسر عن ' + item.name)}" target="_blank" class="btn btn-whatsapp w-100 py-2">
                                    <i class="fab fa-whatsapp ms-1"></i> اطلب عبر الواتساب
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = cardsHtml;
    } else {
        container.innerHTML = `<div class="col-12 text-center text-white-50 my-5"><h4>لا توجد إكسسوارات متوفرة حالياً في هذا القسم.</h4></div>`;
    }
}

function filterAccessories(query) {
    const term = query.trim().toLowerCase();
    if (!term) return allAccessories;
    return allAccessories.filter(item => {
        const haystack = `${item.name || ''} ${item.description || ''} ${item.color || ''}`.toLowerCase();
        return haystack.includes(term);
    });
}

function setupSearch() {
    const searchInput = document.getElementById('accessory-search');
    if (!searchInput) return;
    searchInput.addEventListener('input', () => {
        const filtered = filterAccessories(searchInput.value);
        if (filtered.length === 0) {
            document.getElementById('accessories-container').innerHTML = `<div class="col-12 text-center text-white-50 my-5"><h4><i class="fas fa-search ms-2"></i>مفيش نتائج مطابقة لبحثك.</h4></div>`;
        } else {
            renderAccessories(filtered);
        }
    });
}

async function fetchAccessories() {
    const container = document.getElementById('accessories-container');
    if (!container) return;

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('فشل جلب البيانات من الملف');
        }

        const allProducts = await response.json();

        // فلترة المنتجات لعرض الإكسسوارات فقط
        allAccessories = allProducts.filter(product => product.category === 'accessory');

        renderAccessories(allAccessories);
        setupSearch();
    } catch (error) {
        console.error('حدث خطأ أثناء تحميل الإكسسوارات:', error);
        container.innerHTML = `<div class="col-12 text-center text-danger my-5"><h4>حدث خطأ أثناء تحميل المنتجات.</h4></div>`;
    }
}

document.addEventListener('DOMContentLoaded', fetchAccessories);
