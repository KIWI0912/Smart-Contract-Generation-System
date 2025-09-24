/**
 * 区块链智能合同一键生成系统 - 监控日志系统
 * 提供系统性能监控、实时日志管理、错误追踪和用户行为分析
 */

const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const EventEmitter = require('events');
const { Logger } = require('./utils.js');

class MonitoringSystem extends EventEmitter {
  constructor() {
      super();
      this.logger = new Logger();
      this.metrics = new Map();
      this.alerts = new Map();
      this.logBuffer = [];
      this.maxLogBuffer = 1000;
      this.monitoringInterval = null;
      this.logFilePath = path.join(__dirname, 'logs');
      this.isMonitoring = false;
      
      // 性能指标阈值
      this.thresholds = {
          cpu: 80,           // CPU使用率 %
          memory: 85,        // 内存使用率 %
          responseTime: 5000, // 响应时间 ms
          errorRate: 5,      // 错误率 %
          diskSpace: 90      // 磁盘使用率 %
      };

      this.initializeLogDirectory();
  }

  // 初始化日志目录
  async initializeLogDirectory() {
      try {
          await fs.mkdir(this.logFilePath, { recursive: true });
          this.logger.info('日志目录初始化完成');
      } catch (error) {
          this.logger.error('日志目录创建失败:', error);
      }
  }

  // 启动监控系统
  async startMonitoring(interval = 30000) { // 默认30秒
      if (this.isMonitoring) {
          this.logger.warn('监控系统已在运行中');
          return;
      }

      this.isMonitoring = true;
      this.logger.info('启动系统监控...');

      // 定期收集系统指标
      this.monitoringInterval = setInterval(() => {
          this.collectSystemMetrics();
      }, interval);

      // 定期清理日志缓冲区
      setInterval(() => {
          this.flushLogBuffer();
      }, 60000); // 每分钟清理一次

      // 定期检查磁盘空间
      setInterval(() => {
          this.checkDiskSpace();
      }, 300000); // 每5分钟检查一次

      this.emit('monitoring-started');
  }

  // 停止监控系统
  stopMonitoring() {
      if (!this.isMonitoring) {
          return;
      }

      this.isMonitoring = false;
      if (this.monitoringInterval) {
          clearInterval(this.monitoringInterval);
          this.monitoringInterval = null;
      }

      this.flushLogBuffer();
      this.logger.info('监控系统已停止');
      this.emit('monitoring-stopped');
  }

  // 收集系统指标
  async collectSystemMetrics() {
      try {
          const metrics = {
              timestamp: new Date().toISOString(),
              system: {
                  cpu: await this.getCPUUsage(),
                  memory: this.getMemoryUsage(),
                  uptime: os.uptime(),
                  loadAverage: os.loadavg()
              },
              application: {
                  activeConnections: this.getActiveConnections(),
                  requestCount: this.getRequestCount(),
                  errorCount: this.getErrorCount(),
                  responseTime: this.getAverageResponseTime()
              },
              blockchain: {
                  pendingTransactions: await this.getPendingTransactions(),
                  gasPrice: await this.getCurrentGasPrice(),
                  blockHeight: await this.getCurrentBlockHeight()
              }
          };

          this.metrics.set(Date.now(), metrics);
          this.checkThresholds(metrics);
          
          // 保留最近1000个指标记录
          if (this.metrics.size > 1000) {
              const oldestKey = Math.min(...this.metrics.keys());
              this.metrics.delete(oldestKey);
          }

          this.emit('metrics-collected', metrics);
      } catch (error) {
          this.logger.error('指标收集失败:', error);
      }
  }

  // 获取CPU使用率
  async getCPUUsage() {
      return new Promise((resolve) => {
          const startMeasure = this.cpuAverage();
          
          setTimeout(() => {
              const endMeasure = this.cpuAverage();
              const idleDifference = endMeasure.idle - startMeasure.idle;
              const totalDifference = endMeasure.total - startMeasure.total;
              const percentageCPU = 100 - ~~(100 * idleDifference / totalDifference);
              resolve(percentageCPU);
          }, 100);
      });
  }

