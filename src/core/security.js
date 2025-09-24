/**
 * 区块链智能合同一键生成系统 - 安全验证模块
 * 提供全面的安全防护、身份验证、权限控制和威胁检测
 */

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { Logger } = require('./utils.js');

class SecurityManager {
  constructor() {
      this.logger = new Logger();
      this.blacklistedTokens = new Set();
      this.suspiciousActivities = new Map();
      this.maxLoginAttempts = 5;
      this.lockoutDuration = 15 * 60 * 1000; // 15分钟
  }

  // JWT令牌管理
  generateToken(user, expiresIn = '24h') {
      try {
          const payload = {
              userId: user.id,
              address: user.address,
              role: user.role,
              permissions: user.permissions,
              iat: Math.floor(Date.now() / 1000)
          };

          const token = jwt.sign(payload, process.env.JWT_SECRET, {
              expiresIn,
              issuer: 'smart-contract-system',
              audience: 'contract-users'
          });

          this.logger.info(`为用户 ${user.address} 生成访问令牌`);
          return token;
      } catch (error) {
          this.logger.error('令牌生成失败:', error);
          throw new Error('令牌生成失败');
      }
  }

  // 验证JWT令牌
  verifyToken(token) {
      try {
          if (this.blacklistedTokens.has(token)) {
              throw new Error('令牌已被撤销');
          }

          const decoded = jwt.verify(token, process.env.JWT_SECRET, {
              issuer: 'smart-contract-system',
              audience: 'contract-users'
          });

          return decoded;
      } catch (error) {
          this.logger.warn('令牌验证失败:', error.message);
          throw new Error('无效的访问令牌');
      }
  }

  // 撤销令牌
  revokeToken(token) {
      this.blacklistedTokens.add(token);
      this.logger.info('令牌已被撤销');
  }

  // 数字签名验证
  verifyDigitalSignature(message, signature, publicKey) {
      try {
          const verifier = crypto.createVerify('SHA256');
          verifier.update(message);
          verifier.end();

          const isValid = verifier.verify(publicKey, signature, 'hex');
          
          if (!isValid) {
              this.logger.warn('数字签名验证失败');
              throw new Error('数字签名无效');
          }

          this.logger.info('数字签名验证成功');
          return true;
      } catch (error) {
          this.logger.error('签名验证错误:', error);
          return false;
      }
  }

  // 创建数字签名
  createDigitalSignature(message, privateKey) {
      try {
          const signer = crypto.createSign('SHA256');
          signer.update(message);
          signer.end();

          const signature = signer.sign(privateKey, 'hex');
          this.logger.info('数字签名创建成功');
          return signature;
      } catch (error) {
          this.logger.error('签名创建失败:', error);
          throw new Error('数字签名创建失败');
      }
  }

  // 权限验证中间件
  requirePermission(requiredPermission) {
      return (req, res, next) => {
          try {
              const token = req.headers.authorization?.replace('Bearer ', '');
              if (!token) {
                  return res.status(401).json({ error: '缺少访问令牌' });
              }

              const decoded = this.verifyToken(token);
              
              if (!decoded.permissions.includes(requiredPermission)) {
                  this.logger.warn(`用户 ${decoded.address} 权限不足: ${requiredPermission}`);
                  return res.status(403).json({ error: '权限不足' });
              }

              req.user = decoded;
              next();
          } catch (error) {
              return res.status(401).json({ error: error.message });
          }
      };
  }

  // 角色验证中间件
  requireRole(requiredRole) {
      return (req, res, next) => {
          try {
              const token = req.headers.authorization?.replace('Bearer ', '');
              const decoded = this.verifyToken(token);
              
              if (decoded.role !== requiredRole) {
                  this.logger.warn(`用户 ${decoded.address} 角色不匹配: 需要 ${requiredRole}`);
                  return res.status(403).json({ error: '角色权限不足' });
              }

              req.user = decoded;
              next();
          } catch (error) {
              return res.status(401).json({ error: error.message });
          }
      };
  }

