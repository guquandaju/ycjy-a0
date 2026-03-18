// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Button, Input, Card, CardContent, CardDescription, CardHeader, CardTitle, useToast } from '@/components/ui';

export default function Login(props) {
  const [userType, setUserType] = useState('village'); // village: 乡镇卫生院, county: 县医院
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {
    toast
  } = useToast();
  const handleLogin = async () => {
    if (!username || !password) {
      toast({
        title: "输入错误",
        description: "请输入用户名和密码",
        variant: "destructive"
      });
      return;
    }

    // 模拟登录逻辑
    try {
      toast({
        title: "登录成功",
        description: `欢迎${userType === 'village' ? '乡镇卫生院' : '县医院'}用户`
      });

      // 跳转到对应页面
      setTimeout(() => {
        if (userType === 'village') {
          props.$w.utils.navigateTo({
            pageId: 'villageDashboard',
            params: {
              user: username
            }
          });
        } else {
          props.$w.utils.navigateTo({
            pageId: 'countyDashboard',
            params: {
              user: username
            }
          });
        }
      }, 1000);
    } catch (error) {
      toast({
        title: "登录失败",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4 font-office">
      <Card className="w-full max-w-md shadow-lg border-0 rounded-lg bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-semibold text-slate-700">远程检验平台</CardTitle>
          <CardDescription className="text-slate-500 text-sm">
            乡镇卫生院 - 县医院协作系统
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2 bg-slate-100/50 p-1 rounded-lg">
            <Button variant={userType === 'village' ? 'default' : 'ghost'} onClick={() => setUserType('village')} className={`flex-1 transition-all duration-200 active:scale-95 font-medium rounded-md ${userType === 'village' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md ring-2 ring-blue-300' : 'bg-white/80 text-slate-600 hover:bg-white hover:text-blue-600'}`}>
              乡镇卫生院
            </Button>
            <Button variant={userType === 'county' ? 'default' : 'ghost'} onClick={() => setUserType('county')} className={`flex-1 transition-all duration-200 active:scale-95 font-medium rounded-md ${userType === 'county' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md ring-2 ring-blue-300' : 'bg-white/80 text-slate-600 hover:bg-white hover:text-blue-600'}`}>
              县医院
            </Button>
          </div>
          
          <div className="space-y-3">
            <Input placeholder="用户名" value={username} onChange={e => setUsername(e.target.value)} className="rounded-md border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 bg-white" />
            <Input type="password" placeholder="密码" value={password} onChange={e => setPassword(e.target.value)} className="rounded-md border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 bg-white" />
          </div>
          
          <Button onClick={handleLogin} className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 active:scale-98 transition-all duration-200 shadow-md hover:shadow-lg rounded-md text-white font-medium">
            登录
          </Button>
          
          <div className="text-center text-sm text-slate-400">
            {userType === 'village' ? '乡镇卫生院用户请使用分配账号登录' : '县医院检验人员请使用工作账号登录'}
          </div>
        </CardContent>
      </Card>
    </div>;
}