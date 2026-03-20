// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Textarea, useToast } from '@/components/ui';
// @ts-ignore;
import { ArrowLeft, Save, CheckCircle, AlertCircle } from 'lucide-react';

import { getDatabaseTimestamp } from '@/lib/dateUtils';
// @ts-ignore;

export default function ResultEntry(props) {
  const {
    toast
  } = useToast();
  const [taskData, setTaskData] = useState(null);
  const [results, setResults] = useState({});
  const [labNotes, setLabNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 模拟检验任务数据
  const mockTaskData = {
    id: 'task-001',
    patientName: '张三',
    patientAge: 45,
    patientGender: '男',
    submittedBy: '乡镇卫生院A',
    submittedAt: '2026-03-16 09:30:00',
    testItems: [{
      id: 'item-1',
      name: '血常规',
      normalRange: '3.5-5.5 ×10^12/L',
      unit: '×10^12/L',
      status: 'pending'
    }, {
      id: 'item-2',
      name: '肝功能',
      normalRange: '0-40 U/L',
      unit: 'U/L',
      status: 'pending'
    }, {
      id: 'item-3',
      name: '肾功能',
      normalRange: '44-133 μmol/L',
      unit: 'μmol/L',
      status: 'pending'
    }],
    doctorNotes: '患者近期有乏力症状，建议全面检查'
  };
  useEffect(() => {
    // 从路由参数获取任务ID
    const taskId = props.$w.page.dataset.params?.id;
    if (taskId) {
      // 模拟加载任务数据
      setTaskData(mockTaskData);

      // 初始化结果数据
      const initialResults = {};
      mockTaskData.testItems.forEach(item => {
        initialResults[item.id] = '';
      });
      setResults(initialResults);
    }
  }, [props.$w.page.dataset.params]);
  const handleResultChange = (itemId, value) => {
    setResults(prev => ({
      ...prev,
      [itemId]: value
    }));
  };
  const handleSubmit = async () => {
    if (isSubmitting) return;

    // 验证必填项
    const emptyResults = Object.entries(results).filter(([_, value]) => !value.trim());
    if (emptyResults.length > 0) {
      toast({
        title: '请填写所有检验结果',
        description: '还有未填写的检验项目',
        variant: 'destructive'
      });
      return;
    }
    setIsSubmitting(true);
    try {
      // 保存检验结果到数据库
      const saveResult = await props.$w.cloud.callDataSource({
        dataSourceName: 'test_results',
        methodName: 'wedaCreate',
        params: {
          patientId: taskData.id,
          patientName: taskData.patientName,
          taskId: taskData.id,
          testItems: taskData.testItems.map(item => ({
            ...item,
            result: results[item.id],
            status: 'completed'
          })),
          labNotes: labNotes,
          status: 'completed',
          submittedBy: props.$w.auth.currentUser?.name || '检验员',
          submittedAt: getDatabaseTimestamp(),
          completedAt: getDatabaseTimestamp()
        }
      });
      toast({
        title: '保存成功',
        description: '检验结果已成功保存',
        variant: 'default'
      });

      // 延迟返回上一页
      setTimeout(() => {
        props.$w.utils.navigateBack();
      }, 1500);
    } catch (error) {
      console.error('保存检验结果失败:', error);
      toast({
        title: '保存失败',
        description: '请检查网络连接后重试',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const getCompletionStatus = () => {
    const totalItems = taskData?.testItems.length || 0;
    const completedItems = Object.values(results).filter(value => value.trim()).length;
    return {
      completed: completedItems,
      total: totalItems
    };
  };
  if (!taskData) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>;
  }
  const status = getCompletionStatus();
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* 头部导航 */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => props.$w.utils.navigateBack()} className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-4 h-4" />
            <span>返回</span>
          </Button>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>已完成: {status.completed}/{status.total}</span>
            </div>
            <Button onClick={handleSubmit} disabled={isSubmitting || status.completed !== status.total} className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? '保存中...' : '保存结果'}</span>
            </Button>
          </div>
        </div>

        {/* 患者信息卡片 */}
        <Card className="mb-6 shadow-lg border-0 rounded-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center justify-between">
              <span>患者信息</span>
              <div className="flex items-center space-x-4 text-sm font-normal">
                <span>提交单位: {taskData.submittedBy}</span>
                <span>提交时间: {taskData.submittedAt}</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm text-gray-500">姓名</label>
                <p className="font-medium">{taskData.patientName}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">年龄</label>
                <p className="font-medium">{taskData.patientAge}岁</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">性别</label>
                <p className="font-medium">{taskData.patientGender}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">任务状态</label>
                <p className="font-medium text-blue-600">检验中</p>
              </div>
            </div>
            
            {taskData.doctorNotes && <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <label className="text-sm text-yellow-700 font-medium">医生备注</label>
                <p className="text-yellow-800">{taskData.doctorNotes}</p>
              </div>}
          </CardContent>
        </Card>

        {/* 检验项目录入 */}
        <Card className="shadow-lg border-0 rounded-lg">
          <CardHeader className="bg-white border-b">
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-blue-500" />
              <span>检验结果录入</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {taskData.testItems.map((item, index) => <div key={item.id} className="p-4 border border-gray-200 rounded-lg bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">正常范围: {item.normalRange}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${results[item.id] ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      {results[item.id] ? '已填写' : '待填写'}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm text-gray-500 block mb-1">检验结果</label>
                      <Input type="text" placeholder={`请输入${item.name}结果`} value={results[item.id] || ''} onChange={e => handleResultChange(item.id, e.target.value)} className="rounded-md" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 block mb-1">单位</label>
                      <Input type="text" value={item.unit} disabled className="rounded-md bg-gray-50" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 block mb-1">状态</label>
                      <Input type="text" value={results[item.id] ? '已完成' : '待检验'} disabled className={`rounded-md ${results[item.id] ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`} />
                    </div>
                  </div>
                </div>)}
            </div>

            {/* 检验备注 */}
            <div className="mt-6">
              <label className="text-sm font-medium text-gray-700 block mb-2">检验备注</label>
              <Textarea placeholder="请输入检验过程中的备注信息（可选）" value={labNotes} onChange={e => setLabNotes(e.target.value)} className="rounded-md min-h-[100px]" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
}