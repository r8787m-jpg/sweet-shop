# 🍰 Sweet Shop - نظام إدارة المحل

نظام متكامل لطلب وإدارة منتجات محلات الحلويات.

## ✨ الميزات

- **صفحات الطلب**: كيك مُعجَّز، بوفيه المناسبات، حلويات جاهزة
- **لوحة تحكم الأدمن**: إدارة الطلبات، المنتجات، والعملاء
- **نظام قاعدة بيانات**: SQLite للتخزين المحلي
- **API متكامل**: واجهات برمجية جاهزة للتطوير

## 🚀 التشغيل

```bash
# تثبيت المتطلبات
cd sweet-shop
npm install

# تشغيل السيرفر
npm start
```

**الرابط**: http://localhost:3000

## 👤 حسابات الدخول

| الدور | اسم المستخدم | كلمة المرور |
|-------|-------------|-------------|
| أدمن | admin | admin123 |

## 📄 الصفحات

- `/` - الصفحة الرئيسية
- `/order-cake` - طلب كيك
- `/order-buffet` - طلب بوفيه
- `/order-sweets` - طلب حلويات
- `/admin` - لوحة التحكم

## 🔌 API Endpoints

### المنتجات
- `GET /api/products` - جميع المنتجات
- `GET /api/products?category=cake` - منتجات الكيك
- `POST /api/products` - إضافة منتج (أدمن)

### الطلبات
- `POST /api/orders` - إنشاء طلب
- `GET /api/orders` - جميع الطلبات
- `PUT /api/orders/:id/status` - تحديث الحالة (أدمن)

### العملاء
- `POST /api/customers` - تسجيل عميل
- `GET /api/customers` - قائمة العملاء

### الأدمن
- `POST /api/admin/login` - تسجيل دخول
- `GET /api/admin/stats` - الإحصائيات
- `GET /api/admin/orders` - الطلبات (مع فلتر)
- `GET /api/admin/products` - المنتجات
- `GET /api/admin/customers` - العملاء

## 📁 هيكل المشروع

```
sweet-shop/
├── server.js           # السيرفر الرئيسي
├── package.json        # المتطلبات
├── database/
│   └── db.js          # قاعدة البيانات
├── routes/
│   ├── customerRoutes.js
│   ├── orderRoutes.js
│   ├── productRoutes.js
│   └── adminRoutes.js
└── public/
    ├── index.html     # الصفحة الرئيسية
    ├── order-cake.html
    ├── order-buffet.html
    ├── order-sweets.html
    ├── css/style.css
    └── admin/dashboard.html
```

## 🛠 التقنيات

- **Backend**: Node.js + Express
- **Database**: SQLite
- **Frontend**: HTML5 + Bootstrap 5 + JavaScript

---

**تطوير**: فريق التطوير الذكي | 2026
