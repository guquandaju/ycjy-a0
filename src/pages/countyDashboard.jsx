// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, useToast } from '@/components/ui';
// @ts-ignore;
import { Clock, CheckCircle, AlertCircle, User } from 'lucide-react';

export default function CountyDashboard(props) {
  const [activeTab, setActiveTab] = useState('pending');
  const [testTasks, setTestTasks] = useState([]);
  const {
    toast
  } = useToast();

  // 模拟数据
  useEffect(() => {
    setTestTasks([{
      id: 1,
      patientName: '张三',
      testType: '血常规',
      status: 'pending',
      submitDate: '2026-03-15',
      villageHospital: 'XX乡镇卫生院',
      urgency: 'normal'
    }, {
      id: 2,
      patientName: '李四',
      testType: '尿常规',
      status: 'in-progress',
      submitDate: '2026-03-14',
      villageHospital: 'YY乡镇卫生院',
      urgency: 'urgent'
    }, {
      id: 3,
      patientName: '王五',
      testType: '肝功能',
      status: 'completed',
      submitDate: '2026-03-10',
      resultDate: '2026-03-12',
      villageHospital: 'ZZ乡镇卫生院',
      urgency: 'normal'
    }]);
  }, []);
  const filteredTasks = testTasks.filter(task => {
    if (activeTab === 'all') return true;
    return task.status === activeTab;
  });
  const handleReceiveTask = taskId => {
    setTestTasks(tasks => tasks.map(task => task.id === taskId ? {
      ...task,
      status: 'in-progress'
    } : task));
    toast({
      title: "任务接收成功",
      description: "已开始处理检验任务"
    });
  };
  const handleCompleteTask = taskId => {
    setTestTasks(tasks => tasks.map(task => task.id === taskId ? {
      ...task,
      status: 'completed',
      resultDate: '2026-03-16'
    } : task));
    toast({
      title: "检验完成",
      description: "检验结果已录入系统"
    });
  };
  const getStatusIcon = status => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'in-progress':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };
  const getStatusBadge = status => {
    const variants = {
      'pending': 'secondary',
      'in-progress': 'default',
      'completed': 'success'
    };
    const labels = {
      'pending': '待接收',
      'in-progress': '检验中',
      'completed': '已完成'
    };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };
  return <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <header className="bg-white shadow-sm border-b">
        <div className="w-full px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">县医院检验中心</h1>
              <p className="text-gray-600">远程检验平台 - 检验任务处理</p>
            </div>
            <div className="text-sm text-gray-500">
              今日接收任务: {testTasks.filter(t => t.status !== 'pending').length} / 完成: {testTasks.filter(t => t.status === 'completed').length}
            </div>
          </div>
        </div>
      </header>

      {/* 标签页 */}
      <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 border-b">
          <button onClick={() => setActiveTab('pending')} className={`px-3 sm:px-4 py-2 font-medium flex items-center space-x-1 sm:space-x-2 transition-all duration-200 active:scale-95 rounded-t-lg text-xs sm:text-sm ${activeTab === 'pending' ? 'text-blue-600 bg-white border-b-2 border-blue-500 font-semibold shadow-sm' : 'text-slate-600 hover:text-blue-500 hover:bg-white/50'}`}>
            <Clock className="w-4 h-4" />
            <span>待接收 ({testTasks.filter(t => t.status === 'pending').length})</span>
          </button>
          <button onClick={() => setActiveTab('in-progress')} className={`px-3 sm:px-4 py-2 font-medium flex items-center space-x-1 sm:space-x-2 transition-all duration-200 active:scale-95 rounded-t-lg text-xs sm:text-sm ${activeTab === 'in-progress' ? 'text-blue-600 bg-white border-b-2 border-blue-500 font-semibold shadow-sm' : 'text-slate-600 hover:text-blue-500 hover:bg-white/50'}`}>
            <AlertCircle className="w-4 h-4" />
            <span>检验中 ({testTasks.filter(t => t.status === 'in-progress').length})</span>
          </button>
          <button onClick={() => setActiveTab('completed')} className={`px-3 sm:px-4 py-2 font-medium flex items-center space-x-1 sm:space-x-2 transition-all duration-200 active:scale-95 rounded-t-lg text-xs sm:text-sm ${activeTab === 'completed' ? 'text-blue-600 bg-white border-b-2 border-blue-500 font-semibold shadow-sm' : 'text-slate-600 hover:text-blue-500 hover:bg-white/50'}`}>
            <CheckCircle className="w-4 h-4" />
            <span>已完成 ({testTasks.filter(t => t.status === 'completed').length})</span>
          </button>
        </div>

        {/* 任务列表 */}
        <div className="mt-6 space-y-4">
          {filteredTasks.map(task => <Card key={task.id} className="hover:shadow-lg active:shadow-md active:scale-98 transition-all duration-200 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-3 sm:space-y-0">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0 mb-2">
                      {getStatusIcon(task.status)}
                      <h3 className="font-semibold text-lg">{task.patientName} - {task.testType}</h3>
                      {task.urgency === 'urgent' && <Badge variant="destructive">紧急</Badge>}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
                      <div>
                        <span className="font-medium">提交卫生院:</span> {task.villageHospital}
                      </div>
                      <div>
                        <span className="font-medium">提交时间:</span> {task.submitDate}
                      </div>
                      {task.resultDate && <div>
                          <span className="font-medium">完成时间:</span> {task.resultDate}
                        </div>}
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 sm:ml-4 mt-3 sm:mt-0">
                    {getStatusBadge(task.status)}
                    
                    {task.status === 'pending' && <Button onClick={() => handleReceiveTask(task.id)} size="sm" className="bg-green-600 hover:bg-green-700 active:bg-green-800 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md">
                        接收任务
                      </Button>}
                    
                    {task.status === 'in-progress' && <Button onClick={() => handleCompleteTask(task.id)} size="sm" className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md">
                        录入结果
                      </Button>}
                    
                    <Button variant="outline" size="sm" className="hover:bg-blue-50 active:bg-blue-100 active:scale-95 transition-all duration-200" onClick={() => props.$w.utils.navigateTo({
                  pageId: 'countyTestDetail',
                  params: {
                    id: task.id
                  }
                })}>
                      查看详情
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>)}
        </div>
      </div>
    </div>;
}