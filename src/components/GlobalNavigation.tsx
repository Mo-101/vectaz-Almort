
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  GlobeIcon, 
  BarChart3Icon, 
  BrainCircuitIcon, 
  InfoIcon, 
  SettingsIcon,
  ClipboardListIcon,
  ServerIcon,
  SparklesIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppSection } from '@/types/deeptrack';
import { useBaseDataStore } from '@/store/baseState';

const GlobalNavigation = () => {
  const location = useLocation();
  const baseStore = useBaseDataStore();
  const pathname = location.pathname;
  const isIndex = pathname === '/';
  const isDeepCal = pathname === '/deepcal';
  const isForms = pathname === '/forms';
  const isTraining = pathname === '/training';
  const isOracle = pathname === '/oracle';
  
  // Set the appropriate active section based on location
  const getActiveSection = (): string => {
    if (isIndex) {
      // Use hash or default to 'map' on index page
      return location.hash ? location.hash.replace('#', '') : 'map';
    } else if (isDeepCal) {
      return 'deepcal';
    } else if (isForms) {
      return 'forms';
    } else if (isTraining) {
      return 'training';
    } else if (isOracle) {
      return 'oracle';
    }
    return '';
  };
  
  const activeSection = getActiveSection();

  // Icons we'll display in the bottom navigation
  const navIcons = [
    { id: 'map', icon: GlobeIcon, label: 'Map', path: '/' },
    { id: 'analytics', icon: BarChart3Icon, label: 'Analytics', path: '/' },
    { id: 'forms', icon: ClipboardListIcon, label: 'Forms', path: '/forms' },
    { id: 'deepcal', icon: BrainCircuitIcon, label: 'DeepCAL', path: '/deepcal' },
    { id: 'oracle', icon: SparklesIcon, label: 'Oracle', path: '/oracle' },
    { id: 'training', icon: ServerIcon, label: 'Training', path: '/training' },
    { id: 'about', icon: InfoIcon, label: 'About', path: '/' },
    { id: 'settings', icon: SettingsIcon, label: 'Settings', path: '/' }
  ];

  const handleSectionChange = (section: AppSection) => {
    // We only call setActiveSection if it exists on the store and we're on the index page
    if (baseStore && 'setActiveSection' in baseStore && isIndex) {
      (baseStore as any).setActiveSection(section);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="glass-panel rounded-full py-2 px-4 flex items-center justify-center space-x-1 shadow-lg border border-[#00FFD1]/30">
        {navIcons.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          const isIndexPageItem = item.path === '/' && item.id !== 'map';
          const linkPath = isIndexPageItem ? `/#${item.id}` : item.path;

          return (
            <Link
              key={item.id}
              to={linkPath}
              onClick={() => {
                if (isIndex || isIndexPageItem) {
                  handleSectionChange(item.id as AppSection);
                }
              }}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-full transition-all",
                isActive
                  ? "bg-[#00FFD1]/20 text-[#00FFD1]"
                  : "text-gray-400 hover:bg-[#00FFD1]/10 hover:text-[#00FFD1]"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default GlobalNavigation;
