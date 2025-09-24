// js/models.js - 区块链智能合同系统数据模型

// 🏗️ 基础模型类
class BaseModel {
  constructor(data = {}) {
      this.id = data.id || this.generateId();
      this.createdAt = data.createdAt || new Date().toISOString();
      this.updatedAt = data.updatedAt || new Date().toISOString();
      this.version = data.version || 1;
  }

  // 生成唯一ID
  generateId() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // 更新时间戳
  touch() {
      this.updatedAt = new Date().toISOString();
      this.version += 1;
  }

  // 转换为JSON
  toJSON() {
      return JSON.parse(JSON.stringify(this));
  }

  // 验证数据
  validate() {
      return { valid: true, errors: [] };
  }
}

// 📄 智能合同模型
class SmartContract extends BaseModel {
  constructor(data = {}) {
      super(data);
      
      // 基本信息
      this.title = data.title || '';
      this.type = data.type || 'general';
      this.description = data.description || '';
      this.status = data.status || 'draft';
      
      // 合同方信息
      this.parties = {
          party1: {
              name: data.parties?.party1?.name || '',
              address: data.parties?.party1?.address || '',
              contact: data.parties?.party1?.contact || '',
              signature: data.parties?.party1?.signature || null
          },
          party2: {
              name: data.parties?.party2?.name || '',
              address: data.parties?.party2?.address || '',
              contact: data.parties?.party2?.contact || '',
              signature: data.parties?.party2?.signature || null
          }
      };
      
      // 合同条款
      this.terms = {
          content: data.terms?.content || '',
          conditions: data.terms?.conditions || [],
          obligations: data.terms?.obligations || [],
          penalties: data.terms?.penalties || []
      };
      
      // 财务信息
      this.financial = {
          value: data.financial?.value || 0,
          currency: data.financial?.currency || 'CNY',
          paymentTerms: data.financial?.paymentTerms || '',
          paymentSchedule: data.financial?.paymentSchedule || []
      };
      
      // 时间信息
      this.timeline = {
          startDate: data.timeline?.startDate || null,
          endDate: data.timeline?.endDate || null,
          duration: data.timeline?.duration || 0,
          milestones: data.timeline?.milestones || []
      };
      
      // 区块链信息
      this.blockchain = {
          hash: data.blockchain?.hash || null,
          blockHash: data.blockchain?.blockHash || null,
          transactionId: data.blockchain?.transactionId || null,
          deployedAt: data.blockchain?.deployedAt || null,
          gasUsed: data.blockchain?.gasUsed || 0
      };
      
      // 合同代码
      this.code = {
          source: data.code?.source || '',
          compiled: data.code?.compiled || null,
          abi: data.code?.abi || null,
          bytecode: data.code?.bytecode || null
      };
      
      // 元数据
      this.metadata = {
          template: data.metadata?.template || null,
          tags: data.metadata?.tags || [],
          category: data.metadata?.category || '',
          priority: data.metadata?.priority || 'normal',
          attachments: data.metadata?.attachments || []
      };
  }

  // 验证合同数据
  validate() {
      const errors = [];
      
      // 验证基本信息
      if (!this.title || this.title.length < 5) {
          errors.push('合同标题至少需要5个字符');
      }
      
      if (!this.type) {
          errors.push('必须指定合同类型');
      }
      
      // 验证合同方
      if (!this.parties.party1.name) {
          errors.push('必须指定甲方名称');
      }
      
      if (!this.parties.party2.name) {
          errors.push('必须指定乙方名称');
      }
      
      // 验证财务信息
      if (this.financial.value < 0) {
          errors.push('合同金额不能为负数');
      }
      
      // 验证时间信息
      if (this.timeline.startDate && this.timeline.endDate) {
          const start = new Date(this.timeline.startDate);
          const end = new Date(this.timeline.endDate);
          if (start >= end) {
              errors.push('结束日期必须晚于开始日期');
          }
      }
      
      return {
          valid: errors.length === 0,
          errors
      };
  }

  // 计算合同哈希
  calculateHash() {
      const data = {
          title: this.title,
          parties: this.parties,
          terms: this.terms,
          financial: this.financial,
          timeline: this.timeline
      };
      
      return CryptoJS.SHA256(JSON.stringify(data)).toString();
  }

  // 签署合同
  sign(party, signature) {
      if (party === 'party1' || party === 'party2') {
          this.parties[party].signature = {
              data: signature,
              timestamp: new Date().toISOString(),
              hash: CryptoJS.SHA256(signature).toString()
          };
          this.touch();
      }
  }

