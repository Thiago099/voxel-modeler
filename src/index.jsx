
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




async function process(){
    var vertCode = await fetch("./shader.vert").then(res=>res.text())
    var fragCode = await fetch("./shader.frag").then(res=>res.text())


    var [gl, builder] = webgl(canvas.__element,vertCode, fragCode)

    builder.antialias = false


    builder.attribute_matrix_3_float.normal = voxel.geometry_normals;
    builder.attribute_matrix_3_float.position = voxel.geometry_vertexes;
    builder.uniform_4_float.color_overlay = [0.0,0.0,0.0,1.0]

    
    var selection = null

    var old = null
    canvas.$on("mousedown",e=>{
        if(e.button == 1)
        {
            e.preventDefault()
        }
        old = selection
    })

    canvas.$on("contextmenu",e=>{
        e.preventDefault()
        return false
    })

    var keys = new Set()
    document.addEventListener("keydown",e=>{
        keys.add(e.key)
    })
    document.addEventListener("keyup",e=>{
        keys.delete(e.key)
    })

    canvas.$on("mouseup",e=>{
        if(selection != null && old != null && selection.index == old.index)
        {
            // left button
            if(e.button == 0)
            {
                console.log(keys)
                if(keys.has("Shift"))
                {
                    voxel.selection[selection.index] = !voxel.selection[selection.index]
                }
                else
                {
                    voxel.add(selection.voxel.map((x,i)=>x+selection.direction[i]),voxel.selection[selection.index])
                    builder.attribute_matrix_3_float.normal = voxel.geometry_normals;
                    builder.attribute_matrix_3_float.position = voxel.geometry_vertexes;
                }
            }
            else if(e.button == 2)
            {
                voxel.remove(selection.index)
                builder.attribute_matrix_3_float.normal = voxel.geometry_normals;
                builder.attribute_matrix_3_float.position = voxel.geometry_vertexes;
            }
        }
        else
        {
            if(keys.has("Shift"))
            {
                for(var index in voxel.selection)
                {
                    voxel.selection[index]= false
                }
            }
        }
    })



    const {update, mouse} = useCamera(canvas, builder, gl,()=>selection)

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
            builder.uniform_float.disable_lighting = 1
            clear()
            builder.attribute_matrix_4_float.color = voxel.pick_map;
            builder.drawSolid(voxel.geometry_indexes)
            pixel = builder.getPixel(mouse.x, mouse.y)
        })

        

        builder.uniform_float.disable_lighting = 0
        gl.clearColor(0.5, 0.5, 0.5, 0.9);

        gl.enable(gl.POLYGON_OFFSET_FILL);
        gl.polygonOffset(1.0, 1.0);
        clear()


        selection = null


        builder.attribute_matrix_4_float.color = voxel.get_highlight(pixel,data=>selection = data)
        builder.drawSolid(voxel.geometry_indexes)
        gl.disable(gl.POLYGON_OFFSET_FILL);

        builder.uniform_float.enable_color_overlay = 1
        builder.drawLines(voxel.geometry_edge_index)
        builder.uniform_float.enable_color_overlay = 0
        
    })
}

process()
