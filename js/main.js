// 获取DOM元素
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const uploadSection = document.getElementById('uploadSection');
const previewSection = document.getElementById('previewSection');
const originalPreview = document.getElementById('originalPreview');
const compressedPreview = document.getElementById('compressedPreview');
const originalSize = document.getElementById('originalSize');
const originalDimensions = document.getElementById('originalDimensions');
const compressedSize = document.getElementById('compressedSize');
const compressedDimensions = document.getElementById('compressedDimensions');
const qualitySlider = document.getElementById('qualitySlider');
const qualityValue = document.getElementById('qualityValue');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');

// 当前处理的图片数据
let currentFile = null;

// 初始化事件监听
function initializeEventListeners() {
    // 点击上传
    dropZone.addEventListener('click', () => fileInput.click());

    // 文件选择变更
    fileInput.addEventListener('change', handleFileSelect);

    // 拖放事件
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    // 质量滑块变更
    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = `${e.target.value}%`;
        if (currentFile) {
            compressImage(currentFile);
        }
    });

    // 下载按钮
    downloadBtn.addEventListener('click', downloadCompressedImage);

    // 重置按钮
    resetBtn.addEventListener('click', resetUpload);
}

// 处理文件选择
function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

// 处理文件
function handleFile(file) {
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
        alert('请上传图片文件！');
        return;
    }

    currentFile = file;
    displayFileInfo(file);
    compressImage(file);
}

// 显示文件信息
function displayFileInfo(file) {
    // 显示原始文件大小
    originalSize.textContent = `大小: ${formatFileSize(file.size)}`;
    
    // 创建图片对象获取尺寸
    const img = new Image();
    img.onload = () => {
        originalDimensions.textContent = `尺寸: ${img.width} x ${img.height}`;
        // 显示原图预览
        originalPreview.src = img.src;
        // 显示预览区域
        uploadSection.style.display = 'none';
        previewSection.style.display = 'block';
    };
    img.src = URL.createObjectURL(file);
}

// 压缩图片
function compressImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            // 创建 canvas
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            
            // 绘制图片
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            // 压缩
            const quality = qualitySlider.value / 100;
            canvas.toBlob(
                (blob) => {
                    // 更新压缩后预览
                    compressedPreview.src = URL.createObjectURL(blob);
                    // 更新压缩后信息
                    compressedSize.textContent = `大小: ${formatFileSize(blob.size)}`;
                    compressedDimensions.textContent = `尺寸: ${img.width} x ${img.height}`;
                },
                'image/jpeg',
                quality
            );
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// 下载压缩后的图片
function downloadCompressedImage() {
    const link = document.createElement('a');
    link.download = `compressed_${currentFile.name}`;
    link.href = compressedPreview.src;
    link.click();
}

// 重置上传
function resetUpload() {
    currentFile = null;
    fileInput.value = '';
    uploadSection.style.display = 'block';
    previewSection.style.display = 'none';
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 初始化应用
initializeEventListeners(); 