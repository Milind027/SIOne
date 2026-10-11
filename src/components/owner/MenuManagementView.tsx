import React, { useState } from 'react';
import { useRestaurant } from '../../store/restaurantStore';
import { CATEGORIES, CATEGORY_TRANSLATIONS, MenuItem } from '../../data/menuData';
import { formatCurrency } from '../../lib/formatters';
import { Plus, Check, Edit2, Search, X } from 'lucide-react';

export const MenuManagementView: React.FC = () => {
  const { menuItems, toggleItemStock, updateItemPrice, addNewMenuItem, language, t } = useRestaurant();
  const [selectedCategory, setSelectedCategory] = useState<string>('All Items');
  const [search, setSearch] = useState('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editPriceInput, setEditPriceInput] = useState<string>('');

  // Add new dish modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDishName, setNewDishName] = useState('');
  const [newDishHindiName, setNewDishHindiName] = useState('');
  const [newDishPrice, setNewDishPrice] = useState('');
  const [newDishCategory, setNewDishCategory] = useState<MenuItem['category']>('Starters & Quick Bites');

  const filteredItems = menuItems.filter((item) => {
    const matchesCat = selectedCategory === 'All Items' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.hindiName && item.hindiName.includes(search));
    return matchesCat && matchesSearch;
  });

  const handleStartEdit = (item: MenuItem) => {
    setEditingItemId(item.id);
    setEditPriceInput(item.price.toString());
  };

  const handleSavePrice = (id: string) => {
    const num = parseFloat(editPriceInput);
    if (!isNaN(num) && num > 0) {
      updateItemPrice(id, Math.round(num));
    }
    setEditingItemId(null);
  };

  const handleCreateDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim()) return;
    addNewMenuItem({
      name: newDishName.trim(),
      hindiName: newDishHindiName.trim() || newDishName.trim(),
      price: parseFloat(newDishPrice) || 150,
      category: newDishCategory,
    });
    setNewDishName('');
    setNewDishHindiName('');
    setNewDishPrice('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-5">
      {/* Top Action Bar with "+ नई डिश" Button (from SiOne video) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-[#202124]">
            {t('Menu Manager', 'मेन्यू मैनेजर')}
          </h3>
          <p className="text-xs text-[#5f6368]">
            {t('Add new dishes, turn off 86’d items — updates in seconds across POS & QR', 'नई डिश ऐड, पुरानी हटाओ। मेन्यू सेकंडों में अपडेट।')}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-lg bg-[#d93025] hover:bg-[#c5221f] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t('+ Add New Dish', '+ नई डिश')}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#5f6368]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('Search menu items...', 'डिश या मेन्यू खोजें...')}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#dadce0] rounded-lg text-[#202124] focus:outline-hidden focus:ring-1 focus:ring-[#1a73e8]"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const catLabel = CATEGORY_TRANSLATIONS[cat] ? t(cat, CATEGORY_TRANSLATIONS[cat]) : cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#1a73e8] text-white'
                    : 'bg-white border border-[#dadce0] text-[#5f6368] hover:bg-[#f1f3f4]'
                }`}
              >
                {catLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Table with Toggle Switches (from SiOne video timestamp 00:30) */}
      <div className="bg-white border border-[#dadce0] rounded-xl overflow-hidden shadow-xs">
        <div className="divide-y divide-[#e8eaed]">
          {filteredItems.map((item) => {
            const isLive = item.ratingCount > 0;

            return (
              <div
                key={item.id}
                className="p-4 hover:bg-[#f8f9fa] transition-colors flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center p-0.5 shrink-0 ${
                      item.isVeg ? 'border-[#137333] bg-white' : 'border-[#d93025] bg-white'
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-[#137333]' : 'bg-[#d93025]'}`} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#202124] truncate">
                        {language === 'hi' ? (item.hindiName || item.name) : item.name}
                      </span>
                      {item.isNew && (
                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-[#fce8e6] text-[#c5221f]">
                          {t('NEW', 'नया')}
                        </span>
                      )}
                      {item.isBestseller && (
                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-[#fef7e0] text-[#b06000]">
                          {t('BESTSELLER', 'बेस्टसेलर')}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#5f6368] truncate">
                      {CATEGORY_TRANSLATIONS[item.category] ? t(item.category, CATEGORY_TRANSLATIONS[item.category]) : item.category} · {language === 'hi' ? (item.hindiDescription || item.description) : item.description}
                    </div>
                  </div>
                </div>

                {/* Price and Switch */}
                <div className="flex items-center gap-5 shrink-0">
                  {editingItemId === item.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={editPriceInput}
                        onChange={(e) => setEditPriceInput(e.target.value)}
                        className="w-16 px-2 py-1 text-xs font-mono border border-[#dadce0] rounded text-right"
                      />
                      <button
                        onClick={() => handleSavePrice(item.id)}
                        className="p-1 rounded bg-[#137333] text-white"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-sm text-[#202124]">
                        {formatCurrency(item.price)}
                      </span>
                      <button
                        onClick={() => handleStartEdit(item)}
                        className="p-1 text-[#5f6368] hover:text-[#202124]"
                        title="Edit Price"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* Clean iOS/Google toggle switch matching SiOne video */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isLive}
                      onChange={() => toggleItemStock(item.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#dadce0] peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#188038]" />
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add New Dish Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl border border-[#dadce0] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#dadce0]">
              <h3 className="font-bold text-base text-[#202124]">
                {t('Add New Dish to Menu', 'मेन्यू में नई डिश जोड़ें')}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-[#5f6368] hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDish} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#5f6368]">{t('Dish Name (English)', 'डिश का नाम (अंग्रेजी)')}</label>
                <input
                  type="text"
                  required
                  value={newDishName}
                  onChange={(e) => setNewDishName(e.target.value)}
                  placeholder="e.g. Kadai Paneer, Garlic Naan"
                  className="w-full mt-1 p-2.5 bg-[#f8f9fa] border border-[#dadce0] rounded-lg text-[#202124]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#5f6368]">{t('Hindi Name', 'डिश का नाम (हिंदी)')}</label>
                <input
                  type="text"
                  value={newDishHindiName}
                  onChange={(e) => setNewDishHindiName(e.target.value)}
                  placeholder="उदा. कड़ाही पनीर, गार्लिक नान"
                  className="w-full mt-1 p-2.5 bg-[#f8f9fa] border border-[#dadce0] rounded-lg text-[#202124]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#5f6368]">{t('Selling Price (₹)', 'कीमत (₹)')}</label>
                  <input
                    type="number"
                    required
                    value={newDishPrice}
                    onChange={(e) => setNewDishPrice(e.target.value)}
                    placeholder="260"
                    className="w-full mt-1 p-2.5 bg-[#f8f9fa] border border-[#dadce0] rounded-lg text-[#202124] font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#5f6368]">{t('Category', 'कैटेगरी')}</label>
                  <select
                    value={newDishCategory}
                    onChange={(e) => setNewDishCategory(e.target.value as MenuItem['category'])}
                    className="w-full mt-1 p-2.5 bg-[#f8f9fa] border border-[#dadce0] rounded-lg text-[#202124]"
                  >
                    <option value="Starters & Quick Bites">Starters & Quick Bites</option>
                    <option value="Main Course & Tandoor">Main Course & Tandoor</option>
                    <option value="Breads & Rice">Breads & Rice</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#dadce0] text-[#5f6368] hover:bg-[#f1f3f4]"
                >
                  {t('Cancel', 'रद्द करें')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#1a73e8] hover:bg-[#1765c9] text-white font-semibold"
                >
                  {t('Add to Live Menu', 'मेन्यू में जोड़ें')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
