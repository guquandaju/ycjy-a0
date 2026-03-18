// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, useToast } from '@/components/ui';
// @ts-ignore;
import { ArrowLeft, User, Calendar, Phone, MapPin, FileText } from 'lucide-react';

// @ts-ignore;
import { formatLocalTime } from '@/lib/apiUtils';
// @ts-ignore;

export default function PatientDetail(props) {
  const [patient, setPatient] = useState(null);
  const [testHistory, setTestHistory] = useState([]);
  const {
    toast
  } = useToast();

  // 模拟数据
  useEffect(() => {
    const patientId = props.$w.page.dataset.params.id;

    // 模拟患者数据
    const mockPatient = {
      id: patientId,
      name: '张三',
      age: 45,
      gender: '男',
      phone: '13800138000',
      address: 'XX省XX市XX区XX街道XX号',
      idCard: '123456199001011234',
      medicalHistory: '高血压病史5年，糖尿病史2年',
      lastVisit: '2026-03-15',
      emergencyContact: '李四',
      emergencyPhone: '13900139000'
    };

    // 模拟检验历史
    const mockHistory = [{
      id: 1,
      testType: '血常规',
      date: '2026-03-15',
      status: '已完成',
      result: '正常'
    }, {
      id: 2,
      testType: '尿常规',
      date: '2026-03-10',
      status: '已完成',
      result: '正常'
    }, {
      id: 3,
      testType: '肝功能',
      date: '2026-02-28',
      status: '已完成',
      result: '轻度异常'
    }];
    setPatient(mockPatient);
    setTestHistory(mockHistory);
  }, [props.$w.page.dataset.params.id]);
  const handleBack = () => {
    props.$w.utils.navigateBack();
  };
  const handleNewTest = () => {
    if (patient) {
      props.$w.utils.navigateTo({
        pageId: 'testRegistration',
        params: {
          patientId: patient.id
        }
      });
    }
  };
  if (!patient) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>;
  }
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
              <h1 className="text-2xl font-bold text-gray-900">患者详情</h1>
              <p className="text-gray-600">{patient.name} - 基本信息与检验历史</p>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full px-4 py-6 space-y-6 sm:px-6 lg:px-8">
        {/* 基本信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>基本信息</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">姓名</label>
                <p className="text-lg font-semibold">{patient.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">年龄</label>
                <p className="text-lg">{patient.age}岁</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">性别</label>
                <p className="text-lg">{patient.gender}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">联系电话</label>
                <p className="text-lg flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>{patient.phone}</span>
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">身份证号</label>
                <p className="text-lg">{patient.idCard}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">住址</label>
                <p className="text-lg flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{patient.address}</span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">最后就诊</label>
                <p className="text-lg flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatLocalTime(patient.lastVisit)}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 病史信息 */}
        <Card>
          <CardHeader>
            <CardTitle>病史信息</CardTitle>
            <CardDescription>患者既往病史与过敏史</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium text-gray-600">既往病史</label>
                <p className="text-gray-800">{patient.medicalHistory || '无特殊病史'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">紧急联系人</label>
                <p className="text-gray-800">{patient.emergencyContact} - {patient.emergencyPhone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 检验历史 */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>检验历史</span>
                </CardTitle>
                <CardDescription>患者过往检验记录</CardDescription>
              </div>
              <Button onClick={handleNewTest} className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 active:scale-98 transition-all duration-200">
                <FileText className="w-4 h-4 mr-2" />
                新增检验
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testHistory.map(test => <div key={test.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                    <h4 className="font-semibold">{test.testType}</h4>
                    <p className="text-sm text-gray-600">检验日期: {test.date}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant={test.status === '已完成' ? 'success' : 'default'}>
                      {test.status}
                    </Badge>
                    <span className={`text-sm font-medium ${test.result === '正常' ? 'text-green-600' : test.result === '轻度异常' ? 'text-yellow-600' : 'text-red-600'}`}>
                      {test.result}
                    </span>
                  </div>
                </div>)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
}