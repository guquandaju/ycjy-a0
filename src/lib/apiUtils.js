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
      body: JSON.stringify(data) 
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
      body: JSON.stringify(data) 
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
  
  // 获取检验结果
  async getTestResults(patientId, testId) {
    return await apiCaller.get(`https://api.medical.com/test-results?patient=${patientId}&test=${testId}`);
  },
  
  // 同步患者信息
  async syncPatientInfo(patientData) {
    try {
      const response = await apiCaller.post('http://localhost:3000/syncPatient', patientData);
      return {
        success: response.mes === '成功',
        data: response.data,
        message: response.mes
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  // 获取患者数据
  async getPatients(hospitalId) {
    try {
      console.log('开始调用后端API获取患者数据，医院ID:', hospitalId);
      
      // 调用您的后端API，使用POST方法
      const response = await apiCaller.post('http://127.0.0.1:3000/api/ris/getPatients', {
        hospitalId: hospitalId
      });
      
      console.log('后端API响应:', response);
      
      // 适配您的后端返回格式 {"mes": "成功", "data": [...]}
      console.log('完整响应对象:', response);
      console.log('响应状态码:', response && response.status);
      console.log('响应消息:', response && response.mes);
      
      // 关键修复：深入检查响应结构，支持多种响应格式
      let rawData = [];
      if (response && response.data) {
        rawData = response.data;
      } else if (response && response.result) {
        rawData = response.result;
      } else if (response && response.list) {
        rawData = response.list;
      } else if (Array.isArray(response)) {
        rawData = response;
      }
      
      console.log('提取的原始数据:', rawData);
      console.log('原始数据:', rawData);
      console.log('原始数据类型:', typeof rawData);
      console.log('是否是数组:', Array.isArray(rawData));
      console.log('原始数据长度:', rawData ? rawData.length : 0);
      
      // 修复this上下文问题，使用独立的maskPhone函数
      const maskPhone = (phone) => {
        if (!phone) return '';
        return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
      };
      
      // 确保rawData是数组 - 添加更严格的检查
      let safeRawData = [];
      if (Array.isArray(rawData)) {
        safeRawData = rawData;
      } else if (rawData && typeof rawData === 'object') {
        // 如果rawData是对象但不是数组，尝试转换为数组
        safeRawData = Object.values(rawData);
        console.log('将对象转换为数组:', safeRawData);
      }
      console.log('安全处理后的数据:', safeRawData);
      console.log('安全数据长度:', safeRawData.length);
      
      const adaptedData = safeRawData.map(patient => {
        console.log('处理患者数据:', patient);
        console.log('患者数据字段:', Object.keys(patient));
        console.log('患者数据值:', patient);
        
        // 检查后端返回的实际字段名，适配不同的字段命名
        const patientData = {
          id: patient._id || patient.id || patient.patientId || patient.patient_id || '',
          name: patient.name || patient.patientName || patient.username || patient.patient_name || patient.realName || patient.real_name || '',
          age: patient.age || patient.patientAge || patient.patient_age || 0,
          gender: patient.gender === 'male' ? '男' : patient.gender === 'female' ? '女' : patient.gender || '未知',
          phone: maskPhone(patient.phone || patient.mobile || patient.telephone || patient.mobilePhone || patient.mobile_phone || ''),
          idCard: patient.id_card || patient.idCard || patient.identityCard || patient.identity_card || patient.idNumber || patient.id_number || '',
          address: patient.address || patient.patientAddress || patient.patient_address || patient.residence || patient.homeAddress || patient.home_address || '',
          medicalHistory: patient.medical_history || patient.medicalHistory || patient.medical_history || patient.history || patient.medicalRecord || patient.medical_record || '',
          emergencyContact: patient.emergency_contact || patient.emergencyContact || patient.emergency_contact || patient.contactPerson || patient.contact_person || patient.emergencyPerson || patient.emergency_person || '',
          emergencyPhone: maskPhone(patient.emergency_phone || patient.emergencyPhone || patient.emergency_phone || patient.contactPhone || patient.contact_phone || patient.emergencyMobile || patient.emergency_mobile || ''),
          lastVisit: patient.last_visit_date || patient.lastVisitDate || patient.last_visit_date || patient.lastVisit || patient.last_visit || patient.lastVisitTime || patient.last_visit_time || '暂无就诊记录'
        };
        
        console.log('转换后的患者数据:', patientData);
        return patientData;
      });
      
      console.log('适配后的数据:', adaptedData);
      console.log('适配后数据长度:', adaptedData.length);
      
      return {
        success: response && response.mes === '成功',
        data: adaptedData,
        message: response ? response.mes : '无响应'
      };
    } catch (error) {
      console.error('获取患者数据失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  // 获取检验任务数据
  async getTestTasks(hospitalId) {
    try {
      // 调用您的后端API获取检验任务
      const response = await apiCaller.post('http://localhost:3000/getTestTasks', {
        hospitalId: hospitalId
      });
      
      // 适配您的后端返回格式
      const adaptedData = (response.data || []).map(task => ({
        id: task._id || task.id,
        patientName: task.patient_name || task.patientName,
        testType: task.test_type || task.testType,
        status: task.status,
        submitDate: task.submit_date || task.submitDate,
        resultDate: task.result_date || task.resultDate
      }));
      
      return {
        success: response.mes === '成功',
        data: adaptedData,
        message: response.mes
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  /**
   * 手机号脱敏处理
   * @param {string} phone 手机号
   * @returns {string} 脱敏后的手机号
   */
  maskPhone(phone) {
    if (!phone) return '';
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  }
};