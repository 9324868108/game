document.addEventListener('DOMContentLoaded', function() {
    // Get wish ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const wishId = urlParams.get('id');
    
    // If no wish ID, redirect to home
    if (!wishId) {
        window.location.href = 'index.html';
        return;
    }
    
    // Get wish data from localStorage
    const wishData = JSON.parse(localStorage.getItem(`wish_${wishId}`));
    
    // If no wish data or game not completed, redirect to game
    if (!wishData) {
        window.location.href = 'index.html';
        return;
    }
    
    if (!wishData.gameCompleted) {
        window.location.href = `game.html?id=${wishId}`;
        return;
    }
    
    // Update message content
    document.getElementById('recipientName').textContent = wishData.friendName;
    document.getElementById('ageNumber').textContent = wishData.age;
    document.getElementById('memoriesText').textContent = wishData.memories;
    document.getElementById('messageText').textContent = wishData.message;
    document.getElementById('senderNameText').textContent = wishData.senderName;
    
    // Initialize 3D scene
    initBirthdayScene();
    
    // Create new wish button
    const createNewWishBtn = document.getElementById('createNewWishBtn');
    if (createNewWishBtn) {
        createNewWishBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
    
    // 3D Birthday Scene
    function initBirthdayScene() {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 400, 0.1, 1000);
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, 400);
        renderer.setClearColor(0x000000, 0);
        
        const birthdayScene = document.getElementById('birthdayScene');
        birthdayScene.innerHTML = '';
        birthdayScene.appendChild(renderer.domElement);
        
        // Responsive canvas
        window.addEventListener('resize', function() {
            camera.aspect = window.innerWidth / 400;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, 400);
        });
        
        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 10, 10);
        scene.add(directionalLight);
        
        // Camera position
        camera.position.z = 15;
        
        // Create cake
        const cake = createCake();
        scene.add(cake);
        
        // Create balloons
        createBalloons().forEach(balloon => scene.add(balloon));
        
        // Create fireworks particles
        const particles = createParticles();
        scene.add(particles);
        
        // Create text
        const birthdayText = createText(`Happy Birthday, ${wishData.friendName}!`);
        birthdayText.position.set(0, 6, 0);
        scene.add(birthdayText);
        
        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            // Rotate cake
            cake.rotation.y += 0.01;
            
            // Animate particles
            animateParticles(particles);
            
            // Render scene
            renderer.render(scene, camera);
        }
        
        animate();
    }
    
    // Create 3D cake
    function createCake() {
        const cakeGroup = new THREE.Group();
        
        // Base layer
        const baseGeometry = new THREE.CylinderGeometry(3, 3, 1, 32);
        const baseMaterial = new THREE.MeshPhongMaterial({ color: 0xFFDE59 });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = -2;
        cakeGroup.add(base);
        
        // Middle layer
        const middleGeometry = new THREE.CylinderGeometry(2.5, 2.5, 1, 32);
        const middleMaterial = new THREE.MeshPhongMaterial({ color: 0xFF5E94 });
        const middle = new THREE.Mesh(middleGeometry, middleMaterial);
        middle.position.y = -1;
        cakeGroup.add(middle);
        
        // Top layer
        const topGeometry = new THREE.CylinderGeometry(2, 2, 1, 32);
        const topMaterial = new THREE.MeshPhongMaterial({ color: 0x9C4DF4 });
        const top = new THREE.Mesh(topGeometry, topMaterial);
        top.position.y = 0;
        cakeGroup.add(top);
        
        // Candles
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            const radius = 1;
            
            const candleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 16);
            const candleMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
            const candle = new THREE.Mesh(candleGeometry, candleMaterial);
            
            candle.position.x = Math.cos(angle) * radius;
            candle.position.z = Math.sin(angle) * radius;
            candle.position.y = 0.5;
            
            cakeGroup.add(candle);
            
            // Flame
            const flameGeometry = new THREE.SphereGeometry(0.2, 16, 16);
            const flameMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xFFAA00,
                emissive: 0xFFAA00,
                emissiveIntensity: 1
            });
            const flame = new THREE.Mesh(flameGeometry, flameMaterial);
            flame.position.y = 1.2;
            flame.scale.y = 1.5;
            
            // Animate flame
            const flameAnimation = gsap.to(flame.scale, {
                x: 1.2,
                y: 1.8,
                z: 1.2,
                duration: 0.5,
                repeat: -1,
                yoyo: true
            });
            
            candle.add(flame);
        }
        
        return cakeGroup;
    }
    
    // Create balloons
    function createBalloons() {
        const balloons = [];
        const colors = [0xFF5E94, 0x9C4DF4, 0x4DCCBD, 0xFFDE59, 0xFF9A5E];
        
        for (let i = 0; i < 10; i++) {
            const balloonGroup = new THREE.Group();
            
            // Balloon
            const balloonGeometry = new THREE.SphereGeometry(0.8, 32, 32);
            const balloonMaterial = new THREE.MeshPhongMaterial({ 
                color: colors[i % colors.length]
            });
            const balloon = new THREE.Mesh(balloonGeometry, balloonMaterial);
            balloonGroup.add(balloon);
            
            // String
            const stringGeometry = new THREE.CylinderGeometry(0.02, 0.02, 3, 8);
            const stringMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
            const string = new THREE.Mesh(stringGeometry, stringMaterial);
            string.position.y = -1.5;
            balloonGroup.add(string);
            
            // Position randomly
            balloonGroup.position.x = (Math.random() - 0.5) * 20;
            balloonGroup.position.y = Math.random() * 5 + 5;
            balloonGroup.position.z = (Math.random() - 0.5) * 10;
            
            // Animate balloon
            gsap.to(balloonGroup.position, {
                y: '+=1',
                x: '+=0.5',
                z: '+=0.5',
                duration: 2 + Math.random() * 2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
            
            balloons.push(balloonGroup);
        }
        
        return balloons;
    }
    
    // Create particles for fireworks
    function createParticles() {
        const particleCount = 500;
        const particles = new THREE.Group();
        
        const colors = [0xFF5E94, 0x9C4DF4, 0x4DCCBD, 0xFFDE59, 0xFF9A5E];
        
        for (let i = 0; i < particleCount; i++) {
            const geometry = new THREE.SphereGeometry(0.1, 8, 8);
            const material = new THREE.MeshPhongMaterial({ 
                color: colors[Math.floor(Math.random() * colors.length)],
                emissive: colors[Math.floor(Math.random() * colors.length)],
                emissiveIntensity: 0.5
            });
            
            const particle = new THREE.Mesh(geometry, material);
            
            // Random position
            particle.position.x = (Math.random() - 0.5) * 30;
            particle.position.y = (Math.random() - 0.5) * 20;
            particle.position.z = (Math.random() - 0.5) * 20;
            
            // Store original position
            particle.userData.originalPosition = {
                x: particle.position.x,
                y: particle.position.y,
                z: particle.position.z
            };
            
            // Random velocity
            particle.userData.velocity = {
                x: (Math.random() - 0.5) * 0.2,
                y: (Math.random() - 0.5) * 0.2,
                z: (Math.random() - 0.5) * 0.2
            };
            
            particles.add(particle);
        }
        
        return particles;
    }
    
    // Animate particles
    function animateParticles(particles) {
        // Create new firework every few seconds
        if (Math.random() < 0.01) {
            createFirework(particles);
        }
        
        particles.children.forEach(particle => {
            // Update position based on velocity
            particle.position.x += particle.userData.velocity.x;
            particle.position.y += particle.userData.velocity.y;
            particle.position.z += particle.userData.velocity.z;
            
            // Apply gravity
            particle.userData.velocity.y -= 0.001;
            
            // Reset particles that go too far
            if (
                particle.position.y < -10 ||
                Math.abs(particle.position.x) > 20 ||
                Math.abs(particle.position.z) > 20
            ) {
                resetParticle(particle);
            }
        });
    }
    
    // Create firework effect
    function createFirework(particles) {
        const fireworkCenter = {
            x: (Math.random() - 0.5) * 15,
            y: Math.random() * 10,
            z: (Math.random() - 0.5) * 10
        };
        
        // Select random particles for the firework
        const fireworkParticles = [];
        for (let i = 0; i < 50; i++) {
            const randomIndex = Math.floor(Math.random() * particles.children.length);
            fireworkParticles.push(particles.children[randomIndex]);
        }
        
        // Set all selected particles to the firework center
        fireworkParticles.forEach(particle => {
            gsap.to(particle.position, {
                x: fireworkCenter.x,
                y: fireworkCenter.y,
                z: fireworkCenter.z,
                duration: 0.5,
                onComplete: () => {
                    // Explode outward
                    const angle = Math.random() * Math.PI * 2;
                    const height = Math.random() * Math.PI;
                    const speed = 0.1 + Math.random() * 0.2;
                    
                    particle.userData.velocity = {
                        x: Math.sin(angle) * Math.cos(height) * speed,
                        y: Math.sin(height) * speed,
                        z: Math.cos(angle) * Math.cos(height) * speed
                    };
                }
            });
        });
    }
    
    // Reset particle to a new random position
    function resetParticle(particle) {
        particle.position.set(
            (Math.random() - 0.5) * 30,
            10 + Math.random() * 10,
            (Math.random() - 0.5) * 20
        );
        
        particle.userData.velocity = {
            x: (Math.random() - 0.5) * 0.2,
            y: (Math.random() - 0.5) * 0.2 - 0.1,
            z: (Math.random() - 0.5) * 0.2
        };
    }
    
    // Create 3D text
    function createText(text) {
        const textGroup = new THREE.Group();
        
        // Create canvas for text
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 1024;
        canvas.height = 256;
        
        // Draw text on canvas
        context.fillStyle = '#000000';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = 'bold 80px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        
        // Create gradient
        const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, '#FF5E94');
        gradient.addColorStop(0.5, '#9C4DF4');
        gradient.addColorStop(1, '#4DCCBD');
        
        context.fillStyle = gradient;
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        
        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);
        
        // Create plane with texture
        const geometry = new THREE.PlaneGeometry(10, 2.5);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide
        });
        
        const textMesh = new THREE.Mesh(geometry, material);
        textGroup.add(textMesh);
        
        return textGroup;
    }
});
