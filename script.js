///<reference path='./vendor/babylon.d.ts'/>

import rhino3dm from "https://cdn.jsdelivr.net/npm/rhino3dm@0.15.0-beta/rhino3dm.module.js";

const file = "sphere.3dm";
// get a canvas
const canvas = document.getElementById("canvas");
// create BabylonJs engine
const engine = new BABYLON.Engine(canvas, true);

// wait until the rhino3dm library is loaded, then load the 3dm file
rhino3dm().then(async (m) => {
  console.log("Loaded rhino3dm.");
  let rhino = m;

  let res = await fetch(file);
  let buffer = await res.arrayBuffer();
  let arr = new Uint8Array(buffer);
  let doc = rhino.File3dm.fromByteArray(arr);

  const scene = createScene();

  let objects = doc.objects();
  for (let i = 0; i < objects.count; i++) {
    let mesh = objects.get(i).geometry();
    if (mesh instanceof rhino.Mesh) {
      // convert all meshes in 3dm model into threejs objects
      var json = mesh.toThreejsJSON();
      
      
      var customMesh = new BABYLON.Mesh("custom", scene);
      var positions = [ -5, 2, -3, -7, -2, -3, -3, -2, -3, 5, 2, 3, 7, -2, 3, 3, -2, 3,];
      var indices = [0, 1, 2, 3, 4, 5];

      var vertexData = new BABYLON.VertexData();
      //var indices = json.data.attributes.position.index;
      //var positions = json.data.attributes.position.array;
      //var normals = json.data.attributes.normal.array
      //var uvs = json.data.attributes.uv.array;

      vertexData.positions = json.data.attributes.position.array;
      vertexData.indices = json.data.index.array;
      //vertexData.normals = normals;
      //vertexData.uvs = uvs;


      vertexData.applyToMesh(customMesh);
      
      
      //var babylonObj = toBabylonJS("sample",scene,json);
      //var babylonMesh = BABYLON.Geometry.CreateGeometryForMesh(json,scene)
      console.log(json.data);
    }
  }
  engine.runRenderLoop(() => {
    scene.render();
  });
});

//Create Scene Function
function createScene() {
  // create scene
  const scene = new BABYLON.Scene(engine);
  // color
  scene.clearColor = new BABYLON.Color3.White();
  // create camera
  const camera = new BABYLON.FreeCamera(
    "camera1",
    new BABYLON.Vector3(0,0,-10),
    scene
  );
  camera.attachControl(canvas, true);
  // create light
  const ligth = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  //var box = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, scene);
  return scene;
}

//create scene

var toBabylonJS = (name, scene, json) => {
  var obj = new BABYLON.Mesh(name, scene);

  var indices = json.data.attributes.position.index;
  var positions = json.data.attributes.position.array;
  var normals = json.data.attributes.normal.array;
  var uvs = json.data.attributes.uv.array;

  obj.setVerticesData(positions, BABYLON.VertexBuffer.PositionKind);
  obj.setVerticesData(normals, BABYLON.VertexBuffer.NormalKind);
  obj.setVerticesData(uvs, BABYLON.VertexBuffer.UVKind);
  obj.setIndices(indices);

  return obj;
};
