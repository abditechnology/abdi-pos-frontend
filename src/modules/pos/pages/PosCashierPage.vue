<template>
  <div class="pos-cashier-page animate-fade-in">
    <!-- Left Section: Catalog & Search -->
    <div class="catalog-section">
      <!-- Search & Category Bar -->
      <div class="catalog-top-bar base-card card-bordered">
        <div class="search-wrap">
          <BaseInput
            v-model="searchQuery"
            placeholder="Cari menu, kode barcode, atau scan (F1)..."
            :clearable="true"
          >
            <template #prefix>
              <AppIcon name="search" :size="18" />
            </template>
          </BaseInput>
        </div>

        <div class="category-chips">
          <button
            v-for="cat in categories"
            :key="cat"
            type="button"
            :class="['cat-chip', { 'is-active': selectedCategory === cat }]"
            @click="selectedCategory = cat"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Product Cards Grid -->
      <div class="products-grid">
        <div
          v-for="item in filteredProducts"
          :key="item.id"
          class="product-pos-card card-hover-lift"
          @click="addToCart(item)"
        >
          <div class="product-icon-box">
            <AppIcon name="package" :size="24" />
          </div>

          <div class="pos-card-info">
            <span class="pos-item-name">{{ item.name }}</span>
            <span class="pos-item-cat">{{ item.category }}</span>
          </div>

          <div class="pos-card-bottom">
            <MoneyDisplay :amount="item.price" size="md" variant="primary" />
            <button type="button" class="add-plus-btn" aria-label="Tambah">
              <AppIcon name="plus" :size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Section: Temporary Cart & Checkout Panel -->
    <div class="cart-section base-card card-bordered">
      <div class="cart-header">
        <div class="cart-title-row">
          <AppIcon name="cart" :size="20" />
          <h3 class="cart-title">Pesanan Aktif</h3>
        </div>
        <span class="cart-count-badge">{{ cartTotalItems }} Item</span>
      </div>

      <!-- Cart Items List -->
      <div class="cart-items-list">
        <div v-if="cart.length === 0" class="cart-empty-state">
          <AppIcon name="cart" :size="48" custom-class="empty-icon" />
          <p class="empty-title">Keranjang Kasir Masih Kosong</p>
          <p class="empty-subtitle">Klik salah satu menu di sebelah kiri atau scan barcode untuk menambahkan pesanan.</p>
        </div>

        <div
          v-for="(item, idx) in cart"
          :key="item.id"
          class="cart-item-row"
        >
          <div class="cart-item-meta">
            <span class="cart-item-name">{{ item.name }}</span>
            <span class="cart-item-unit-price">@ Rp {{ formatNumber(item.price) }}</span>
          </div>

          <!-- Quantity Stepper -->
          <div class="qty-stepper">
            <button type="button" class="stepper-btn" @click="decreaseQty(idx)">-</button>
            <span class="qty-value">{{ item.qty }}</span>
            <button type="button" class="stepper-btn" @click="item.qty++">+</button>
          </div>

          <!-- Total per Item -->
          <span class="cart-item-subtotal">Rp {{ formatNumber(item.price * item.qty) }}</span>
        </div>
      </div>

      <!-- Checkout Summary & Pay Button -->
      <div class="cart-checkout-box">
        <div class="summary-line">
          <span>Subtotal</span>
          <strong>Rp {{ formatNumber(cartSubtotal) }}</strong>
        </div>
        <div class="summary-line">
          <span>Pajak (PB1 10%)</span>
          <span>Rp {{ formatNumber(cartTax) }}</span>
        </div>
        <div class="summary-line total-line">
          <span>Total Tagihan</span>
          <MoneyDisplay :amount="cartGrandTotal" size="lg" variant="primary" />
        </div>

        <!-- Payment Method Quick Selection -->
        <div class="payment-methods-grid">
          <button
            type="button"
            :class="['pay-choice', { 'is-selected': paymentMethod === 'QRIS' }]"
            @click="paymentMethod = 'QRIS'"
          >
            QRIS
          </button>
          <button
            type="button"
            :class="['pay-choice', { 'is-selected': paymentMethod === 'TUNAI' }]"
            @click="paymentMethod = 'TUNAI'"
          >
            Tunai
          </button>
          <button
            type="button"
            :class="['pay-choice', { 'is-selected': paymentMethod === 'DEBIT' }]"
            @click="paymentMethod = 'DEBIT'"
          >
            Debit
          </button>
        </div>

        <BaseButton
          variant="primary"
          size="lg"
          :block="true"
          :disabled="cart.length === 0"
          :loading="isProcessingCheckout"
          @click="processCheckout"
        >
          <template #icon>
            <AppIcon name="check-circle" :size="20" />
          </template>
          Bayar & Cetak Struk (Rp {{ formatNumber(cartGrandTotal) }})
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from '../../../shared/composables/useToast'
import BaseButton from '../../../shared/components/ui/BaseButton.vue'
import BaseInput from '../../../shared/components/ui/BaseInput.vue'
import MoneyDisplay from '../../../shared/components/ui/MoneyDisplay.vue'
import AppIcon from '../../../shared/components/icons/AppIcon.vue'