  // 输入验证和清理
  sanitizeInput(input, type = 'string') {
      if (input === null || input === undefined) {
          return null;
      }

      switch (type) {
          case 'string':
              return String(input)
                  .trim()
                  .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                  .replace(/[<>]/g, '');
          
          case 'address':
              const address = String(input).trim().toLowerCase();
              if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
                  throw new Error('无效的以太坊地址格式');
              }
              return address;
          
          case 'number':
              const num = Number(input);
              if (isNaN(num)) {
                  throw new Error('无效的数字格式');
              }
              return num;
          
          case 'email':
              const email = String(input).trim().toLowerCase();
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                  throw new Error('无效的邮箱格式');
              }
              return email;
          
          default:
              return input;
      }
  }

  // SQL注入防护
  preventSQLInjection(query) {
      const dangerousPatterns = [
          /(\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE)?|INSERT|MERGE|SELECT|UPDATE|UNION|USE)\b)/gi,
          /(;|--|\/\*|\*\/|xp_|sp_)/gi,
          /('|('')|"|(\")|(;)|(--)|(\|))/gi
      ];

      for (const pattern of dangerousPatterns) {
          if (pattern.test(query)) {
              this.logger.error('检测到SQL注入攻击尝试:', query);
              throw new Error('检测到危险的数据库查询');
          }
      }

      return query;
  }

  // XSS防护
  preventXSS(input) {
      if (typeof input !== 'string') {
          return input;
      }

      return input
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;')
          .replace(/\//g, '&#x2F;');
  }

  // 暴力破解防护
  checkBruteForce(identifier) {
      const attempts = this.suspiciousActivities.get(identifier) || { count: 0, lastAttempt: 0 };
      const now = Date.now();

      // 如果在锁定期内
      if (attempts.count >= this.maxLoginAttempts && 
          (now - attempts.lastAttempt) < this.lockoutDuration) {
          const remainingTime = this.lockoutDuration - (now - attempts.lastAttempt);
          throw new Error(`账户已锁定，请在 ${Math.ceil(remainingTime / 60000)} 分钟后重试`);
      }

      // 重置计数器（如果锁定期已过）
      if ((now - attempts.lastAttempt) > this.lockoutDuration) {
          attempts.count = 0;
      }

      return attempts;
  }

  // 记录失败尝试
  recordFailedAttempt(identifier) {
      const attempts = this.checkBruteForce(identifier);
      attempts.count++;
      attempts.lastAttempt = Date.now();
      this.suspiciousActivities.set(identifier, attempts);

      this.logger.warn(`用户 ${identifier} 登录失败，尝试次数: ${attempts.count}`);
  }

  // 重置失败尝试
  resetFailedAttempts(identifier) {
      this.suspiciousActivities.delete(identifier);
      this.logger.info(`重置用户 ${identifier} 的失败尝试记录`);
  }

  // 合同内容安全检查
  validateContractContent(content) {
      const securityChecks = [
          {
              name: '恶意代码检测',
              pattern: /(eval|exec|system|shell_exec|passthru)/gi,
              message: '检测到潜在的恶意代码'
          },
          {
              name: '敏感信息检测',
              pattern: /(password|private.*key|secret|token)/gi,
              message: '合同中不应包含敏感信息'
          },
          {
              name: '外部链接检测',
              pattern: /(http:\/\/|https:\/\/|ftp:\/\/)/gi,
              message: '合同中包含外部链接，请谨慎处理'
          }
      ];

      const warnings = [];
      const errors = [];

      for (const check of securityChecks) {
          if (check.pattern.test(content)) {
              if (check.name.includes('恶意代码')) {
                  errors.push(check.message);
              } else {
                  warnings.push(check.message);
              }
          }
      }

      if (errors.length > 0) {
          this.logger.error('合同安全检查失败:', errors);
          throw new Error(`合同安全检查失败: ${errors.join(', ')}`);
      }

      if (warnings.length > 0) {
          this.logger.warn('合同安全警告:', warnings);
      }

      return { warnings, errors };
  }

  // 区块链交易安全验证
  validateTransaction(transaction) {
      const checks = [
          {
              name: '交易金额验证',
              check: () => {
                  if (transaction.amount <= 0) {
                      throw new Error('交易金额必须大于0');
                  }
                  if (transaction.amount > 1000000) { // 100万上限
                      throw new Error('交易金额超出安全限制');
                  }
              }
          },
          {
              name: '地址格式验证',
              check: () => {
                  if (!this.isValidAddress(transaction.from)) {
                      throw new Error('发送方地址格式无效');
                  }
                  if (!this.isValidAddress(transaction.to)) {
                      throw new Error('接收方地址格式无效');
                  }
              }
          },
          {
              name: '自转账检测',
              check: () => {
                  if (transaction.from.toLowerCase() === transaction.to.toLowerCase()) {
                      throw new Error('不允许自转账交易');
                  }
              }
          },
          {
              name: 'Gas费用验证',
              check: () => {
                  if (transaction.gasPrice && transaction.gasPrice > 100000000000) { // 100 Gwei
                      throw new Error('Gas价格过高，可能存在风险');
                  }
              }
          }
      ];

      for (const check of checks) {
          try {
              check.check();
          } catch (error) {
              this.logger.error(`交易验证失败 - ${check.name}:`, error.message);
              throw error;
          }
      }

      this.logger.info('交易安全验证通过');
      return true;
  }

  // 地址验证
  isValidAddress(address) {
      return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  // 生成安全的随机数
  generateSecureRandom(length = 32) {
      return crypto.randomBytes(length).toString('hex');
  }

  // 密码哈希
  hashPassword(password, salt = null) {
      if (!salt) {
          salt = crypto.randomBytes(16).toString('hex');
      }
      
      const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512');
      return {
          hash: hash.toString('hex'),
          salt: salt
      };
  }

  // 密码验证
  verifyPassword(password, hash, salt) {
      const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512');
      return hash === verifyHash.toString('hex');
  }

  // 安全配置中间件
  getSecurityMiddleware() {
      return [
          // Helmet安全头
          helmet({
              contentSecurityPolicy: {
                  directives: {
                      defaultSrc: ["'self'"],
                      styleSrc: ["'self'", "'unsafe-inline'"],
                      scriptSrc: ["'self'"],
                      imgSrc: ["'self'", "data:", "https:"],
                  },
              },
              hsts: {
                  maxAge: 31536000,
                  includeSubDomains: true,
                  preload: true
              }
          }),

          // 速率限制
          rateLimit({
              windowMs: 15 * 60 * 1000, // 15分钟
              max: 100, // 限制每个IP 100个请求
              message: {
                  error: '请求过于频繁，请稍后再试'
              },
              standardHeaders: true,
              legacyHeaders: false,
          }),

          // API速率限制（更严格）
          rateLimit({
              windowMs: 60 * 1000, // 1分钟
              max: 20, // 限制每个IP 20个API请求
              skip: (req) => !req.path.startsWith('/api/'),
              message: {
                  error: 'API请求过于频繁，请稍后再试'
              }
          })
      ];
  }

  // 安全审计日志
  auditLog(action, user, details = {}) {
      const auditEntry = {
          timestamp: new Date().toISOString(),
          action,
          user: user.address || 'anonymous',
          userId: user.id || null,
          details,
          ip: details.ip || 'unknown',
          userAgent: details.userAgent || 'unknown'
      };

      this.logger.info('安全审计:', auditEntry);
      
      // 在实际应用中，这里应该写入专门的审计日志文件或数据库
      return auditEntry;
  }

  // 威胁检测
  detectThreats(request) {
      const threats = [];

      // 检测异常请求频率
      const userAgent = request.headers['user-agent'] || '';
      if (!userAgent || userAgent.length < 10) {
          threats.push('可疑的User-Agent');
      }

      // 检测异常请求大小
      const contentLength = parseInt(request.headers['content-length'] || '0');
      if (contentLength > 10 * 1024 * 1024) { // 10MB
          threats.push('请求体过大');
      }

      // 检测可疑的请求头
      const suspiciousHeaders = ['x-forwarded-for', 'x-real-ip'];
      for (const header of suspiciousHeaders) {
          if (request.headers[header]) {
              const value = request.headers[header];
              if (value.includes('..') || value.includes('<') || value.includes('>')) {
                  threats.push(`可疑的${header}头`);
              }
          }
      }

      if (threats.length > 0) {
          this.logger.warn('检测到威胁:', threats);
      }

      return threats;
  }
}

// 导出安全管理器
module.exports = {
  SecurityManager
};