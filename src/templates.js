let templateData = []; // 定义全局变量

// 显示模板来源信息
function displayTemplateSourceInfo(templateData) {
    console.log('模板来源信息:', templateData);
}

// 生成模板列表
function generateTemplateList() {
    console.log('生成模板列表...');
    // 示例：可以根据 templateData 渲染模板列表
}

// 生成模板选择器选项
function generateTemplateSelectorOptions() {
    console.log('生成模板选择器选项...');
    // 示例：可以根据 templateData 渲染选择器选项
}

// 初始化模板数据
async function initTemplateData() {
    try {
        console.log('强制使用备用数据...');
        // 强制使用备用模板数据
        templateData = getBackupTemplates();

        console.log('备用数据加载成功:', templateData);

        // 显示模板来源信息
        displayTemplateSourceInfo(templateData);

        // 生成模板列表和选择器选项
        generateTemplateList();
        generateTemplateSelectorOptions();
    } catch (error) {
        console.error('初始化模板数据失败:', error);
    }
}

// 备用模板数据
function getBackupTemplates() {
    return [
        {
            id: "labor-standard-2025",
            name: "标准劳动合同（2025版）",
            description: "人力资源和社会保障部2025年发布的标准劳动合同范本，适用于各类企业",
            category: "labor",
            version: "2025-08版",
            authority: "人力资源和社会保障部",
            fields: [
                { name: "employerName", label: "用人单位名称", type: "text", required: true },
                { name: "employerUnifiedCode", label: "统一社会信用代码", type: "text", required: true },
                { name: "employerAddress", label: "用人单位注册地址", type: "text", required: true },
                { name: "employerRepresentative", label: "用人单位法定代表人", type: "text", required: true },
                { name: "employerContact", label: "用人单位联系电话", type: "text", required: true },
                { name: "employeeName", label: "劳动者姓名", type: "text", required: true },
                { name: "employeeID", label: "劳动者身份证号", type: "text", required: true },
                { name: "employeeAddress", label: "劳动者住址", type: "text", required: true },
                { name: "employeeContact", label: "劳动者联系电话", type: "text", required: true },
                { name: "contractStartDate", label: "合同开始日期", type: "date", required: true },
                { name: "contractEndDate", label: "合同结束日期", type: "date", required: true },
                { name: "position", label: "工作岗位", type: "text", required: true },
                { name: "workingPlace", label: "工作地点", type: "text", required: true },
                { name: "basicSalary", label: "基本工资(元/月)", type: "number", required: true },
                { name: "socialInsurance", label: "社会保险", type: "checkbox", required: true }
            ]
        },
        {
            id: "rental-house-2025",
            name: "房屋租赁合同（2025版）",
            description: "适用于住宅房屋租赁",
            fields: [
                { name: "lessorName", label: "出租方姓名", type: "text", required: true },
                { name: "lessorID", label: "出租方身份证号/统一社会信用代码", type: "text", required: true },
                { name: "lessorAddress", label: "出租方地址", type: "text", required: true },
                { name: "lessorContact", label: "出租方联系电话", type: "text", required: true },
                { name: "lesseeName", label: "承租方姓名", type: "text", required: true },
                { name: "lesseeID", label: "承租方身份证号/统一社会信用代码", type: "text", required: true },
                { name: "lesseeAddress", label: "承租方地址", type: "text", required: true },
                { name: "lesseeContact", label: "承租方联系电话", type: "text", required: true },
                { name: "propertyAddress", label: "租赁房屋地址", type: "text", required: true },
                { name: "propertyArea", label: "租赁房屋面积(平方米)", type: "number", required: true },
                { name: "rentStartDate", label: "租赁开始日期", type: "date", required: true },
                { name: "rentEndDate", label: "租赁结束日期", type: "date", required: true },
                { name: "monthlyRent", label: "月租金(元)", type: "number", required: true },
                { name: "depositAmount", label: "押金(元)", type: "number", required: true },
                { name: "paymentMethod", label: "租金支付方式", type: "select", options: ["月付", "季付", "半年付", "年付"], required: true },
                { name: "paymentDate", label: "租金支付日", type: "select", options: ["每月1日", "每月5日", "每月10日", "每月15日", "每季度首月1日"], required: true },
                { name: "propertyCondition", label: "房屋现状", type: "textarea", required: true },
                { name: "furnishings", label: "家具设备", type: "textarea", required: false }
            ]
        },
        {
            id: "test",
            name: "测试模板",
            description: "只是测试而已",
            fields: [
                { name: "employerName", label: "文字", type: "text", required: true },
                { name: "socialInsurance", label: "选择", type: "checkbox", required: true }
            ]
        }
    ];
}

// 导出模板数据和初始化函数
export { templateData, initTemplateData, getBackupTemplates };