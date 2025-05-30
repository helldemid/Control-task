document.addEventListener('DOMContentLoaded', function () {
    const errorNode = document.getElementById('errors');
    try {
        var scene = new THREE.Scene();

        var camera = new THREE.Camera();
        scene.add(camera);

        var light = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(light);
        var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);

        var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('ar-container').appendChild(renderer.domElement);

        var arSource = new THREEx.ArToolkitSource({ sourceType: 'webcam' });

        function onResize() {
            arSource.onResizeElement();
            arSource.copyElementSizeTo(renderer.domElement);
            if (arContext.arController !== null) {
                arSource.copyElementSizeTo(arContext.arController.canvas);
            }
            renderer.setSize(window.innerWidth, window.innerHeight, false);
        }

        arSource.init(function onReady() {
            onResize();
        });
        window.addEventListener('resize', function () { onResize(); });
        window.addEventListener('orientationchange', function () { setTimeout(onResize, 500); });

        var arContext = new THREEx.ArToolkitContext({
            cameraParametersUrl: './configuration/camParameters.dat',
            detectionMode: 'mono'
        });

        arContext.init(function onCompleted() {
            camera.projectionMatrix.copy(arContext.getProjectionMatrix());
        });

        var markerRoot = new THREE.Group();
        scene.add(markerRoot);

        var markerControls = new THREEx.ArMarkerControls(arContext, markerRoot, {
            type: 'pattern',
            patternUrl: './configuration/pattern-marker.patt',
        });

        var surface = new Torus();
        var mesh = surface.getMesh();
        markerRoot.add(mesh);

        let t = 0;
        function animate() {
            requestAnimationFrame(animate);
            if (arSource.ready) arContext.update(arSource.domElement);
            mesh.rotation.y += 0.02;
            mesh.rotation.x = Math.sin(t) * 0.2;
            mesh.scale.setScalar(1 + 0.2 * Math.sin(t * 3));

            t += 0.02;

            renderer.render(scene, camera);
        }
        animate();
    } catch (error) {
        errorNode.innerHTML += `<p style="color:red">${error.message}</p>`;
    }
});