  // CPU平均值计算辅助函数
  cpuAverage() {
      const cpus = os.cpus();
      let user = 0, nice = 0, sys = 0, idle = 0, irq = 0;
      
      for (const cpu of cpus) {
          user += cpu.times.user;
          nice += cpu.times.nice;
          sys += cpu.times.sys;
          idle += cpu.times.idle;
          irq += cpu.times.irq;
      }
      
      const total = user + nice + sys + idle + irq;
      return { idle, total };
  }

  // 获取内存使用率
  getMemoryUsage() {
      const totalMemory = os.totalmem();
      const freeMemory = os.freemem();
      const usedMemory = totalMemory - freeMemory;
      const memoryUsagePercent = (usedMemory / totalMemory) * 100;

      return {
          total: totalMemory,
          used: usedMemory,
          free: freeMemory,
          percentage: Math.round(memoryUsagePercent * 100) / 100
      };
  }

  // 检查磁盘空间
  async checkDiskSpace() {
      try {
          const stats = await fs.stat(this.logFilePath);
          // 这里简化处理，实际应用中需要使用更精确的磁盘空间检查
          const diskUsage = 75; // 模拟磁盘使用率
          
          if (diskUsage > this.thresholds.diskSpace) {
              this.createAlert('disk-space', `磁盘使用率过高: ${diskUsage}%`, 'high');
          }
      } catch (error) {
          this.logger.error('磁盘空间检查失败:', error);
      }
  }

  // 获取活跃连接数（模拟）
  getActiveConnections() {
      return Math.floor(Math.random() * 100) + 10;
  }

  // 获取请求计数（模拟）
  getRequestCount() {
      return Math.floor(Math.random() * 1000) + 100;
  }

  // 获取错误计数（模拟）
  getErrorCount() {
      return Math.floor(Math.random() * 10);
  }

  // 获取平均响应时间（模拟）
  getAverageResponseTime() {
      return Math.floor(Math.random() * 2000) + 100;
  }

  // 获取待处理交易数（模拟）
  async getPendingTransactions() {
      return Math.floor(Math.random() * 50);
  }

  // 获取当前Gas价格（模拟）
  async getCurrentGasPrice() {
      return Math.floor(Math.random() * 50) + 20; // 20-70 Gwei
  }

  // 获取当前区块高度（模拟）
  async getCurrentBlockHeight() {
      return 18500000 + Math.floor(Math.random() * 1000);
  }

  // 检查阈值并创建警报
  checkThresholds(metrics) {
      const checks = [
          {
              name: 'cpu-usage',
              value: metrics.system.cpu,
              threshold: this.thresholds.cpu,
              message: `CPU使用率过高: ${metrics.system.cpu}%`
          },
          {
              name: 'memory-usage',
              value: metrics.system.memory.percentage,
              threshold: this.thresholds.memory,
              message: `内存使用率过高: ${metrics.system.memory.percentage}%`
          },
          {
              name: 'response-time',
              value: metrics.application.responseTime,
              threshold: this.thresholds.responseTime,
              message: `响应时间过长: ${metrics.application.responseTime}ms`
          }
      ];

      for (const check of checks) {
          if (check.value > check.threshold) {
              this.createAlert(check.name, check.message, 'medium');
          }
      }
  }

  // 创建警报
  createAlert(type, message, severity = 'low') {
      const alert = {
          id: `${type}-${Date.now()}`,
          type,
          message,
          severity,
          timestamp: new Date().toISOString(),
          resolved: false
      };

      this.alerts.set(alert.id, alert);
      this.logger.warn(`[警报] ${severity.toUpperCase()}: ${message}`);
      this.emit('alert-created', alert);

      // 发送通知（如果是高严重性）
      if (severity === 'high') {
          this.sendNotification(alert);
      }

      return alert.id;
  }

  // 解决警报
  resolveAlert(alertId) {
      const alert = this.alerts.get(alertId);
      if (alert) {
          alert.resolved = true;
          alert.resolvedAt = new Date().toISOString();
          this.logger.info(`警报已解决: ${alert.message}`);
          this.emit('alert-resolved', alert);
      }
  }

  // 发送通知
  async sendNotification(alert) {
      try {
          // 这里可以集成邮件、短信、Slack等通知服务
          this.logger.info(`发送通知: ${alert.message}`);
          
          // 模拟发送邮件通知
          await this.sendEmailNotification(alert);
          
          // 模拟发送Webhook通知
          await this.sendWebhookNotification(alert);
      } catch (error) {
          this.logger.error('通知发送失败:', error);
      }
  }

