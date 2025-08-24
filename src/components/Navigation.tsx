
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  TrendingDown,
  BarChart3,
  FileText,
  Settings,
  Menu,
  X } from
'lucide-react';
import { useState } from 'react';

const Navigation: React.FC = () => {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
  {
    key: 'saidas',
    label: t('nav.saidas'),
    path: '/saidas',
    icon: TrendingDown
  },
  {
    key: 'analises',
    label: t('nav.analises'),
    path: '/analises',
    icon: BarChart3
  },
  {
    key: 'dre',
    label: t('nav.dre'),
    path: '/dre',
    icon: FileText
  },
  {
    key: 'configuracoes',
    label: t('nav.configuracoes'),
    path: '/configuracoes',
    icon: Settings
  }];


  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: 'var(--primary)' }}>

                iC
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                iClub Financial
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.key}
                  to={item.path}
                  className={({ isActive }) =>
                  `nav-tab flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive ?
                  'bg-green-50 text-green-700 border-b-2 border-green-500' :
                  'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`

                  }>

                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>);

            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="Toggle mobile menu">

              {isMobileMenuOpen ?
              <X size={24} /> :

              <Menu size={24} />
              }
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen &&
        <div className="md:hidden border-t border-gray-200 bg-white animate-slide-in-up">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.key}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActive ?
                  'bg-green-50 text-green-700 border-l-4 border-green-500' :
                  'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`

                  }>

                    <Icon size={20} />
                    <span>{item.label}</span>
                  </NavLink>);

            })}
            </div>
          </div>
        }
      </div>
    </nav>);

};

export default Navigation;