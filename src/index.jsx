
import './style.css'
import { Voxel,vertexPosition, vertexNormals,wireframeIndexes } from './object.js'

import { webgl } from './bin/gl-builder'
import { useCamera } from './bin/camera'
import { step } from './bin/utils'
import { ToolSelector } from './components/tool-selection/tool-selection'
import { ToggleButton } from './components/toggle-button/toggle-button'
import { ActionButton } from './components/action-button/action-button'


var subdivide = null
var save = null
var load = null
const tools = [
    {
        name: "Point"
    },
    {
        name: "Plane"
    },
    {
        name: "Horizontal line"
    },
    {
        name: "Vertical line"
    },
]
var selected_tool = "Point"
var contiguous = false
var wireframe = true
const canvas = ref()
const fps = ref()
const main = 
<div class="main">
    <canvas ref={canvas}></canvas>
    <div class="info">
        <p>
            FPS: <span ref={fps}></span>
        </p>
        <p>
            <h3>
                Tool
            </h3>
            {ToolSelector(tools, x => selected_tool = x)}
        </p>
        <p>
            <h3>
                Tool options
            </h3>
            {ToggleButton("Contiguous",x=>contiguous = x)}
        </p>
        <p>
            <h3>
                View
            </h3>
            {ToggleButton("Wireframe",x=>wireframe = x)}
        </p>
        <p>
            <h3>
                Actions
            </h3>
            {ActionButton("Subdivide",()=>subdivide())}
        </p>
        <p>
            <h3>
                Persistence
            </h3>
            {ActionButton("Save",()=>save())}
            {ActionButton("Load",()=>load())}

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



    builder.uniform_4_float.color_overlay = [0.0,0.0,0.0,1.0]


    save = () => {
        var data = JSON.stringify(voxel.voxels)
        var blob = new Blob([data], {type: "application/json"});
        var url  = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.download    = "voxel.json";
        a.href        = url;
        a.textContent = "Download";
        a.click();
        a.remove()
    }
    load = async () => {
        var input = document.createElement('input');
        input.type = 'file';
        input.onchange = e => {
            var file = e.target.files[0];
            var reader = new FileReader();
            reader.onload = function(e) {
                var contents = e.target.result;
                voxel.voxels = JSON.parse(contents)
                voxel.init()

                var [min, max] = voxel.boundary

                var x = min[0] - max[0]
                var y = min[1] - max[1]
                var z = min[2] - max[2]

                var max = Math.abs(Math.max(x,y,z))

                console.log(max)
                zoom(max)

                builder.attribute_matrix_3_float.normal = voxel.geometry_normals;
                builder.attribute_matrix_3_float.position = voxel.geometry_vertexes;
            }
            reader.readAsText(file);
        }
        input.click();
        input.remove()
    }


    

    
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
    canvas.$on("mouseup",e=>{
        if(selection != null && old != null && selection.index == old.index)
        {
            // left button
            if(e.button == 0)
            {
                voxel.add(...selection.voxel.map(u=>u.map((x,i)=>x+selection.direction[i])))
                builder.attribute_matrix_3_float.normal = voxel.geometry_normals;
                builder.attribute_matrix_3_float.position = voxel.geometry_vertexes;
            }
            else if(e.button == 2)
            {
                voxel.remove(...selection.voxel)
                builder.attribute_matrix_3_float.normal = voxel.geometry_normals;
                builder.attribute_matrix_3_float.position = voxel.geometry_vertexes;
            }
        }
    })



    const {update, mouse,zoom} = useCamera(canvas, builder, gl,()=>selection)

    subdivide = () => {
        voxel.subdivide()
        builder.attribute_matrix_3_float.normal = voxel.geometry_normals;
        builder.attribute_matrix_3_float.position = voxel.geometry_vertexes;
        zoom(2)
    }

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

        builder.attribute_matrix_3_float.normal = voxel.geometry_normals;
        builder.attribute_matrix_3_float.position = voxel.geometry_vertexes;

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


        if(selected_tool == "Point")
        {
            builder.attribute_matrix_4_float.color = voxel.get_highlight(pixel,data=>selection = data)
        }
        else
        {
            builder.attribute_matrix_4_float.color = voxel.highlight_plane(pixel,data=>selection = data,selected_tool,contiguous)
        }
        builder.drawSolid(voxel.geometry_indexes)
        gl.disable(gl.POLYGON_OFFSET_FILL);

        if(wireframe)
        {
            builder.uniform_float.enable_color_overlay = 1
            builder.drawLines(voxel.geometry_edge_index)
            builder.uniform_float.enable_color_overlay = 0
        }
        
    })
}

process()
