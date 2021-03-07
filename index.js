const SoftwareRenderer = require("./renderer/software-renderer");

const express = require('express')
const cors = require('cors')
const THREE = require('three')
const PNG = require('pngjs').PNG
const fs = require('fs')
const rhino3dm = require('rhino3dm')

const app = express()
const port = 3001

app.use(express.json())
app.use(cors())

app.listen(port, () => {
  console.log('Listening on port: ' + port)
})

loadRhino3dm()

app.post('/', (req, res) => {
  console.log('API call recieved!')

  // Build scene with cube
  const width = 1024;
  const height = 768;
  const camera = new THREE.PerspectiveCamera(75, width / height, 1, 10000);
  camera.position.z = 500;
  const scene = new THREE.Scene();

  //const geometry = new THREE.BoxGeometry(200, 200, 200);
  //const material = new THREE.MeshBasicMaterial({color: 0xff0000});
  //const mesh = new THREE.Mesh(geometry, material);
  
  const mesh = meshToThreejs(req.body.meshString)

  scene.add(mesh);
  
  // Rotate the cube a bit
  //mesh.rotation.x += 0.5;
  //mesh.rotation.y += 0.6;
  mesh.position.z += 400
  
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

  if (!fs.existsSync("temp")) {
    fs.mkdirSync("temp");
  }

  // png.pack();
  // var chunks = [];
  // var imgUrl
  // png.on('data', function(chunk) {
  //   chunks.push(chunk);
  //   console.log('chunk:', chunk.length);
  // });
  // png.on('end', function() {
  //   var result = Buffer.concat(chunks);
  //   console.log('final result:', result.length);
  //   imgUrl = 'data:image/png;base64,' + result.toString('base64')
  //   res.send({ msg: 'Success!', imgUrl })
  // });

  png.pack().pipe(fs.createWriteStream("temp/example3.png"));

  res.send({ msg: 'Success!' })
  
})

var rhino

function loadRhino3dm() {
  console.log("Loading rhino..")
  
  if (rhino){
      console.log("Already loaded")
  }
  rhino3dm().then(m => {
      rhino = m
      console.log("Rhino loaded.. ")
  })
}

function meshToThreejs (base64) {
  const mesh = rhino.DracoCompression.decompressBase64String(base64)
  let loader = new THREE.BufferGeometryLoader()
  var geometry = loader.parse(mesh.toThreejsJSON())
  //console.log(geometry)
  const material = new THREE.MeshBasicMaterial({color: 0xff0000});
  return new THREE.Mesh(geometry, material)
}