  // 检查是否完全签署
  isFullySigned() {
      return this.parties.party1.signature && this.parties.party2.signature;
  }

  // 更新状态
  updateStatus(newStatus) {
      const validStatuses = ['draft', 'pending', 'active', 'completed', 'cancelled', 'expired'];
      if (validStatuses.includes(newStatus)) {
          this.status = newStatus;
          this.touch();
      }
  }
}

// 🧱 区块模型
class Block extends BaseModel {
  constructor(data = {}) {
      super(data);
      
      this.index = data.index || 0;
      this.timestamp = data.timestamp || new Date().toISOString();
      this.previousHash = data.previousHash || '0';
      this.hash = data.hash || '';
      this.nonce = data.nonce || 0;
      this.difficulty = data.difficulty || 4;
      
      // 交易数据
      this.transactions = (data.transactions || []).map(tx => 
          tx instanceof Transaction ? tx : new Transaction(tx)
      );
      
      // 区块元数据
      this.metadata = {
          size: data.metadata?.size || 0,
          transactionCount: data.metadata?.transactionCount || 0,
          merkleRoot: data.metadata?.merkleRoot || '',
          gasUsed: data.metadata?.gasUsed || 0,
          gasLimit: data.metadata?.gasLimit || 1000000
      };
      
      // 如果没有哈希，计算哈希
      if (!this.hash) {
          this.hash = this.calculateHash();
      }
  }

  // 计算区块哈希
  calculateHash() {
      const data = {
          index: this.index,
          timestamp: this.timestamp,
          previousHash: this.previousHash,
          transactions: this.transactions.map(tx => tx.toJSON()),
          nonce: this.nonce
      };
      
      return CryptoJS.SHA256(JSON.stringify(data)).toString();
  }

  // 挖矿
  mineBlock(difficulty = 4) {
      const target = Array(difficulty + 1).join('0');
      
      while (this.hash.substring(0, difficulty) !== target) {
          this.nonce++;
          this.hash = this.calculateHash();
      }
      
      this.difficulty = difficulty;
      console.log(`区块挖矿完成: ${this.hash}`);
  }

  // 添加交易
  addTransaction(transaction) {
      if (!(transaction instanceof Transaction)) {
          transaction = new Transaction(transaction);
      }
      
      // 验证交易
      const validation = transaction.validate();
      if (!validation.valid) {
          throw new Error('无效交易: ' + validation.errors.join(', '));
      }
      
      this.transactions.push(transaction);
      this.metadata.transactionCount = this.transactions.length;
      this.touch();
  }

  // 验证区块
  validate() {
      const errors = [];
      
      // 验证哈希
      if (this.hash !== this.calculateHash()) {
          errors.push('区块哈希无效');
      }
      
      // 验证交易
      for (const transaction of this.transactions) {
          const txValidation = transaction.validate();
          if (!txValidation.valid) {
              errors.push(`交易 ${transaction.id} 无效: ${txValidation.errors.join(', ')}`);
          }
      }
      
      return {
          valid: errors.length === 0,
          errors
      };
  }
}

// 💳 交易模型
class Transaction extends BaseModel {
  constructor(data = {}) {
      super(data);
      
      this.type = data.type || 'transfer';
      this.from = data.from || '';
      this.to = data.to || '';
      this.amount = data.amount || 0;
      this.fee = data.fee || 0;
      this.data = data.data || {};
      this.signature = data.signature || null;
      this.status = data.status || 'pending';
      
      // 交易元数据
      this.metadata = {
          gasPrice: data.metadata?.gasPrice || 0,
          gasLimit: data.metadata?.gasLimit || 21000,
          gasUsed: data.metadata?.gasUsed || 0,
          blockHash: data.metadata?.blockHash || null,
          blockIndex: data.metadata?.blockIndex || null,
          transactionIndex: data.metadata?.transactionIndex || null
      };
  }

  // 计算交易哈希
  calculateHash() {
      const data = {
          type: this.type,
          from: this.from,
          to: this.to,
          amount: this.amount,
          fee: this.fee,
          data: this.data,
          timestamp: this.createdAt
      };
      
      return CryptoJS.SHA256(JSON.stringify(data)).toString();
  }

  // 签署交易
  sign(privateKey) {
      const hash = this.calculateHash();
      this.signature = {
          hash,
          signature: CryptoJS.HmacSHA256(hash, privateKey).toString(),
          timestamp: new Date().toISOString()
      };
  }

