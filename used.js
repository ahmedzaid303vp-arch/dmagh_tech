const API_URL = 'products.json';
let allUsedDevices = [];

function buildSpecBadges(device) {
    const specs = [];
    if (device.ram) specs.push(`<span class="spec-badge"><i class="fas fa-memory"></i> ${device.ram}</span>`);
    if (device.storage) specs.push(`<span class="spec-badge"><i class="fas fa-hdd"></i> ${device.storage}</span>`);
    if (device.color) specs.push(`<span class="spec-badge"><i class="fas fa-palette"></i> ${device.color}</span>`);
    if (device.condition) specs.push(`<span class="spec-badge"><i class="fas fa-check-circle"></i> ${device.condition}</span>`);
    return specs.length ? `<div class="spec-row">${specs.join('')}</div>` : '';
}

function renderUsedDevices(devices) {
    const container = document.getElementById('used-container');
    if (!container) return;

    if (Array.isArray(devices) && devices.length > 0) {
        let cardsHtml = '';

        devices.forEach(device => {
            const deviceImg = device.image || 'img/default.png';
            const deviceDesc = device.description || '';

            cardsHtml += `
                <div class="col-12 col-md-6 col-lg-4">
                    <div class="card product-card h-100 border-0">
                        <span class="badge bg-warning text-dark position-absolute top-0 end-0 m-3 fs-6">كسر زيرو</span>
                        <img src="${deviceImg}" onerror="this.src='img/default.png';" class="card-img-top p-3 product-img" alt="${device.name}">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title fw-bold text-white">${device.name}</h5>
                            ${buildSpecBadges(device)}
                            <p class="card-text text-white small mb-3">${deviceDesc}</p>
                            <div class="mt-auto">
                                <div class="mb-3"><span class="fs-4 fw-bold text-accent">${Number(device.price).toLocaleString()} ج.م</span></div>
                                <a href="https://wa.me/201145263416?text=${encodeURIComponent('أهلاً دماغ.تك، عايز أستفسر عن ' + device.name)}" target="_blank" class="btn btn-whatsapp w-100 py-2">
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
        container.innerHTML = `<div class="col-12 text-center text-white-50 my-5"><h4>لا توجد أجهزة متوفرة حالياً في هذا القسم.</h4></div>`;
    }
}

function filterUsedDevices(query) {
    const term = query.trim().toLowerCase();
    if (!term) return allUsedDevices;
    return allUsedDevices.filter(device => {
        const haystack = `${device.name || ''} ${device.description || ''} ${device.color || ''} ${device.storage || ''} ${device.ram || ''}`.toLowerCase();
        return haystack.includes(term);
    });
}

function setupSearch() {
    const searchInput = document.getElementById('used-search');
    if (!searchInput) return;
    searchInput.addEventListener('input', () => {
        const filtered = filterUsedDevices(searchInput.value);
        if (filtered.length === 0) {
            document.getElementById('used-container').innerHTML = `<div class="col-12 text-center text-white-50 my-5"><h4><i class="fas fa-search ms-2"></i>مفيش نتائج مطابقة لبحثك.</h4></div>`;
        } else {
            renderUsedDevices(filtered);
        }
    });
}

async function fetchUsedDevices() {
    const container = document.getElementById('used-container');
    if (!container) return;

    container.innerHTML = `
        <div class="col-12 text-center text-white py-5">
            <div class="spinner-border text-accent" role="status"></div>
            <p class="mt-2">جاري تحميل أجهزة كسر الزيرو...</p>
        </div>
    `;

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('فشل جلب البيانات من الملف');
        }

        const allProducts = await response.json();

        // فلترة المنتجات لعرض المستعمل فقط
        allUsedDevices = allProducts.filter(product => product.category === 'used');

        renderUsedDevices(allUsedDevices);
        setupSearch();
    } catch (error) {
        console.error('حدث خطأ أثناء تحميل أجهزة كسر زيرو:', error);
        container.innerHTML = `<div class="col-12 text-center text-danger my-5"><h4>حدث خطأ أثناء تحميل المنتجات.</h4></div>`;
    }
}

document.addEventListener('DOMContentLoaded', fetchUsedDevices);
