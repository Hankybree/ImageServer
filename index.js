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

  const width = 1024;
  const height = 768;

  const scene = new THREE.Scene()
  
  const camera = setupCamera(width, height)
  
  // TEMP GONNA COME FROM CLIENT
  const colors = getColorArray()
  // END TEMP
  const mesh = meshToThreejs(req.body.meshString, colors)

  scene.add(mesh);

  setRotation(mesh)
  setPosition(mesh)
  
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

function meshToThreejs(base64, colors) {
  const mesh = rhino.DracoCompression.decompressBase64String(base64)
  let loader = new THREE.BufferGeometryLoader()
  var geometry = loader.parse(mesh.toThreejsJSON())

  const colorsAttr = geometry.attributes.position.clone();
  colorsAttr.array = colors
  console.log(colorsAttr)
  
  geometry.setAttribute('color', colorsAttr);

  console.log(geometry)

  const material = new THREE.MeshBasicMaterial({
    vertexColors: THREE.VertexColors
  });

  console.log(material)
  return new THREE.Mesh(geometry, material)
}

function setupCamera(width, height) {
  console.log('Camera')
  const fov = 75
  const aspect = width / height
  const near = 0.1
  const far = 1000

  return new THREE.PerspectiveCamera(fov, aspect, near, far)
}

function setRotation(mesh) {

  mesh.rotation.x = -1
  mesh.rotation.y = 0
  mesh.rotation.z = 0.5;
}

function setPosition(mesh) {
  mesh.position.z -= 50
  mesh.position.y -= 10
}

function getColorArray () {
  var color_object = {
    "0": 0.5098039507865906,
    "1": 0.33725491166114807,
    "2": 0.3960784375667572,
    "3": 0.20392157137393951,
    "4": 0.8392156958580017,
    "5": 0.0941176488995552,
    "6": 0.5098039507865906,
    "7": 0.33725491166114807,
    "8": 0.3960784375667572,
    "9": 0.20392157137393951,
    "10": 0.8392156958580017,
    "11": 0.0941176488995552,
    "12": 0.5098039507865906,
    "13": 0.33725491166114807,
    "14": 0.3960784375667572,
    "15": 0.20392157137393951,
    "16": 0.8392156958580017,
    "17": 0.0941176488995552,
    "18": 0.5098039507865906,
    "19": 0.33725491166114807,
    "20": 0.3960784375667572,
    "21": 0.20392157137393951,
    "22": 0.8392156958580017,
    "23": 0.0941176488995552,
    "24": 0.5098039507865906,
    "25": 0.33725491166114807,
    "26": 0.3960784375667572,
    "27": 0.20392157137393951,
    "28": 0.8392156958580017,
    "29": 0.0941176488995552,
    "30": 0.5098039507865906,
    "31": 0.33725491166114807,
    "32": 0.3960784375667572,
    "33": 0.20392157137393951,
    "34": 0.8392156958580017,
    "35": 0.0941176488995552,
    "36": 0.5098039507865906,
    "37": 0.33725491166114807,
    "38": 0.3960784375667572,
    "39": 0.20392157137393951,
    "40": 0.8392156958580017,
    "41": 0.0941176488995552,
    "42": 0.5098039507865906,
    "43": 0.33725491166114807,
    "44": 0.3960784375667572,
    "45": 0.20392157137393951,
    "46": 0.8392156958580017,
    "47": 0.0941176488995552,
    "48": 0.5098039507865906,
    "49": 0.33725491166114807,
    "50": 0.3960784375667572,
    "51": 0.20392157137393951,
    "52": 0.8392156958580017,
    "53": 0.0941176488995552,
    "54": 0.5098039507865906,
    "55": 0.33725491166114807,
    "56": 0.3960784375667572,
    "57": 0.20392157137393951,
    "58": 0.8392156958580017,
    "59": 0.0941176488995552,
    "60": 0.5098039507865906,
    "61": 0.33725491166114807,
    "62": 0.3960784375667572,
    "63": 0.20392157137393951,
    "64": 0.8392156958580017,
    "65": 0.0941176488995552,
    "66": 0.5098039507865906,
    "67": 0.33725491166114807,
    "68": 0.3960784375667572,
    "69": 0.20392157137393951,
    "70": 0.8392156958580017,
    "71": 0.0941176488995552
  }
  
  var color_array = Object.values(color_object)
  
  return new Float32Array(color_array)
}