'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/authContext';
import { useMenuData } from '@/hooks/useMenuData';
import DataManagementWorkflow from '@/components/admin/data-management/DataManagementWorkflow';
import OverviewDashboard from '@/components/admin/dashboard/OverviewDashboard';
import { Database, LogOut, LayoutDashboard, UtensilsCrossed, Settings, Plus, Edit2, Trash2, Users, ChevronDown, ChevronRight, GripVertical, Save, ExternalLink, Palette } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { updateTheme, batchUpdateMenu, updateCategory, updateMenuItem } from '@/lib/firebase/menuService';
import { rawMenuSections } from '@/lib/menu';
import { db } from '@/lib/firebase/config';
import { doc, setDoc, writeBatch, collection, getDocs, updateDoc, getDoc } from 'firebase/firestore';
import { PREDEFINED_THEMES } from '@/lib/themes/predefinedThemes';


// Sortable wrapper for individual menu ITEMS (inside a category)
function SortableItem({ id, children, className }: { id: string, children: React.ReactNode, className?: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  return (
    <div ref={setNodeRef} style={style} className={`${className ?? ''} flex items-center gap-2`}>
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-600 p-1 flex-shrink-0 touch-none">
        <GripVertical size={18} />
      </button>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

// Sortable wrapper for CATEGORIES
function SortableCategory({ id, children, className }: { id: string, children: React.ReactNode, className?: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  return (
    <div ref={setNodeRef} style={style} className={`${className ?? ''} relative group/cat`}>
      <div {...attributes} {...listeners} className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 p-1 z-10 touch-none hidden group-hover/cat:block">
        <GripVertical size={18} />
      </div>
      {children}
    </div>
  );
}

export default function AdminDashboard() {
  const { user, userRole, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [currentRestaurantId, setCurrentRestaurantId] = useState('');
  const { categories, items, loading: dataLoading } = useMenuData(currentRestaurantId);
  const [activeTab, setActiveTab] = useState<'stats' | 'categories' | 'items' | 'menu' | 'theme' | 'data' | 'settings' | 'super_admin'>(userRole?.role === 'super_admin' ? 'super_admin' : 'stats');

  const [allRestaurants, setAllRestaurants] = useState<any[]>([]);

  // Menu Management State
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const [localCategories, setLocalCategories] = useState<any[]>([]);
  const [localItems, setLocalItems] = useState<any[]>([]);
  const [deletedCategoryIds, setDeletedCategoryIds] = useState<string[]>([]);
  const [deletedItemIds, setDeletedItemIds] = useState<string[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };
  
  useEffect(() => {
    if (!hasUnsavedChanges && !dataLoading) {
      setLocalCategories(categories.map(c => ({...c})));
      setLocalItems(items.map(i => ({...i})));
    }
  }, [categories, items, dataLoading, hasUnsavedChanges]);

  const handleDragEnd = (event: DragEndEvent, categoryId: string) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setLocalItems(prevItems => {
        const catItems = prevItems.filter(i => i.categoryId === categoryId).sort((a, b) => a.sortOrder - b.sortOrder);
        const oldIndex = catItems.findIndex(i => i.id === active.id);
        const newIndex = catItems.findIndex(i => i.id === over.id);
        const newCatItems = arrayMove(catItems, oldIndex, newIndex);
        newCatItems.forEach((item, index) => { item.sortOrder = index; });
        const newItems = [...prevItems];
        newCatItems.forEach(updatedItem => {
          const idx = newItems.findIndex(i => i.id === updatedItem.id);
          if (idx !== -1) newItems[idx] = updatedItem;
        });
        setHasUnsavedChanges(true);
        return newItems;
      });
    }
  };

  const handleCategoryDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setLocalCategories(prev => {
        const oldIndex = prev.findIndex(c => c.id === active.id);
        const newIndex = prev.findIndex(c => c.id === over.id);
        const reordered = arrayMove(prev, oldIndex, newIndex);
        reordered.forEach((cat, index) => { cat.sortOrder = index; });
        setHasUnsavedChanges(true);
        return reordered;
      });
    }
  };


  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleSaveAllMenu = async () => {
    if (!currentRestaurantId) return;
    try {
      await batchUpdateMenu(currentRestaurantId, localCategories, localItems, deletedCategoryIds, deletedItemIds);
      setHasUnsavedChanges(false);
      setDeletedCategoryIds([]);
      setDeletedItemIds([]);
      showToast('All changes saved ✓');
    } catch (e: any) {
      showToast('Failed to save: ' + e.message, 'error');
    }
  };

  // Immediately toggle item visibility and persist to Firestore
  const handleToggleItem = async (itemId: string, currentActive: boolean) => {
    const newVal = !currentActive;
    setLocalItems(prev => prev.map(i => i.id === itemId ? { ...i, isActive: newVal } : i));
    if (!itemId.startsWith('temp_')) {
      try {
        await updateMenuItem(currentRestaurantId, itemId, { isActive: newVal });
        showToast(newVal ? 'Item shown ✓' : 'Item hidden ✓');
      } catch (e: any) {
        // revert on failure
        setLocalItems(prev => prev.map(i => i.id === itemId ? { ...i, isActive: currentActive } : i));
        showToast('Failed to update item', 'error');
      }
    } else {
      setHasUnsavedChanges(true);
    }
  };

  // Immediately toggle category visibility and persist to Firestore
  const handleToggleCategory = async (catId: string, currentActive: boolean) => {
    const newVal = !currentActive;
    setLocalCategories(prev => prev.map(c => c.id === catId ? { ...c, isActive: newVal } : c));
    if (!catId.startsWith('temp_')) {
      try {
        await updateCategory(currentRestaurantId, catId, { isActive: newVal });
        showToast(newVal ? 'Category shown ✓' : 'Category hidden ✓');
      } catch (e: any) {
        setLocalCategories(prev => prev.map(c => c.id === catId ? { ...c, isActive: currentActive } : c));
        showToast('Failed to update category', 'error');
      }
    } else {
      setHasUnsavedChanges(true);
    }
  };

  
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({...prev, [categoryId]: !prev[categoryId]}));
  };

  // Setting profile state
  const [profileSettings, setProfileSettings] = useState<any>({
    instagramUrl: '',
    reviewUrl: '',
    heroVideoUrl: '',
    mobileNumber: '',
    address: '',
    logoUrl: ''
  });

  // Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [selectedCategoryIdForNewItem, setSelectedCategoryIdForNewItem] = useState<string>('');

  useEffect(() => {
    if (!currentRestaurantId) {
      if (userRole?.role === 'super_admin') {
        // Let it be empty so Super Admin Hub shows by default
      } else if (userRole?.restaurantIds && userRole.restaurantIds.length > 0) {
        setCurrentRestaurantId(userRole.restaurantIds[0]);
      } else if (userRole?.restaurantId) {
        setCurrentRestaurantId(userRole.restaurantId); // legacy fallback
      } else if (userRole?.role === 'owner' || userRole?.role === 'guest') {
        router.push('/admin/onboarding'); // Fallback redirect if they somehow reached here
      }
    } else {
      // Fetch current restaurant settings
      getDoc(doc(db, 'restaurants', currentRestaurantId, 'settings', 'theme')).then(snap => {
        if (snap.exists()) {
          const data = snap.data();
          setProfileSettings({
            instagramUrl: data.instagramUrl || '',
            reviewUrl: data.reviewUrl || '',
            heroVideoUrl: data.heroVideoUrl || '',
            mobileNumber: data.mobileNumber || '',
            address: data.address || '',
            logoUrl: data.logoUrl || ''
          });
        }
      });
    }
  }, [userRole, currentRestaurantId]);

  useEffect(() => {
    if (userRole?.role === 'super_admin' || userRole?.role === 'owner') {
      getDocs(collection(db, 'restaurants')).then(snap => {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setAllRestaurants(list);
      }).catch(console.error);
    }
  }, [userRole]);

  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'super_admin' && userRole?.role === 'super_admin') {
      setUsersLoading(true);
      getDocs(collection(db, 'users')).then(snap => {
        const usersList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setAllUsers(usersList);
        setUsersLoading(false);
      }).catch(err => {
        console.error(err);
        setUsersLoading(false);
      });
    }
  }, [activeTab, userRole]);

  const handleUpdateUser = async (uid: string, newRole: string, newRestaurantIds: string[]) => {
    try {
      await updateDoc(doc(db, 'users', uid), { 
        role: newRole, 
        restaurantIds: newRestaurantIds,
        restaurantId: newRestaurantIds.length > 0 ? newRestaurantIds[0] : ''
      });
      alert('User updated!');
    } catch (e: any) {
      alert('Error updating user: ' + e.message);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/admin/login');
      } else if (userRole?.role === 'super_admin') {
        // Super admin is always allowed
      } else if (userRole?.role !== 'owner' || !userRole?.restaurantId) {
        router.push('/admin/login');
      }
    }
  }, [user, userRole, authLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const [isMigrating, setIsMigrating] = useState(false);

  const handleMigrateData = async () => {
    if (!currentRestaurantId) return;
    if (!window.confirm(`This will load all demo categories and items into ${currentRestaurantId}. Proceed?`)) return;
    
    setIsMigrating(true);
    try {
      const RESTAURANT_ID = currentRestaurantId;
      let sortOrder = 0;
      
      for (const category of rawMenuSections) {
        const categoryId = category.id;
        const categoryRef = doc(db, `restaurants/${RESTAURANT_ID}/categories`, categoryId);
        
        await setDoc(categoryRef, {
          name: category.title,
          description: category.subtitle || '',
          sortOrder: sortOrder++,
          isActive: true
        });

        const batch = writeBatch(db);
        let itemSortOrder = 0;
        
        for (const item of category.items) {
          const itemId = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          const itemRef = doc(db, `restaurants/${RESTAURANT_ID}/items`, itemId);
          
          const itemData: any = {
            categoryId: categoryId,
            name: item.name,
            description: item.description || '',
            imageUrl: (item as any).imageUrl || '',
            isVeg: (item as any).isVeg !== undefined ? (item as any).isVeg : true,
            isSpicy: (item as any).isSpicy || false,
            isGlutenFree: (item as any).isGlutenFree || false,
            customTag: item.customTag || '',
            sortOrder: itemSortOrder++,
            isActive: true
          };

          if (item.price !== undefined) itemData.price = item.price;
          if (item.prices !== undefined) itemData.prices = item.prices;

          batch.set(itemRef, itemData);
        }
        await batch.commit();
      }
      alert('Migration completed successfully!');
    } catch (error: any) {
      console.error(error);
      alert(`Error migrating data: ${error.message}`);
    } finally {
      setIsMigrating(false);
    }
  };

  if (authLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 font-sans text-gray-900 overflow-hidden">

      {/* ── Mobile Top Header (always visible) ── */}
      <div className="md:hidden flex items-center justify-between bg-white border-b px-4 py-3 z-20 shrink-0 shadow-sm">
        <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
        {hasUnsavedChanges && (
          <button
            onClick={handleSaveAllMenu}
            className="bg-green-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-sm font-medium shadow-sm active:scale-95 transition-transform"
          >
            <Save size={15} /> Save
          </button>
        )}
        {currentRestaurantId && (
          <a
            href={`/menu/${currentRestaurantId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 bg-black text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-sm font-medium shadow-sm active:scale-95 transition-transform"
          >
            <ExternalLink size={15} /> Preview
          </a>
        )}
      </div>

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex flex-col w-64 bg-white shadow-sm shrink-0">
        <div className="p-6 border-b space-y-4 flex flex-col">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          </div>

          {/* Desktop: Save All Changes button */}
          {hasUnsavedChanges && (
            <button
              onClick={handleSaveAllMenu}
              className="w-full bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition font-medium shadow-sm text-sm"
            >
              <Save size={16} /> Save All Changes
            </button>
          )}

          {(userRole?.role === 'super_admin' || (userRole?.restaurantIds && userRole.restaurantIds.length > 1)) && (
            <div className="relative">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Active Restaurant</label>
              <div className="relative">
                <select
                  className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg pl-3 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-black"
                  value={currentRestaurantId || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCurrentRestaurantId(val);
                    if (val === '') {
                      setActiveTab('super_admin');
                    } else if (activeTab === 'super_admin') {
                      setActiveTab('stats');
                    }
                  }}
                >
                  {userRole?.role === 'super_admin' && (
                    <option value="">⚙️ Super Admin Hub</option>
                  )}
                  {allRestaurants.filter(r => userRole?.role === 'super_admin' || userRole?.restaurantIds?.includes(r.id)).map(r => (
                    <option key={r.id} value={r.id}>{r.name || r.id}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
              </div>
            </div>
          )}
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {currentRestaurantId && (
            <>
              <button
                onClick={() => setActiveTab('stats')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'stats' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <LayoutDashboard size={20} />
                <span className="font-medium">Overview</span>
              </button>
              <button
                onClick={() => setActiveTab('menu')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'menu' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <UtensilsCrossed size={20} />
                <span className="font-medium">Menu Management</span>
              </button>
              <button
                onClick={() => setActiveTab('theme')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'theme' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Palette size={20} />
                <span className="font-medium">Theme</span>
              </button>
              <button
                onClick={() => setActiveTab('data')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'data' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Database size={20} />
                <span className="font-medium">Data (Beta)</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Settings size={20} />
                <span className="font-medium">Settings</span>
              </button>
              
              <div className="pt-4 mt-2 border-t border-gray-100">
                <a
                  href={`/menu/${currentRestaurantId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-black bg-gray-100 hover:bg-gray-200"
                >
                  <ExternalLink size={20} />
                  <span className="font-medium">View Live Menu</span>
                </a>
              </div>
            </>
          )}
          {userRole?.role === 'super_admin' && !currentRestaurantId && (
            <button
              onClick={() => setActiveTab('super_admin')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'super_admin' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Users size={20} />
              <span className="font-medium">Super Admin</span>
            </button>
          )}
        </nav>
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
        {activeTab === 'stats' && (
          <OverviewDashboard
            restaurant={allRestaurants.find(r => r.id === currentRestaurantId) || null}
            profileSettings={profileSettings}
            categories={categories}
            items={items}
            onNavigate={(tab) => setActiveTab(tab as any)}
            onRestaurantUpdate={(updatedRestaurant) => {
              setAllRestaurants(prev => prev.map(r => r.id === updatedRestaurant.id ? updatedRestaurant : r));
            }}
          />
        )}

        {activeTab === 'menu' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Menu Management</h2>
              <div className="flex items-center gap-3">
                {hasUnsavedChanges && (
                  <button 
                    onClick={handleSaveAllMenu}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition font-medium shadow-sm"
                  >
                    <Save size={18} /> Save All Changes
                  </button>
                )}
                <button 
                  onClick={() => { setEditingCategory(null); setIsCategoryModalOpen(true); }}
                  className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition"
                >
                  <Plus size={18} /> Add Category
                </button>
              </div>
            </div>
            
            {dataLoading ? (
              <div className="text-gray-500">Loading menu...</div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {localCategories.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    No categories found. Create a category to get started.
                  </div>
                )}
                {/* Category-level DnD */}
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleCategoryDragEnd}>
                  <SortableContext items={localCategories.map(c => c.id)} strategy={verticalListSortingStrategy}>
                    {localCategories.map(cat => (
                      <SortableCategory key={cat.id} id={cat.id} className="border-b last:border-b-0">
                        {/* Category header row */}
                        <div
                          className={`flex items-center justify-between p-4 pl-8 cursor-pointer hover:bg-gray-50 ${!cat.isActive ? 'opacity-60 bg-gray-50' : ''}`}
                          onClick={() => toggleCategory(cat.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`transform transition-transform ${expandedCategories[cat.id] ? 'rotate-90' : ''}`}>
                              <ChevronRight size={20} className="text-gray-400" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{cat.name}</h3>
                              <p className="text-sm text-gray-500">{cat.description || 'No description'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => { setSelectedCategoryIdForNewItem(cat.id); setEditingItem(null); setIsItemModalOpen(true); }}
                              className="text-xs bg-gray-100 px-2 sm:px-3 py-1 rounded-full flex items-center gap-1 hover:bg-gray-200"
                            >
                              <Plus size={14} /> <span className="hidden sm:inline">Add Item</span>
                            </button>
                            <div className="w-px h-6 bg-gray-200"></div>
                            {/* Pill Toggle for category */}
                            <button
                              onClick={() => handleToggleCategory(cat.id, cat.isActive)}
                              title={cat.isActive ? 'Hide Category' : 'Show Category'}
                              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                cat.isActive ? 'bg-green-500' : 'bg-gray-300'
                              }`}
                            >
                              <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ease-in-out ${
                                  cat.isActive ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                            <button onClick={() => { setEditingCategory(cat); setIsCategoryModalOpen(true); }} className="text-blue-600 hover:text-blue-800 p-1" title="Edit Category"><Edit2 size={18} /></button>
                            <button onClick={() => { if(window.confirm('Delete category and all its items?')) { setDeletedCategoryIds(prev => [...prev, cat.id]); setLocalCategories(prev => prev.filter(c => c.id !== cat.id)); setHasUnsavedChanges(true); } }} className="text-red-600 hover:text-red-800 p-1" title="Delete Category"><Trash2 size={18} /></button>
                          </div>
                        </div>

                        {/* Items inside this category */}
                        {expandedCategories[cat.id] && (
                          <div className="bg-gray-50 p-3 space-y-2 border-t">
                            {localItems.filter(i => i.categoryId === cat.id).sort((a,b) => a.sortOrder - b.sortOrder).length === 0 ? (
                              <p className="text-sm text-gray-500 italic px-2">No items in this category.</p>
                            ) : (
                              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, cat.id)}>
                                <SortableContext
                                  items={localItems.filter(i => i.categoryId === cat.id).sort((a,b) => a.sortOrder - b.sortOrder).map(i => i.id)}
                                  strategy={verticalListSortingStrategy}
                                >
                                  {localItems.filter(i => i.categoryId === cat.id).sort((a,b) => a.sortOrder - b.sortOrder).map(item => (
                                    <SortableItem key={item.id} id={item.id} className={`p-3 bg-white rounded-lg border shadow-sm ${!item.isActive ? 'opacity-50' : ''}`}>
                                      {/* Item content + action row */}
                                      <div className="flex items-center justify-between min-w-0">
                                        <div className="min-w-0 mr-2">
                                          <p className="font-medium text-gray-900 text-sm truncate">{item.name}</p>
                                          <p className="text-xs text-gray-500 truncate">₹{item.price}{item.description ? ` · ${item.description}` : ''}</p>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
                                          {/* Pill Toggle for item */}
                                          <button
                                            onClick={() => handleToggleItem(item.id, item.isActive)}
                                            title={item.isActive ? 'Hide Item' : 'Show Item'}
                                            className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                              item.isActive ? 'bg-green-500' : 'bg-gray-300'
                                            }`}
                                          >
                                            <span
                                              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition-transform duration-200 ease-in-out ${
                                                item.isActive ? 'translate-x-4' : 'translate-x-0'
                                              }`}
                                            />
                                          </button>
                                          <button onClick={() => { setEditingItem(item); setIsItemModalOpen(true); }} className="text-blue-600 hover:text-blue-800 p-1"><Edit2 size={16} /></button>
                                          <button onClick={() => { if(window.confirm('Delete item?')) { setDeletedItemIds(prev => [...prev, item.id]); setLocalItems(prev => prev.filter(i => i.id !== item.id)); setHasUnsavedChanges(true); } }} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={16} /></button>
                                        </div>
                                      </div>
                                    </SortableItem>
                                  ))}
                                </SortableContext>
                              </DndContext>
                            )}
                          </div>
                        )}
                      </SortableCategory>
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
            )}

          </div>
        )}

                        {activeTab === 'data' && (
          <div className="w-full">
            <DataManagementWorkflow restaurantId={currentRestaurantId} />
          </div>
        )}

{activeTab === 'theme' && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Theme</h2>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-1">Theme Selection</h3>
              <p className="text-sm text-gray-500 mb-5">Choose a theme — changes apply instantly on your live menu.</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PREDEFINED_THEMES.map(theme => {
                  const isActive = profileSettings.activeThemeId === theme.id || (!profileSettings.activeThemeId && theme.id === 'warm-artisan');
                  return (
                  <button
                    key={theme.id}
                    onClick={async () => {
                      if (currentRestaurantId) {
                        try {
                          await updateTheme(currentRestaurantId, {
                            activeThemeId: theme.id,
                            // Clear any custom overrides if user switches to a predefined theme
                            customTheme: null
                          } as any);
                          setProfileSettings({...profileSettings, activeThemeId: theme.id, customTheme: null});
                          showToast(`Theme set to "${theme.name}" ✓`);
                        } catch (err: any) {
                          showToast(`Error: ${err.message}`, 'error');
                        }
                      } else {
                        showToast('Select a restaurant first.', 'error');
                      }
                    }}
                    className={`border-2 rounded-xl p-3 flex flex-col items-start gap-2 transition-all group text-left ${isActive ? 'border-gray-900 shadow-md ring-2 ring-gray-900 ring-offset-2' : 'border-gray-100 hover:border-gray-900 hover:shadow-md'}`}
                  >
                    {/* 3-color swatch strip */}
                    <div className="w-full h-10 rounded-lg overflow-hidden flex shadow-sm">
                      <div className="flex-1" style={{ backgroundColor: theme.colors.background }} />
                      <div className="flex-1" style={{ backgroundColor: theme.colors.primary }} />
                      <div className="flex-1" style={{ backgroundColor: theme.colors.accent }} />
                    </div>
                    <span className={`font-medium text-xs leading-snug ${isActive ? 'text-black font-bold' : 'text-gray-800 group-hover:text-black'}`}>{theme.name}</span>
                  </button>
                )})}
                
                {/* CUSTOM THEME BUTTON */}
                <button
                    onClick={async () => {
                      if (currentRestaurantId) {
                        try {
                          const initialCustomTheme = profileSettings.customTheme || { colors: PREDEFINED_THEMES[0].colors };
                          await updateTheme(currentRestaurantId, {
                            activeThemeId: 'custom',
                            customTheme: initialCustomTheme
                          } as any);
                          setProfileSettings({...profileSettings, activeThemeId: 'custom', customTheme: initialCustomTheme});
                          showToast(`Custom theme selected ✓`);
                        } catch (err: any) {
                          showToast(`Error: ${err.message}`, 'error');
                        }
                      } else {
                        showToast('Select a restaurant first.', 'error');
                      }
                    }}
                    className={`border-2 rounded-xl p-3 flex flex-col items-start gap-2 transition-all group text-left ${profileSettings.activeThemeId === 'custom' ? 'border-gray-900 shadow-md ring-2 ring-gray-900 ring-offset-2' : 'border-gray-100 hover:border-gray-900 hover:shadow-md'}`}
                >
                    <div className="w-full h-10 rounded-lg overflow-hidden flex shadow-sm border border-dashed border-gray-300 items-center justify-center bg-gray-50 group-hover:bg-gray-100">
                        <span className="text-xl">🎨</span>
                    </div>
                    <span className={`font-medium text-xs leading-snug ${profileSettings.activeThemeId === 'custom' ? 'text-black font-bold' : 'text-gray-800 group-hover:text-black'}`}>Custom Theme</span>
                </button>
              </div>

              {profileSettings.activeThemeId === 'custom' && profileSettings.customTheme?.colors && (
                <div className="mt-6 p-5 border border-gray-200 rounded-xl bg-gray-50/50">
                  <h4 className="font-semibold text-sm mb-4">Customize Colors</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {Object.entries(profileSettings.customTheme.colors).map(([key, value]) => (
                      <div key={key} className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-600 capitalize">{key}</label>
                        <div className="flex gap-2 items-center">
                          <input 
                            type="color" 
                            value={value as string} 
                            onChange={(e) => {
                                const newCustomTheme = {
                                    ...profileSettings.customTheme,
                                    colors: {
                                        ...profileSettings.customTheme.colors,
                                        [key]: e.target.value
                                    }
                                };
                                setProfileSettings({ ...profileSettings, customTheme: newCustomTheme });
                            }}
                            onBlur={async () => {
                                if (currentRestaurantId) {
                                    await updateTheme(currentRestaurantId, {
                                        activeThemeId: 'custom',
                                        customTheme: profileSettings.customTheme
                                    } as any);
                                }
                            }}
                            className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                          />
                          <input 
                            type="text" 
                            value={value as string}
                            onChange={(e) => {
                                const newCustomTheme = {
                                    ...profileSettings.customTheme,
                                    colors: {
                                        ...profileSettings.customTheme.colors,
                                        [key]: e.target.value
                                    }
                                };
                                setProfileSettings({ ...profileSettings, customTheme: newCustomTheme });
                            }}
                            onBlur={async () => {
                                if (currentRestaurantId) {
                                    await updateTheme(currentRestaurantId, {
                                        activeThemeId: 'custom',
                                        customTheme: profileSettings.customTheme
                                    } as any);
                                }
                            }}
                            className="text-xs uppercase border border-gray-300 rounded px-2 py-1.5 w-20 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Settings</h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Restaurant Profile</h3>
                <button 
                  onClick={async () => {
                    if (currentRestaurantId) {
                      try {
                        await updateTheme(currentRestaurantId, profileSettings);
                        alert('Profile saved successfully!');
                      } catch (err: any) {
                        alert('Error saving profile: ' + err.message);
                      }
                    }
                  }}
                  className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors"
                >
                  Save Profile
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant ID</label>
                  <input 
                    type="text" 
                    disabled={true}
                    value={currentRestaurantId}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed" 
                  />
                  {userRole?.role === 'super_admin' && (
                    <p className="text-xs text-gray-500 mt-1">Super admins can change the active restaurant from the top-left sidebar dropdown.</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                    <input 
                      type="text" 
                      value={profileSettings.mobileNumber || ''}
                      onChange={e => setProfileSettings({...profileSettings, mobileNumber: e.target.value})}
                      placeholder="+91 9876543210"
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-black focus:border-black" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instagram Link</label>
                    <input 
                      type="url" 
                      value={profileSettings.instagramUrl || ''}
                      onChange={e => setProfileSettings({...profileSettings, instagramUrl: e.target.value})}
                      placeholder="https://instagram.com/yourcafe"
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-black focus:border-black" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Review Link</label>
                    <input 
                      type="url" 
                      value={profileSettings.reviewUrl || ''}
                      onChange={e => setProfileSettings({...profileSettings, reviewUrl: e.target.value})}
                      placeholder="https://g.page/r/..."
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-black focus:border-black" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                    <input 
                      type="url" 
                      value={profileSettings.logoUrl || ''}
                      onChange={e => setProfileSettings({...profileSettings, logoUrl: e.target.value})}
                      placeholder="https://example.com/logo.png"
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-black focus:border-black" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hero Video URL</label>
                  <input 
                    type="url" 
                    value={profileSettings.heroVideoUrl || ''}
                    onChange={e => setProfileSettings({...profileSettings, heroVideoUrl: e.target.value})}
                    placeholder="https://example.com/video.mp4"
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-black focus:border-black" 
                  />
                  <p className="text-xs text-gray-500 mt-1">Direct link to an mp4 video file. Avoid YouTube links as they don't autoplay seamlessly.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea 
                    value={profileSettings.address || ''}
                    onChange={e => setProfileSettings({...profileSettings, address: e.target.value})}
                    placeholder="123 Cafe Street, City, Country"
                    rows={2}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-black focus:border-black resize-none" 
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl mt-6">
              <h3 className="text-lg font-semibold mb-4 text-red-600">Data Management</h3>
              <p className="text-sm text-gray-500 mb-6">Import demo menu data. This will create categories and items based on the predefined Cafe 9:50 menu.</p>
              
              <button
                onClick={handleMigrateData}
                disabled={isMigrating}
                className="bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isMigrating ? 'Migrating Data...' : 'Migrate Demo Menu Data'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'super_admin' && userRole?.role === 'super_admin' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-purple-700">Super Admin Portal</h2>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
              <h3 className="text-lg font-semibold mb-4">Create New Restaurant</h3>
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
                  <input 
                    type="text" 
                    id="newRestName" 
                    className="w-full border border-gray-300 rounded px-3 py-2" 
                    placeholder="My Awesome Cafe" 
                    onChange={(e) => {
                      const idInput = document.getElementById('newRestId') as HTMLInputElement;
                      if (idInput && (!idInput.value || idInput.dataset.auto === 'true')) {
                        // Generate slug without hyphens (e.g. "Cafe 950" -> "cafe950")
                        idInput.value = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '');
                        idInput.dataset.auto = 'true';
                      }
                    }}
                  />
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant ID / Slug (URL-friendly)</label>
                  <input 
                    type="text" 
                    id="newRestId" 
                    className="w-full border border-gray-300 rounded px-3 py-2" 
                    placeholder="myawesomecafe" 
                    onChange={(e) => {
                      e.target.dataset.auto = 'false';
                    }}
                  />
                </div>
                <button 
                  onClick={async () => {
                    const name = (document.getElementById('newRestName') as HTMLInputElement).value;
                    const id = (document.getElementById('newRestId') as HTMLInputElement).value;
                    if (!name || !id) return alert('Fill both fields');
                    if (id.includes(' ')) return alert('ID cannot contain spaces');
                    try {
                      await setDoc(doc(db, 'restaurants', id), { name, slug: id });
                      alert('Restaurant created!');
                      window.location.reload();
                    } catch(e:any) {
                      alert(e.message);
                    }
                  }}
                  className="bg-black text-white px-6 py-2 rounded font-medium hover:bg-gray-800 transition-colors w-full sm:w-auto"
                >
                  Create
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
              <h3 className="text-lg font-semibold mb-4">User Management</h3>
              
              {usersLoading ? (
                <p className="text-gray-500">Loading users...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 text-sm border-b">
                      <tr>
                        <th className="px-4 py-3 font-medium">Email</th>
                        <th className="px-4 py-3 font-medium">Role</th>
                        <th className="px-4 py-3 font-medium">Restaurant ID</th>
                        <th className="px-4 py-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {allUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{u.email || u.id}</td>
                          <td className="px-4 py-3 text-sm">
                            <select 
                              className="border border-gray-300 rounded px-2 py-1 bg-white"
                              value={u.role}
                              onChange={(e) => {
                                const newUsers = [...allUsers];
                                const index = newUsers.findIndex(x => x.id === u.id);
                                newUsers[index].role = e.target.value;
                                setAllUsers(newUsers);
                              }}
                            >
                              <option value="guest">guest</option>
                              <option value="owner">owner</option>
                              <option value="super_admin">super_admin</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex flex-col gap-2 max-h-40 overflow-y-auto border border-gray-200 p-2 rounded bg-white min-w-[200px]">
                              {allRestaurants.map(r => (
                                <label key={r.id} className="flex items-center gap-2 cursor-pointer">
                                  <input 
                                    type="checkbox"
                                    className="rounded border-gray-300 text-black focus:ring-black"
                                    checked={u.restaurantIds?.includes(r.id) || u.restaurantId === r.id || false}
                                    onChange={(e) => {
                                      const newUsers = [...allUsers];
                                      const index = newUsers.findIndex(x => x.id === u.id);
                                      const currentIds = u.restaurantIds || (u.restaurantId ? [u.restaurantId] : []);
                                      
                                      if (e.target.checked) {
                                        newUsers[index].restaurantIds = [...new Set([...currentIds, r.id])];
                                      } else {
                                        newUsers[index].restaurantIds = currentIds.filter((id: string) => id !== r.id);
                                      }
                                      setAllUsers(newUsers);
                                    }}
                                  />
                                  <span className="text-sm text-gray-700">{r.name || r.id}</span>
                                </label>
                              ))}
                              {allRestaurants.length === 0 && (
                                <span className="text-xs text-gray-500 italic">No restaurants exist yet</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <button 
                              onClick={() => handleUpdateUser(u.id, u.role, u.restaurantIds || (u.restaurantId ? [u.restaurantId] : []))}
                              className="bg-black text-white px-3 py-1.5 rounded hover:bg-gray-800 transition font-medium"
                            >
                              Save
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Basic Modals for Add/Edit */}
            {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Name</label><input type="text" id="catName" className="w-full border rounded-lg p-2" defaultValue={editingCategory?.name} /></div>
              <div><label className="block text-sm font-medium mb-1">Description (Optional)</label><input type="text" id="catDesc" className="w-full border rounded-lg p-2" defaultValue={editingCategory?.description} /></div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setIsCategoryModalOpen(false); setEditingCategory(null); }} className="px-4 py-2 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={() => { 
                const name = (document.getElementById('catName') as HTMLInputElement).value;
                const desc = (document.getElementById('catDesc') as HTMLInputElement).value;
                if (!name) return alert('Name is required');
                
                if (editingCategory) {
                  setLocalCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...c, name, description: desc } : c));
                } else {
                  setLocalCategories(prev => [...prev, { id: 'temp_' + Date.now(), name, description: desc, isActive: true, sortOrder: prev.length }]);
                }
                setHasUnsavedChanges(true);
                setIsCategoryModalOpen(false); 
                setEditingCategory(null); 
              }} className="px-4 py-2 bg-black text-white rounded-lg">Save</button>
            </div>
          </div>
        </div>
      )}

            {isItemModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">{editingItem ? 'Edit Item' : 'Add Item'}</h3>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Name</label><input type="text" id="itemName" className="w-full border rounded-lg p-2" defaultValue={editingItem?.name} /></div>
              <div><label className="block text-sm font-medium mb-1">Price</label><input type="number" id="itemPrice" className="w-full border rounded-lg p-2" defaultValue={editingItem?.price} /></div>
              <div><label className="block text-sm font-medium mb-1">Description (Optional)</label><textarea id="itemDesc" className="w-full border rounded-lg p-2 resize-none" rows={2} defaultValue={editingItem?.description}></textarea></div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setIsItemModalOpen(false); setEditingItem(null); }} className="px-4 py-2 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={() => { 
                const name = (document.getElementById('itemName') as HTMLInputElement).value;
                const price = Number((document.getElementById('itemPrice') as HTMLInputElement).value);
                const desc = (document.getElementById('itemDesc') as HTMLTextAreaElement).value;
                if (!name || isNaN(price)) return alert('Name and Price are required');

                if (editingItem) {
                  setLocalItems(prev => prev.map(i => i.id === editingItem.id ? { ...i, name, price, description: desc } : i));
                } else {
                  const itemsInCat = localItems.filter(i => i.categoryId === selectedCategoryIdForNewItem);
                  setLocalItems(prev => [...prev, { id: 'temp_' + Date.now(), categoryId: selectedCategoryIdForNewItem, name, price, description: desc, isActive: true, sortOrder: itemsInCat.length }]);
                }
                setHasUnsavedChanges(true);
                setIsItemModalOpen(false); 
                setEditingItem(null); 
              }} className="px-4 py-2 bg-black text-white rounded-lg">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Bottom Tab Bar (always visible) ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-[0_-2px_12px_rgba(0,0,0,0.08)] flex items-stretch">
        {currentRestaurantId ? (
          <>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-colors ${
                activeTab === 'stats' ? 'text-black' : 'text-gray-400'
              }`}
            >
              <LayoutDashboard size={22} />
              <span className={`text-[10px] font-medium ${activeTab === 'stats' ? 'text-black' : 'text-gray-400'}`}>Overview</span>
              {activeTab === 'stats' && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-black rounded-full" />}
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-colors relative ${
                activeTab === 'menu' ? 'text-black' : 'text-gray-400'
              }`}
            >
              <UtensilsCrossed size={22} />
              <span className={`text-[10px] font-medium ${activeTab === 'menu' ? 'text-black' : 'text-gray-400'}`}>Menu</span>
              {activeTab === 'menu' && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-black rounded-full" />}
            </button>
            <button
              onClick={() => setActiveTab('theme')}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-colors relative ${
                activeTab === 'theme' ? 'text-black' : 'text-gray-400'
              }`}
            >
              <Palette size={22} />
              <span className={`text-[10px] font-medium ${activeTab === 'theme' ? 'text-black' : 'text-gray-400'}`}>Theme</span>
              {activeTab === 'theme' && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-black rounded-full" />}
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-colors relative ${
                activeTab === 'data' ? 'text-black' : 'text-gray-400'
              }`}
            >
              <Database size={22} />
              <span className={`text-[10px] font-medium ${activeTab === 'data' ? 'text-black' : 'text-gray-400'}`}>Data</span>
              {activeTab === 'data' && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-black rounded-full" />}
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-colors relative ${
                activeTab === 'settings' ? 'text-black' : 'text-gray-400'
              }`}
            >
              <Settings size={22} />
              <span className={`text-[10px] font-medium ${activeTab === 'settings' ? 'text-black' : 'text-gray-400'}`}>Settings</span>
              {activeTab === 'settings' && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-black rounded-full" />}
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-red-500 transition-colors relative"
            >
              <LogOut size={22} />
              <span className="text-[10px] font-medium">Sign Out</span>
            </button>
          </>
        ) : userRole?.role === 'super_admin' ? (
          <>
            <button
              onClick={() => setActiveTab('super_admin')}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-colors relative ${
                activeTab === 'super_admin' ? 'text-black' : 'text-gray-400'
              }`}
            >
              <Users size={22} />
              <span className={`text-[10px] font-medium ${activeTab === 'super_admin' ? 'text-black' : 'text-gray-400'}`}>Admin</span>
              {activeTab === 'super_admin' && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-black rounded-full" />}
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-red-500 transition-colors"
            >
              <LogOut size={22} />
              <span className="text-[10px] font-medium">Sign Out</span>
            </button>
          </>
        ) : null}
      </nav>

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg text-white text-sm font-medium transition-all animate-in fade-in slide-in-from-bottom-4 duration-300 ${
            toast.type === 'success' ? 'bg-gray-900' : 'bg-red-600'
          }`}
        >
          {toast.type === 'success' ? (
            <svg className="w-4 h-4 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {toast.message}
        </div>
      )}
    </div>
  );
}