  // 发送邮件通知（模拟）
  async sendEmailNotification(alert) {
      // 实际应用中这里会集成邮件服务
      this.logger.info(`[邮件通知] ${alert.message}`);
  }

  // 发送Webhook通知（模拟）
  async sendWebhookNotification(alert) {
      // 实际应用中这里会发送HTTP请求到Webhook URL
      this.logger.info(`[Webhook通知] ${alert.message}`);
  }

  // 记录用户行为
  logUserAction(userId, action, details = {}) {
      const logEntry = {
          timestamp: new Date().toISOString(),
          type: 'user-action',
          userId,
          action,
          details,
          sessionId: details.sessionId || null,
          ip: details.ip || null,
          userAgent: details.userAgent || null
      };

      this.addToLogBuffer(logEntry);
      this.emit('user-action-logged', logEntry);
  }

  // 记录系统事件
  logSystemEvent(event, details = {}) {
      const logEntry = {
          timestamp: new Date().toISOString(),
          type: 'system-event',
          event,
          details,
          level: details.level || 'info'
      };

      this.addToLogBuffer(logEntry);
      this.emit('system-event-logged', logEntry);
  }

  // 记录错误
  logError(error, context = {}) {
      const logEntry = {
          timestamp: new Date().toISOString(),
          type: 'error',
          message: error.message,
          stack: error.stack,
          context,
          level: 'error'
      };

      this.addToLogBuffer(logEntry);
      this.emit('error-logged', logEntry);

      // 严重错误创建警报
      if (context.severity === 'critical') {
          this.createAlert('critical-error', error.message, 'high');
      }
  }

  // 添加到日志缓冲区
  addToLogBuffer(logEntry) {
      this.logBuffer.push(logEntry);
      
      if (this.logBuffer.length >= this.maxLogBuffer) {
          this.flushLogBuffer();
      }
  }

  // 清空日志缓冲区
  async flushLogBuffer() {
      if (this.logBuffer.length === 0) {
          return;
      }

      try {
          const today = new Date().toISOString().split('T')[0];
          const logFileName = `app-${today}.log`;
          const logFilePath = path.join(this.logFilePath, logFileName);

          const logContent = this.logBuffer
              .map(entry => JSON.stringify(entry))
              .join('\n') + '\n';

          await fs.appendFile(logFilePath, logContent);
          
          this.logger.info(`已写入 ${this.logBuffer.length} 条日志到 ${logFileName}`);
          this.logBuffer = [];
      } catch (error) {
          this.logger.error('日志写入失败:', error);
      }
  }

  // 获取系统状态
  getSystemStatus() {
      const latestMetrics = Array.from(this.metrics.values()).pop();
      const activeAlerts = Array.from(this.alerts.values()).filter(alert => !alert.resolved);
      
      return {
          status: activeAlerts.length === 0 ? 'healthy' : 'warning',
          uptime: os.uptime(),
          metrics: latestMetrics,
          alerts: activeAlerts,
          monitoring: this.isMonitoring
      };
  }

  // 获取性能报告
  getPerformanceReport(timeRange = 3600000) { // 默认1小时
      const now = Date.now();
      const startTime = now - timeRange;
      
      const relevantMetrics = Array.from(this.metrics.entries())
          .filter(([timestamp]) => timestamp >= startTime)
          .map(([, metrics]) => metrics);

      if (relevantMetrics.length === 0) {
          return null;
      }

      const report = {
          timeRange: {
              start: new Date(startTime).toISOString(),
              end: new Date(now).toISOString(),
              duration: timeRange
          },
          summary: {
              avgCPU: this.calculateAverage(relevantMetrics, 'system.cpu'),
              avgMemory: this.calculateAverage(relevantMetrics, 'system.memory.percentage'),
              avgResponseTime: this.calculateAverage(relevantMetrics, 'application.responseTime'),
              totalRequests: this.calculateSum(relevantMetrics, 'application.requestCount'),
              totalErrors: this.calculateSum(relevantMetrics, 'application.errorCount')
          },
          trends: {
              cpuTrend: this.calculateTrend(relevantMetrics, 'system.cpu'),
              memoryTrend: this.calculateTrend(relevantMetrics, 'system.memory.percentage'),
              responseTimeTrend: this.calculateTrend(relevantMetrics, 'application.responseTime')
          }
      };

      return report;
  }

