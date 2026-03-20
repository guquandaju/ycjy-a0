// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Input, Textarea, Label, useToast } from '@/components/ui';
// @ts-ignore;
import { ArrowLeft, User, Calendar, Clock, FileText, CheckCircle, AlertCircle, Download, Printer } from 'lucide-react';

export default function CountyTestDetail(props) {
  const [task, setTask] = useState(null);
  const [results, setResults] = useState({});
  const [notes, setNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedResults, setEditedResults] = useState({});
  const [editedNotes, setEditedNotes] = useState('');
  const {
    toast
  } = useToast();

  // 模拟检验任务数据
  const mockTask = {
    id: props.$w.page.dataset.params.id || '1',
    patientName: '张三',
    patientAge: 45,
    patientGender: '男',
    testType: '血常规检查',
    villageHospital: '城关镇卫生院',
    submitDate: '2026-03-15 09:30',
    resultDate: '',
    status: 'in-progress',
    urgency: 'normal',
    doctorNotes: '患者主诉头晕乏力，建议进行血常规检查',
    testItems: [{
      id: 1,
      name: '白细胞计数',
      unit: '×10⁹/L',
      normalRange: '4.0-10.0',
      result: ''
    }, {
      id: 2,
      name: '红细胞计数',
      unit: '×10¹²/L',
      normalRange: '4.0-5.5',
      result: ''
    }, {
      id: 3,
      name: '血红蛋白',
      unit: 'g/L',
      normalRange: '120-160',
      result: ''
    }, {
      id: 4,
      name: '血小板计数',
      unit: '×10⁹/L',
      normalRange: '100-300',
      result: ''
    }]
  };

  // 开始编辑
  const handleStartEdit = () => {
    setIsEditing(true);
    setEditedResults({
      ...results
    });
    setEditedNotes(notes);
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedResults({});
    setEditedNotes('');
  };

  // 保存结果
  const handleSaveResults = async () => {
    try {
      // 模拟保存到数据库
      setResults(editedResults);
      setNotes(editedNotes);

      // 更新任务状态为已完成
      const updatedTask = {
        ...task,
        status: 'completed',
        resultDate: getDatabaseTimestamp()
      };
      setTask(updatedTask);
      setIsEditing(false);
      toast({
        title: '保存成功',
        description: '检验结果已成功保存',
        variant: 'default'
      });
    } catch (error) {
      toast({
        title: '保存失败',
        description: '检验结果保存失败，请重试',
        variant: 'destructive'
      });
    }
  };
  useEffect(() => {
    // 模拟数据加载
    setTimeout(() => {
      setTask(mockTask);
    }, 500);
  }, []);

  // 更新检验结果
  const handleResultChange = (itemId, value) => {
    if (isEditing) {
      setEditedResults(prev => ({
        ...prev,
        [itemId]: value
      }));
    } else {
      setResults(prev => ({
        ...prev,
        [itemId]: value
      }));
    }
  };
  const handleSubmitResults = () => {
    if (Object.keys(results).length === 0) {
      toast({
        title: "提交失败",
        description: "请先录入检验结果",
        variant: "destructive"
      });
      return;
    }

    // 模拟提交结果
    toast({
      title: "提交成功",
      description: "检验结果已提交"
    });

    // 返回工作台
    setTimeout(() => {
      props.$w.utils.navigateBack();
    }, 1000);
  };
  const handlePrintReport = () => {
    toast({
      title: "打印功能",
      description: "检验报告打印中..."
    });
  };
  const handleDownloadReport = () => {
    toast({
      title: "下载功能",
      description: "检验报告下载中..."
    });
  };
  if (!task) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-0">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button variant="ghost" onClick={() => props.$w.utils.navigateBack()} className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-gray-900 text-sm sm:text-base">
              <ArrowLeft className="w-4 h-4" />
              <span>返回工作台</span>
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900">检验任务详情</h1>
            </div>
            <div className="flex flex-wrap gap-2 sm:space-x-2">
              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white" onClick={() => props.$w.utils.navigateTo({
              pageId: 'resultEntry',
              params: {
                id: taskData.id
              }
            })}>
                <FileText className="w-4 h-4 mr-2" />
                录入结果
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrintReport}>
                <Printer className="w-4 h-4 mr-2" />
                打印报告
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadReport}>
                <Download className="w-4 h-4 mr-2" />
                下载报告
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* 左侧 - 患者信息 */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <span>患者信息</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">姓名:</span>
                  <span className="font-medium">{task.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">年龄:</span>
                  <span className="font-medium">{task.patientAge}岁</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">性别:</span>
                  <span className="font-medium">{task.patientGender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">提交单位:</span>
                  <span className="font-medium">{task.villageHospital}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span>时间信息</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">提交时间:</span>
                  <span className="font-medium">{task.submitDate}</span>
                </div>
                {task.resultDate && <div className="flex justify-between">
                    <span className="text-gray-600">完成时间:</span>
                    <span className="font-medium">{task.resultDate}</span>
                  </div>}
                <div className="flex justify-between">
                  <span className="text-gray-600">紧急程度:</span>
                  <Badge variant={task.urgency === 'urgent' ? 'destructive' : 'secondary'}>
                    {task.urgency === 'urgent' ? '紧急' : '普通'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧 - 检验详情 */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>检验项目详情</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-2">{task.testType}</h3>
                  <p className="text-gray-600 text-sm">{task.doctorNotes}</p>
                </div>

                <div className="space-y-4">
                  {task.testItems.map(item => <div key={item.id} className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-1 sm:space-y-0 mb-1">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-sm text-gray-500">{item.normalRange}</span>
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <Input placeholder="录入检验结果" value={results[item.id] || ''} onChange={e => handleResultChange(item.id, e.target.value)} className="flex-1" />
                          <span className="text-sm text-gray-500 w-16">{item.unit}</span>
                        </div>
                      </div>
                    </div>)}
                </div>

                <div className="mt-6">
                  <Label htmlFor="notes">检验备注</Label>
                  <Textarea id="notes" placeholder="请输入检验过程中的备注信息" value={notes} onChange={e => setNotes(e.target.value)} className="mt-1" />
                </div>

                <div className="flex space-x-3 mt-6">
                  <Button onClick={handleSubmitResults} className="flex-1 bg-green-600 hover:bg-green-700 active:bg-green-800 active:scale-95 transition-all duration-200">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    提交检验结果
                  </Button>
                  <Button variant="outline" onClick={() => props.$w.utils.navigateBack()} className="flex-1">
                    取消
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>;
}