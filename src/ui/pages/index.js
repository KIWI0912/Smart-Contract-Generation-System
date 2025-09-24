// js/app.js - 区块链智能合同生成系统主应用

import { BlockchainManager } from './blockchain.js'; // 确保路径正确
import { ContractGenerator } from './contract.js';
import { Utils } from './hash-utils.js';

class SmartContractApp {
  constructor() {
      this.blockchain = new BlockchainManager();
      this.contractManager = new ContractGenerator();
      this.utils = new Utils();
      this.currentView = 'dashboard';
      this.contracts = [];
      this.init();
  }

  // 初始化应用
  init() {
      this.bindEvents();
      this.loadDashboard();
      this.updateUI();
      console.log('🚀 区块链智能合同系统已启动');
  }

  // 绑定所有事件
  bindEvents() {
      // 导航菜单事件
      document.querySelectorAll('.nav-item').forEach(item => {
          item.addEventListener('click', (e) => {
              e.preventDefault();
              const view = item.getAttribute('data-view');
              this.switchView(view);
          });
      });

      // 生成合同按钮
      const generateBtn = document.getElementById('generateContract');
      if (generateBtn) {
          generateBtn.addEventListener('click', () => this.handleGenerateContract());
      }

      // 验证合同按钮
      const verifyBtn = document.getElementById('verifyContract');
      if (verifyBtn) {
          verifyBtn.addEventListener('click', () => this.handleVerifyContract());
      }

      // 部署合同按钮
      const deployBtn = document.getElementById('deployContract');
      if (deployBtn) {
          deployBtn.addEventListener('click', () => this.handleDeployContract());
      }

      // 表单提交事件
      const contractForm = document.getElementById('contractForm');
      if (contractForm) {
          contractForm.addEventListener('submit', (e) => {
              e.preventDefault();
              this.processContractForm();
          });
      }

      // 搜索功能
      const searchInput = document.getElementById('searchInput');
      if (searchInput) {
          searchInput.addEventListener('input', (e) => {
              this.searchContracts(e.target.value);
          });
      }
  }

  // 切换视图
  switchView(viewName) {
      // 隐藏所有视图
      document.querySelectorAll('.view').forEach(view => {
          view.classList.add('hidden');
      });

      // 显示目标视图
      const targetView = document.getElementById(viewName);
      if (targetView) {
          targetView.classList.remove('hidden');
          this.currentView = viewName;
      }

      // 更新导航状态
      document.querySelectorAll('.nav-item').forEach(item => {
          item.classList.remove('active');
      });
      document.querySelector(`[data-view="${viewName}"]`).classList.add('active');

      // 根据视图加载相应数据
      this.loadViewData(viewName);
  }

  // 加载视图数据
  loadViewData(viewName) {
      switch (viewName) {
          case 'dashboard':
              this.loadDashboard();
              break;
          case 'generate':
              this.loadGenerateView();
              break;
          case 'history':
              this.loadHistoryView();
              break;
          case 'verify':
              this.loadVerifyView();
              break;
          case 'deploy':
              this.loadDeployView();
              break;
      }
  }

  // 加载仪表板
  loadDashboard() {
      const stats = this.getDashboardStats();
      
      // 更新统计卡片
      this.updateStatCard('totalContracts', stats.totalContracts);
      this.updateStatCard('activeContracts', stats.activeContracts);
      this.updateStatCard('totalValue', stats.totalValue);
      this.updateStatCard('successRate', stats.successRate);

      // 加载最近合同
      this.loadRecentContracts();
      
      // 更新区块链状态
      this.updateBlockchainStatus();
  }

  // 获取仪表板统计数据
  getDashboardStats() {
      return {
          totalContracts: this.contracts.length,
          activeContracts: this.contracts.filter(c => c.status === 'active').length,
          totalValue: this.contracts.reduce((sum, c) => sum + (c.value || 0), 0),
          successRate: this.contracts.length > 0 ? 
              Math.round((this.contracts.filter(c => c.status === 'completed').length / this.contracts.length) * 100) : 0
      };
  }

  // 更新统计卡片
  updateStatCard(cardId, value) {
      const card = document.getElementById(cardId);
      if (card) {
          const valueElement = card.querySelector('.stat-value');
          if (valueElement) {
              if (cardId === 'totalValue') {
                  valueElement.textContent = formatCurrency(value);
              } else if (cardId === 'successRate') {
                  valueElement.textContent = value + '%';
              } else {
                  valueElement.textContent = value.toLocaleString();
              }
          }
      }
  }

  // 处理生成合同
  handleGenerateContract() {
      this.switchView('generate');
      this.showNotification('请填写合同详细信息', 'info');
  }

