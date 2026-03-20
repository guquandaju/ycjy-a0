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
      if (patientsResult.success && patientsResult.data && patientsResult.data.length > 0) {
        setPatients(patientsResult.data);
      } else {
        toast({
          title: "加载患者数据失败",
          description: patientsResult.error || "使用模拟数据",
          variant: "destructive"
        });
        // API失败时使用模拟数据
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
      }

      // 获取检验任务数据
      const tasksResult = await medicalAPI.getTestTasks('{ "data": [{ "_id": "p001" }]}');
      if (tasksResult.success && tasksResult.data && tasksResult.data.length > 0) {
        setTestTasks(tasksResult.data);
      } else {
        toast({
          title: "加载检验任务失败",
          description: tasksResult.error || "使用模拟数据",
          variant: "destructive"
        });
        // API失败时使用模拟数据
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
  return <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* 头部 */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">乡镇卫生院工作台</h1>
            <p className="text-gray-600 mt-1">远程检验平台 - 患者管理与检验申请</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={isLoading} className="flex items-center gap-2">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? '加载中...' : '刷新'}
            </Button>
            
            <Button onClick={handleNewPatient} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              新患者
            </Button>
            
            <Button onClick={handleNewTest} className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
              <FileText className="w-4 h-4" />
              检验
            </Button>
          </div>
        </div>
      </div>

      {/* 主体内容 */}
      <div className="space-y-6">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">患者总数</p>
                  <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">检验任务</p>
                  <p className="text-2xl font-bold text-gray-900">{testTasks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">已完成</p>
                  <p className="text-2xl font-bold text-gray-900">{testTasks.filter(task => task.status === 'completed').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">待处理</p>
                  <p className="text-2xl font-bold text-gray-900">{testTasks.filter(task => task.status === 'pending').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 标签页 */}
        <Card>
          <div className="border-b">
            <div className="flex space-x-8">
              <button onClick={() => setActiveTab('patients')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'patients' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                患者管理 ({patients.length})
              </button>
              <button onClick={() => setActiveTab('tests')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'tests' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                检验任务 ({testTasks.length})
              </button>
            </div>
          </div>
          
          <CardContent className="p-0">
            {activeTab === 'patients' && <div>
                <div className="divide-y">
                  {getPaginatedItems(patients, patientsPage).map(patient => <div key={patient.id} className="p-6 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => props.$w.utils.navigateTo({
                pageId: 'patientDetail',
                params: {
                  patientId: patient.id
                }
              })}>
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-gray-900">{patient.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{patient.age}岁 • {patient.gender} • {patient.phone}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">最近就诊</p>
                          <p className="text-sm font-medium text-gray-900">{formatLocalTime(patient.lastVisit)}</p>
                        </div>
                      </div>
                    </div>)}
                </div>
                
                {getTotalPages(patients) > 1 && <div className="border-t p-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious onClick={() => setPatientsPage(Math.max(1, patientsPage - 1))}>
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
                            下一页
                          </PaginationNext>
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>}
              </div>}

            {activeTab === 'tests' && <div>
                <div className="divide-y">
                  {getPaginatedItems(testTasks, testsPage).map(task => <div key={task.id} className="p-6 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => props.$w.utils.navigateTo({
                pageId: 'testTaskDetail',
                params: {
                  taskId: task.id
                }
              })}>
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-gray-900">{task.patientName}</h3>
                          <p className="text-sm text-gray-600 mt-1">{task.testType}</p>
                        </div>
                        <div className="text-right">
                          <div className="mb-2">
                            {getStatusBadge(task.status)}
                          </div>
                          <p className="text-sm text-gray-600">提交时间: {task.submitDate}</p>
                          {task.resultDate && <p className="text-sm text-gray-600">结果时间: {task.resultDate}</p>}
                        </div>
                      </div>
                    </div>)}
                </div>
                
                {getTotalPages(testTasks) > 1 && <div className="border-t p-4">
                    <Pagination>
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
                    </Pagination>
                  </div>}
              </div>}
          </CardContent>
        </Card>
      </div>
    </div>;
}