  // 计算平均值
  calculateAverage(metrics, path) {
      const values = metrics.map(m => this.getNestedValue(m, path)).filter(v => v !== undefined);
      return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  }

  // 计算总和
  calculateSum(metrics, path) {
      const values = metrics.map(m => this.getNestedValue(m, path)).filter(v => v !== undefined);
      return values.reduce((a, b) => a + b, 0);
  }

  // 计算趋势
  calculateTrend(metrics, path) {
      const values = metrics.map(m => this.getNestedValue(m, path)).filter(v => v !== undefined);
      if (values.length < 2) return 'stable';
      
      const first = values[0];
      const last = values[values.length - 1];
      const change = ((last - first) / first) * 100;
      
      if (change > 10) return 'increasing';
      if (change < -10) return 'decreasing';
      return 'stable';
  }

  // 获取嵌套对象值
  getNestedValue(obj, path) {
      return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // 清理旧日志文件
  async cleanupOldLogs(daysToKeep = 30) {
      try {
          const files = await fs.readdir(this.logFilePath);
          const cutoffDate = new Date();
          cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

          for (const file of files) {
              if (file.endsWith('.log')) {
                  const filePath = path.join(this.logFilePath, file);
                  const stats = await fs.stat(filePath);
                  
                  if (stats.mtime < cutoffDate) {
                      await fs.unlink(filePath);
                      this.logger.info(`删除旧日志文件: ${file}`);
                  }
              }
          }
      } catch (error) {
          this.logger.error('清理旧日志失败:', error);
      }
  }

  // 导出监控数据
  async exportMonitoringData(format = 'json') {
      const data = {
          metrics: Array.from(this.metrics.entries()),
          alerts: Array.from(this.alerts.entries()),
          systemStatus: this.getSystemStatus(),
          exportTime: new Date().toISOString()
      };

      const fileName = `monitoring-export-${Date.now()}.${format}`;
      const filePath = path.join(this.logFilePath, fileName);

      try {
          if (format === 'json') {
              await fs.writeFile(filePath, JSON.stringify(data, null, 2));
          } else if (format === 'csv') {
              // 简化的CSV导出
              const csvContent = this.convertToCSV(data.metrics);
              await fs.writeFile(filePath, csvContent);
          }

          this.logger.info(`监控数据已导出到: ${fileName}`);
          return filePath;
      } catch (error) {
          this.logger.error('监控数据导出失败:', error);
          throw error;
      }
  }

  // 转换为CSV格式
  convertToCSV(metrics) {
      const headers = ['timestamp', 'cpu', 'memory', 'responseTime', 'activeConnections'];
      const rows = metrics.map(([timestamp, data]) => [
          new Date(timestamp).toISOString(),
          data.system.cpu,
          data.system.memory.percentage,
          data.application.responseTime,
          data.application.activeConnections
      ]);

      return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
}

// 监控中间件
function createMonitoringMiddleware(monitor) {
  return (req, res, next) => {
      const startTime = Date.now();
      
      // 记录请求开始
      monitor.logUserAction(req.user?.id || 'anonymous', 'api-request', {
          method: req.method,
          url: req.url,
          ip: req.ip,
          userAgent: req.get('User-Agent')
      });

      // 监听响应结束
      res.on('finish', () => {
          const responseTime = Date.now() - startTime;
          const statusCode = res.statusCode;
          
          monitor.logSystemEvent('api-response', {
              method: req.method,
              url: req.url,
              statusCode,
              responseTime,
              level: statusCode >= 400 ? 'warn' : 'info'
          });

          // 记录错误响应
          if (statusCode >= 500) {
              monitor.logError(new Error(`HTTP ${statusCode} - ${req.method} ${req.url}`), {
                  responseTime,
                  statusCode,
                  severity: 'medium'
              });
          }
      });

      next();
  };
}

// 导出监控系统
module.exports = {
  MonitoringSystem,
  createMonitoringMiddleware
};