  // 处理合同表单
  processContractForm() {
      const formData = new FormData(document.getElementById('contractForm'));
      const contractData = {
          type: formData.get('contractType'),
          title: formData.get('contractTitle'),
          parties: {
              party1: formData.get('party1'),
              party2: formData.get('party2')
          },
          terms: formData.get('contractTerms'),
          value: parseFloat(formData.get('contractValue')) || 0,
          duration: formData.get('contractDuration'),
          timestamp: new Date().toISOString(),
          id: generateId(),
          status: 'draft'
      };

      try {
          // 生成智能合同代码
          const contractCode = this.contractManager.generateContract(contractData);
          
          // 添加到合同列表
          const contract = {
              ...contractData,
              code: contractCode,
              hash: this.blockchain.calculateHash(JSON.stringify(contractData))
          };
          
          this.contracts.push(contract);
          
          // 显示生成结果
          this.displayGeneratedContract(contract);
          this.showNotification('合同生成成功！', 'success');
          
          // 更新UI
          this.updateUI();
          
      } catch (error) {
          console.error('合同生成失败:', error);
          this.showNotification('合同生成失败: ' + error.message, 'error');
      }
  }

  // 显示生成的合同
  displayGeneratedContract(contract) {
      const resultDiv = document.getElementById('contractResult');
      if (resultDiv) {
          resultDiv.innerHTML = `
              <div class="contract-preview">
                  <h3>📄 生成的智能合同</h3>
                  <div class="contract-info">
                      <p><strong>合同ID:</strong> ${contract.id}</p>
                      <p><strong>类型:</strong> ${contract.type}</p>
                      <p><strong>标题:</strong> ${contract.title}</p>
                      <p><strong>哈希:</strong> ${contract.hash}</p>
                  </div>
                  <div class="contract-code">
                      <h4>智能合同代码:</h4>
                      <pre><code>${contract.code}</code></pre>
                  </div>
                  <div class="contract-actions">
                      <button onclick="app.deployContract('${contract.id}')" class="btn btn-primary">
                          🚀 部署合同
                      </button>
                      <button onclick="app.downloadContract('${contract.id}')" class="btn btn-secondary">
                          💾 下载合同
                      </button>
                  </div>
              </div>
          `;
          resultDiv.classList.remove('hidden');
      }
  }

  // 处理验证合同
  handleVerifyContract() {
      const contractHash = document.getElementById('verifyHash').value;
      if (!contractHash) {
          this.showNotification('请输入合同哈希值', 'warning');
          return;
      }

      try {
          const isValid = this.blockchain.verifyContract(contractHash);
          const contract = this.contracts.find(c => c.hash === contractHash);
          
          const resultDiv = document.getElementById('verifyResult');
          if (resultDiv) {
              resultDiv.innerHTML = `
                  <div class="verify-result ${isValid ? 'valid' : 'invalid'}">
                      <h3>${isValid ? '✅ 验证成功' : '❌ 验证失败'}</h3>
                      ${contract ? `
                          <div class="contract-details">
                              <p><strong>合同标题:</strong> ${contract.title}</p>
                              <p><strong>创建时间:</strong> ${new Date(contract.timestamp).toLocaleString()}</p>
                              <p><strong>状态:</strong> ${contract.status}</p>
                          </div>
                      ` : '<p>未找到对应的合同信息</p>'}
                  </div>
              `;
              resultDiv.classList.remove('hidden');
          }
          
          this.showNotification(
              isValid ? '合同验证成功' : '合同验证失败', 
              isValid ? 'success' : 'error'
          );
          
      } catch (error) {
          console.error('验证失败:', error);
          this.showNotification('验证过程出错: ' + error.message, 'error');
      }
  }

  // 部署合同
  deployContract(contractId) {
      const contract = this.contracts.find(c => c.id === contractId);
      if (!contract) {
          this.showNotification('未找到指定合同', 'error');
          return;
      }

      try {
          // 创建新区块
          const block = this.blockchain.createBlock({
              type: 'contract_deployment',
              contractId: contract.id,
              contractHash: contract.hash,
              timestamp: new Date().toISOString()
          });

          // 更新合同状态
          contract.status = 'deployed';
          contract.blockHash = block.hash;
          contract.deployedAt = new Date().toISOString();

          this.showNotification('合同部署成功！', 'success');
          this.updateUI();
          
      } catch (error) {
          console.error('部署失败:', error);
          this.showNotification('合同部署失败: ' + error.message, 'error');
      }
  }

  // 加载历史记录视图
  loadHistoryView() {
      const historyContainer = document.getElementById('contractHistory');
      if (historyContainer) {
          historyContainer.innerHTML = this.contracts.map(contract => `
              <div class="contract-item" data-id="${contract.id}">
                  <div class="contract-header">
                      <h4>${contract.title}</h4>
                      <span class="status-badge status-${contract.status}">${contract.status}</span>
                  </div>
                  <div class="contract-meta">
                      <p><strong>类型:</strong> ${contract.type}</p>
                      <p><strong>创建时间:</strong> ${new Date(contract.timestamp).toLocaleString()}</p>
                      <p><strong>价值:</strong> ${formatCurrency(contract.value)}</p>
                  </div>
                  <div class="contract-actions">
                      <button onclick="app.viewContract('${contract.id}')" class="btn btn-sm">查看</button>
                      <button onclick="app.editContract('${contract.id}')" class="btn btn-sm">编辑</button>
                      ${contract.status === 'draft' ? 
                          `<button onclick="app.deployContract('${contract.id}')" class="btn btn-sm btn-primary">部署</button>` : 
                          ''
                      }
                  </div>
              </div>
          `).join('');
      }
  }

