// Contract Logic.js - 合同生成逻辑
import ContractGenerator from './contract.js'; // 导入合同生成模块
import templates from './templates.js'; // 导入模板数据

// 初始化合同生成器
const contractGenerator = new ContractGenerator(templates);

// 获取 HTML 元素
const templateSelect = document.querySelector('#templateSelector');
const generateButton = document.querySelector('#generateButton');
const outputArea = document.querySelector('#outputArea'); // 合同内容显示区域

// 监听模板选择器变化
templateSelect.addEventListener('change', () => {
  const selectedTemplateName = templateSelect.value;
  console.log(`用户选择了模板: ${selectedTemplateName}`);
});

// 监听生成按钮点击事件
generateButton.addEventListener('click', () => {
  const selectedTemplateName = templateSelect.value; // 获取用户选择的模板名称
  try {
    const contractContent = contractGenerator.generate(selectedTemplateName); // 生成合同内容
    outputArea.textContent = contractContent; // 显示合同内容
    console.log('合同生成成功:', contractContent);
  } catch (error) {
    console.error('生成合同时发生错误:', error);
    outputArea.textContent = `错误: ${error.message}`; // 显示错误信息
  }
});
