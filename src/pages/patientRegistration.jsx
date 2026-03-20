// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Button, Input, Card, CardContent, CardDescription, CardHeader, CardTitle, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, useToast } from '@/components/ui';
// @ts-ignore;
import { ArrowLeft, Save } from 'lucide-react';

import { apiCaller } from '@/lib/apiUtils';
export default function PatientRegistration(props) {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    age: '',
    idCard: '',
    phone: '',
    address: '',
    medicalHistory: '',
    emergencyContact: '',
    emergencyPhone: ''
  });
  const {
    toast
  } = useToast();
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSubmit = async () => {
    // 验证必填字段
    if (!formData.name || !formData.gender || !formData.age || !formData.phone) {
      toast({
        title: "信息不完整",
        description: "请填写患者基本信息",
        variant: "destructive"
      });
      return;
    }

    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast({
        title: "手机号格式错误",
        description: "请输入正确的11位手机号码",
        variant: "destructive"
      });
      return;
    }

    // 验证紧急联系人手机号格式
    if (formData.emergencyPhone && !phoneRegex.test(formData.emergencyPhone)) {
      toast({
        title: "紧急联系人手机号格式错误",
        description: "请输入正确的11位手机号码",
        variant: "destructive"
      });
      return;
    }
    try {
      // 使用POST方式调用外部API保存患者信息
      const patientData = {
        name: formData.name,
        gender: formData.gender,
        // === 'male' ? '男' : '女',
        age: parseInt(formData.age),
        idCard: formData.idCard || '',
        phone: formData.phone,
        address: formData.address || '',
        medicalHistory: formData.medicalHistory || '',
        emergencyContact: formData.emergencyContact || '',
        emergencyPhone: formData.emergencyPhone || '',
        village: '幸福村',
        hospitalId: 'vh001',
        createTime: getDatabaseTimestamp(),
        lastVisit: getDatabaseTimestamp()
      };

      // 使用apiCaller.post调用外部API
      const result = await apiCaller.post('http://127.0.0.1:3000/api/ris/addpatients', JSON.stringify(patientData));
      if (result.success || result.id) {
        toast({
          title: "患者登记成功",
          description: `${formData.name}的信息已保存到系统`
        });

        // 返回乡镇卫生院工作台
        setTimeout(() => {
          props.$w.utils.navigateBack();
        }, 1500);
      } else {
        throw new Error(result.message || '保存失败');
      }
    } catch (error) {
      console.error('保存患者信息失败:', error);
      toast({
        title: "保存失败",
        description: error.message || '网络错误，请稍后重试',
        variant: "destructive"
      });
    }
  };
  const handleBack = () => {
    props.$w.utils.navigateBack();
  };
  return <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* 头部 */}
        <div className="mb-6">
          <Button variant="ghost" onClick={handleBack} className="mb-4 hover:bg-gray-100 active:bg-gray-200 active:scale-95 transition-all duration-200">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">患者信息登记</h1>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
            <CardDescription>
              请填写患者的个人信息和联系方式
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            {/* 基本信息 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <Label htmlFor="name">姓名 *</Label>
                <Input id="name" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} placeholder="请输入患者姓名" />
              </div>
              
              <div>
                <Label htmlFor="gender">性别 *</Label>
                <Select value={formData.gender} onValueChange={value => handleInputChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择性别" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">男</SelectItem>
                    <SelectItem value="female">女</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="age">年龄 *</Label>
                <Input id="age" type="number" value={formData.age} onChange={e => handleInputChange('age', e.target.value)} placeholder="请输入年龄" />
              </div>

              <div>
                <Label htmlFor="idCard">身份证号</Label>
                <Input id="idCard" value={formData.idCard} onChange={e => handleInputChange('idCard', e.target.value)} placeholder="请输入身份证号码" />
              </div>

              <div>
                <Label htmlFor="phone">联系电话 *</Label>
                <Input id="phone" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} placeholder="请输入手机号码" />
              </div>

              <div>
                <Label htmlFor="address">联系地址</Label>
                <Input id="address" value={formData.address} onChange={e => handleInputChange('address', e.target.value)} placeholder="请输入详细地址" />
              </div>
            </div>

            {/* 紧急联系人 */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">紧急联系人信息</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="emergencyContact">紧急联系人姓名</Label>
                  <Input id="emergencyContact" value={formData.emergencyContact} onChange={e => handleInputChange('emergencyContact', e.target.value)} placeholder="请输入紧急联系人姓名" />
                </div>
                
                <div>
                  <Label htmlFor="emergencyPhone">紧急联系电话</Label>
                  <Input id="emergencyPhone" value={formData.emergencyPhone} onChange={e => handleInputChange('emergencyPhone', e.target.value)} placeholder="请输入紧急联系电话" />
                </div>
              </div>
            </div>

            {/* 病史信息 */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">病史信息</h3>
              <div>
                <Label htmlFor="medicalHistory">既往病史</Label>
                <textarea id="medicalHistory" value={formData.medicalHistory} onChange={e => handleInputChange('medicalHistory', e.target.value)} placeholder="请输入患者的既往病史、过敏史等信息" className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 sm:pt-6 border-t">
              <Button variant="outline" onClick={handleBack} className="hover:bg-gray-50 active:bg-gray-100 active:scale-95 transition-all duration-200 text-sm sm:text-base">
                取消
              </Button>
              <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 active:scale-98 transition-all duration-200 shadow-md hover:shadow-lg active:shadow-sm text-sm sm:text-base">
                <Save className="w-4 h-4 mr-2" />
                保存患者信息
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
}