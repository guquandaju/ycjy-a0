// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, useToast } from '@/components/ui';
// @ts-ignore;
import { ArrowLeft, Download, Printer, FileText } from 'lucide-react';

export default function TestResults(props) {
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const {
    toast
  } = useToast();

  // 模拟检验结果数据
  useEffect(() => {
    setResults([{
      id: 1,
      patientName: '张三',
      testType: '血常规',
      testDate: '2026-03-15',
      resultDate: '2026-03-16',
      status: 'completed',
      villageHospital: 'XX乡镇卫生院',
      countyHospital: 'XX县人民医院',
      items: [{
        name: '白细胞计数',
        value: '6.5',
        unit: '×10⁹/L',
        normalRange: '4.0-10.0',
        status: 'normal'
      }, {
        name: '红细胞计数',
        value: '4.8',
        unit: '×10¹²/L',
        normalRange: '4.0-5.5',
        status: 'normal'
      }, {
        name: '血红蛋白',
        value: '145',
        unit: 'g/L',
        normalRange: '120-160',
        status: 'normal'
      }, {
        name: '血小板计数',
        value: '210',
        unit: '×10⁹/L',
        normalRange: '100-300',
        status: 'normal'
      }],
      doctorNotes: '检验结果正常，无明显异常。建议定期复查。',
      doctorName: '李医生'
    }, {
      id: 2,
      patientName: '李四',
      testType: '尿常规',
      testDate: '2026-03-14',
      resultDate: '2026-03-15',
      status: 'completed',
      villageHospital: 'YY乡镇卫生院',
      countyHospital: 'XX县人民医院',
      items: [{
        name: '尿蛋白',
        value: '阴性',
        unit: '',
        normalRange: '阴性',
        status: 'normal'
      }, {
        name: '尿糖',
        value: '阴性',
        unit: '',
        normalRange: '阴性',
        status: 'normal'
      }, {
        name: '尿胆原',
        value: '正常',
        unit: '',
        normalRange: '正常',
        status: 'normal'
      }, {
        name: '红细胞',
        value: '0-2',
        unit: '个/HP',
        normalRange: '0-3',
        status: 'normal'
      }],
      doctorNotes: '尿常规检查结果正常。',
      doctorName: '王医生'
    }]);
  }, []);
  const handleBack = () => {
    props.$w.utils.navigateBack();
  };
  const handleViewDetails = result => {
    setSelectedResult(result);
  };
  const handlePrint = () => {
    toast({
      title: "打印功能",
      description: "检验报告打印功能已调用"
    });
  };
  const handleDownload = () => {
    toast({
      title: "下载功能",
      description: "检验报告下载功能已调用"
    });
  };
  const getStatusBadge = status => {
    return <Badge variant="success">已完成</Badge>;
  };
  const getItemStatus = item => {
    if (item.status === 'abnormal') return 'text-red-600 font-semibold';
    if (item.status === 'warning') return 'text-orange-600 font-semibold';
    return 'text-gray-700';
  };
  if (selectedResult) {
    return <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* 头部 */}
          <div className="flex justify-between items-center mb-6">
            <Button variant="ghost" onClick={() => setSelectedResult(null)} className="mr-4 hover:bg-gray-100 active:bg-gray-200 active:scale-95 transition-all duration-200">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回列表
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handlePrint} className="hover:bg-gray-50 active:bg-gray-100 active:scale-95 transition-all duration-200">
                <Printer className="w-4 h-4 mr-2" />
                打印报告
              </Button>
              <Button variant="outline" onClick={handleDownload} className="hover:bg-gray-50 active:bg-gray-100 active:scale-95 transition-all duration-200">
                <Download className="w-4 h-4 mr-2" />
                下载报告
              </Button>
            </div>
          </div>

          {/* 检验报告详情 */}
          <Card>
            <CardHeader className="bg-blue-50">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">检验报告单</CardTitle>
                  <CardDescription>
                    {selectedResult.countyHospital} - 检验科
                  </CardDescription>
                </div>
                {getStatusBadge(selectedResult.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 患者信息 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-semibold">患者姓名:</span> {selectedResult.patientName}
                </div>
                <div>
                  <span className="font-semibold">检验项目:</span> {selectedResult.testType}
                </div>
                <div>
                  <span className="font-semibold">送检日期:</span> {selectedResult.testDate}
                </div>
                <div>
                  <span className="font-semibold">报告日期:</span> {selectedResult.resultDate}
                </div>
                <div>
                  <span className="font-semibold">送检单位:</span> {selectedResult.villageHospital}
                </div>
                <div>
                  <span className="font-semibold">检验单位:</span> {selectedResult.countyHospital}
                </div>
              </div>

              {/* 检验结果 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">检验结果</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold">检验项目</th>
                        <th className="px-4 py-2 text-left font-semibold">结果</th>
                        <th className="px-4 py-2 text-left font-semibold">单位</th>
                        <th className="px-4 py-2 text-left font-semibold">参考范围</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedResult.items.map((item, index) => <tr key={index} className="border-t">
                          <td className="px-4 py-3">{item.name}</td>
                          <td className={`px-4 py-3 ${getItemStatus(item)}`}>
                            {item.value}
                          </td>
                          <td className="px-4 py-3 text-gray-600">{item.unit}</td>
                          <td className="px-4 py-3 text-gray-600">{item.normalRange}</td>
                        </tr>)}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 医生意见 */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">检验医师意见</h4>
                <p className="text-blue-800">{selectedResult.doctorNotes}</p>
                <div className="text-right mt-2 text-blue-700">
                  — {selectedResult.doctorName}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* 头部 */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={handleBack} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">检验结果查询</h1>
        </div>

        {/* 结果列表 */}
        <div className="grid gap-6">
          {results.map(result => <Card key={result.id} className="hover:shadow-lg active:shadow-md active:scale-98 transition-all duration-200 cursor-pointer" onClick={() => handleViewDetails(result)}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-lg">{result.patientName} - {result.testType}</h3>
                      {getStatusBadge(result.status)}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">送检单位:</span> {result.villageHospital}
                      </div>
                      <div>
                        <span className="font-medium">检验单位:</span> {result.countyHospital}
                      </div>
                      <div>
                        <span className="font-medium">送检日期:</span> {result.testDate}
                      </div>
                      <div>
                        <span className="font-medium">报告日期:</span> {result.resultDate}
                      </div>
                    </div>
                    
                    <p className="mt-2 text-gray-700">
                      <span className="font-medium">医师意见:</span> {result.doctorNotes}
                    </p>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    查看详情
                  </Button>
                </div>
              </CardContent>
            </Card>)}
        </div>

        {results.length === 0 && <Card>
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600">暂无检验结果</h3>
              <p className="text-gray-500">当前没有可查看的检验报告</p>
            </CardContent>
          </Card>}
      </div>
    </div>;
}