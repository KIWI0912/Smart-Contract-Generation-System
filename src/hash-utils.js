// 工具函数库
class Utils {
  constructor() {
      this.init();
  }

  init() {
      // 初始化一些全局工具
      this.setupGlobalErrorHandler();
      this.setupPerformanceMonitor();
      this.initializeTheme();
  }

  // ==================== 日期时间工具 ====================
  
  /**
   * 格式化日期
   * @param {Date|string|number} date - 日期对象、字符串或时间戳
   * @param {string} format - 格式字符串，如 'YYYY-MM-DD HH:mm:ss'
   * @returns {string} 格式化后的日期字符串
   */
  formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
      const d = new Date(date);
      if (isNaN(d.getTime())) return '无效日期';

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');

      return format
          .replace('YYYY', year)
          .replace('MM', month)
          .replace('DD', day)
          .replace('HH', hours)
          .replace('mm', minutes)
          .replace('ss', seconds);
  }

  /**
   * 获取相对时间描述
   * @param {Date|string|number} date - 日期
   * @returns {string} 相对时间描述
   */
  getRelativeTime(date) {
      const now = new Date();
      const target = new Date(date);
      const diff = now - target;

      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const months = Math.floor(days / 30);
      const years = Math.floor(days / 365);

      if (years > 0) return `${years}年前`;
      if (months > 0) return `${months}个月前`;
      if (days > 0) return `${days}天前`;
      if (hours > 0) return `${hours}小时前`;
      if (minutes > 0) return `${minutes}分钟前`;
      if (seconds > 10) return `${seconds}秒前`;
      return '刚刚';
  }

  /**
   * 检查日期是否有效
   * @param {*} date - 待检查的日期
   * @returns {boolean} 是否有效
   */
  isValidDate(date) {
      return date instanceof Date && !isNaN(date.getTime());
  }

  // ==================== 字符串工具 ====================

  /**
   * 生成随机字符串
   * @param {number} length - 字符串长度
   * @param {string} charset - 字符集
   * @returns {string} 随机字符串
   */
  generateRandomString(length = 8, charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
      let result = '';
      for (let i = 0; i < length; i++) {
          result += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      return result;
  }

  /**
   * 截断字符串并添加省略号
   * @param {string} str - 原字符串
   * @param {number} maxLength - 最大长度
   * @param {string} suffix - 后缀
   * @returns {string} 截断后的字符串
   */
  truncateString(str, maxLength = 50, suffix = '...') {
      if (!str || str.length <= maxLength) return str;
      return str.substring(0, maxLength - suffix.length) + suffix;
  }

  /**
   * 首字母大写
   * @param {string} str - 输入字符串
   * @returns {string} 首字母大写的字符串
   */
  capitalize(str) {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  /**
   * 驼峰命名转换
   * @param {string} str - 输入字符串
   * @returns {string} 驼峰命名字符串
   */
  toCamelCase(str) {
      return str.replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '');
  }

  /**
   * 短横线命名转换
   * @param {string} str - 输入字符串
   * @returns {string} 短横线命名字符串
   */
  toKebabCase(str) {
      return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }

  // ==================== 数字工具 ====================

  /**
   * 格式化数字
   * @param {number} num - 数字
   * @param {number} decimals - 小数位数
   * @returns {string} 格式化后的数字字符串
   */
  formatNumber(num, decimals = 2) {
      if (isNaN(num)) return '0';
      return Number(num).toLocaleString('zh-CN', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
      });
  }

  /**
   * 格式化文件大小
   * @param {number} bytes - 字节数
   * @param {number} decimals - 小数位数
   * @returns {string} 格式化后的文件大小
   */
  formatFileSize(bytes, decimals = 2) {
      if (bytes === 0) return '0 Bytes';
      
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
  }

  /**
   * 生成指定范围的随机数
   * @param {number} min - 最小值
   * @param {number} max - 最大值
   * @param {boolean} integer - 是否为整数
   * @returns {number} 随机数
   */
  randomNumber(min = 0, max = 100, integer = true) {
      const random = Math.random() * (max - min) + min;
      return integer ? Math.floor(random) : random;
  }

  // ==================== 数组工具 ====================

  /**
   * 数组去重
   * @param {Array} arr - 输入数组
   * @param {string} key - 对象数组的去重键
   * @returns {Array} 去重后的数组
   */
  uniqueArray(arr, key = null) {
      if (!Array.isArray(arr)) return [];
      
      if (key) {
          const seen = new Set();
          return arr.filter(item => {
              const value = item[key];
              if (seen.has(value)) return false;
              seen.add(value);
              return true;
          });
      }
      
      return [...new Set(arr)];
  }

  /**
   * 数组分组
   * @param {Array} arr - 输入数组
   * @param {string|function} key - 分组键或函数
   * @returns {Object} 分组后的对象
   */
  groupBy(arr, key) {
      if (!Array.isArray(arr)) return {};
      
      return arr.reduce((groups, item) => {
          const group = typeof key === 'function' ? key(item) : item[key];
          if (!groups[group]) groups[group] = [];
          groups[group].push(item);
          return groups;
      }, {});
  }

  /**
   * 数组排序
   * @param {Array} arr - 输入数组
   * @param {string} key - 排序键
   * @param {string} order - 排序顺序 'asc' | 'desc'
   * @returns {Array} 排序后的数组
   */
  sortArray(arr, key = null, order = 'asc') {
      if (!Array.isArray(arr)) return [];
      
      return [...arr].sort((a, b) => {
          let valueA = key ? a[key] : a;
          let valueB = key ? b[key] : b;
          
          // 处理字符串比较
          if (typeof valueA === 'string') valueA = valueA.toLowerCase();
          if (typeof valueB === 'string') valueB = valueB.toLowerCase();
          
          if (order === 'desc') {
              return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
          } else {
              return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
          }
      });
  }

  /**
   * 数组分页
   * @param {Array} arr - 输入数组
   * @param {number} page - 页码（从1开始）
   * @param {number} pageSize - 每页大小
   * @returns {Object} 分页结果
   */
  paginateArray(arr, page = 1, pageSize = 10) {
      if (!Array.isArray(arr)) return { data: [], total: 0, page: 1, pageSize, totalPages: 0 };
      
      const total = arr.length;
      const totalPages = Math.ceil(total / pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const data = arr.slice(startIndex, endIndex);
      
      return {
          data,
          total,
          page: Math.max(1, Math.min(page, totalPages)),
          pageSize,
          totalPages
      };
  }

  // ==================== 对象工具 ====================

  /**
   * 深拷贝对象
   * @param {*} obj - 要拷贝的对象
   * @returns {*} 拷贝后的对象
   */
  deepClone(obj) {
      if (obj === null || typeof obj !== 'object') return obj;
      if (obj instanceof Date) return new Date(obj.getTime());
      if (obj instanceof Array) return obj.map(item => this.deepClone(item));
      if (typeof obj === 'object') {
          const clonedObj = {};
          for (let key in obj) {
              if (obj.hasOwnProperty(key)) {
                  clonedObj[key] = this.deepClone(obj[key]);
              }
          }
          return clonedObj;
      }
  }

  /**
   * 合并对象
   * @param {Object} target - 目标对象
   * @param {...Object} sources - 源对象
   * @returns {Object} 合并后的对象
   */
  mergeObjects(target, ...sources) {
      if (!target) target = {};
      
      sources.forEach(source => {
          if (source && typeof source === 'object') {
              Object.keys(source).forEach(key => {
                  if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                      target[key] = this.mergeObjects(target[key] || {}, source[key]);
                  } else {
                      target[key] = source[key];
                  }
              });
          }
      });
      
      return target;
  }

  /**
   * 获取嵌套对象属性值
   * @param {Object} obj - 对象
   * @param {string} path - 属性路径，如 'user.profile.name'
   * @param {*} defaultValue - 默认值
   * @returns {*} 属性值
   */
  getNestedValue(obj, path, defaultValue = undefined) {
      if (!obj || !path) return defaultValue;
      
      const keys = path.split('.');
      let current = obj;
      
      for (let key of keys) {
          if (current === null || current === undefined || !(key in current)) {
              return defaultValue;
          }
          current = current[key];
      }
      
      return current;
  }

  /**
   * 设置嵌套对象属性值
   * @param {Object} obj - 对象
   * @param {string} path - 属性路径
   * @param {*} value - 要设置的值
   */
  setNestedValue(obj, path, value) {
      if (!obj || !path) return;
      
      const keys = path.split('.');
      let current = obj;
      
      for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i];
          if (!(key in current) || typeof current[key] !== 'object') {
              current[key] = {};
          }
          current = current[key];
      }
      
      current[keys[keys.length - 1]] = value;
  }

  // ==================== 验证工具 ====================

  /**
   * 验证邮箱格式
   * @param {string} email - 邮箱地址
   * @returns {boolean} 是否有效
   */
  isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
  }

  /**
   * 验证手机号格式（中国大陆）
   * @param {string} phone - 手机号
   * @returns {boolean} 是否有效
   */
  isValidPhone(phone) {
      const phoneRegex = /^1[3-9]\d{9}$/;
      return phoneRegex.test(phone);
  }

  /**
   * 验证身份证号格式（中国大陆）
   * @param {string} idCard - 身份证号
   * @returns {boolean} 是否有效
   */
  isValidIdCard(idCard) {
      const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      return idCardRegex.test(idCard);
  }

  /**
   * 验证URL格式
   * @param {string} url - URL地址
   * @returns {boolean} 是否有效
   */
  isValidUrl(url) {
      try {
          new URL(url);
          return true;
      } catch {
          return false;
      }
  }

  /**
   * 验证以太坊地址格式
   * @param {string} address - 以太坊地址
   * @returns {boolean} 是否有效
   */
  isValidEthAddress(address) {
      const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
      return ethAddressRegex.test(address);
  }

  // ==================== 存储工具 ====================

  /**
   * 本地存储操作
   */
  storage = {
      /**
       * 设置本地存储
       * @param {string} key - 键
       * @param {*} value - 值
       * @param {number} expiry - 过期时间（毫秒）
       */
      set: (key, value, expiry = null) => {
          try {
              const item = {
                  value: value,
                  timestamp: Date.now(),
                  expiry: expiry ? Date.now() + expiry : null
              };
              localStorage.setItem(key, JSON.stringify(item));
          } catch (error) {
              console.error('存储失败:', error);
          }
      },

      /**
       * 获取本地存储
       * @param {string} key - 键
       * @param {*} defaultValue - 默认值
       * @returns {*} 存储的值
       */
      get: (key, defaultValue = null) => {
          try {
              const item = localStorage.getItem(key);
              if (!item) return defaultValue;

              const parsed = JSON.parse(item);
              
              // 检查是否过期
              if (parsed.expiry && Date.now() > parsed.expiry) {
                  localStorage.removeItem(key);
                  return defaultValue;
              }

              return parsed.value;
          } catch (error) {
              console.error('读取存储失败:', error);
              return defaultValue;
          }
      },

      /**
       * 删除本地存储
       * @param {string} key - 键
       */
      remove: (key) => {
          try {
              localStorage.removeItem(key);
          } catch (error) {
              console.error('删除存储失败:', error);
          }
      },

      /**
       * 清空本地存储
       */
      clear: () => {
          try {
              localStorage.clear();
          } catch (error) {
              console.error('清空存储失败:', error);
          }
      }
  };

  // ==================== DOM 工具 ====================

  /**
   * 等待DOM元素出现
   * @param {string} selector - CSS选择器
   * @param {number} timeout - 超时时间（毫秒）
   * @returns {Promise<Element>} DOM元素
   */
  waitForElement(selector, timeout = 5000) {
      return new Promise((resolve, reject) => {
          const element = document.querySelector(selector);
          if (element) {
              resolve(element);
              return;
          }

          const observer = new MutationObserver(() => {
              const element = document.querySelector(selector);
              if (element) {
                  observer.disconnect();
                  resolve(element);
              }
          });

          observer.observe(document.body, {
              childList: true,
              subtree: true
          });

          setTimeout(() => {
              observer.disconnect();
              reject(new Error(`元素 ${selector} 在 ${timeout}ms 内未找到`));
          }, timeout);
      });
  }

  /**
   * 平滑滚动到元素
   * @param {string|Element} target - 目标元素或选择器
   * @param {Object} options - 滚动选项
   */
  scrollToElement(target, options = {}) {
      const element = typeof target === 'string' ? document.querySelector(target) : target;
      if (!element) return;

      const defaultOptions = {
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
      };

      element.scrollIntoView({ ...defaultOptions, ...options });
  }

  /**
   * 复制文本到剪贴板
   * @param {string} text - 要复制的文本
   * @returns {Promise<boolean>} 是否成功
   */
  async copyToClipboard(text) {
      try {
          if (navigator.clipboard && window.isSecureContext) {
              await navigator.clipboard.writeText(text);
              return true;
          } else {
              // 降级方案
              const textArea = document.createElement('textarea');
              textArea.value = text;
              textArea.style.position = 'fixed';
              textArea.style.left = '-999999px';
              textArea.style.top = '-999999px';
              document.body.appendChild(textArea);
              textArea.focus();
              textArea.select();
              const success = document.execCommand('copy');
              document.body.removeChild(textArea);
              return success;
          }
      } catch (error) {
          console.error('复制失败:', error);
          return false;
      }
  }

  // ==================== 性能工具 ====================

  /**
   * 防抖函数
   * @param {Function} func - 要防抖的函数
   * @param {number} wait - 等待时间
   * @param {boolean} immediate - 是否立即执行
   * @returns {Function} 防抖后的函数
   */
  debounce(func, wait = 300, immediate = false) {
      let timeout;
      return function executedFunction(...args) {
          const later = () => {
              timeout = null;
              if (!immediate) func.apply(this, args);
          };
          const callNow = immediate && !timeout;
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
          if (callNow) func.apply(this, args);
      };
  }

  /**
   * 节流函数
   * @param {Function} func - 要节流的函数
   * @param {number} limit - 时间限制
   * @returns {Function} 节流后的函数
   */
  throttle(func, limit = 300) {
      let inThrottle;
      return function executedFunction(...args) {
          if (!inThrottle) {
              func.apply(this, args);
              inThrottle = true;
              setTimeout(() => inThrottle = false, limit);
          }
      };
  }

  /**
   * 性能监控
   * @param {string} name - 监控名称
   * @param {Function} func - 要监控的函数
   * @returns {*} 函数执行结果
   */
  async performanceMonitor(name, func) {
      const start = performance.now();
      try {
          const result = await func();
          const end = performance.now();
          console.log(`[性能监控] ${name}: ${(end - start).toFixed(2)}ms`);
          return result;
      } catch (error) {
          const end = performance.now();
          console.error(`[性能监控] ${name} 执行失败: ${(end - start).toFixed(2)}ms`, error);
          throw error;
      }
  }

  // ==================== 主题工具 ====================

  /**
   * 初始化主题
   */
  initializeTheme() {
      const savedTheme = this.storage.get('theme', 'light');
      this.setTheme(savedTheme);
  }

  /**
   * 设置主题
   * @param {string} theme - 主题名称 'light' | 'dark'
   */
  setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      this.storage.set('theme', theme);
      
      // 更新主题切换按钮状态
      const themeToggle = document.querySelector('.theme-toggle');
      if (themeToggle) {
          themeToggle.classList.toggle('dark', theme === 'dark');
      }
  }

  /**
   * 切换主题
   */
  toggleTheme() {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      this.setTheme(newTheme);
  }

  // ==================== 错误处理 ====================

  /**
   * 设置全局错误处理
   */
  setupGlobalErrorHandler() {
      window.addEventListener('error', (event) => {
          console.error('全局错误:', event.error);
          this.logError('JavaScript Error', event.error);
      });

      window.addEventListener('unhandledrejection', (event) => {
          console.error('未处理的Promise拒绝:', event.reason);
          this.logError('Unhandled Promise Rejection', event.reason);
      });
  }

  /**
   * 记录错误
   * @param {string} type - 错误类型
   * @param {Error} error - 错误对象
   */
  logError(type, error) {
      const errorLog = {
          type: type,
          message: error.message || error,
          stack: error.stack,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
      };

      // 保存到本地存储（用于调试）
      const errors = this.storage.get('errorLogs', []);
      errors.push(errorLog);
      
      // 只保留最近100条错误日志
      if (errors.length > 100) {
          errors.splice(0, errors.length - 100);
      }
      
      this.storage.set('errorLogs', errors);
  }

  /**
   * 设置性能监控
   */
  setupPerformanceMonitor() {
      // 监控页面加载性能
      window.addEventListener('load', () => {
          setTimeout(() => {
              const perfData = performance.getEntriesByType('navigation')[0];
              if (perfData) {
                  console.log('页面加载性能:', {
                      DNS解析: perfData.domainLookupEnd - perfData.domainLookupStart,
                      TCP连接: perfData.connectEnd - perfData.connectStart,
                      请求响应: perfData.responseEnd - perfData.requestStart,
                      DOM解析: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                      总加载时间: perfData.loadEventEnd - perfData.navigationStart
                  });
              }
          }, 0);
      });
  }
}

// 创建全局工具实例
const utils = new Utils();

// 导出常用方法到全局
window.formatDate = utils.formatDate.bind(utils);
window.formatNumber = utils.formatNumber.bind(utils);
window.debounce = utils.debounce.bind(utils);
window.throttle = utils.throttle.bind(utils);
window.copyToClipboard = utils.copyToClipboard.bind(utils);

// 导出 Utils 类
export { Utils, utils };