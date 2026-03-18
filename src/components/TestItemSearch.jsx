// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Search, Filter } from 'lucide-react';
// @ts-ignore;
import { Input, Button, Badge, useToast } from '@/components/ui';

export default function TestItemSearch({
  onTestSelect,
  selectedTests,
  testItems
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredTests, setFilteredTests] = useState([]);
  const {
    toast
  } = useToast();

  // 获取所有分类
  const categories = [...new Set(testItems.map(item => item.category))];

  // 过滤检验项目
  useEffect(() => {
    let filtered = testItems;

    // 按搜索词过滤
    if (searchTerm.trim()) {
      filtered = filtered.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.category.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // 按分类过滤
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    setFilteredTests(filtered);
  }, [searchTerm, selectedCategory, testItems]);
  const handleTestToggle = testId => {
    onTestSelect(testId);
  };
  const handleSelectAll = category => {
    const categoryTests = testItems.filter(item => item.category === category);
    categoryTests.forEach(test => {
      if (!selectedTests.includes(test.id)) {
        onTestSelect(test.id);
      }
    });
    toast({
      title: "批量选择成功",
      description: `已选择${category}分类下所有项目`,
      variant: "default"
    });
  };
  return <div className="space-y-4">
      {/* 搜索和筛选栏 */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input type="text" placeholder="输入项目名称或分类关键词进行搜索..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 pr-4" />
        </div>
        
        <div className="flex gap-2">
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">所有分类</option>
            {categories.map(category => <option key={category} value={category}>{category}</option>)}
          </select>
          
          {(searchTerm || selectedCategory) && <Button variant="outline" onClick={() => {
          setSearchTerm('');
          setSelectedCategory('');
        }} className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              清除搜索
            </Button>}
        </div>
      </div>

      {/* 搜索结果统计 */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>找到 {filteredTests.length} 个项目</span>
        {selectedTests.length > 0 && <span>已选择 {selectedTests.length} 个项目</span>}
      </div>

      {/* 检验项目列表 */}
      <div className="space-y-3">
        {filteredTests.length === 0 ? <div className="text-center py-8 text-gray-500">
            <Filter className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>未找到匹配的检验项目</p>
            <p className="text-sm">尝试调整搜索条件</p>
          </div> : filteredTests.map(test => <div key={test.id} className={`flex items-center justify-between p-4 border rounded-lg transition-all duration-200 ${selectedTests.includes(test.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-medium text-gray-900">{test.name}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {test.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>¥{test.price}</span>
                  <span>编号: {test.id}</span>
                </div>
              </div>
              
              <Button variant={selectedTests.includes(test.id) ? "default" : "outline"} size="sm" onClick={() => handleTestToggle(test.id)} className="ml-4">
                {selectedTests.includes(test.id) ? '已选择' : '选择'}
              </Button>
            </div>)}
      </div>

      {/* 批量操作 */}
      {categories.length > 0 && <div className="border-t pt-4 mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">批量选择</h4>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => <Button key={category} variant="outline" size="sm" onClick={() => handleSelectAll(category)} className="text-xs">
                选择所有{category}
              </Button>)}
          </div>
        </div>}
    </div>;
}