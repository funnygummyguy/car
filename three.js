<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Driveable Car Three.js</title>
  <style>
    body { margin: 0; overflow: hidden; background: #222; }
    canvas { display: block; }
  </style>
</head>
<body>
  <!-- Three.js CDN -->
  <script src="https://cdn.jsdelivr.net/npm/three@0.156.0/build/three.min.js"></script>
  <!-- OrbitControls -->
  <script src="https://cdn.jsdelivr.net/npm/three@0.156.0/examples/js/controls/OrbitControls.js"></script>
  <script>
    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x444444);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Orbit Controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 20, 10);
    scene.add(directionalLight);

    // Ground
    const groundGeo = new THREE.PlaneGeometry(100, 100);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI/2;
    scene.add(ground);

    // Simple car (box + wheels)
    const car = new THREE.Group();

    const bodyGeo = new THREE.BoxGeometry(2, 0.8, 4);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.5;
    car.add(body);

    const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.5, 16);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111 });

    function createWheel(x, z){
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(x, 0.2, z);
      return wheel;
    }

    car.add(createWheel(-0.9, 1.5)); // front left
    car.add(createWheel(0.9, 1.5));  // front right
    car.add(createWheel(-0.9, -1.5));// back left
    car.add(createWheel(0.9, -1.5)); // back right

    scene.add(car);

    // Car movement variables
    let speed = 0;
    let maxSpeed = 0.2;
    let acceleration = 0.01;
    let deceleration = 0.02;
    let turnSpeed = 0.03;
    const keys = {};

    // Keyboard events
    document.addEventListener('keydown', (e) => keys[e.key.toLowerCase()] = true);
    document.addEventListener('keyup', (e) => keys[e.key.toLowerCase()] = false);

    function updateCar() {
      // Forward/backward
      if(keys['w']) speed = Math.min(speed + acceleration, maxSpeed);
      else if(keys['s']) speed = Math.max(speed - acceleration, -maxSpeed);
      else {
        if(speed > 0) speed = Math.max(speed - deceleration, 0);
        if(speed < 0) speed = Math.min(speed + deceleration, 0);
      }

      // Turn
      if(keys['a']) car.rotation.y += turnSpeed * (speed !== 0 ? Math.sign(speed) : 1);
      if(keys['d']) car.rotation.y -= turnSpeed * (speed !== 0 ? Math.sign(speed) : 1);

      // Move car forward
      car.position.x += Math.sin(car.rotation.y) * speed;
      car.position.z += Math.cos(car.rotation.y) * speed;
    }

    // Animate
    function animate() {
      requestAnimationFrame(animate);
      updateCar();
      controls.update();
      renderer.render(scene, camera);
    }

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  </script>
</body>
</html>
