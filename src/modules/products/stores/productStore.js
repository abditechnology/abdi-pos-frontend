import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useToast } from '../../../shared/composables/useToast'

export const useProductStore = defineStore('product', () => {
  const toast = useToast()

  // 1. Data Kategori Produk
  const categories = ref([
    {
      id: 1,
      name: 'Terang Bulan Manis',
      icon: 'sparkles',
      color: '#f59e0b',
      description: 'Martabak manis aneka topping klasik dan spesial premium.',
      itemCount: 4
    },
    {
      id: 2,
      name: 'Martabak Telur Gurih',
      icon: 'package',
      color: '#ef4444',
      description: 'Martabak telur renyah daging sapi cincang & ayam pedas.',
      itemCount: 3
    },
    {
      id: 3,
      name: 'Minuman Segar & Kopi',
      icon: 'tag',
      color: '#3b82f6',
      description: 'Aneka minuman dingin, kopi susu gula aren, dan teh.',
      itemCount: 4
    },
    {
      id: 4,
      name: 'Topping Tambahan & Side',
      icon: 'gift',
      color: '#10b981',
      description: 'Ekstra keju mozarella, coklat batangan, dan butter wijsman.',
      itemCount: 2
    }
  ])

  // 2. Data Master Produk
  const products = ref([
    {
      id: 101,
      name: 'Terang Bulan Coklat Keju Spesial',
      sku: 'TB-CK-01',
      categoryId: 1,
      price: 38000,
      costPrice: 22000,
      stock: 45,
      unit: 'Porsi',
      image: 'https://images.unsplash.com/photo-1579888944880-d98341245702?w=160&h=160&fit=crop',
      isActive: true,
      trackStock: true
    },
    {
      id: 102,
      name: 'Terang Bulan Red Velvet Cream Cheese Oreo',
      sku: 'TB-RV-02',
      categoryId: 1,
      price: 52000,
      costPrice: 31000,
      stock: 28,
      unit: 'Porsi',
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=160&h=160&fit=crop',
      isActive: true,
      trackStock: true
    },
    {
      id: 103,
      name: 'Terang Bulan Pandan Jagung Keju',
      sku: 'TB-PJK-03',
      categoryId: 1,
      price: 42000,
      costPrice: 24000,
      stock: 15,
      unit: 'Porsi',
      image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=160&h=160&fit=crop',
      isActive: true,
      trackStock: true
    },
    {
      id: 104,
      name: 'Terang Bulan Klasik Kacang Coklat Wijen',
      sku: 'TB-KCW-04',
      categoryId: 1,
      price: 32000,
      costPrice: 18000,
      stock: 50,
      unit: 'Porsi',
      image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=160&h=160&fit=crop',
      isActive: true,
      trackStock: true
    },
    {
      id: 201,
      name: 'Martabak Telur Spesial Daging Sapi (3 Telur)',
      sku: 'MT-SP-01',
      categoryId: 2,
      price: 48000,
      costPrice: 29000,
      stock: 35,
      unit: 'Porsi',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=160&h=160&fit=crop',
      isActive: true,
      trackStock: true
    },
    {
      id: 202,
      name: 'Martabak Telur Bebek Jumbo (5 Telur)',
      sku: 'MT-BBK-02',
      categoryId: 2,
      price: 65000,
      costPrice: 40000,
      stock: 20,
      unit: 'Porsi',
      image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=160&h=160&fit=crop',
      isActive: true,
      trackStock: true
    },
    {
      id: 203,
      name: 'Martabak Telur Mozarella Cheesy Melt',
      sku: 'MT-MOZ-03',
      categoryId: 2,
      price: 58000,
      costPrice: 35000,
      stock: 18,
      unit: 'Porsi',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=160&h=160&fit=crop',
      isActive: true,
      trackStock: true
    },
    {
      id: 301,
      name: 'Es Kopi Susu Gula Aren Senja',
      sku: 'DRK-KOP-01',
      categoryId: 3,
      price: 18000,
      costPrice: 8000,
      stock: 80,
      unit: 'Cup',
      image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=160&h=160&fit=crop',
      isActive: true,
      trackStock: true
    },
    {
      id: 302,
      name: 'Es Teh Manis Jasmine Melati',
      sku: 'DRK-TEH-02',
      categoryId: 3,
      price: 8000,
      costPrice: 2500,
      stock: 120,
      unit: 'Cup',
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=160&h=160&fit=crop',
      isActive: true,
      trackStock: false
    },
    {
      id: 303,
      name: 'Matcha Green Tea Latte Dingin',
      sku: 'DRK-MTC-03',
      categoryId: 3,
      price: 24000,
      costPrice: 12000,
      stock: 40,
      unit: 'Cup',
      image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=160&h=160&fit=crop',
      isActive: true,
      trackStock: true
    },
    {
      id: 401,
      name: 'Ekstra Keju Cheddar Parut Melimpah',
      sku: 'TOP-KJU-01',
      categoryId: 4,
      price: 7000,
      costPrice: 4000,
      stock: 60,
      unit: 'Porsi',
      image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=160&h=160&fit=crop',
      isActive: true,
      trackStock: true
    }
  ])

  // Getters
  const totalProducts = computed(() => products.value.length)
  const activeProducts = computed(() => products.value.filter(p => p.isActive).length)
  const lowStockProducts = computed(() => products.value.filter(p => p.trackStock && p.stock <= 20).length)

  const getCategoryName = (categoryId) => {
    const found = categories.value.find(c => c.id === categoryId)
    return found ? found.name : 'Tanpa Kategori'
  }

  // CRUD Produk
  const createProduct = (productData) => {
    const newId = products.value.length ? Math.max(...products.value.map(p => p.id)) + 1 : 101
    const newProduct = {
      id: newId,
      name: productData.name,
      sku: productData.sku || `SKU-${Date.now().toString().slice(-4)}`,
      categoryId: Number(productData.categoryId) || 1,
      price: Number(productData.price) || 0,
      costPrice: Number(productData.costPrice) || 0,
      stock: Number(productData.stock) || 0,
      unit: productData.unit || 'Porsi',
      image: productData.image || 'https://images.unsplash.com/photo-1579888944880-d98341245702?w=160&h=160&fit=crop',
      isActive: Boolean(productData.isActive !== false),
      trackStock: Boolean(productData.trackStock !== false)
    }

    products.value.unshift(newProduct)
    // Update counter kategori
    const cat = categories.value.find(c => c.id === newProduct.categoryId)
    if (cat) cat.itemCount = (cat.itemCount || 0) + 1

    toast.success(`Produk "${newProduct.name}" berhasil ditambahkan!`, 'Produk Dibuat')
    return newProduct
  }

  const updateProduct = (id, productData) => {
    const index = products.value.findIndex(p => p.id === id)
    if (index !== -1) {
      products.value[index] = {
        ...products.value[index],
        ...productData,
        price: Number(productData.price) || 0,
        costPrice: Number(productData.costPrice) || 0,
        stock: Number(productData.stock) || 0
      }
      toast.success(`Produk "${products.value[index].name}" berhasil diperbarui.`, 'Produk Diperbarui')
      return true
    }
    return false
  }

  const deleteProduct = (id) => {
    const index = products.value.findIndex(p => p.id === id)
    if (index !== -1) {
      const deleted = products.value.splice(index, 1)[0]
      const cat = categories.value.find(c => c.id === deleted.categoryId)
      if (cat && cat.itemCount > 0) cat.itemCount -= 1

      toast.info(`Produk "${deleted.name}" telah dihapus.`, 'Produk Dihapus')
      return true
    }
    return false
  }

  // CRUD Kategori
  const createCategory = (catData) => {
    const newId = categories.value.length ? Math.max(...categories.value.map(c => c.id)) + 1 : 1
    const newCategory = {
      id: newId,
      name: catData.name,
      icon: catData.icon || 'tag',
      color: catData.color || '#3b82f6',
      description: catData.description || '',
      itemCount: 0
    }
    categories.value.push(newCategory)
    toast.success(`Kategori "${newCategory.name}" berhasil dibuat!`, 'Kategori Dibuat')
    return newCategory
  }

  const updateCategory = (id, catData) => {
    const index = categories.value.findIndex(c => c.id === id)
    if (index !== -1) {
      categories.value[index] = { ...categories.value[index], ...catData }
      toast.success(`Kategori "${categories.value[index].name}" berhasil diperbarui.`, 'Kategori Diperbarui')
      return true
    }
    return false
  }

  const deleteCategory = (id) => {
    const hasProducts = products.value.some(p => p.categoryId === id)
    if (hasProducts) {
      toast.error('Tidak dapat menghapus kategori yang masih memiliki produk aktif.', 'Gagal Hapus')
      return false
    }
    const index = categories.value.findIndex(c => c.id === id)
    if (index !== -1) {
      const deleted = categories.value.splice(index, 1)[0]
      toast.info(`Kategori "${deleted.name}" telah dihapus.`, 'Kategori Dihapus')
      return true
    }
    return false
  }

  return {
    categories,
    products,
    totalProducts,
    activeProducts,
    lowStockProducts,
    getCategoryName,
    createProduct,
    updateProduct,
    deleteProduct,
    createCategory,
    updateCategory,
    deleteCategory
  }
})
