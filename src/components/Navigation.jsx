// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Button } from '@/components/ui';
// @ts-ignore;
import { Home, User, FileText, Settings } from 'lucide-react';

export function Navigation(props) {
  const navItems = [{
    id: 'villageDashboard',
    label: '工作台',
    icon: Home
  }, {
    id: 'patientRegistration',
    label: '患者登记',
    icon: User
  }, {
    id: 'testRegistration',
    label: '检验申请',
    icon: FileText
  }, {
    id: 'testResults',
    label: '检验结果',
    icon: FileText
  }];
  const handleNavigation = pageId => {
    props.$w.utils.navigateTo({
      pageId,
      params: {}
    });
  };
  return <nav className="bg-white shadow-sm border-b">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4 sm:space-x-8">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">远程检验平台</h1>
            <div className="hidden md:flex space-x-1">
              {navItems.map(item => <Button key={item.id} variant="ghost" onClick={() => handleNavigation(item.id)} className="flex items-center space-x-2">
                  <item.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>)}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              设置
            </Button>
            <Button variant="outline" size="sm" onClick={() => props.$w.utils.navigateTo({
            pageId: 'login',
            params: {}
          })}>
              退出
            </Button>
          </div>
        </div>
      </div>
    </nav>;
}