  // 搜索合同
  searchContracts(query) {
      const filteredContracts = this.contracts.filter(contract => 
          contract.title.toLowerCase().includes(query.toLowerCase()) ||
          contract.type.toLowerCase().includes(query.toLowerCase()) ||
          contract.parties.party1.toLowerCase().includes(query.toLowerCase()) ||
          contract.parties.party2.toLowerCase().includes(query.toLowerCase())
      );
      
      this.displayFilteredContracts(filteredContracts);
  }

  // 显示过滤后的合同
  displayFilteredContracts(contracts) {
      const historyContainer = document.getElementById('contractHistory');
      if (historyContainer) {
          historyContainer.innerHTML = contracts.map(contract => `
              <div class="contract-item" data-id="${contract.id}">
                  <div class="contract-header">
                      <h4>${contract.title}</h4>
                      <span class="status-badge status-${contract.status}">${contract.status}</span>
                  </div>
                  <div class="contract-meta">
                      <p><strong>类型:</strong> ${contract.type}</p>
                      <p><strong>创建时间:</strong> ${new Date(contract.timestamp).toLocaleString()}</p>
                  </div>
              </div>
          `).join('');
      }
  }

  // 更新区块链状态
  updateBlockchainStatus() {
      const statusElement = document.getElementById('blockchainStatus');
      if (statusElement) {
          const chainInfo = this.blockchain.getChainInfo();
          statusElement.innerHTML = `
              <div class="blockchain-info">
                  <p><strong>区块数量:</strong> ${chainInfo.blockCount}</p>
                  <p><strong>最新区块:</strong> ${chainInfo.latestBlock}</p>
                  <p><strong>网络状态:</strong> <span class="status-online">在线</span></p>
              </div>
          `;
      }
  }

  // 加载最近合同
  loadRecentContracts() {
      const recentContainer = document.getElementById('recentContracts');
      if (recentContainer) {
          const recent = this.contracts
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .slice(0, 5);
              
          recentContainer.innerHTML = recent.map(contract => `
              <div class="recent-contract-item">
                  <div class="contract-info">
                      <h5>${contract.title}</h5>
                      <p class="contract-type">${contract.type}</p>
                  </div>
                  <div class="contract-status">
                      <span class="status-badge status-${contract.status}">${contract.status}</span>
                  </div>
              </div>
          `).join('');
      }
  }

  // 显示通知
  showNotification(message, type = 'info') {
      const notification = document.createElement('div');
      notification.className = `notification notification-${type}`;
      notification.innerHTML = `
          <span>${message}</span>
          <button onclick="this.parentElement.remove()">&times;</button>
      `;
      
      document.body.appendChild(notification);
      
      // 3秒后自动消失
      setTimeout(() => {
          if (notification.parentElement) {
              notification.remove();
          }
      }, 3000);
  }

  // 更新整个UI
  updateUI() {
      if (this.currentView === 'dashboard') {
          this.loadDashboard();
      } else if (this.currentView === 'history') {
          this.loadHistoryView();
      }
  }

  // 下载合同
  downloadContract(contractId) {
      const contract = this.contracts.find(c => c.id === contractId);
      if (!contract) return;

      const contractData = JSON.stringify(contract, null, 2);
      const blob = new Blob([contractData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `contract_${contract.id}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      this.showNotification('合同下载成功', 'success');
  }

  // 查看合同详情
  viewContract(contractId) {
      const contract = this.contracts.find(c => c.id === contractId);
      if (!contract) return;

      // 这里可以打开模态框显示合同详情
      console.log('查看合同:', contract);
      this.showNotification('合同详情功能开发中...', 'info');
  }

  // 编辑合同
  editContract(contractId) {
      const contract = this.contracts.find(c => c.id === contractId);
      if (!contract) return;

      if (contract.status !== 'draft') {
          this.showNotification('只能编辑草稿状态的合同', 'warning');
          return;
      }

      // 切换到生成页面并填充表单
      this.switchView('generate');
      this.fillContractForm(contract);
  }

  // 填充合同表单
  fillContractForm(contract) {
      const form = document.getElementById('contractForm');
      if (form) {
          form.contractType.value = contract.type;
          form.contractTitle.value = contract.title;
          form.party1.value = contract.parties.party1;
          form.party2.value = contract.parties.party2;
          form.contractTerms.value = contract.terms;
          form.contractValue.value = contract.value;
          form.contractDuration.value = contract.duration;
      }
  }
}

// 工具函数
function formatCurrency(amount) {
  return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
  }).format(amount);
}

function generateId() {
  return 'contract_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// 全局应用实例
let app;

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
  app = new SmartContractApp();
});

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SmartContractApp;
}

