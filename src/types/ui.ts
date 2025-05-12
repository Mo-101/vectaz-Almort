
/**
 * UI Types
 * 
 * This file contains types related to UI components and navigation.
 */

import { ReactComponentType } from 'react';

export type AppSection = 'map' | 'analytics' | 'deepcal' | 'about' | 'settings' | 'forms';

export interface TabItem {
  id: AppSection;
  label: string;
  icon: ReactComponentType<any>;
}
