import React, { useState } from 'react';
import { ExternalLink, CheckCircle2, AlertCircle, Loader2, Plus, LayoutGrid, Palette, Video, Link as LinkIcon, Download, Globe, AlertTriangle } from 'lucide-react';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface Props {
  restaurant: any;
  profileSettings: any;
  categories: any[];
  items: any[];
  onNavigate: (tab: string) => void;
  onRestaurantUpdate: (updatedRestaurant: any) => void;
}

export default function OverviewDashboard({ restaurant, profileSettings, categories, items, onNavigate, onRestaurantUpdate }: Props) {
  const [isPublishing, setIsPublishing] = useState(false);

  const isLive = restaurant?.isPublished === true;
  const publicUrl = restaurant?.slug ? `${window.location.origin}/menu/${restaurant.slug}` : '';

  const handlePublishToggle = async () => {
    if (!restaurant?.id) return;
    setIsPublishing(true);
    try {
      const newStatus = !isLive;
      await updateDoc(doc(db, 'restaurants', restaurant.id), {
        isPublished: newStatus
      });
      onRestaurantUpdate({ ...restaurant, isPublished: newStatus });
    } catch (error) {
      console.error('Failed to publish menu:', error);
      alert('Failed to update publishing status.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCopyLink = () => {
    if (publicUrl) {
      navigator.clipboard.writeText(publicUrl);
      alert('Menu link copied to clipboard!');
    }
  };

  // Evaluate Menu Health
  const healthChecks = [
    {
      id: 'published',
      label: 'Menu is published',
      passed: isLive,
      critical: true,
      action: () => {} // Handled by status section
    },
    {
      id: 'logo',
      label: 'Logo added',
      passed: !!profileSettings?.logoUrl,
      critical: false,
      action: () => onNavigate('theme')
    },
    {
      id: 'hero',
      label: 'Hero section configured',
      passed: !!profileSettings?.heroVideoUrl || !!profileSettings?.customTheme?.colors?.primary,
      critical: false,
      action: () => onNavigate('settings')
    },
    {
      id: 'categories_filled',
      label: 'All categories have items',
      passed: categories.length > 0 && categories.every(c => items.some(i => i.categoryId === c.id)),
      critical: true,
      action: () => onNavigate('categories')
    },
    {
      id: 'item_images',
      label: 'Items have images',
      passed: items.length > 0 && items.every(i => i.imageUrl),
      critical: false,
      action: () => onNavigate('items'),
      warning: true
    },
    {
      id: 'item_descriptions',
      label: 'Items have descriptions',
      passed: items.length > 0 && items.every(i => i.description && i.description.length > 0),
      critical: false,
      action: () => onNavigate('items'),
      warning: true
    },
    {
      id: 'contact',
      label: 'Contact/WhatsApp number configured',
      passed: !!profileSettings?.mobileNumber,
      critical: true,
      action: () => onNavigate('settings')
    }
  ];

  const totalChecks = healthChecks.length;
  const passedChecks = healthChecks.filter(c => c.passed).length;
  const healthScore = Math.round((passedChecks / totalChecks) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* 1. Menu Status */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className={`p-6 border-b ${isLive ? 'bg-green-50/50 border-green-100' : 'bg-orange-50/50 border-orange-100'}`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`relative flex h-4 w-4 ${isLive ? 'text-green-500' : 'text-orange-500'}`}>
                {isLive && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-4 w-4 ${isLive ? 'bg-green-500' : 'bg-orange-500'}`}></span>
              </div>
              <div>
                <h3 className={`text-lg font-bold ${isLive ? 'text-green-900' : 'text-orange-900'}`}>
                  {isLive ? 'Menu is Live' : 'Menu is currently unpublished'}
                </h3>
                {isLive && publicUrl && (
                  <p className="text-sm text-green-700 mt-1 font-medium">{publicUrl}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {isLive ? (
                <>
                  <button onClick={() => window.open(publicUrl, '_blank')} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                    <ExternalLink size={16} /> View Menu
                  </button>
                  <button onClick={handleCopyLink} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                    <LinkIcon size={16} /> Copy Link
                  </button>
                  <button onClick={() => window.open(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(publicUrl)}`, '_blank')} className="px-4 py-2 bg-black text-white hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                    <Globe size={16} /> QR Code
                  </button>
                  <button onClick={handlePublishToggle} disabled={isPublishing} className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors">
                    Unpublish
                  </button>
                </>
              ) : (
                <button 
                  onClick={handlePublishToggle} 
                  disabled={isPublishing} 
                  className="px-6 py-2.5 bg-black text-white hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  {isPublishing ? <Loader2 size={16} className="animate-spin" /> : 'Publish Menu'}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          {/* 2. Quick Actions */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <ActionCard icon={<Plus size={20} />} label="Add Item" onClick={() => onNavigate('items')} />
              <ActionCard icon={<LayoutGrid size={20} />} label="Manage Categories" onClick={() => onNavigate('categories')} />
              <ActionCard icon={<Palette size={20} />} label="Change Theme" onClick={() => onNavigate('theme')} />
              <ActionCard icon={<Video size={20} />} label="Change Hero Video" onClick={() => onNavigate('settings')} />
              <ActionCard icon={<ExternalLink size={20} />} label="Preview Menu" onClick={() => publicUrl ? window.open(publicUrl, '_blank') : alert('Restaurant not set up')} />
              <ActionCard icon={<Download size={20} />} label="Import Menu" onClick={() => onNavigate('data')} />
            </div>
          </section>

          {/* 3. Menu Health */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Menu Health</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500">Score</span>
                <span className={`text-xl font-bold ${healthScore > 80 ? 'text-green-600' : healthScore > 50 ? 'text-orange-500' : 'text-red-600'}`}>
                  {healthScore}%
                </span>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden divide-y divide-gray-100">
              {healthChecks.map((check) => (
                <div 
                  key={check.id} 
                  onClick={!check.passed ? check.action : undefined}
                  className={`p-4 flex items-center justify-between transition-colors ${!check.passed ? 'cursor-pointer hover:bg-gray-50' : 'bg-white'}`}
                >
                  <div className="flex items-center gap-3">
                    {check.passed ? (
                      <CheckCircle2 className="text-green-500" size={20} />
                    ) : check.critical ? (
                      <AlertCircle className="text-red-500" size={20} />
                    ) : (
                      <AlertTriangle className="text-orange-500" size={20} />
                    )}
                    <span className={`font-medium text-sm ${check.passed ? 'text-gray-900' : check.critical ? 'text-red-700' : 'text-orange-700'}`}>
                      {check.label}
                    </span>
                  </div>
                  {!check.passed && (
                    <span className="text-xs font-medium text-gray-400">Fix now &rarr;</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* 4. Recent Activity */}
        <div className="lg:col-span-1">
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-500 text-sm">No recent activity</p>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}

function ActionCard({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-3 p-4 bg-white border border-gray-200 hover:border-gray-900 hover:shadow-md rounded-xl transition-all text-gray-700 hover:text-black group"
    >
      <div className="p-3 rounded-full bg-gray-50 group-hover:bg-gray-100 transition-colors">
        {icon}
      </div>
      <span className="text-sm font-medium text-center">{label}</span>
    </button>
  );
}
