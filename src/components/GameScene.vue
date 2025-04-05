<template>
    <div ref="container" class="game-scene"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useGameStore } from '../stores/game';

const container = ref(null);
const gameStore = useGameStore();

// Three.js 变量
let scene, camera, renderer, controls;
let cubes = [];

// 材质定义
const materials = {
    hidden: new THREE.MeshStandardMaterial({
        color: 0x808080,
        metalness: 0.7,
        roughness: 0.3,
        emissive: 0x101010,
        envMapIntensity: 1.0
    }),
    revealed: new THREE.MeshStandardMaterial({
        color: 0xc0c0c0,
        metalness: 0.5,
        roughness: 0.5,
        emissive: 0x050505
    }),
    mine: new THREE.MeshStandardMaterial({
        color: 0xff0000,
        metalness: 0.8,
        roughness: 0.2,
        emissive: 0x300000,
        emissiveIntensity: 0.5
    }),
    flag: new THREE.MeshStandardMaterial({
        color: 0xff8800,
        metalness: 0.6,
        roughness: 0.3,
        emissive: 0x301000,
        emissiveIntensity: 0.3
    })
};

// 创建环境贴图
const cubeTextureLoader = new THREE.CubeTextureLoader();
const envMap = cubeTextureLoader.load([
    'https://threejs.org/examples/textures/cube/Bridge2/posx.jpg',
    'https://threejs.org/examples/textures/cube/Bridge2/negx.jpg',
    'https://threejs.org/examples/textures/cube/Bridge2/posy.jpg',
    'https://threejs.org/examples/textures/cube/Bridge2/negy.jpg',
    'https://threejs.org/examples/textures/cube/Bridge2/posz.jpg',
    'https://threejs.org/examples/textures/cube/Bridge2/negz.jpg'
]);

// 应用环境贴图到所有材质
Object.values(materials).forEach(material => {
    material.envMap = envMap;
});

// 初始化场景
function initScene() {
    const { width, height } = gameStore.config;

    // 创建场景
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121212); // 更暗的背景色，增强对比度

    // 创建相机
    camera = new THREE.PerspectiveCamera(
        45,
        container.value.clientWidth / container.value.clientHeight,
        0.1,
        1000
    );
    camera.position.set(width, height * 1.5, width);

    // 创建渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.value.clientWidth, container.value.clientHeight);
    container.value.appendChild(renderer.domElement);

    // 添加轨道控制器
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = Math.max(width, height) * 3;

    // 添加光源 - 增强版
    const ambientLight = new THREE.AmbientLight(0x222222, 0.5);
    scene.add(ambientLight);

    // 主方向光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // 添加点光源
    const pointLight1 = new THREE.PointLight(0x3366ff, 1, 20);
    pointLight1.position.set(-width/2, 5, -height/2);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xff6633, 1, 20);
    pointLight2.position.set(width/2, 5, height/2);
    scene.add(pointLight2);
    
    // 添加聚光灯
    const spotLight = new THREE.SpotLight(0xffffff, 1.5);
    spotLight.position.set(0, 15, 0);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.3;
    scene.add(spotLight);
    
    // 创建灯光辅助对象（调试用，可以注释掉）
    // const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
    // scene.add(directionalLightHelper);
    
    // 添加雾效果
    scene.fog = new THREE.FogExp2(0x000000, 0.02);

    // 创建棋盘
    createBoard();

    // 开始动画循环
    animate();
}

// 创建棋盘
function createBoard() {
    const { width, height } = gameStore.config;
    const geometry = new THREE.BoxGeometry(0.9, 0.9, 0.9);

    for (let y = 0; y < height; y++) {
        cubes[y] = [];
        for (let x = 0; x < width; x++) {
            const cube = new THREE.Mesh(geometry, materials.hidden);
            cube.position.set(x - width / 2, 0, y - height / 2);
            scene.add(cube);
            cubes[y][x] = cube;

            // 添加数字标签
            const cell = gameStore.board[y][x];
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 256;
            const ctx = canvas.getContext('2d');

            // 根据数字设置不同的颜色
            const colors = ['#666666', '#0000FF', '#008000', '#FF0000', '#000080', '#800000', '#008080', '#000000', '#808080'];
            ctx.fillStyle = colors[cell.neighborMines] || '#000000';
            ctx.font = 'bold 192px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(cell.neighborMines.toString(), 128, 128);

            const texture = new THREE.CanvasTexture(canvas);
            const numberMaterial = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                opacity: 1
            });
            const plane = new THREE.Mesh(
                new THREE.PlaneGeometry(0.8, 0.8),
                numberMaterial
            );
            plane.position.y = 0.46;
            plane.rotation.x = -Math.PI / 2;
            plane.rotation.z = Math.PI;
            cube.add(plane);
            cube.numberPlane = plane;
        }
    }
}

