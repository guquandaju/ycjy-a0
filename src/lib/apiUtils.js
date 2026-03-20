// 外部API调用工具函数
// 支持GET、POST、PUT、DELETE等HTTP方法

/**
 * 格式化时间为本地化中文格式
 * @param {string|Date} date 日期字符串或Date对象
 * @param {boolean} includeTime 是否包含时间
 * @returns {string} 格式化后的时间字符串
 */
export const formatLocalTime = (date, includeTime = false) => {
  if (!date) return '暂无就诊记录';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return '日期格式错误';
    }
    
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    
    if (!includeTime) {
      return `${year}年${month}月${day}日`;
    }
    
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const seconds = String(dateObj.getSeconds()).padStart(2, '0');
    
    return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    console.error('时间格式化错误:', error);
    return '日期格式错误';
  }
};

/**
 * 格式化相对时间（如：3天前）
 * @param {string|Date} date 日期字符串或Date对象
 * @returns {string} 相对时间字符串
 */
export const formatRelativeTime = (date) => {
  if (!date) return '暂无就诊记录';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now - dateObj;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return '今天';
    } else if (diffDays === 1) {
      return '昨天';
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks}周前`;
    } else {
      return formatLocalTime(dateObj, false);
    }
  } catch (error) {
    console.error('相对时间格式化错误:', error);
    return formatLocalTime(date, false);
  }
};

import { data } from "autoprefixer";

export const apiCaller = {
  /**
   * GET请求
   * @param {string} url API地址
   * @param {object} options 请求选项
   */
  async get(url, options = {}) {
    return await this.request(url, 'GET', options);
  },
  
  /**
   * POST请求
   * @param {string} url API地址
   * @param {object} data 请求数据
   * @param {object} options 请求选项
   */
  async post(url, data, options = {}) {
    return await this.request(url, 'POST', { 
      ...options, 
     // body: JSON.stringify(data) 
      body: data  // 支持FormData和普通对象
    });
  },
  
  /**
   * PUT请求
   * @param {string} url API地址
   * @param {object} data 请求数据
   * @param {object} options 请求选项
   */
  async put(url, data, options = {}) {
    return await this.request(url, 'PUT', { 
      ...options, 
      //body: JSON.stringify(data) 
    });
  },
  
  /**
   * DELETE请求
   * @param {string} url API地址
   * @param {object} options 请求选项
   */
  async delete(url, options = {}) {
    return await this.request(url, 'DELETE', options);
  },
  
  /**
   * 通用请求方法
   * @param {string} url API地址
   * @param {string} method HTTP方法
   * @param {object} options 请求选项
   */
  async request(url, method = 'GET', options = {}) {
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };
    
    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP错误! 状态码: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        success: true,
        data: data,
        status: response.status
      };
      
    } catch (error) {
      console.error('API调用失败:', error);
      return {
        success: false,
        error: error.message,
        status: 0
      };
    }
  }
};

/**
 * 医疗检验相关API调用示例
 */
export const medicalAPI = {
  // 获取检验项目列表
  async getTestItems(hospitalId) {
    return await apiCaller.get(`https://api.medical.com/test-items?hospital=${hospitalId}`);
  },
  
  // 提交检验申请
  async submitTestApplication(data) {
    return await apiCaller.post('https://api.medical.com/test-applications', data);
  },

 // 获取患者数据
 async getPatients(data) {
  try {
    console.log('开始调用后端API获取患者数据，医院ID:', data);
    
    // 调用您的后端API，使用POST方法
    const response = await apiCaller.post('http://127.0.0.1:3000/api/ris/getPatients',data);
    
    // console.log('后端API响应:', response);
    
    // // 适配您的后端返回格式 {"mes": "成功", "data": [...]}
    // console.log('完整响应对象:', response);
    
    // // 关键修复：深入检查响应结构
    // const rawData = response && response.data ? response.data : [];
    // console.log('原始数据:', rawData);
    // console.log('原始数据类型:', typeof rawData);
    // console.log('是否是数组:', Array.isArray(rawData));
    // console.log('原始数据长度:', rawData ? rawData.length : 0);
    
    // // 修复this上下文问题，使用独立的maskPhone函数
    // const maskPhone = (phone) => {
    //   if (!phone) return '';
    //   return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    // };
    
    // // 确保rawData是数组 - 添加更严格的检查
    // let safeRawData = [];
    // if (Array.isArray(rawData)) {
    //   safeRawData = rawData;
    // } else if (rawData && typeof rawData === 'object') {
    //   // 如果rawData是对象但不是数组，尝试转换为数组
    //   safeRawData = Object.values(rawData);
    //   console.log('将对象转换为数组:', safeRawData);
    // }
    // console.log('安全处理后的数据:', safeRawData);
    // console.log('安全数据长度:', safeRawData.length);
    
    const adaptedData = Object.values(response.data)[1].map(patient => {
      console.log('处理患者数据:', patient);
      return {
        id: patient._id,
        name: patient.name,
        age: patient.age,
        //gender: patient.gender,
        gender: patient.gender === 'male' ? '男' : patient.gender === 'female' ? '女' : patient.gender || '未知',
        phone: patient.phone,
        lastVisit: patient.created_at
               };
    });
    
    return {
      success: response && response.data.mes === '成功',
      data: adaptedData,
      message: response ? response.data.mes : '无响应'
    };
  } catch (error) {
    console.error('获取患者数据失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
},
    
    // 获取患者检验信息
    async getTestTasks(data) {
      //return await apiCaller.post('http://127.0.0.1:3000/api/ris/getTestTasks', data);
      try {
        console.log('开始调用后端API获取患者数据，医院ID:', data);
        
        // 调用您的后端API，使用POST方法
        const response = await apiCaller.post('http://127.0.0.1:3000/api/ris/getTestTasks', data);
        const adaptedData = Object.values(response.data)[1].map(patient => {
          console.log('处理患者数据:', patient);
          return {
            id: patient._id,
            patientName: patient.patientName,
            testType: patient.testType,
            status: patient.status,
            submitDate: patient.submitDate,
            resultDate: patient.resultDate
                   };
        });
        
        return {
          success: response && response.data.mes === '成功',
          data: adaptedData,
          message: response ? response.data.mes : '无响应'
        };
      } catch (error) {
        console.error('获取患者数据失败:', error);
        return {
          success: false,
          error: error.message
        };
      }              
    },

  // 获取检验结果
  async getTestResults(patientId, testId) {
    return await apiCaller.get(`https://api.medical.com/test-results?patient=${patientId}&test=${testId}`);
  },
  
  // 同步患者信息
  async syncPatientInfo(patientData) {
    return await apiCaller.post('https://api.medical.com/patients/sync', patientData);
  }
};