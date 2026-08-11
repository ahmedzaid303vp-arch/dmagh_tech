// ==========================================
// ربط بيانات المنتجات بـ Supabase — دماغ.تك
// ==========================================

const SUPABASE_URL = 'https://uyegururktfostnjnyrp.supabase.co';
// ⚠️ ضع هنا المفتاح الخاص بك (Publishable Key) الذي نسخته من Supabase
const SUPABASE_KEY = 'sb_publishable_t-e883_62CIW-rtUFfQwUg_gPlWAqQn';

// تهيئة عميل Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// مصفوفة عامة لحفظ المنتجات
let PRODUCTS_DATA = [];

/**
 * دالة تحويل المنتج من شكل الداتابيز الهيكلي لشكل الفرونت إند
 * @param {Object} item - كائن المنتج القادم من Supabase
 * @returns {Object} المنتج المنسق
 */
function formatProduct(item) {
  const specs = item.specs || {};

  return {
    id: item.id,
    name: item.name,
    price: item.price,
    image: item.image ? (item.image.startsWith('img/') ? item.image : `img/${item.image}`) : 'img/default.png',
    isNew: item.is_new,
    description: item.description,
    category: item.categories?.slug || 'smartphones',
    ...specs
  };
}

/**
 * دالة لجلب جميع المنتجات من Supabase مع ربط جدول الأقسام (Categories)
 * @returns {Promise<Array>} مصفوفة المنتجات المنسقة
 */
async function fetchProducts() {
  try {
    const { data, error } = await supabaseClient
      .from('products')
      .select(`
        *,
        categories (
          slug,
          name
        )
      `)
      .order('id', { ascending: true });

    if (error) {
      console.error('خطأ أثناء جلب المنتجات من Supabase:', error.message);
      return [];
    }

    const formattedData = data.map(formatProduct);
    PRODUCTS_DATA = formattedData;
    return formattedData;
  } catch (err) {
    console.error('حدث خطأ غير متوقع:', err);
    return [];
  }
}

/**
 * دالة لجلب المنتجات حسب القسم (smartphones / used / accessories)
 * @param {string} categorySlug - الاسم الفريد للقسم
 * @returns {Promise<Array>} مصفوفة المنتجات المنسقة للقسم
 */
async function fetchProductsByCategory(categorySlug) {
  try {
    const { data, error } = await supabaseClient
      .from('products')
      .select(`
        *,
        categories!inner (
          slug,
          name
        )
      `)
      .eq('categories.slug', categorySlug)
      .order('id', { ascending: true });

    if (error) {
      console.error(`خطأ أثناء جلب قسم ${categorySlug}:`, error.message);
      return [];
    }

    return data.map(formatProduct);
  } catch (err) {
    console.error('حدث خطأ غير متوقع:', err);
    return [];
  }
}
