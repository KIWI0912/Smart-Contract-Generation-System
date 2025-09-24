// blockchain.js
import Web3 from 'web3'; // 引入 Web3.js

class BlockchainManager {
  constructor() {
    this.web3 = null;
    this.account = null;
    this.contractAddress = null;
    this.contractABI = null;
    this.contract = null;
    this.networkId = null;
    this.isConnected = false;

    // 模拟区块链数据
    this.simulatedBlocks = JSON.parse(localStorage.getItem('simulatedBlocks') || '[]');
    this.simulatedTransactions = JSON.parse(localStorage.getItem('simulatedTransactions') || '[]');
    this.networkStats = {
      blockHeight: 1250000 + this.simulatedBlocks.length,
      totalTransactions: 50000000 + this.simulatedTransactions.length,
      avgBlockTime: 2.5,
      gasPrice: 20,
      networkHashRate: '180.5 TH/s'
    };

    this.init(); // 初始化
  }

  async init() {
    this.bindEvents();
    this.updateNetworkStats();

    // 检查是否有 Web3 环境
    if (typeof window.ethereum !== 'undefined') {
      await this.initWeb3(); // 初始化 Web3
    } else {
      console.log('使用模拟区块链环境');
      this.initSimulatedBlockchain(); // 使用模拟区块链
    }

    // 将区块链浏览器更新逻辑放入 DOMContentLoaded 中
    document.addEventListener('DOMContentLoaded', () => {
      this.updateBlockchainExplorer();
    });
  }

  async initWeb3() {
    try {
      // 使用 MetaMask 提供的 Web3 环境
      this.web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' }); // 请求连接钱包
      const accounts = await this.web3.eth.getAccounts();
      this.account = accounts[0]; // 获取当前账户
      this.networkId = await this.web3.eth.net.getId(); // 获取网络 ID
      console.log('Web3 初始化成功:', { account: this.account, networkId: this.networkId });
      this.isConnected = true;
    } catch (error) {
      console.error('Web3 初始化失败:', error);
    }
  }

  initSimulatedBlockchain() {
    // 模拟区块链环境逻辑
    console.log('模拟区块链环境已启动');
  }

  bindEvents() {
    // 连接钱包按钮
    document.addEventListener('click', (e) => {
      if (e.target.id === 'connect-wallet') {
        this.initWeb3();
      }
    });
  }

  updateNetworkStats() {
    // 更新网络统计数据
    console.log('更新网络统计数据:', this.networkStats);
  }

  updateBlockchainExplorer() {
    // 更新区块链浏览器
    console.log('更新区块链浏览器');
  }
}

export { BlockchainManager };
