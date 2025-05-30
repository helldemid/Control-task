document.addEventListener('DOMContentLoaded', function () {
    const errorNode = document.getElementById('errors');
    function logStep(msg) {
        errorNode.innerHTML += `<p>${msg}</p>`;
    }
    try {
        logStep('Создание сцены...');
        var scene = new THREE.Scene();

        logStep('Создание камеры...');
        var camera = new THREE.Camera();
        scene.add(camera);

        logStep('Добавление света...');
        var light = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(light);
        var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);

        logStep('Создание рендерера...');
        var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('ar-container').appendChild(renderer.domElement);

        logStep('Инициализация AR источника...');
        var arSource = new THREEx.ArToolkitSource({ sourceType: 'webcam' });

        function onResize() {
            arSource.onResizeElement();
            arSource.copyElementSizeTo(renderer.domElement);
            if (arContext.arController !== null) {
                arSource.copyElementSizeTo(arContext.arController.canvas);
            }
            renderer.setSize(window.innerWidth, window.innerHeight, false);
        }

        logStep('Настройка resize listeners...');
        arSource.init(function onReady() {
            onResize();
        });
        window.addEventListener('resize', function () { onResize(); });
        window.addEventListener('orientationchange', function () { setTimeout(onResize, 500); });

        logStep('Инициализация AR контекста...');
        var arContext = new THREEx.ArToolkitContext({
            cameraParametersUrl: './configuration/camParameters.dat',
            detectionMode: 'mono'
        });

        arContext.init(function onCompleted() {
            camera.projectionMatrix.copy(arContext.getProjectionMatrix());
            logStep('AR контекст готов!');
        });

        logStep('Создание marker root...');
        var markerRoot = new THREE.Group();
        scene.add(markerRoot);

        logStep('Настройка marker controls...');
        var markerControls = new THREEx.ArMarkerControls(arContext, markerRoot, {
            type: 'pattern',
            patternUrl: './configuration/VR_Study_Logo.patt',
        });

        logStep('Добавление фигуры...');
        var surface = new Torus();
        var mesh = surface.getMesh();
        markerRoot.add(mesh);

        logStep('Запуск анимации...');
        function animate() {
            requestAnimationFrame(animate);
            if (arSource.ready) arContext.update(arSource.domElement);
            mesh.rotation.y += 0.02;
            mesh.rotation.x = Math.sin(t) * 0.2;
            mesh.material.opacity = 0.7 + 0.3 * Math.abs(Math.sin(t * 2)); // если материал поддерживает прозрачность
            mesh.scale.setScalar(1 + 0.2 * Math.sin(t * 3)); // пульсация размера

            t += 0.02;

            renderer.render(scene, camera);
        }
        animate();
        logStep('Готово!');
    } catch (error) {
        errorNode.innerHTML += `<p style="color:red">${error.message}</p>`;
    }
});