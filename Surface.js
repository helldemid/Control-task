
class SurfaceThreeJS {
    constructor(name, p, h, uSegmentsNumber, vSegmentsNumber) {
        this.name = name;
        this.p = p;
        this.h = h;
        this.uSegmentsNumber = uSegmentsNumber;
        this.vSegmentsNumber = vSegmentsNumber;

        this.geometry = new THREE.BufferGeometry();

        this.updateSurfaceData();
    }

    // Генерируем вершины и индексы по твоей формуле
    updateSurfaceData() {
        const positions = [];
        const indices = [];
        const normals = [];
        const uvs = [];

        const vMax = 2 * Math.PI;

        // Генерация вершин
        for (let i = 0; i <= this.uSegmentsNumber; i++) {
            let z = -this.h + (i / this.uSegmentsNumber) * (2 * this.h);
            for (let j = 0; j <= this.vSegmentsNumber; j++) {
                const v = (j / this.vSegmentsNumber) * vMax;

                const radius = (((Math.abs(z) - this.h) ** 2) / (2 * this.p));
                const x = radius * Math.cos(v);
                const y = radius * Math.sin(v);

                positions.push(x, y, z);

                // Текстурные координаты
                uvs.push(i / this.uSegmentsNumber, j / this.vSegmentsNumber);
            }
        }

        // Генерация индексов
        for (let u = 0; u < this.uSegmentsNumber; u++) {
            for (let v = 0; v < this.vSegmentsNumber; v++) {
                const topLeft = u * (this.vSegmentsNumber + 1) + v;
                const topRight = topLeft + 1;
                const bottomLeft = (u + 1) * (this.vSegmentsNumber + 1) + v;
                const bottomRight = bottomLeft + 1;

                indices.push(topLeft, bottomLeft, topRight);
                indices.push(topRight, bottomLeft, bottomRight);
            }
        }

        // Создаем BufferAttribute для позиций и индексов
        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        this.geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        this.geometry.setIndex(indices);

        // Автоматически считаем нормали (Three.js умеет)
        this.geometry.computeVertexNormals();
    }

    // Создаем меш с материалом
    createMesh() {
        const material = new THREE.MeshStandardMaterial({
            color: 0x049ef4,
            metalness: 0.5,
            roughness: 0.2,
            side: THREE.DoubleSide,
        });

        this.mesh = new THREE.Mesh(this.geometry, material);
        return this.mesh;
    }
}