// 创建爆炸粒子效果
function createExplosion(position) {
    const particleCount = 50;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    const color = new THREE.Color();
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        // 随机位置
        positions[i3] = position.x + (Math.random() - 0.5) * 2;
        positions[i3 + 1] = position.y + (Math.random() - 0.5) * 2;
        positions[i3 + 2] = position.z + (Math.random() - 0.5) * 2;
        
        // 随机颜色 - 红色到黄色
        color.setHSL(Math.random() * 0.1 + 0.05, 1.0, 0.5);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
        
        // 随机大小
        sizes[i] = Math.random() * 0.2 + 0.1;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 1.0,
        sizeAttenuation: true
    });
    
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    
    // 动画效果
    const duration = 1.0; // 持续1秒
    let elapsed = 0;
    
    function animateParticles() {
        elapsed += 0.016; // 假设60fps
        
        if (elapsed < duration) {
            const positions = particles.geometry.attributes.position.array;
            const sizes = particles.geometry.attributes.size.array;
            
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                // 粒子向外扩散
                positions[i3] += (Math.random() - 0.5) * 0.1;
                positions[i3 + 1] += (Math.random() - 0.5) * 0.1;
                positions[i3 + 2] += (Math.random() - 0.5) * 0.1;
                
                // 粒子逐渐变小
                sizes[i] *= 0.98;
            }
            
            particles.geometry.attributes.position.needsUpdate = true;
            particles.geometry.attributes.size.needsUpdate = true;
            
            // 透明度逐渐降低
            particles.material.opacity = 1.0 - (elapsed / duration);
            
            requestAnimationFrame(animateParticles);
        } else {
            // 动画结束，移除粒子
            scene.remove(particles);
            particles.geometry.dispose();
            particles.material.dispose();
        }
    }
    
    animateParticles();
}

