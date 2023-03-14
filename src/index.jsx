
import './style.css'
import {vertexPosition, GetCubeSelectionColor, GetCubeIdMap,vertexIndexes,wireframeIndexes,vertexNormals,voxels, faceIndexes} from './object.js'

import { webgl } from './bin/gl-builder'
import { useCamera } from './bin/camera'
import { step } from './bin/utils'

const canvas = ref()

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
    </div>
</div>

canvas.width = 800
canvas.height = 800

main.$parent(document.body)


async function process(){
    var vertCode = await fetch("./shader.vert").then(res=>res.text())
    var fragCode = await fetch("./shader.frag").then(res=>res.text())


    var [gl, builder] = webgl(canvas.__element,vertCode, fragCode)

    builder.antialias = false


    builder.attribute_matrix_3_float.normal = vertexNormals
    builder.attribute_matrix_3_float.position = vertexPosition;
    builder.face = vertexIndexes
    builder.uniform_4_float.color_overlay = [0.0,0.0,0.0,1.0]


    const  cube_id_map = GetCubeIdMap()

    const {update, mouse} = useCamera(canvas, builder, gl)

    function clear()
    {
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.CULL_FACE);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
    }

    step(() => {

        update()

        var pixel = null
        builder.buffer(()=>{
            gl.clearColor(0, 0, 0, 0);
            builder.attribute_matrix_4_float.color = cube_id_map;
            builder.uniform_float.is_picking_step = 1
            clear()
            builder.drawSolid()
            pixel = builder.getPixel(mouse.x, mouse.y)
        })

        
        builder.attribute_matrix_4_float.color = GetCubeSelectionColor(pixel);
        builder.uniform_float.is_picking_step = 0
        gl.clearColor(0.5, 0.5, 0.5, 0.9);

        gl.enable(gl.POLYGON_OFFSET_FILL);
        gl.polygonOffset(1.0, 1.0);
        clear()

        for(const index in voxels)
        {
            builder.uniform_3_float.transform = voxels[index].map(x=>x*2)
            builder.drawSolid(faceIndexes[index])
        }
        gl.disable(gl.POLYGON_OFFSET_FILL);

        builder.uniform_float.enable_color_overlay = 1

        for(const index in voxels)
        {
            builder.uniform_3_float.transform = voxels[index].map(x=>x*2)
            builder.drawLines(wireframeIndexes)
        }

        
        builder.uniform_float.enable_color_overlay = 0
    })
}

process()
