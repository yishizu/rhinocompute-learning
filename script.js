import rhino3dm from 'https://cdn.jsdelivr.net/npm/rhino3dm@0.15.0-beta/rhino3dm.module.js'

const file = 'hello_mesh.3dm'
// wait until the rhino3dm library is loaded, then load the 3dm file
rhino3dm().then(async m => {
    console.log('Loaded rhino3dm.')
    let rhino = m

    let res = await fetch(file)
    let buffer = await res.arrayBuffer()
    let arr = new Uint8Array(buffer)
    let doc = rhino.File3dm.fromByteArray(arr)

    
})