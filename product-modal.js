// ==========================================
// نافذة تفاصيل المنتج المشتركة (كل الصفحات)
// بتتفتح لما المستخدم يدوس على أي كارت منتج
// ==========================================
(function () {
    // تسمية عربية للمواصفات المختلفة اللي ممكن تتواجد في المنتج
    const specLabels = {
        ram: 'الرام',
        storage: 'المساحة',
        color: 'اللون',
        warranty: 'الضمان',
        condition: 'الحالة',
        battery: 'البطارية',
        screen: 'الشاشة',
        processor: 'المعالج',
        camera: 'الكاميرا'
    };

    // المفاتيح دي بتتعرض بشكل خاص مش كمواصفة عادية
    const excludedKeys = ['id', 'name', 'category', 'price', 'description', 'image', 'isNew'];

    // خريطة كلمات مفتاحية -> أيقونة FontAwesome مناسبة لكل نوع مواصفة
    // بتتفحص بالترتيب وأول تطابق يفوز
    const iconRules = [
        { keywords: ['شاشة', 'amoled', 'retina', 'oled'], icon: 'fa-mobile-screen-button' },
        { keywords: ['معالج', 'snapdragon', 'bionic', 'processor'], icon: 'fa-microchip' },
        { keywords: ['تخزين', 'جيجابايت'], icon: 'fa-hdd' },
        { keywords: ['رام'], icon: 'fa-memory' },
        { keywords: ['كاميرا'], icon: 'fa-camera' },
        { keywords: ['بطارية', 'مللي أمبير'], icon: 'fa-battery-full' },
        { keywords: ['شحن'], icon: 'fa-bolt' },
        { keywords: ['مقاوم', 'ip68', 'ip67'], icon: 'fa-shield-halved' },
        { keywords: ['5g', 'شبكات', 'الجيل الخامس'], icon: 'fa-signal' },
        { keywords: ['s pen', 'قلم'], icon: 'fa-pen' },
        { keywords: ['بلوتوث', 'bluetooth'], icon: 'fa-bluetooth-b' },
        { keywords: ['ضوضاء', 'anc'], icon: 'fa-volume-xmark' },
        { keywords: ['ميكروفون'], icon: 'fa-microphone' },
        { keywords: ['هرتز', 'تحديث'], icon: 'fa-gauge-high' },
        { keywords: ['لون', 'أنيق'], icon: 'fa-palette' },
        { keywords: ['فحص', 'استعمال', 'حالة الجهاز'], icon: 'fa-magnifying-glass' },
        { keywords: ['ضمان', 'جديد', 'الوكيل', 'الكرتونة'], icon: 'fa-certificate' },
        { keywords: ['ماء', 'غبار'], icon: 'fa-droplet' }
    ];

    function iconForLine(line) {
        const lower = String(line).toLowerCase();
        for (const rule of iconRules) {
            if (rule.keywords.some(k => lower.includes(k))) return rule.icon;
        }
        return 'fa-circle-check';
    }

    // بتبني صفوف الوصف (كل سطر في صف منفصل بأيقونته الخاصة)
    function buildDescriptionRows(description) {
        if (Array.isArray(description)) {
            return description.map(line => `
                <div class="desc-spec-row">
                    <div class="desc-spec-icon"><i class="fas ${iconForLine(line)}"></i></div>
                    <div class="desc-spec-text">${line}</div>
                </div>
            `).join('');
        }
        if (typeof description === 'string' && description.trim()) {
            return `<p class="product-modal-desc">${description}</p>`;
        }
        return '';
    }

    function injectModal() {
        if (document.getElementById('productDetailsModal')) return;

        const modalHtml = `
        <div class="modal fade" id="productDetailsModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content product-modal-content">
                    <div class="modal-header border-0">
                        <h5 class="modal-title fw-bold" id="productModalTitle"></h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="إغلاق"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-4">
                            <div class="col-12 col-md-5 text-center">
                                <img id="productModalImage" src="" class="img-fluid product-modal-img" alt="">
                            </div>
                            <div class="col-12 col-md-7">
                                <div id="productModalBadge" class="mb-3"></div>
                                <div id="productModalSpecs" class="mb-3"></div>
                                <div id="productModalDesc" class="desc-spec-list mb-3"></div>
                                <div class="product-modal-price mb-3">
                                    <span class="price-label d-block">السعر</span>
                                    <span id="productModalPrice" class="fs-3 fw-bold text-accent"></span>
                                </div>
                                <a id="productModalWhatsapp" href="#" target="_blank" class="btn btn-whatsapp w-100 py-2">
                                    <i class="fab fa-whatsapp ms-1"></i> اطلب عبر الواتساب
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    function buildSpecsHtml(product) {
        const items = [];
        Object.keys(product).forEach(key => {
            if (excludedKeys.includes(key)) return;
            const value = product[key];
            if (value === undefined || value === null || value === '') return;
            const label = specLabels[key] || key;
            items.push(`<span class="spec-badge"><i class="fas fa-check-circle"></i> ${label}: ${value}</span>`);
        });
        return items.length ? `<div class="spec-row">${items.join('')}</div>` : '';
    }

    // بتفتح المودال وتملي بياناته بمنتج معين
    window.openProductModal = function (product) {
        if (!product) return;
        injectModal();

        const modalEl = document.getElementById('productDetailsModal');
        const imageEl = document.getElementById('productModalImage');

        document.getElementById('productModalTitle').textContent = product.name || '';
        imageEl.src = product.image || 'img/default.png';
        imageEl.alt = product.name || '';
        imageEl.onerror = function () { this.onerror = null; this.src = 'img/default.png'; };
        document.getElementById('productModalDesc').innerHTML = buildDescriptionRows(product.description);
        document.getElementById('productModalSpecs').innerHTML = buildSpecsHtml(product);
        document.getElementById('productModalPrice').textContent = `${Number(product.price).toLocaleString()} ج.م`;

        const badgeEl = document.getElementById('productModalBadge');
        if (product.isNew) {
            badgeEl.innerHTML = '<span class="badge bg-danger fs-6">جديد</span>';
        } else if (product.category === 'used') {
            badgeEl.innerHTML = '<span class="badge bg-warning text-dark fs-6">كسر زيرو</span>';
        } else {
            badgeEl.innerHTML = '';
        }

        const waLink = document.getElementById('productModalWhatsapp');
        waLink.href = `https://wa.me/201145263416?text=${encodeURIComponent('أهلاً دماغ.تك، عايز أستفسر عن ' + product.name)}`;

        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
    };

    // بتربط الضغط على أي كارت جوه حاوية معينة بفتح المودال
    // containerId: id الحاوية اللي فيها الكروت
    // getProductsFn: دالة بترجع مصفوفة المنتجات الحالية عشان نلاقي المنتج بالـ id بتاعه
    window.attachProductCardClicks = function (containerId, getProductsFn) {
        const container = document.getElementById(containerId);
        if (!container || container.dataset.modalBound === 'true') return;

        container.addEventListener('click', function (e) {
            // لو المستخدم دوس على زرار الواتساب نفسه سيبه يشتغل عادي من غير ما نفتح المودال
            if (e.target.closest('a.btn-whatsapp')) return;

            const card = e.target.closest('[data-product-id]');
            if (!card) return;

            const id = card.getAttribute('data-product-id');
            const products = getProductsFn() || [];
            const product = products.find(p => String(p.id) === String(id));
            if (product) {
                window.openProductModal(product);
            }
        });

        container.dataset.modalBound = 'true';
    };
})();
