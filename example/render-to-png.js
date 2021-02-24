const express = require('express')
const cors = require('cors')
const THREE = require('three')
const PNG = require('pngjs')
const fs = require('fs')
const SoftwareRenderer = require("../").SoftwareRenderer;

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

app.listen(port, () => {
  console.log('Listening on port: ' + port)
})

app.get('/', (req, res) => {
  console.log('API call recieved!')

  // Build scene with cube
  const width = 1024;
  const height = 768;
  const camera = new THREE.PerspectiveCamera(75, width / height, 1, 10000);
  camera.position.z = 500;
  const scene = new THREE.Scene();
  const geometry = new THREE.BoxGeometry(200, 200, 200);
  const material = new THREE.MeshBasicMaterial({color: 0xff0000});
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  
  // Rotate the cube a bit
  mesh.rotation.x += 0.5;
  mesh.rotation.y += 0.6;
  
  // Render into pixels-array (RGBA)
  const renderer = new SoftwareRenderer();
  renderer.setSize(width, height);
  var imagedata = renderer.render(scene, camera);
  
  // Create a PNG from the pixels array (RGBA)
  const png = new PNG({
    width: width,
    height: height,
    filterType: -1
  });
  
  for(var i=0;i<imagedata.data.length;i++) {
    png.data[i] = imagedata.data[i];
  }
  console.log(png.data);
  if (!fs.existsSync("temp")) {
    fs.mkdirSync("temp");
  }
  png.pack().pipe(fs.createWriteStream("temp/example.png"));
  res.send({ msg: 'Success!', data: imagedata })
})
