// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, useToast, Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui';
// @ts-ignore;
import { Plus, User, FileText, Clock, CheckCircle, RefreshCw } from 'lucide-react';

// @ts-ignore;
import { medicalAPI, formatLocalTime } from '@/lib/apiUtils';
export default function VillageDashboard(props) {
  const [activeTab, setActiveTab] = useState('patients');
  const [patients, setPatients] = useState([]);
  const [testTasks, setTestTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 分页状态
  const [patientsPage, setPatientsPage] = useState(1);
  const [testsPage, setTestsPage] = useState(1);
  const itemsPerPage = 5;
  const {
    toast
  } = useToast();

  // 分页计算函数
  const getPaginatedItems = (items, currentPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };
  const getTotalPages = items => {
    return Math.ceil(items.length / itemsPerPage);
  };

  // 从外部API加载数据
  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // 获取患者数据
      const patientsResult = await medicalAPI.getPatients('{ "data": [{ "_id": "p001" }]}');
      if (patientsResult.success) {
        setPatients(patientsResult.data);
      } else {
        toast({
          title: "加载患者数据失败",
          description: patientsResult.error,
          variant: "destructive"
        });
      }

      // 获取检验任务数据
      const tasksResult = await medicalAPI.getTestTasks('{ "data": [{ "_id": "p001" }]}');
      if (tasksResult.success) {
        setTestTasks(tasksResult.data);
      } else {
        toast({
          title: "加载检验任务失败",
          description: tasksResult.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("加载仪表板数据失败:", error);
      toast({
        title: "网络错误",
        description: "无法连接到数据服务，使用本地数据",
        variant: "destructive"
      });

      // 网络失败时使用模拟数据
      setPatients([{
        id: 1,
        name: '张三',
        age: 45,
        gender: '男',
        phone: '138****1234',
        lastVisit: '2026-03-15'
      }, {
        id: 2,
        name: '李四',
        age: 32,
        gender: '女',
        phone: '139****5678',
        lastVisit: '2026-03-14'
      }, {
        id: 3,
        name: '王五',
        age: 68,
        gender: '男',
        phone: '137****9012',
        lastVisit: '2026-03-10'
      }]);
      setTestTasks([{
        id: 1,
        patientName: '张三',
        testType: '血常规',
        status: 'completed',
        submitDate: '2026-03-15',
        resultDate: '2026-03-16'
      }, {
        id: 2,
        patientName: '李四',
        testType: '尿常规',
        status: 'in-progress',
        submitDate: '2026-03-14',
        resultDate: null
      }, {
        id: 3,
        patientName: '王五',
        testType: '肝功能',
        status: 'pending',
        submitDate: '2026-03-10',
        resultDate: null
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // 刷新数据
  const handleRefresh = async () => {
    await loadDashboardData();
    toast({
      title: "数据刷新成功",
      description: "仪表板数据已更新",
      variant: "default"
    });
  };

  // 组件挂载时加载数据
  useEffect(() => {
    loadDashboardData();
  }, []);
  const handleNewPatient = () => {
    props.$w.utils.navigateTo({
      pageId: 'patientRegistration',
      params: {}
    });
  };
  const handleNewTest = () => {
    props.$w.utils.navigateTo({
      pageId: 'testRegistration',
      params: {}
    });
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">乡镇卫生院工作台</h1>
              <p className="text-sm sm:text-base text-gray-600">远程检验平台 - 患者管理与检验申请</p>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <Button onClick={handleRefresh} disabled={isLoading} variant="outline" size="sm" className="flex items-center gap-1 text-xs sm:text-sm">
                <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? '加载中...' : '刷新'}
              </Button>
              <Button onClick={handleNewPatient} size="sm" className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-xs sm:text-sm">
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                新患者
              </Button>
              <Button onClick={handleNewTest} size="sm" className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-xs sm:text-sm">
                <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                检验
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 主体内容 */}
      <main>
        <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
          {/* 统计卡片 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
            <Card className="min-h-0">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="rounded-full bg-blue-100 p-2 sm:p-3 mr-3 sm:mr-4">
                    <User className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">患者总数</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{patients.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="min-h-0">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="rounded-full bg-green-100 p-2 sm:p-3 mr-3 sm:mr-4">
                    <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">检验任务</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{testTasks.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="min-h-0">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="rounded-full bg-orange-100 p-2 sm:p-3 mr-3 sm:mr-4">
                    <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">已完成</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{testTasks.filter(task => task.status === 'completed').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="min-h-0">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="rounded-full bg-purple-100 p-2 sm:p-3 mr-3 sm:mr-4">
                    <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">待处理</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{testTasks.filter(task => task.status === 'pending').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 标签页 */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="border-b">
              <nav className="flex space-x-8 px-6">
                <button onClick={() => setActiveTab('patients')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'patients' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                  患者管理 ({patients.length})
                </button>
                <button onClick={() => setActiveTab('tests')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'tests' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                  检验任务 ({testTasks.length})
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'patients' && <div>
                  <div className="space-y-4 mb-6">
                    {getPaginatedItems(patients, patientsPage).map(patient => <Card key={patient.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => props.$w.utils.navigateTo({
                  pageId: 'patientDetail',
                  params: {
                    patientId: patient.id
                  }
                })}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h3 className="font-medium text-gray-900">{patient.name}</h3>
                                  <p className="text-sm text-gray-600">{patient.age}岁 • {patient.gender} • {patient.phone}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-gray-500">最近就诊</p>
                                  <p className="text-sm font-medium text-gray-900">{formatLocalTime(patient.lastVisit)}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>)}
                  </div>
                  
                  {getTotalPages(patients) > 1 && <Pagination className="text-zh-CN">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious onClick={() => setPatientsPage(Math.max(1, patientsPage - 1))}>
                          <span className="sr-only">Previous</span>
                          上一页
                        </PaginationPrevious>
                      </PaginationItem>
                      
                      {Array.from({
                    length: Math.min(5, getTotalPages(patients))
                  }, (_, i) => {
                    const pageNum = i + 1;
                    return <PaginationItem key={pageNum}>
                            <PaginationLink onClick={() => setPatientsPage(pageNum)} isActive={patientsPage === pageNum}>
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>;
                  })}
                      
                      {getTotalPages(patients) > 5 && <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>}
                      
                      <PaginationItem>
                        <PaginationNext onClick={() => setPatientsPage(Math.min(getTotalPages(patients), patientsPage + 1))}>
                          <span className="sr-only">Next</span>
                          下一页
                        </PaginationNext>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>}
                </div>}

              {activeTab === 'tests' && <div>
                  <div className="space-y-4 mb-6">
                    {getPaginatedItems(testTasks, testsPage).map(task => <Card key={task.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => props.$w.utils.navigateTo({
                  pageId: 'testTaskDetail',
                  params: {
                    taskId: task.id
                  }
                })}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h3 className="font-medium text-gray-900">{task.patientName}</h3>
                                  <p className="text-sm text-gray-600">{task.testType}</p>
                                </div>
                                <div className="text-right">
                                  <div className="mb-2">
                                    {getStatusBadge(task.status)}
                                  </div>
                                  <p className="text-sm text-gray-500">提交时间: {task.submitDate}</p>
                                  {task.resultDate && <p className="text-sm text-gray-500">结果时间: {task.resultDate}</p>}
                                </div>
                              </div>
                            </CardContent>
                          </Card>)}
                  </div>
                  
                  {getTotalPages(testTasks) > 1 && <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious onClick={() => setTestsPage(Math.max(1, testsPage - 1))}>
                          上一页
                        </PaginationPrevious>
                      </PaginationItem>
                      
                      {Array.from({
                    length: Math.min(5, getTotalPages(testTasks))
                  }, (_, i) => {
                    const pageNum = i + 1;
                    return <PaginationItem key={pageNum}>
                            <PaginationLink onClick={() => setTestsPage(pageNum)} isActive={testsPage === pageNum}>
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>;
                  })}
                      
                      {getTotalPages(testTasks) > 5 && <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>}
                      
                      <PaginationItem>
                        <PaginationNext onClick={() => setTestsPage(Math.min(getTotalPages(testTasks), testsPage + 1))}>
                          下一页
                        </PaginationNext>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>}
                </div>}
            </div>
          </div>
        </div>
      </main>
    </div>;
}