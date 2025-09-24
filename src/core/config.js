// js/config.js - 区块链智能合同系统配置文件

const CONFIG = {
  // 🌐 区块链网络配置
  blockchain: {
      // 网络参数
      network: {
          name: 'SmartContract Network',
          version: '1.0.0',
          chainId: 'sc-chain-001',
          networkId: 1001
      },
      
      // 区块配置
      block: {
          maxSize: 1024 * 1024, // 1MB
          maxTransactions: 1000,
          targetBlockTime: 10000, // 10秒
          difficulty: 4, // 挖矿难度
          reward: 10 // 区块奖励
      },
      
      // 挖矿配置
      mining: {
          enabled: true,
          maxNonce: 1000000,
          hashAlgorithm: 'SHA-256'
      },
      
      // 节点配置
      nodes: [
          'http://localhost:3001',
          'http://localhost:3002',
          'http://localhost:3003'
      ]
  },

  // ⚙️ 系统设置
  system: {
      // 应用信息
      app: {
          name: '区块链智能合同生成系统',
          version: '1.0.0',
          author: 'Smart Contract Team',
          description: '基于区块链的智能合同生成、验证和部署平台'
      },
      
      // 性能配置
      performance: {
          maxConcurrentRequests: 10,
          requestTimeout: 30000, // 30秒
          cacheExpiry: 300000, // 5分钟
          maxMemoryUsage: 512 * 1024 * 1024 // 512MB
      },
      
      // 日志配置
      logging: {
          level: 'info', // debug, info, warn, error
          maxLogSize: 10 * 1024 * 1024, // 10MB
          logRotation: true,
          console: true,
          file: true
      },
      
      // 存储配置
      storage: {
          type: 'localStorage', // localStorage, indexedDB, memory
          prefix: 'sc_system_',
          encryption: true,
          compression: false
      }
  },

  // 🎨 界面配置
  ui: {
      // 主题设置
      theme: {
          default: 'light',
          available: ['light', 'dark', 'auto'],
          colors: {
              primary: '#3b82f6',
              secondary: '#64748b',
              success: '#10b981',
              warning: '#f59e0b',
              error: '#ef4444',
              info: '#06b6d4'
          }
      },
      
      // 布局配置
      layout: {
          sidebarWidth: 250,
          headerHeight: 60,
          footerHeight: 40,
          contentPadding: 20,
          borderRadius: 8
      },
      
      // 动画设置
      animation: {
          enabled: true,
          duration: 300,
          easing: 'ease-in-out',
          fadeIn: 200,
          slideIn: 250
      },
      
      // 分页配置
      pagination: {
          defaultPageSize: 10,
          pageSizeOptions: [5, 10, 20, 50, 100],
          showSizeChanger: true,
          showQuickJumper: true
      }
  },

  // 🔐 安全参数
  security: {
      // 加密配置
      encryption: {
          algorithm: 'AES-256-GCM',
          keyLength: 256,
          ivLength: 12,
          tagLength: 16,
          iterations: 100000
      },
      
      // 哈希配置
      hashing: {
          algorithm: 'SHA-256',
          salt: 'smartcontract_salt_2024',
          rounds: 10000
      },
      
      // 签名配置
      signature: {
          algorithm: 'ECDSA',
          curve: 'secp256k1',
          hashFunction: 'SHA-256'
      },
      
      // 访问控制
      access: {
          maxLoginAttempts: 5,
          lockoutDuration: 900000, // 15分钟
          sessionTimeout: 3600000, // 1小时
          requireAuth: false // 开发阶段设为false
      }
  },

  // 📊 业务规则
  business: {
      // 合同类型配置
      contractTypes: {
          'purchase': {
              name: '采购合同',
              icon: '🛒',
              template: 'purchase_template',
              requiredFields: ['buyer', 'seller', 'product', 'price', 'delivery'],
              maxValue: 1000000,
              minDuration: 1,
              maxDuration: 365
          },
          'service': {
              name: '服务合同',
              icon: '🔧',
              template: 'service_template',
              requiredFields: ['provider', 'client', 'service', 'fee', 'duration'],
              maxValue: 500000,
              minDuration: 7,
              maxDuration: 730
          },
          'rental': {
              name: '租赁合同',
              icon: '🏠',
              template: 'rental_template',
              requiredFields: ['landlord', 'tenant', 'property', 'rent', 'period'],
              maxValue: 100000,
              minDuration: 30,
              maxDuration: 3650
          },
          'employment': {
              name: '雇佣合同',
              icon: '👔',
              template: 'employment_template',
              requiredFields: ['employer', 'employee', 'position', 'salary', 'startDate'],
              maxValue: 2000000,
              minDuration: 30,
              maxDuration: 1825
          },
          'partnership': {
              name: '合作协议',
              icon: '🤝',
              template: 'partnership_template',
              requiredFields: ['party1', 'party2', 'scope', 'terms', 'duration'],
              maxValue: 5000000,
              minDuration: 90,
              maxDuration: 1825
          }
      },
      
      // 合同状态
      contractStatus: {
          'draft': { name: '草稿', color: '#64748b', icon: '📝' },
          'pending': { name: '待审核', color: '#f59e0b', icon: '⏳' },
          'active': { name: '生效中', color: '#10b981', icon: '✅' },
          'completed': { name: '已完成', color: '#06b6d4', icon: '🎉' },
          'cancelled': { name: '已取消', color: '#ef4444', icon: '❌' },
          'expired': { name: '已过期', color: '#64748b', icon: '⏰' }
      },
      
      // 验证规则
      validation: {
          contractTitle: {
              minLength: 5,
              maxLength: 100,
              pattern: /^[a-zA-Z0-9\u4e00-\u9fa5\s\-_]+$/
          },
          partyName: {
              minLength: 2,
              maxLength: 50,
              pattern: /^[a-zA-Z\u4e00-\u9fa5\s]+$/
          },
          contractValue: {
              min: 0,
              max: 10000000,
              precision: 2
          },
          duration: {
              min: 1,
              max: 3650 // 10年
          }
      }
  },

  // 📡 API配置
  api: {
      // 基础配置
      base: {
          url: 'http://localhost:3000/api',
          version: 'v1',
          timeout: 30000,
          retries: 3,
          retryDelay: 1000
      },
      
      // 端点配置
      endpoints: {
          contracts: '/contracts',
          blockchain: '/blockchain',
          verification: '/verify',
          deployment: '/deploy',
          templates: '/templates',
          users: '/users'
      },
      
      // 请求头
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-API-Version': 'v1'
      }
  },

  // 🔧 开发配置
  development: {
      // 调试模式
      debug: true,
      verbose: true,
      mockData: true,
      
      // 测试配置
      testing: {
          enabled: true,
          autoRun: false,
          coverage: true
      },
      
      // 热重载
      hotReload: {
          enabled: true,
          port: 3001,
          watchFiles: ['*.js', '*.css', '*.html']
      }
  },

  // 🌍 国际化配置
  i18n: {
      // 默认语言
      defaultLanguage: 'zh-CN',
      
      // 支持的语言
      supportedLanguages: [
          { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
          { code: 'zh-TW', name: '繁體中文', flag: '🇹🇼' },
          { code: 'en-US', name: 'English', flag: '🇺🇸' },
          { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
          { code: 'ko-KR', name: '한국어', flag: '🇰🇷' }
      ],
      
      // 翻译配置
      translation: {
          loadPath: '/locales/{{lng}}/{{ns}}.json',
          savePath: '/locales/{{lng}}/{{ns}}.json',
          fallbackLanguage: 'en-US',
          namespace: 'common'
      }
  },

  // 📊 监控配置
  monitoring: {
      // 性能监控
      performance: {
          enabled: true,
          sampleRate: 0.1,
          maxEntries: 1000
      },
      
      // 错误追踪
      errorTracking: {
          enabled: true,
          maxErrors: 100,
          reportToServer: false
      },
      
      // 用户行为分析
      analytics: {
          enabled: false,
          trackClicks: true,
          trackPageViews: true,
          trackErrors: true
      }
  }
};

// 🔧 配置工具函数
const ConfigUtils = {
  // 获取配置值
  get(path, defaultValue = null) {
      const keys = path.split('.');
      let value = CONFIG;
      
      for (const key of keys) {
          if (value && typeof value === 'object' && key in value) {
              value = value[key];
          } else {
              return defaultValue;
          }
      }
      
      return value;
  },
  
  // 设置配置值
  set(path, value) {
      const keys = path.split('.');
      const lastKey = keys.pop();
      let target = CONFIG;
      
      for (const key of keys) {
          if (!(key in target) || typeof target[key] !== 'object') {
              target[key] = {};
          }
          target = target[key];
      }
      
      target[lastKey] = value;
  },
  
  // 合并配置
  merge(newConfig) {
      return this.deepMerge(CONFIG, newConfig);
  },
  
  // 深度合并对象
  deepMerge(target, source) {
      const result = { ...target };
      
      for (const key in source) {
          if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
              result[key] = this.deepMerge(target[key] || {}, source[key]);
          } else {
              result[key] = source[key];
          }
      }
      
      return result;
  },
  
  // 验证配置
  validate() {
      const errors = [];
      
      // 验证必需的配置项
      const required = [
          'blockchain.network.name',
          'system.app.name',
          'security.encryption.algorithm'
      ];
      
      for (const path of required) {
          if (!this.get(path)) {
              errors.push(`Missing required config: ${path}`);
          }
      }
      
      return errors;
  },
  
  // 获取环境配置
  getEnvironmentConfig() {
      const env = process.env.NODE_ENV || 'development';
      return this.get(`environments.${env}`, {});
  },
  
  // 导出配置为JSON
  toJSON() {
      return JSON.stringify(CONFIG, null, 2);
  },
  
  // 从JSON加载配置
  fromJSON(jsonString) {
      try {
          const newConfig = JSON.parse(jsonString);
          return this.merge(newConfig);
      } catch (error) {
          console.error('Invalid JSON configuration:', error);
          return CONFIG;
      }
  }
};

// 🚀 初始化配置
function initializeConfig() {
  // 验证配置
  const errors = ConfigUtils.validate();
  if (errors.length > 0) {
      console.warn('Configuration validation errors:', errors);
  }
  
  // 设置全局配置
  if (typeof window !== 'undefined') {
      window.CONFIG = CONFIG;
      window.ConfigUtils = ConfigUtils;
  }
  
  console.log('📋 Configuration initialized:', CONFIG.system.app.name);
  return CONFIG;
}

// 导出配置和工具
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CONFIG, ConfigUtils, initializeConfig };
} else {
  // 浏览器环境下自动初始化
  initializeConfig();
}