const toast = useToast()

const searchQuery = ref('')
const selectedCategory = ref('Semua')
const paymentMethod = ref('QRIS')
const isProcessingCheckout = ref(false)

const categories = ['Semua', 'Terang Bulan', 'Martabak Telur', 'Martabak Tipker', 'Minuman']

const catalog = [
  { id: 1, name: 'Terang Bulan Spesial Coklat Keju', category: 'Terang Bulan', price: 40000 },
  { id: 2, name: 'Martabak Telur Bebek Double Daging', category: 'Martabak Telur', price: 45000 },
  { id: 3, name: 'Terang Bulan Red Velvet Cream Cheese', category: 'Terang Bulan', price: 50000 },
  { id: 4, name: 'Martabak Tipis Kering (Tipker) Coklat', category: 'Martabak Tipker', price: 25000 },
  { id: 5, name: 'Terang Bulan Klasik Kacang Coklat', category: 'Terang Bulan', price: 35000 },
  { id: 6, name: 'Martabak Telur Ayam Spesial', category: 'Martabak Telur', price: 38000 },
  { id: 7, name: 'Es Teh Manis Jumbo Nusantara', category: 'Minuman', price: 6000 },
  { id: 8, name: 'Es Jeruk Murni Peras Segar', category: 'Minuman', price: 10000 }
]

const cart = ref([
  { id: 1, name: 'Terang Bulan Spesial Coklat Keju', price: 40000, qty: 1 },
  { id: 7, name: 'Es Teh Manis Jumbo Nusantara', price: 6000, qty: 2 }
])

const filteredProducts = computed(() => {
  return catalog.filter(item => {
    const matchCat = selectedCategory.value === 'Semua' || item.category === selectedCategory.value
    const matchSearch = !searchQuery.value || item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchCat && matchSearch
  })
})

const cartTotalItems = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.qty, 0)
})

const cartSubtotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.price * item.qty, 0)
})

const cartTax = computed(() => {
  return Math.round(cartSubtotal.value * 0.1)
})

const cartGrandTotal = computed(() => {
  return cartSubtotal.value + cartTax.value
})

const addToCart = (product) => {
  const existing = cart.value.find(i => i.id === product.id)
  if (existing) {
    existing.qty++
  } else {
    cart.value.push({ ...product, qty: 1 })
  }
  toast.info(`+1 ${product.name} dimasukkan ke keranjang`, 'Item Ditambahkan')
}

const decreaseQty = (idx) => {
  if (cart.value[idx].qty > 1) {
    cart.value[idx].qty--
  } else {
    cart.value.splice(idx, 1)
  }
}

