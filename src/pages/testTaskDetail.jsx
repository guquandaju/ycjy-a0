// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, useToast } from '@/components/ui';
// @ts-ignore;
import { ArrowLeft, FileText, Calendar, User, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function TestTaskDetail(props) {
  const [task, setTask] = useState(null);
  const [testItems, setTestItems] = useState([]);
  const {
    toast
  } = useToast();

  // 模拟数据
  useEffect(() => {
    const taskId = props.$w.page.dataset.params.id;

    // 模拟任务数据
    const mockTask = {
      id: taskId,
      patientName: '张三',
      patientAge: 45,
      patientGender: '男',
      testType: '血常规',
      status: 'in-progress',
      submitDate: '2026-03-15',
      submitBy: '李医生',
      receiveDate: '2026-03-15',
      completeDate: null,
      priority: '常规',
      notes: '患者近期有头晕症状，请重点关注血红蛋白指标'
    };

    // 模拟检验项目
    const mockTestItems = [{
      id: 1,
      name: '白细胞计数',
      unit: '×10^9/L',
      normalRange: '4.0-10.0',
      result: null,
      status: '待检验'
    }, {
      id: 2,
      name: '红细胞计数',
      unit: '×10^12/L',
      normalRange: '4.0-5.5',
      result: null,
      status: '待检验'
    }, {
      id: 3,
      name: '血红蛋白',
      unit: 'g/L',
      normalRange: '120-160',
      result: null,
      status: '检验中'
    }, {
      id: 4,
      name: '血小板计数',
      unit: '×10^9/L',
      normalRange: '100-300',
      result: null,
      status: '待检验'
    }];
    setTask(mockTask);
    setTestItems(mockTestItems);
  }, [props.$w.page.dataset.params.id]);
  const handleBack = () => {
    props.$w.utils.navigateBack();
  };
  const getStatusInfo = status => {
    switch (status) {
      case 'pending':
        return {
          label: '待接收',
          color: 'secondary',
          icon: Clock
        };
      case 'in-progress':
        return {
          label: '检验中',
          color: 'default',
          icon: AlertCircle
        };
      case 'completed':
        return {
          label: '已完成',
          color: 'success',
          icon: CheckCircle
        };
      default:
        return {
          label: '未知',
          color: 'secondary',
          icon: Clock
        };
    }
  };
  if (!task) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>;
  }
  const statusInfo = getStatusInfo(task.status);
  const StatusIcon = statusInfo.icon;
  return <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <header className="bg-white shadow-sm border-b">
        <div className="w-full px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={handleBack} className="hover:bg-gray-100 active:bg-gray-200 active:scale-95 transition-all duration-200">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">检验任务详情</h1>
              <p className="text-gray-600">{task.patientName} - {task.testType}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full px-4 py-6 space-y-6 sm:px-6 lg:px-8">
        {/* 任务概览 */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>任务概览</span>
                </CardTitle>
                <CardDescription>检验任务基本信息</CardDescription>
              </div>
              <Badge variant={statusInfo.color} className="flex items-center space-x-2">
                <StatusIcon className="w-3 h-3" />
                <span>{statusInfo.label}</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">患者信息</label>
                <p className="text-lg font-semibold flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{task.patientName} ({task.patientAge}岁, {task.patientGender})</span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">检验项目</label>
                <p className="text-lg font-semibold">{task.testType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">优先级</label>
                <p className="text-lg">{task.priority}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">提交时间</label>
                <p className="text-lg flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{task.submitDate}</span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">提交医生</label>
                <p className="text-lg">{task.submitBy}</p>
              </div>
              {task.receiveDate && <div>
                  <label className="text-sm font-medium text-gray-600">接收时间</label>
                  <p className="text-lg">{task.receiveDate}</p>
                </div>}
              {task.completeDate && <div>
                  <label className="text-sm font-medium text-gray-600">完成时间</label>
                  <p className="text-lg">{task.completeDate}</p>
                </div>}
            </div>
          </CardContent>
        </Card>

        {/* 检验项目明细 */}
        <Card>
          <CardHeader>
            <CardTitle>检验项目明细</CardTitle>
            <CardDescription>具体检验项目与结果</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testItems.map(item => <div key={item.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-gray-600">参考范围: {item.normalRange} {item.unit}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    {item.result ? <span className={`text-lg font-semibold ${item.result.includes('异常') ? 'text-red-600' : 'text-green-600'}`}>
                        {item.result}
                      </span> : <Badge variant={item.status === '检验中' ? 'default' : 'secondary'}>
                        {item.status}
                      </Badge>}
                  </div>
                </div>)}
            </div>
          </CardContent>
        </Card>

        {/* 医生备注 */}
        {task.notes && <Card>
            <CardHeader>
              <CardTitle>医生备注</CardTitle>
              <CardDescription>医生特别说明事项</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">{task.notes}</p>
              </div>
            </CardContent>
          </Card>}

        {/* 操作按钮 */}
        {task.status === 'pending' && <div className="flex justify-end space-x-4">
            <Button variant="outline">
              拒绝接收
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 active:bg-green-800">
              接收任务
            </Button>
          </div>}

        {task.status === 'in-progress' && <div className="flex justify-end space-x-4">
            <Button variant="outline">
              暂停检验
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800">
              录入结果
            </Button>
          </div>}

        {task.status === 'completed' && <div className="flex justify-end space-x-4">
            <Button variant="outline">
              打印报告
            </Button>
            <Button>
              查看完整报告
            </Button>
          </div>}
      </div>
    </div>;
}