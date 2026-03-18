// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Input, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, useToast } from '@/components/ui';
// @ts-ignore;
import { Search, User, Calendar, MapPin, Filter } from 'lucide-react';

export default function PatientSearch({
  onPatientSelect,
  selectedPatient
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {
    toast
  } = useToast();

  // 模拟患者数据（实际应用中应从数据库获取）
  const patients = [{
    id: '1',
    name: '张三',
    age: 45,
    gender: '男',
    village: '幸福村',
    phone: '138****1234',
    lastVisit: '2026-03-15'
  }, {
    id: '2',
    name: '李四',
    age: 32,
    gender: '女',
    village: '阳光村',
    phone: '139****5678',
    lastVisit: '2026-03-10'
  }, {
    id: '3',
    name: '王五',
    age: 68,
    gender: '男',
    village: '和平村',
    phone: '137****9012',
    lastVisit: '2026-03-05'
  }, {
    id: '4',
    name: '赵六',
    age: 28,
    gender: '女',
    village: '幸福村',
    phone: '136****3456',
    lastVisit: '2026-03-12'
  }, {
    id: '5',
    name: '钱七',
    age: 55,
    gender: '男',
    village: '阳光村',
    phone: '135****7890',
    lastVisit: '2026-03-08'
  }];

  // 搜索患者
  const searchPatients = () => {
    setIsLoading(true);
    setTimeout(() => {
      const filtered = patients.filter(patient => patient.name.includes(searchTerm) || patient.village.includes(searchTerm) || patient.phone.includes(searchTerm));
      setFilteredPatients(filtered);
      setIsLoading(false);
      if (filtered.length === 0 && searchTerm) {
        toast({
          title: "未找到患者",
          description: `未找到匹配"${searchTerm}"的患者`,
          variant: "destructive"
        });
      }
    }, 500);
  };

  // 清空搜索
  const clearSearch = () => {
    setSearchTerm('');
    setFilteredPatients([]);
  };

  // 选择患者
  const handleSelectPatient = patient => {
    onPatientSelect(patient);
    toast({
      title: "患者已选择",
      description: `已选择患者：${patient.name}`,
      variant: "default"
    });
  };

  // 初始化显示所有患者
  useEffect(() => {
    if (!searchTerm) {
      setFilteredPatients(patients);
    }
  }, [searchTerm]);
  return <div className="space-y-4">
      {/* 搜索框 */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input type="text" placeholder="输入患者姓名、所在村或手机号搜索..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onKeyPress={e => e.key === 'Enter' && searchPatients()} className="pl-10 pr-4 py-2" />
        </div>
        <Button onClick={searchPatients} disabled={isLoading}>
          {isLoading ? '搜索中...' : '搜索'}
        </Button>
        {searchTerm && <Button variant="outline" onClick={clearSearch}>
            清空
          </Button>}
      </div>

      {/* 患者列表 */}
      <div className="grid gap-3 max-h-80 overflow-y-auto">
        {filteredPatients.map(patient => <Card key={patient.id} className={`cursor-pointer transition-all hover:shadow-md ${selectedPatient?.id === patient.id ? 'border-blue-500 bg-blue-50' : ''}`} onClick={() => handleSelectPatient(patient)}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                      <Badge variant={patient.gender === '男' ? 'default' : 'secondary'}>
                        {patient.gender}
                      </Badge>
                      <span className="text-sm text-gray-500">{patient.age}岁</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {patient.village}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        上次就诊：{patient.lastVisit}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">{patient.phone}</div>
                  {selectedPatient?.id === patient.id && <Badge variant="default" className="mt-1">已选择</Badge>}
                </div>
              </div>
            </CardContent>
          </Card>)}
      </div>

      {filteredPatients.length === 0 && !isLoading && <div className="text-center py-8 text-gray-500">
          <User className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p>暂无患者数据</p>
        </div>}
    </div>;
}