  // 验证交易
  validate() {
      const errors = [];
      
      if (!this.from) {
          errors.push('发送方地址不能为空');
      }
      
      if (!this.to) {
          errors.push('接收方地址不能为空');
      }
      
      if (this.amount < 0) {
          errors.push('交易金额不能为负数');
      }
      
      if (this.fee < 0) {
          errors.push('交易费用不能为负数');
      }
      
      return {
          valid: errors.length === 0,
          errors
      };
  }
}

// 👤 用户模型
class User extends BaseModel {
  constructor(data = {}) {
      super(data);
      
      this.username = data.username || '';
      this.email = data.email || '';
      this.role = data.role || 'user';
      this.status = data.status || 'active';
      
      // 个人信息
      this.profile = {
          firstName: data.profile?.firstName || '',
          lastName: data.profile?.lastName || '',
          avatar: data.profile?.avatar || '',
          phone: data.profile?.phone || '',
          address: data.profile?.address || ''
      };
      
      // 区块链信息
      this.blockchain = {
          address: data.blockchain?.address || this.generateAddress(),
          publicKey: data.blockchain?.publicKey || null,
          privateKey: data.blockchain?.privateKey || null, // 实际应用中不应存储私钥
          balance: data.blockchain?.balance || 0
      };
      
      // 权限设置
      this.permissions = data.permissions || [];
      
      // 设置信息
      this.settings = {
          language: data.settings?.language || 'zh-CN',
          theme: data.settings?.theme || 'light',
          notifications: data.settings?.notifications || true,
          twoFactor: data.settings?.twoFactor || false
      };
  }

  // 生成区块链地址
  generateAddress() {
      return '0x' + CryptoJS.SHA256(this.id + Date.now()).toString().substring(0, 40);
  }

  // 验证用户数据
  validate() {
      const errors = [];
      
      if (!this.username || this.username.length < 3) {
          errors.push('用户名至少需要3个字符');
      }
      
      if (!this.email || !this.isValidEmail(this.email)) {
          errors.push('请提供有效的邮箱地址');
      }
      
      return {
          valid: errors.length === 0,
          errors
      };
  }

  // 验证邮箱格式
  isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
  }

  // 检查权限
  hasPermission(permission) {
      return this.permissions.includes(permission) || this.role === 'admin';
  }
}

// 📊 数据存储管理器
class DataStore {
  constructor(storageType = 'localStorage') {
      this.storageType = storageType;
      this.prefix = 'sc_';
      this.cache = new Map();
  }

  // 保存数据
  save(collection, id, data) {
      const key = `${this.prefix}${collection}_${id}`;
      const serialized = JSON.stringify({
          data,
          timestamp: new Date().toISOString(),
          version: 1
      });
      
      try {
          if (this.storageType === 'localStorage') {
              localStorage.setItem(key, serialized);
          } else if (this.storageType === 'memory') {
              this.cache.set(key, serialized);
          }
          return true;
      } catch (error) {
          console.error('保存数据失败:', error);
          return false;
      }
  }

  // 加载数据
  load(collection, id) {
      const key = `${this.prefix}${collection}_${id}`;
      
      try {
          let serialized;
          if (this.storageType === 'localStorage') {
              serialized = localStorage.getItem(key);
          } else if (this.storageType === 'memory') {
              serialized = this.cache.get(key);
          }
          
          if (serialized) {
              const parsed = JSON.parse(serialized);
              return parsed.data;
          }
          return null;
      } catch (error) {
          console.error('加载数据失败:', error);
          return null;
      }
  }

  // 删除数据
  delete(collection, id) {
      const key = `${this.prefix}${collection}_${id}`;
      
      try {
          if (this.storageType === 'localStorage') {
              localStorage.removeItem(key);
          } else if (this.storageType === 'memory') {
              this.cache.delete(key);
          }
          return true;
      } catch (error) {
          console.error('删除数据失败:', error);
          return false;
      }
  }

  // 查询数据
  query(collection, filter = {}) {
      const results = [];
      const pattern = `${this.prefix}${collection}_`;
      
      try {
          if (this.storageType === 'localStorage') {
              for (let i = 0; i < localStorage.length; i++) {
                  const key = localStorage.key(i);
                  if (key && key.startsWith(pattern)) {
                      const data = JSON.parse(localStorage.getItem(key)).data;
                      if (this.matchesFilter(data, filter)) {
                          results.push(data);
                      }
                  }
              }
          } else if (this.storageType === 'memory') {
              for (const [key, value] of this.cache.entries()) {
                  if (key.startsWith(pattern)) {
                      const data = JSON.parse(value).data;
                      if (this.matchesFilter(data, filter)) {
                          results.push(data);
                      }
                  }
              }
          }
      } catch (error) {
          console.error('查询数据失败:', error);
      }
      
      return results;
  }

