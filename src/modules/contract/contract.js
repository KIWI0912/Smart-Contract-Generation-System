// 合同生成相关功能
class ContractGenerator {
  constructor(templates) {
    this.templates = templates; // 从外部加载模板数据
  }

  /**
   * 根据模板名称生成合同内容
   * @param {string} templateName - 用户选择的模板名称
   * @returns {string} - 返回合同内容
   */
  generate(templateName) {
    const selectedTemplate = this.templates.find(template => template.name === templateName);
    if (!selectedTemplate) {
      throw new Error(`未找到对应的合同模板: ${templateName}`);
    }
    return selectedTemplate.content; // 返回模板内容
  }
}

// 导出模块
export default ContractGenerator;
