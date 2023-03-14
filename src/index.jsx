
import './style.css'
import { Voxel,vertexPosition, vertexNormals,wireframeIndexes } from './object.js'

import { webgl } from './bin/gl-builder'
import { useCamera } from './bin/camera'
import { step } from './bin/utils'

const canvas = ref()
const fps = ref()
const main = 
<div class="main">
    <canvas ref={canvas}></canvas>
    <div class="info">
        <p>
            Click and drag to rotate
        </p>
        <p>
            Mouse wheel to zoom
        </p>
        <p>
            Hover the mouse over the cube to highlight its faces
        </p>
        <p>
            FPS: <span ref={fps}></span>
        </p>
    </div>
</div>

canvas.width = 800
canvas.height = 800

main.$parent(document.body)

var voxel = new Voxel()
voxel.init()


var selection = null
var position = {x:0,y:0}
canvas.$on("mousedown",e=>{
    position.x = e.clientX
    position.y = e.clientY
})
canvas.$on("mouseup",e=>{
    var current = {x:e.clientX,y:e.clientY}
    if(selection != null && current.x == position.x && current.y == position.y)
    {
        console.log(selection)
    }
})


async function process(){
    var vertCode = await fetch("./shader.vert").then(res=>res.text())
    var fragCode = await fetch("./shader.frag").then(res=>res.text())


    var [gl, builder] = webgl(canvas.__element,vertCode, fragCode)

    builder.antialias = false


    builder.attribute_matrix_3_float.normal = vertexNormals
    builder.attribute_matrix_3_float.position = vertexPosition;
    builder.uniform_4_float.color_overlay = [0.0,0.0,0.0,1.0]



    const {update, mouse} = useCamera(canvas, builder, gl)

    function clear()
    {
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.CULL_FACE);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
    }

    step((a) => {
        fps.$html(a)
        update()

        var pixel = null
        builder.buffer(()=>{
            gl.clearColor(0, 0, 0, 0);
            builder.uniform_float.is_picking_step = 1
            
            clear()
            for(const index in voxel.positions)
            {
                builder.attribute_matrix_4_float.color = voxel.pick_map[index].colors;
                builder.uniform_3_float.transform = voxel.positions[index]
                builder.drawSolid(voxel.face_indices[index])
            }
            pixel = builder.getPixel(mouse.x, mouse.y)
        })

        

        builder.uniform_float.is_picking_step = 0
        gl.clearColor(0.5, 0.5, 0.5, 0.9);

        gl.enable(gl.POLYGON_OFFSET_FILL);
        gl.polygonOffset(1.0, 1.0);
        clear()


        selection = null

        function setSelection(data)
        {
            selection = data
        }

        for(const index in voxel.positions)
        {
            builder.attribute_matrix_4_float.color = voxel.get_highlight(pixel,index,setSelection)
            builder.uniform_3_float.transform = voxel.positions[index]
            builder.drawSolid(voxel.face_indices[index])
        }
        gl.disable(gl.POLYGON_OFFSET_FILL);

        builder.uniform_float.enable_color_overlay = 1

        for(const index in voxel.positions)
        {
            builder.uniform_3_float.transform = voxel.positions[index]
            builder.drawLines(wireframeIndexes)
        }

        
        builder.uniform_float.enable_color_overlay = 0
    })
}

process()
