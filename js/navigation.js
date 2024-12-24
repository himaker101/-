// 工具配置缓存
let toolsConfig = [];

// 初始化导航
async function initializeNavigation() {
    try {
        // 加载工具配置
        await loadToolsConfig();
        // 渲染导航菜单
        renderNavigation();
        // 处理路由
        handleRoute();
        // 初始化工具特定的样式和脚本
        initializeToolResources();
    } catch (error) {
        console.error('初始化导航失败:', error);
    }
}

// 加载工具配置
async function loadToolsConfig() {
    try {
        // 这里可以从服务器加载配置，现在先使用静态配置
        toolsConfig = [
            {
                id: 'tool-001',
                name: '图片压缩工具',
                displayOrder: 1,
                icon: '🖼️',
                status: 'active',
                description: '简单高效的在线图片压缩服务'
            },
            {
                id: 'tool-002',
                name: '恋爱预测',
                displayOrder: 2,
                icon: '❤️',
                status: 'planning',
                description: '趣味性恋爱预测工具'
            },
            {
                id: 'tool-003',
                name: 'YouTube下载器',
                displayOrder: 3,
                icon: '📺',
                status: 'planning',
                description: 'YouTube视频本地下载工具'
            }
        ];

        // 按显示顺序排序
        toolsConfig.sort((a, b) => a.displayOrder - b.displayOrder);
    } catch (error) {
        console.error('加载工具配置失败:', error);
        throw error;
    }
}

// 渲染导航菜单
function renderNavigation() {
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;

    // 清空现有内容
    navMenu.innerHTML = '';

    // 创建工具组
    const toolGroup = document.createElement('div');
    toolGroup.className = 'nav-group';
    toolGroup.innerHTML = `
        <h3 class="nav-group-title">工具列表</h3>
        <ul class="nav-list">
            ${toolsConfig.map(tool => `
                <li class="nav-item ${tool.status === 'planning' ? 'disabled' : ''}" data-tool-id="${tool.id}">
                    <a href="#${tool.id}" class="nav-link" ${tool.status === 'planning' ? 'disabled' : ''}>
                        <span class="nav-icon">${tool.icon}</span>
                        ${tool.name}
                        ${tool.status === 'planning' ? '<span class="status-badge">开发中</span>' : ''}
                    </a>
                </li>
            `).join('')}
        </ul>
    `;

    navMenu.appendChild(toolGroup);

    // 绑定点击事件
    document.querySelectorAll('.nav-item:not(.disabled)').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const toolId = item.dataset.toolId;
            navigateToTool(toolId);
        });
    });
}

// 初始化工具特定的资源
function initializeToolResources() {
    // 初始时隐藏所有工具相关的样式和脚本
    document.querySelectorAll('[data-tool]').forEach(element => {
        const toolId = element.getAttribute('data-tool');
        const tool = toolsConfig.find(t => t.id === toolId);
        
        if (tool && tool.status === 'planning') {
            // 如果工具还在开发中，移除相关资源
            element.remove();
        } else if (element.tagName === 'LINK' || element.tagName === 'SCRIPT') {
            // 保留已完成工具的资源
            element.disabled = true;
        }
    });
}

// 处理路由
function handleRoute() {
    const hash = window.location.hash.slice(1);
    if (hash) {
        const tool = toolsConfig.find(t => t.id === hash);
        if (tool && tool.status === 'active') {
            navigateToTool(hash);
        } else {
            // 如果工具不存在或未激活，导航到第一个可用工具
            const firstTool = toolsConfig.find(t => t.status === 'active');
            if (firstTool) {
                navigateToTool(firstTool.id);
            }
        }
    } else {
        // 默认导航到第一个工具
        const firstTool = toolsConfig.find(tool => tool.status === 'active');
        if (firstTool) {
            navigateToTool(firstTool.id);
        }
    }
}

// 导航到指定工具
function navigateToTool(toolId) {
    const tool = toolsConfig.find(t => t.id === toolId);
    if (!tool || tool.status !== 'active') return;

    // 更新活动状态
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.toolId === toolId);
    });

    // 隐藏所有工具内容
    document.querySelectorAll('.tool-content').forEach(content => {
        content.style.display = 'none';
        
        // 禁用非当前工具的样式和脚本
        const contentToolId = content.getAttribute('data-tool');
        document.querySelectorAll(`[data-tool="${contentToolId}"]`).forEach(element => {
            if (element.tagName === 'LINK' || element.tagName === 'SCRIPT') {
                element.disabled = true;
            }
        });
    });

    // 显示选中的工具内容
    const selectedTool = document.getElementById(toolId);
    if (selectedTool) {
        selectedTool.style.display = 'block';
        
        // 启用当前工具的样式和脚本
        document.querySelectorAll(`[data-tool="${toolId}"]`).forEach(element => {
            if (element.tagName === 'LINK' || element.tagName === 'SCRIPT') {
                element.disabled = false;
            }
        });
    }

    // 更新 URL hash
    window.location.hash = toolId;
}

// 监听路由变化
window.addEventListener('hashchange', handleRoute);

// 初始化
document.addEventListener('DOMContentLoaded', initializeNavigation); 