
import './style.css'

import "@fortawesome/fontawesome-free/css/all.css"

import { Voxel,vertexPosition, vertexNormals,wireframeIndexes } from './object.js'

import { webgl } from './bin/gl-builder'
import { useCamera } from './bin/camera'
import { step } from './bin/utils'
import { ToolSelector } from './components/tool-selection/tool-selection'
import { ToggleButton } from './components/toggle-button/toggle-button'
import { ActionButton } from './components/action-button/action-button'
import ColorPicker from './components/color-selection/color-selection'




var subdivide = null
var save = null
var load = null
var reset_pan = null
var reset_rotation = null
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

const modes = [
    {
        name: "Sculpt"
    },
    {
        name: "Paint"
    },
]
var selected_tool = "Point"
var selected_mode = "Sculpt"
var contiguous = true
var wireframe = true

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ]: null;
  }
function color2array(color)
{
    color = hexToRgb(color)
    return [color[0]/255,color[1]/255,color[2]/255]
}
var foreground = [1,0,0]
var background = [1,1,1]

function updateColor(fg,bg)
{
    foreground = [fg.r / 255,fg.g / 255,fg.b / 255,fg.a / 255]
    background = [bg.r / 255,bg.g / 255,bg.b / 255,bg.a / 255]
}
var set = null

function SetColor(fg,bg)
{
    var so = null
    if(fg != null)
    {
        so = {
            r: fg[0]*255,
            g: fg[1]*255,
            b: fg[2]*255,
            a: 255
        }
    }
    var bo = null
    if(bg != null)
    {
        bo = {
            r: bg[0]*255,
            g: bg[1]*255,
            b: bg[2]*255,
            a: 255
        }
    }
    set(so,bo)
}
const canvas = ref()
const fps = ref()
const main = 
<div class="main">
    <div class="info">
        <p>
            <h3>
                Mode
            </h3>
            {ToolSelector(modes, x => selected_mode = x,"Sculpt")}
        </p>
        <p>
            <h3>
                Color
            </h3>
            <ColorPicker get={(fg,bg)=>updateColor(fg,bg)} set={fn=>set=fn}></ColorPicker>
        </p>
    </div>
    {/* <div class="tip-box">
        <h2>
            Tips:
        </h2>
        <p>
            <h3> Camera: </h3>
            <p>
                ● Left click and drag to rotate
            </p>
            <p>
                ● middle click and drag to pan
            </p>
            <p>
                ● Scroll to zoom
            </p>
        </p>
        <p>
            <h3> Object:</h3>
            <p>
                ● Left click to add a voxels from the highlighted faces
            </p>
            <p>
                ● Right click to remove a voxel from the highlighted faces
            </p>
                
        </p>
    </div> */}
    <canvas ref={canvas}></canvas>
    <div class="info">
        <p>
            FPS: <span ref={fps}></span>
        </p>
        <p>
            <h3>
                Tool
            </h3>
            {ToolSelector(tools, x => selected_tool = x,"Point")}
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
            {ActionButton("Reset pan",()=>reset_pan())}
            {ActionButton("Reset rotation",()=>reset_rotation())}
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
        var data = JSON.stringify({
            voxels:voxel.voxels,
            color:voxel.color
        })
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
                const {voxels, color} = JSON.parse(contents)


                voxel.voxels = voxels
                voxel.color = color

                voxel.init()

                var [min, max] = voxel.boundary

                var x = min[0] - max[0]
                var y = min[1] - max[1]
                var z = min[2] - max[2]

                var max = Math.abs(Math.max(x,y,z))

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

    var click_position = null
    canvas.$on("mousedown",e=>{
        click_position = [e.offsetX,e.offsetY]
        if(e.button == 1)
        {
            e.preventDefault()
        }
    })

    canvas.$on("contextmenu",e=>{
        e.preventDefault()
        return false
    })
    canvas.$on("mouseup",e=>{
        // if radius is less than 5 pixels
        if(!click_position || Math.abs(e.offsetX - click_position[0]) > 3 || Math.abs(e.offsetY - click_position[1]) > 3) return
        // left button

        if(!selection) return

        if(selected_mode == "Sculpt")
        {

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
        else
        {
            if(e.button == 0)
            {
                for(var j = 0; j < selection.color.length; j++)
                for(var i = 0; i < 3; i++)
                {
                    selection.color[j][i] = (selection.color[j][i] * (1 - foreground[3]))+(foreground[i]*foreground[3] )
                }
            }
            else if(e.button == 2)
            {
                for(var j = 0; j < selection.color.length; j++)
                for(var i = 0; i < 3; i++)
                {
                    selection.color[j][i] = (selection.color[j][i] * (1 - background[3]))+(background[i]*background[3] )
                }
            }
            if(e.button == 1)
            {
                foreground = [...selection.mouse_color]
                SetColor(foreground)
            }
        }
    })



    const {update, mouse,zoom,resetPan,resetRotation} = useCamera(canvas, builder, gl,()=>selection)

    reset_pan = resetPan
    reset_rotation = resetRotation

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