// 更新棋盘显示
function updateBoard() {
    const { width, height } = gameStore.config;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const cell = gameStore.board[y][x];
            const cube = cubes[y][x];

            // 更新数字标签内容，确保显示最新的邻近地雷数量
            if (cube.numberPlane) {
                // 创建新的画布并绘制数字
                const canvas = document.createElement('canvas');
                canvas.width = 256;
                canvas.height = 256;
                const ctx = canvas.getContext('2d');

                // 根据数字设置不同的颜色
                const colors = ['#666666', '#0000FF', '#008000', '#FF0000', '#000080', '#800000', '#008080', '#000000', '#808080'];
                ctx.fillStyle = colors[cell.neighborMines] || '#000000';
                ctx.font = 'bold 192px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(cell.neighborMines.toString(), 128, 128);

                // 添加发光效果
                ctx.shadowColor = colors[cell.neighborMines] || '#000000';
                ctx.shadowBlur = 20;
                ctx.fillText(cell.neighborMines.toString(), 128, 128);

                // 释放旧纹理并创建新纹理
                if (cube.numberPlane.material.map) {
                    cube.numberPlane.material.map.dispose();
                }
                cube.numberPlane.material.map = new THREE.CanvasTexture(canvas);
                cube.numberPlane.material.needsUpdate = true;
            }

            // 更新方块状态
            if (cell.isRevealed) {
                if (cell.isMine) {
                    // 如果是地雷且刚刚被揭示，创建爆炸效果
                    if (cube.material !== materials.mine) {
                        createExplosion(cube.position);
                    }
                    cube.material = materials.mine;
                    if (cube.numberPlane) {
                        cube.numberPlane.material.opacity = 0; // 隐藏地雷格子上的数字
                    }
                    
                    // 添加脉冲发光效果
                    if (!cube.pulseAnimation) {
                        cube.pulseAnimation = true;
                        const originalEmissive = materials.mine.emissive.clone();
                        const pulseIntensity = 0.8;
                        let pulseDirection = 1;
                        let pulseValue = 0;
                        
                        function animatePulse() {
                            if (!cube.pulseAnimation) return;
                            
                            pulseValue += 0.05 * pulseDirection;
                            if (pulseValue >= pulseIntensity) {
                                pulseDirection = -1;
                            } else if (pulseValue <= 0) {
                                pulseDirection = 1;
                            }
                            
                            cube.material.emissive.copy(originalEmissive).multiplyScalar(1 + pulseValue);
                            requestAnimationFrame(animatePulse);
                        }
                        
                        animatePulse();
                    }
                } else {
                    cube.material = materials.revealed;
                    if (cube.numberPlane) {
                        cube.numberPlane.material.opacity = 1; // 显示数字
                        // 调整数字平面的位置，使其保持在正确的显示高度
                        cube.numberPlane.position.y = 0.66; // 0.46 + 0.2 以补偿cube的下降
                    }
                }
                // 添加显示动画 - 更平滑的动画
                if (cube.position.y > -0.2) {
                    // 使用GSAP风格的动画
                    const targetY = -0.2;
                    const duration = 0.3;
                    const startY = cube.position.y;
                    const startTime = Date.now();
                    
                    function animateReveal() {
                        const elapsed = (Date.now() - startTime) / 1000;
                        const progress = Math.min(elapsed / duration, 1);
                        // 使用缓动函数使动画更自然
                        const easedProgress = 1 - Math.pow(1 - progress, 3); // 缓出效果
                        
                        cube.position.y = startY + (targetY - startY) * easedProgress;
                        
                        if (progress < 1) {
                            requestAnimationFrame(animateReveal);
                        }
                    }
                    
                    animateReveal();
                }
            } else if (cell.isFlagged) {
                cube.material = materials.flag;
                if (cube.numberPlane) {
                    cube.numberPlane.material.opacity = 0; // 隐藏标记为旗帜的格子上的数字
                }
                
                // 添加旗帜悬浮动画
                if (!cube.flagAnimation) {
                    cube.flagAnimation = true;
                    const originalY = cube.position.y;
                    const hoverHeight = 0.2;
                    let time = 0;
                    
                    function animateFlag() {
                        if (!cell.isFlagged) {
                            cube.flagAnimation = false;
                            cube.position.y = originalY;
                            return;
                        }
                        
                        time += 0.02;
                        cube.position.y = originalY + Math.sin(time * 2) * hoverHeight;
                        requestAnimationFrame(animateFlag);
                    }
                    
                    animateFlag();
                }
            } else {
                cube.material = materials.hidden;
                cube.position.y = 0;
                if (cube.numberPlane) {
                    cube.numberPlane.material.opacity = 0; // 隐藏未揭示格子上的数字
                }
                
                // 停止任何动画
                cube.pulseAnimation = false;
                cube.flagAnimation = false;
            }
        }
    }
}

// 动画循环
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// 处理窗口大小变化
function handleResize() {
    if (!camera || !renderer || !container.value) return;

    camera.aspect = container.value.clientWidth / container.value.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.value.clientWidth, container.value.clientHeight);
}

// 处理点击事件
function handleClick(event) {
    if (!scene || !camera) return;

    const rect = container.value.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / container.value.clientWidth) * 2 - 1;
    const y = -((event.clientY - rect.top) / container.value.clientHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera({ x, y }, camera);

    const { width, height } = gameStore.config;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const intersects = raycaster.intersectObject(cubes[y][x]);
            if (intersects.length > 0) {
                if (event.button === 0) { // 左键点击
                    gameStore.revealCell(x, y);
                } else if (event.button === 2) { // 右键点击
                    gameStore.toggleFlag(x, y);
                }
                return;
            }
        }
    }
}

// 监听游戏板变化
watch(() => gameStore.board, updateBoard, { deep: true });

// 生命周期钩子
onMounted(() => {
    gameStore.initializeGame(gameStore.config);
    // 确保在创建场景之前先放置地雷并计算邻近地雷数
    // 使用棋盘中心位置作为安全的第一次点击位置
    const centerX = Math.floor(gameStore.config.width / 2);
    const centerY = Math.floor(gameStore.config.height / 2);
    gameStore.placeMines(centerX, centerY);

    initScene();
    window.addEventListener('resize', handleResize);
    container.value.addEventListener('mousedown', handleClick);
    container.value.addEventListener('contextmenu', (e) => e.preventDefault());
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    container.value?.removeEventListener('mousedown', handleClick);
    container.value?.removeEventListener('contextmenu', (e) => e.preventDefault());

    // 清理Three.js资源
    scene?.traverse((object) => {
        if (object.geometry) {
            object.geometry.dispose();
        }
        if (object.material) {
            if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
            } else {
                object.material.dispose();
            }
        }
    });
    renderer?.dispose();
});
</script>

<style scoped>
.game-scene {
    width: 100%;
    height: 100%;
    position: relative;
}
</style>