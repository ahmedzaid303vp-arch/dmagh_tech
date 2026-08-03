const API_URL = 'products.json';
let allPhones = [];

function buildSpecBadges(phone) {
    const specs = [];
    if (phone.ram) specs.push(`<span class="spec-badge"><i class="fas fa-memory"></i> ${phone.ram}</span>`);
    if (phone.storage) specs.push(`<span class="spec-badge"><i class="fas fa-hdd"></i> ${phone.storage}</span>`);
    if (phone.color) specs.push(`<span class="spec-badge"><i class="fas fa-palette"></i> ${phone.color}</span>`);
    if (phone.warranty) specs.push(`<span class="spec-badge"><i class="fas fa-shield-alt"></i> ${phone.warranty}</span>`);
    return specs.length ? `<div class="spec-row">${specs.join('')}</div>` : '';
}

function renderPhones(phones) {
    const container = document.getElementById('smartphones-container');
    if (!container) return;

    if (!Array.isArray(phones) || phones.length === 0) {
        container.innerHTML = `<div class="col-12 text-center text-white-50 my-5"><h4><i class="fas fa-search ms-2"></i>مفيش نتائج مطابقة لبحثك.</h4></div>`;
        return;
    }

    container.innerHTML = phones.map(phone => `
        <div class="col-12 col-md-6 col-lg-4">
            <div class="card product-card h-100 border-0">
                ${phone.isNew ? '<span class="badge bg-danger position-absolute top-0 end-0 m-3 fs-6">جديد</span>' : ''}
                <img src="${phone.image || 'img/default.png'}" onerror="this.src='img/default.png';" class="card-img-top p-3 product-img" alt="${phone.name}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title fw-bold text-white">${phone.name}</h5>
                    ${buildSpecBadges(phone)}
                    <p class="card-text text-white mb-3">${phone.description || ''}</p>
                    <div class="mt-auto">
                        <div class="price-tag mb-3">
                            <span class="price-label">السعر</span>
                            <span class="fs-4 fw-bold text-accent">${Number(phone.price).toLocaleString()} ج.م</span>
                        </div>
                        <a href="https://wa.me/201145263416?text=${encodeURIComponent('أهلاً دماغ.تك، عايز أستفسر عن ' + phone.name)}" target="_blank" class="btn btn-whatsapp w-100 py-2">
                            <i class="fab fa-whatsapp ms-1"></i> اطلب عبر الواتساب
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function filterPhones(query) {
    const term = query.trim().toLowerCase();
    if (!term) return allPhones;
    return allPhones.filter(phone => {
        const haystack = `${phone.name || ''} ${phone.description || ''} ${phone.color || ''} ${phone.storage || ''} ${phone.ram || ''}`.toLowerCase();
        return haystack.includes(term);
    });
}

function setupSearch() {
    const searchInput = document.getElementById('phone-search');
    if (!searchInput) return;
    searchInput.addEventListener('input', () => {
        renderPhones(filterPhones(searchInput.value));
    });
}

async function fetchSmartphones() {
    const container = document.getElementById('smartphones-container');
    if (!container) return;

    container.innerHTML = `
        <div class="col-12 text-center text-white py-5">
            <div class="spinner-border text-accent" role="status"></div>
            <p class="mt-2">جاري تحميل الموبايلات...</p>
        </div>
    `;

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`خطأ في الشبكة: ${response.status}`);
        }

        const allProducts = await response.json();

        // فلترة المنتجات لعرض الهواتف الذكية فقط
        allPhones = allProducts.filter(product => product.category === 'smartphone');

        renderPhones(allPhones);
        setupSearch();
    } catch (error) {
        console.error('حدث خطأ أثناء تحميل الهواتف:', error);
        container.innerHTML = `<div class="col-12 text-center text-danger my-5"><h4>حدث خطأ أثناء تحميل المنتجات.</h4></div>`;
    }
}

document.addEventListener('DOMContentLoaded', fetchSmartphones);
