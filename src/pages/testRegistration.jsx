// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, Input, Card, CardContent, CardDescription, CardHeader, CardTitle, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Checkbox, useToast } from '@/components/ui';
// @ts-ignore;
import { ArrowLeft, Save, AlertTriangle, UserSearch } from 'lucide-react';

// @ts-ignore;
import PatientSearch from '@/components/PatientSearch';
// @ts-ignore;
import TestItemSearch from '@/components/TestItemSearch';
// @ts-ignore;
import { medicalAPI } from '@/lib/apiUtils';
export default function TestRegistration(props) {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedTests, setSelectedTests] = useState([]);
  const [urgency, setUrgency] = useState('normal');
  const [notes, setNotes] = useState('');
  const [showPatientSearch, setShowPatientSearch] = useState(false);
  const [showTestSearch, setShowTestSearch] = useState(false);
  const {
    toast
  } = useToast();

  // 从外部API加载检验项目
  const loadTestItemsFromAPI = async () => {
    try {
      const result = await medicalAPI.getTestItems("hospital-001");
      if (result.success) {
        // 这里可以替换静态数据，但为了演示保留静态数据
        console.log('从API获取到检验项目:', result.data);
        toast({
          title: "检验项目加载完成",
          description: `获取到 ${result.data.length} 个检验项目`,
          variant: "default"
        });
      } else {
        toast({
          title: "加载检验项目失败",
          description: result.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("加载检验项目失败:", error);
      toast({
        title: "网络错误",
        description: "无法连接到检验项目服务，使用本地数据",
        variant: "destructive"
      });
    }
  };

  // 组件挂载时从API加载数据
  useEffect(() => {
    loadTestItemsFromAPI();
  }, []);

  // 检验项目数据
  const testItems = [{
    id: 'blood-routine',
    name: '血常规',
    category: '常规检验',
    price: 50
  }, {
    id: 'urine-routine',
    name: '尿常规',
    category: '常规检验',
    price: 40
  }, {
    id: 'liver-function',
    name: '肝功能',
    category: '生化检验',
    price: 120
  }, {
    id: 'kidney-function',
    name: '肾功能',
    category: '生化检验',
    price: 100
  }, {
    id: 'blood-sugar',
    name: '血糖',
    category: '生化检验',
    price: 30
  }, {
    id: 'lipid-profile',
    name: '血脂',
    category: '生化检验',
    price: 80
  }, {
    id: 'thyroid-function',
    name: '甲状腺功能',
    category: '内分泌检验',
    price: 150
  }, {
    id: 'tumor-markers',
    name: '肿瘤标志物',
    category: '特殊检验',
    price: 200
  }];
  const handleTestToggle = testId => {
    setSelectedTests(prev => prev.includes(testId) ? prev.filter(id => id !== testId) : [...prev, testId]);
  };
  const handleTestSelect = testId => {
    setSelectedTests(prev => prev.includes(testId) ? prev.filter(id => id !== testId) : [...prev, testId]);
  };
  const handlePatientSelect = patient => {
    setSelectedPatient(patient);
    setShowPatientSearch(false);
  };
  const handleSubmit = async () => {
    if (!selectedPatient) {
      toast({
        title: "请选择患者",
        description: "请先选择要检验的患者",
        variant: "destructive"
      });
      return;
    }
    if (selectedTests.length === 0) {
      toast({
        title: "请选择检验项目",
        description: "请至少选择一项检验项目",
        variant: "destructive"
      });
      return;
    }
    try {
      const selectedTestNames = selectedTests.map(testId => testItems.find(t => t.id === testId)?.name).filter(Boolean);
      toast({
        title: "检验申请提交成功",
        description: `患者：${selectedPatient.name}，检验项目：${selectedTestNames.join('、')}`,
        variant: "default"
      });

      // 清空表单
      setSelectedPatient(null);
      setSelectedTests([]);
      setUrgency('normal');
      setNotes('');

      // 模拟保存到数据库
      setTimeout(() => {
        props.$w.utils.navigateBack();
      }, 1500);
    } catch (error) {
      toast({
        title: "提交失败",
        description: "检验申请提交失败，请重试",
        variant: "destructive"
      });
    }
  };
  const totalPrice = selectedTests.reduce((total, testId) => {
    const test = testItems.find(t => t.id === testId);
    return total + (test?.price || 0);
  }, 0);
  return <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="icon" onClick={() => props.$w.utils.navigateBack()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">检验申请</h1>
              <p className="text-gray-600">为患者申请检验项目</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {/* 患者选择 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserSearch className="h-5 w-5" />
                <span>选择患者</span>
              </CardTitle>
              <CardDescription>
                搜索并选择要检验的患者
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showPatientSearch ? <div className="space-y-4">
                  {selectedPatient ? <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-green-900">{selectedPatient.name}</h3>
                          <p className="text-sm text-green-700">
                            {selectedPatient.gender}，{selectedPatient.age}岁，{selectedPatient.village}
                          </p>
                          <p className="text-xs text-green-600">手机：{selectedPatient.phone}</p>
                        </div>
                        <Button variant="outline" onClick={() => setShowPatientSearch(true)}>
                          重新选择
                        </Button>
                      </div>
                    </div> : <div className="text-center py-8">
                      <UserSearch className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-gray-500 mb-4">请选择患者</p>
                      <Button onClick={() => setShowPatientSearch(true)}>
                        选择患者
                      </Button>
                    </div>}
                </div> : <PatientSearch onPatientSelect={handlePatientSelect} selectedPatient={selectedPatient} />}
            </CardContent>
          </Card>

          {/* 检验项目选择 */}
          {selectedPatient && <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>检验项目</span>
                  <Button variant="outline" size="sm" onClick={() => setShowTestSearch(!showTestSearch)} className="flex items-center gap-2">
                    {showTestSearch ? '返回列表' : '搜索项目'}
                  </Button>
                </CardTitle>
                <CardDescription>
                  选择需要检验的项目（可多选）
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!showTestSearch ? <div className="space-y-4">
                    {selectedTests.length > 0 ? <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-gray-900">已选择的检验项目</h3>
                          <Button variant="outline" size="sm" onClick={() => setShowTestSearch(true)}>
                            添加更多项目
                          </Button>
                        </div>
                        {selectedTests.map(testId => {
                  const test = testItems.find(t => t.id === testId);
                  return test ? <div key={test.id} className="flex items-center justify-between p-3 border border-blue-200 bg-blue-50 rounded-lg">
                              <div>
                                <span className="font-medium text-blue-900">{test.name}</span>
                                <span className="ml-3 text-sm text-blue-700">{test.category}</span>
                                <span className="ml-3 text-sm text-blue-600">¥{test.price}</span>
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => handleTestToggle(test.id)} className="text-red-600 hover:text-red-700">
                                移除
                              </Button>
                            </div> : null;
                })}
                      </div> : <div className="text-center py-8">
                        <div className="text-gray-400 mb-3">
                          <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <p className="text-gray-500 mb-4">请选择检验项目</p>
                        <Button onClick={() => setShowTestSearch(true)}>
                          选择检验项目
                        </Button>
                      </div>}
                  </div> : <TestItemSearch onTestSelect={handleTestSelect} selectedTests={selectedTests} testItems={testItems} />}
              </CardContent>
            </Card>}

          {/* 其他信息 */}
          {selectedPatient && selectedTests.length > 0 && <Card>
              <CardHeader>
                <CardTitle>其他信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="urgency">紧急程度</Label>
                  <Select value={urgency} onValueChange={setUrgency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">普通</SelectItem>
                      <SelectItem value="urgent">紧急</SelectItem>
                      <SelectItem value="critical">加急</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="notes">备注信息</Label>
                  <Input id="notes" placeholder="请输入检验相关的备注信息..." value={notes} onChange={e => setNotes(e.target.value)} />
                </div>
              </CardContent>
            </Card>}

          {/* 提交按钮 */}
          {selectedPatient && selectedTests.length > 0 && <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">费用总计</h3>
                    <p className="text-2xl font-bold text-green-600">¥{totalPrice}</p>
                  </div>
                  <Button onClick={handleSubmit} size="lg" className="px-8">
                    <Save className="h-4 w-4 mr-2" />
                    提交检验申请
                  </Button>
                </div>
                <div className="text-sm text-gray-500">
                  <p>患者：{selectedPatient.name}</p>
                  <p>检验项目数：{selectedTests.length}项</p>
                </div>
              </CardContent>
            </Card>}
        </div>
      </div>
    </div>;
}