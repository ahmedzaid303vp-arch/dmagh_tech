// ==========================================
// ربط بيانات المنتجات بـ Supabase — دماغ.تك
// ==========================================

const SUPABASE_URL = 'https://uyegururktfostnjnyrp.supabase.co';
// ⚠️ ضع هنا المفتاح الخاص بك (Publishable Key) الذي نسخته من Supabase
const SUPABASE_KEY = 'YOUR_PUBLISHABLE_KEY_HERE';

// تهيئة عميل Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// مصفوفة عامة لحفظ المنتجات
let PRODUCTS_DATA = [];

/**
 * دالة لجلب جميع المنتجات من Supabase
 * @returns {Promise<Array>} مصفوفة المنتجات
 */
async function fetchProducts() {
  try {
    const { data, error } = await supabaseClient
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('خطأ أثناء جلب المنتجات من Supabase:', error.message);
      return [];
    }

    PRODUCTS_DATA = data;
    return data;
  } catch (err) {
    console.error('حدث خطأ غير متوقع:', err);
    return [];
  }
}