const processCheckout = () => {
  isProcessingCheckout.value = true
  setTimeout(() => {
    isProcessingCheckout.value = false
    const grand = cartGrandTotal.value
    cart.value = []
    toast.success(`Pembayaran Rp ${formatNumber(grand)} via ${paymentMethod.value} berhasil diproses. Struk tercetak.`, 'Transaksi Selesai!')
  }, 1000)
}

const formatNumber = (num) => new Intl.NumberFormat('id-ID').format(num)
</script>

<style scoped>
.pos-cashier-page {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 20px;
  height: calc(100vh - var(--header-height) - 48px);
}

.catalog-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
}

.catalog-top-bar {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.category-chips {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 2px;
}

.cat-chip {
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 600;
  border-radius: var(--radius-full);
  background-color: var(--slate-100);
  color: var(--slate-600);
  white-space: nowrap;
  transition: all var(--duration-fast) ease;
}

.cat-chip.is-active {
  background-color: var(--primary-600);
  color: #ffffff;
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 16px;
  overflow-y: auto;
  padding-right: 4px;
}

.product-pos-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-app);
  border-radius: var(--radius-lg);
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
  cursor: pointer;
  user-select: none;
}

.product-icon-box {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
  color: var(--primary-600);
  display: flex;
  align-items: center;
  justify-content: center;
}

.pos-card-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.pos-item-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.3;
}

.pos-item-cat {
  font-size: 11.5px;
  color: var(--text-muted);
}

.pos-card-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
  border-top: 1px solid var(--slate-100);
}

.add-plus-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  background-color: var(--primary-50);
  color: var(--primary-600);
  transition: all var(--duration-fast) ease;
}

.product-pos-card:hover .add-plus-btn {
  background-color: var(--primary-600);
  color: #ffffff;
}

/* Cart Panel */
.cart-section {
  display: flex;
  flex-direction: column;
  background-color: var(--bg-surface);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border-bottom: 1px solid var(--slate-100);
}

.cart-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--primary-600);
}

.cart-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-main);
}

.cart-count-badge {
  font-size: 11.5px;
  font-weight: 700;
  background-color: var(--primary-100);
  color: var(--primary-700);
  padding: 3px 8px;
  border-radius: var(--radius-full);
}

.cart-items-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cart-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  color: var(--slate-400);
  padding: 24px;
}

.empty-icon {
  margin-bottom: 12px;
  opacity: 0.4;
}

.empty-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 4px;
}

.empty-subtitle {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.4;
}

.cart-item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid var(--slate-100);
}

.cart-item-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.cart-item-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-main);
}

.cart-item-unit-price {
  font-size: 11px;
  color: var(--text-muted);
}

.qty-stepper {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--slate-100);
  border-radius: var(--radius-md);
  padding: 2px 4px;
}

.stepper-btn {
  width: 24px;
  height: 24px;
  font-weight: 700;
  color: var(--slate-700);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  background: #ffffff;
}

.qty-value {
  font-size: 12px;
  font-weight: 700;
  min-width: 14px;
  text-align: center;
}

.cart-item-subtotal {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--text-main);
}

.cart-checkout-box {
  padding: 18px 20px;
  background-color: var(--slate-50);
  border-top: 1px solid var(--slate-100);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--text-secondary);
}

.total-line {
  margin-top: 4px;
  padding-top: 8px;
  border-top: 1px dashed var(--slate-300);
  font-size: 15px;
  font-weight: 700;
  color: var(--text-main);
}

.payment-methods-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.pay-choice {
  padding: 8px;
  font-size: 12.5px;
  font-weight: 700;
  border-radius: var(--radius-md);
  background-color: #ffffff;
  border: 1px solid var(--border-app);
  color: var(--slate-700);
  cursor: pointer;
  transition: all var(--duration-fast) ease;
}

.pay-choice.is-selected {
  background-color: var(--primary-600);
  border-color: var(--primary-600);
  color: #ffffff;
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3);
}

@media (max-width: 1024px) {
  .pos-cashier-page {
    grid-template-columns: 1fr;
    height: auto;
  }
}
</style>