  // 过滤匹配
  matchesFilter(data, filter) {
      for (const [key, value] of Object.entries(filter)) {
          if (data[key] !== value) {
              return false;
          }
      }
      return true;
  }

  // 清空集合
  clear(collection) {
      const pattern = `${this.prefix}${collection}_`;
      const keysToDelete = [];
      
      try {
          if (this.storageType === 'localStorage') {
              for (let i = 0; i < localStorage.length; i++) {
                  const key = localStorage.key(i);
                  if (key && key.startsWith(pattern)) {
                      keysToDelete.push(key);
                  }
              }
              keysToDelete.forEach(key => localStorage.removeItem(key));
          } else if (this.storageType === 'memory') {
              for (const key of this.cache.keys()) {
                  if (key.startsWith(pattern)) {
                      keysToDelete.push(key);
                  }
              }
              keysToDelete.forEach(key => this.cache.delete(key));
          }
          return true;
      } catch (error) {
          console.error('清空数据失败:', error);
          return false;
      }
  }
}

// 📈 数据统计工具
class DataAnalytics {
  constructor(dataStore) {
      this.dataStore = dataStore;
  }

  // 获取合同统计
  getContractStats() {
      const contracts = this.dataStore.query('contracts');
      
      return {
          total: contracts.length,
          byStatus: this.groupBy(contracts, 'status'),
          byType: this.groupBy(contracts, 'type'),
          totalValue: contracts.reduce((sum, c) => sum + (c.financial?.value || 0), 0),
          avgValue: contracts.length > 0 ? 
              contracts.reduce((sum, c) => sum + (c.financial?.value || 0), 0) / contracts.length : 0,
          recentCount: contracts.filter(c => 
              new Date(c.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          ).length
      };
  }

  // 获取区块链统计
  getBlockchainStats() {
      const blocks = this.dataStore.query('blocks');
      const transactions = this.dataStore.query('transactions');
      
      return {
          blockCount: blocks.length,
          transactionCount: transactions.length,
          avgBlockSize: blocks.length > 0 ? 
              blocks.reduce((sum, b) => sum + (b.metadata?.size || 0), 0) / blocks.length : 0,
          totalGasUsed: blocks.reduce((sum, b) => sum + (b.metadata?.gasUsed || 0), 0),
          latestBlock: blocks.sort((a, b) => b.index - a.index)[0] || null
      };
  }

  // 分组统计
  groupBy(array, key) {
      return array.reduce((groups, item) => {
          const value = this.getNestedValue(item, key);
          groups[value] = (groups[value] || 0) + 1;
          return groups;
      }, {});
  }

  // 获取嵌套属性值
  getNestedValue(obj, path) {
      return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // 时间序列分析
  getTimeSeriesData(collection, dateField = 'createdAt', interval = 'day') {
      const data = this.dataStore.query(collection);
      const grouped = {};
      
      data.forEach(item => {
          const date = new Date(item[dateField]);
          let key;
          
          switch (interval) {
              case 'hour':
                  key = date.toISOString().substring(0, 13);
                  break;
              case 'day':
                  key = date.toISOString().substring(0, 10);
                  break;
              case 'month':
                  key = date.toISOString().substring(0, 7);
                  break;
              default:
                  key = date.toISOString().substring(0, 10);
          }
          
          grouped[key] = (grouped[key] || 0) + 1;
      });
      
      return grouped;
  }
}

// 导出所有模型和工具
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
      BaseModel,
      SmartContract,
      Block,
      Transaction,
      User,
      DataStore,
      DataAnalytics
  };
} else {
  // 浏览器环境
  window.Models = {
      BaseModel,
      SmartContract,
      Block,
      Transaction,
      User,
      DataStore,
      DataAnalytics
  };
}

// 初始化全局数据存储
const globalDataStore = new DataStore('localStorage');
const globalAnalytics = new DataAnalytics(globalDataStore);

if (typeof window !== 'undefined') {
  window.dataStore = globalDataStore;
  window.analytics = globalAnalytics;
}

console.log('📊 数据模型已加载');