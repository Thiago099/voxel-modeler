
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
import { Save, Load, SaveText, SaveImage } from './bin/persistence'
import { voxel2mesh } from './bin/voxel2mesh'
import modal from  './components/modal/modal'
import {build_obj_file,build_texture,build_hd_texture} from './bin/waveformat'


var subdivide = null
var save = null
var load = null
var _export = null
var reset_pan = null
var reset_rotation = null
var undo_fn = null
var redo_fn = null
var last = foreground
const tools = [
    {
        name: "Pen"
    },
    {
        name: "Line"
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
var selected_tool = "Pen"
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

function updateColor(changed,fg,bg)
{
    foreground = [fg.r / 255,fg.g / 255,fg.b / 255,fg.a / 255]
    background = [bg.r / 255,bg.g / 255,bg.b / 255,bg.a / 255]

    if(changed == "foreground")
    {
        last = foreground
    }
    else
    {
        last = background
    }
}
var set = null
var fill_all_with_color = null

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
const controls = state({radius:1,feather:0})
const canvas = ref()
const fps = ref()

var circle = true
const main = 
<div class="main">
    <div class="info">
        <p>
            <h3>
                Mode
            </h3>
            {ToolSelector(modes, x => {selected_mode = x,last=foreground},"Sculpt")}
        </p>
        <p>

            <h3>
                Color
            </h3>
            <ColorPicker get={(changed,fg,bg)=>updateColor(changed, fg,bg)} set={fn=>set=fn}></ColorPicker>
            {ActionButton("Fill all",()=>fill_all_with_color())}

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
    <canvas ref={canvas} ></canvas>
    <div class="info">
        <p>
            FPS: <span ref={fps}></span>
        </p>
        <p>
            <h3>
                Tool
            </h3>
            {ToolSelector(tools, x => selected_tool = x,"Pen")}
        </p>
        <p>
            <h3>
                Tool options
            </h3>
            <label>Radius</label>
            <div style="width:300px">
                <input type="number" model={controls.radius} class="input" />
            </div>
            <label>Feather</label>
            <div style="width:300px">
                <input type="number" model={controls.feather} min="0" max="1" step="0.1" class="input" />
            </div>
            {ToggleButton("Contiguous",x=>contiguous = x)}
            {ToggleButton("Circle",x=>circle = x)}
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
            {ActionButton("Undo",()=>undo_fn())}
            {ActionButton("Redo",()=>redo_fn())}

        </p>
        <p>
            <h3>
                Persistence
            </h3>
            {ActionButton("Save project",()=>save())}
            {ActionButton("Load project",()=>load())}
            {ActionButton("Export obj",()=>_export())}
        </p>
    </div>
</div>

canvas.width = 800
canvas.height = 800

main.$parent(document.body)

var voxel = new Voxel()
voxel.init()


_export = () => {

    var save_obj_preferences = localStorage.getItem("save_obj_preferences")



    var texture = true
    var geometry = true
    var filename = "object"
    var square_size = 1

    if(save_obj_preferences != null)
    {
        save_obj_preferences = JSON.parse(save_obj_preferences)
        texture = save_obj_preferences.texture
        geometry = save_obj_preferences.geometry
        filename = save_obj_preferences.filename
        square_size = save_obj_preferences.square_size
    }

    var export_button = ref()
    var modal_content = 
    <div class="prompt col">
        <div class="row margin">
            {ToggleButton("Geometry",x=>geometry = x,geometry)}
            {ToggleButton("Texture",x=>texture = x,texture)}
        </div>
        <div class="row margin">
            <div>
                <label>File name</label>
                <input type="text" class="input" model={filename}></input>
            </div>
            <div>
                <label>Texture voxel size</label>
                <input type="number" class="input" model={square_size}></input>
            </div>
        </div>
        <button class="footer-button button" ref={export_button}>Export</button>
    </div>

    var {close} = modal(modal_content)

    export_button.$on("click",() => {
        var data = voxel2mesh(voxel)
        if(texture)
        {
            if(square_size <= 1)
            {
                var img = build_texture(data)
                SaveImage(filename+".png",img)
            }
            else
            {
                var img = build_hd_texture(data,square_size)
                SaveImage(filename+".png",img)
            }
        }
        if(geometry)
        {
            var obj = build_obj_file(data)
            SaveText(filename+".obj",obj)
        }
        var save_obj_preferences = {
            filename: filename,
            geometry: geometry,
            texture: texture,
            square_size: square_size
        }
        localStorage.setItem("save_obj_preferences",JSON.stringify(save_obj_preferences))
        close()
    })
}

    

function get_mouse(e)
{
    const rect = canvas.__element.getBoundingClientRect();
    var x = (e.clientX - rect.left) * canvas.width / canvas.clientWidth;
    var y = canvas.height - (e.clientY - rect.top) * canvas.height / canvas.clientHeight - 1;
    return [x,y]
}

function flood(x1, y1, x2, y2,theta) {
    var rx = x2;
    var ry = y2;

    var px, py,minx,miny,maxx,maxy;


    if (x1 == x2) {
      px = 1;
    } else {
      px = 1 / Math.abs(x2 - x1) ;
    }
    if (y1 == y2) {
      py = 1;
    } else {
      py = 1 / Math.abs(y2 - y1) ;
    }
    var p = Math.min(px, py) * theta;
    var s = 0;
    var result = [];
    var cx = minx;
    var cy = miny;
    while (s <= 1) {
      cx = x1 * (1 - s) + x2 * s;
      cy = y1 * (1 - s) + y2 * s;
      result.push([cx, cy]);
      s += p;
    }
    return result;
  }

async function process(){
    var vertCode = await fetch("./shader.vert").then(res=>res.text())
    var fragCode = await fetch("./shader.frag").then(res=>res.text())


    var [gl, builder] = webgl(canvas.__element,vertCode, fragCode)

    builder.antialias = false



    builder.uniform_4_float.color_overlay = [0.0,0.0,0.0,1.0]


    save = () => {

        var save_obj_preferences = localStorage.getItem("save_obj_preferences")
        var filename = ""
        if(save_obj_preferences != null)
        {
            save_obj_preferences = JSON.parse(save_obj_preferences)
            filename = save_obj_preferences.filename
        }

        const export_button = ref()
        var modal_content = 
        <div class="prompt-small col">
            <div class="row margin">
                <div>
                    <label>File name</label>
                    <input type="text" class="input" model={filename}></input>
                </div>
            </div>
            <button class="footer-button button" ref={export_button}>Export</button>
        </div>
    
        var {close} = modal(modal_content)

        export_button.$on("click",() => {

            save_obj_preferences.filename = filename
            localStorage.setItem("save_obj_preferences",JSON.stringify(save_obj_preferences))
            Save(filename+".vox",{
                voxels:voxel.voxels,
                color:voxel.color
            })
            close()
        })

    }
    load = async () => {
        Load("vox",({voxels, color})=>{

            voxel.voxels = voxels
            voxel.color = color

            voxel.init()

            var [min, max] = voxel.boundary

            var x = min[0] - max[0]
            var y = min[1] - max[1]
            var z = min[2] - max[2]

            var max = Math.abs(Math.max(x,y,z))

            setZoom(-6)
            resetPan()
            resetRotation()
            zoom(Math.max(max,1))

            builder.attribute_matrix_3_float.normal = voxel.geometry_normals;
            builder.attribute_matrix_3_float.position = voxel.geometry_vertexes;
            push_history()
        })
    }


    fill_all_with_color = () => {
        // set all colors in voxel to foreground
        for(var i = 0; i < voxel.color.length; i++)
        {
            for(var j = 0; j < voxel.color[i].length; j++)
            {
                for(var k = 0; k < 3; k++)
                {
                    voxel.color[i][j][k] = voxel.color[i][j][k] * (1 - foreground[3]) + (foreground[k]*foreground[3] )
                }
            }
        }
        push_history()
    }

    
    var selection = null


    var click_position = null

    var positions =[]
    var px = 0
    var py = 0
    var drag = false


    var ctrlDown = false;
    var pointer = -1
    var history = []
    push_history()

    function push_history(division = false)
    {
        if(history.length > 30)
        {
            history = history.slice(1)
            pointer--
        }
        history = history.slice(0,pointer+1)
        history.push(JSON.parse(JSON.stringify([voxel.voxels,voxel.color,voxel.faces,division])))
        pointer = history.length-1
    }
    undo_fn = undo
    redo_fn = redo
    function undo()
    {
        if(pointer > 0)
        {
            const division = history[pointer][3]
            pointer--
            const [voxels,color,faces] = JSON.parse(JSON.stringify(history[pointer]))
            if(division)
            {
                zoom(0.5)
            }
            voxel.voxels = voxels
            voxel.color = color
            voxel.faces = faces
            voxel.init()
            voxel.build()
            builder.attribute_matrix_3_float.normal = voxel.geometry_normals;
            builder.attribute_matrix_3_float.position = voxel.geometry_vertexes;
        }
    }
    function redo()
    {
        if(pointer+1 < history.length)
        {
            pointer++
            const [voxels,color,faces,division] = history[pointer]
            if(division)
            {
                zoom(2)
            }
            voxel.voxels = voxels
            voxel.color = color
            voxel.faces = faces
            voxel.build()
            builder.attribute_matrix_3_float.normal = voxel.geometry_normals;
            builder.attribute_matrix_3_float.position = voxel.geometry_vertexes;
        }
    }
    document.addEventListener('keydown', function(event) {
        if (event.key == "Control") {
            ctrlDown = true;
        }
        // ctrl + z
        if (event.key == "z" && event.ctrlKey) {
            
            undo()
        }
            
        if(event.key == "y" && event.ctrlKey)
        {
            redo()
        }

        if(event.key == "x" && event.ctrlKey)
        {
            subdivide()
        }
            
    });
    document.addEventListener('keyup', function(event) {
        ctrlDown = false;
    });
    
    var has_ctrl = false
    
    canvas.$on("mousedown",e=>{
        has_ctrl = ctrlDown
        if(ctrlDown) return
        click_position = [e.offsetX,e.offsetY]
        if(e.button == 1)
        {
            e.preventDefault()
        }
        else if(e.button == 0 || e.button == 2 && selected_tool == "Pen")
        {
            const [x,y] = get_mouse(e)
            px = x
            py = y
            drag = true
            positions = [[x,y]]
        }

        if(selected_tool == "Line")
        {
            const [x,y] = get_mouse(e)
            px = x
            py = y
            drag = true
            positions = [[x,y]]
        }

        if(e.button == 0)
        {
            last = foreground
        }
        else if(e.button == 2)
        {
            last = background
        }
    })
    canvas.$on("mousemove",e=>{
        if(!drag) return
        
        const [x,y] = get_mouse(e)
        if(selected_tool == "Line")
        {
            positions = [[px,py],...flood(x,y,px,py,5),[x,y]]
        }
        else
        {
            positions.push(...flood(x,y,px,py,5))
            px = x
            py = y
        }
    })

    canvas.$on("contextmenu",e=>{
        e.preventDefault()
        return false
    })
    var pixel_group = []
    canvas.$on("mouseup",e=>{
        if(ctrlDown || has_ctrl) return

        pixel_group = []
        // if radius is less than 5 pixels
        // if(!click_position || Math.abs(e.offsetX - click_position[0]) > 3 || Math.abs(e.offsetY - click_position[1]) > 3) return
        // left button
        positions = []
        drag = false
        if(!selection) return

        
        if(selected_tool == "Pen" || selected_tool == "Line")
        {
            if(selected_mode == "Sculpt")
            {
    
                if(e.button == 0)
                {
                    var new_voxels = []
                    for(var item of selection)
                    {
                        new_voxels.push(...item.voxel.map(u=>u.map((x,i)=>x+item.direction[i])))
                    }
                    new_voxels = [...new Set(new_voxels.map(JSON.stringify))].map(JSON.parse)
                    voxel.add(...new_voxels)
                    builder.attribute_matrix_3_float.normal = voxel.geometry_normals;
                    builder.attribute_matrix_3_float.position = voxel.geometry_vertexes;
                }
                else if(e.button == 2)
                {
                    var new_voxels = []
                    for(var item of selection)
                    {
                        new_voxels.push(...item.voxel)
                    }
                    voxel.remove(...new_voxels)
                    builder.attribute_matrix_3_float.normal = voxel.geometry_normals;
                    builder.attribute_matrix_3_float.position = voxel.geometry_vertexes;
                }
            }
            else
            {
                function mix(distance,a,b,i)
                {
                    var k = parseFloat(controls.feather)
                    if(k > 0)
                    {
                        var d = distance / k
                    }
                    else
                    {
                        var d = 1
                    }

                    var k_color =  (a * (1 - b[3]*d))+(b[i]*b[3]*d )

                    return k_color
                }
                if(e.button == 0)
                {
                    last = foreground
                    for(var item of selection)
                    {
                        for(var j = 0; j < item.color.length; j++)
                        for(var i = 0; i < 3; i++)
                        {
                            item.color[j][i] = mix(item.distance,item.color[j][i],foreground,i)
                        }
                    }
                }
                else if(e.button == 2)
                {
                    last = background
                    for(var item of selection)
                    {
                        for(var j = 0; j < item.color.length; j++)
                        for(var i = 0; i < 3; i++)
                        {
                            item.color[j][i] = mix(item.distance,item.color[j][i],background,i)
                        }
                    }
                }
                if(e.button == 1)
                {
                    foreground = [...selection[0].mouse_color,1]
                    last = foreground
                    SetColor(foreground)
                }
            }
        }
        else
        {

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
                    last = foreground
                    for(var j = 0; j < selection.color.length; j++)
                    for(var i = 0; i < 3; i++)
                    {
                        selection.color[j][i] = (selection.color[j][i] * (1 - foreground[3]))+(foreground[i]*foreground[3] )
                    }
                }
                else if(e.button == 2)
                {
                    last = background
                    for(var j = 0; j < selection.color.length; j++)
                    for(var i = 0; i < 3; i++)
                    {
                        selection.color[j][i] = (selection.color[j][i] * (1 - background[3]))+(background[i]*background[3] )
                    }
                }

            }
        }
        if(e.button == 1)
        {
            foreground = [...selection.mouse_color,1]
            last = foreground
            SetColor(foreground)
        }
        push_history()
    })



    const {update, mouse,zoom,resetPan,resetRotation, setZoom} = useCamera(canvas, builder, gl,()=>selection)

    reset_pan = resetPan
    reset_rotation = resetRotation

    subdivide = () => {
        voxel.subdivide()
        builder.attribute_matrix_3_float.normal = voxel.geometry_normals;
        builder.attribute_matrix_3_float.position = voxel.geometry_vertexes;
        zoom(2)
        push_history(true)
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
        // fps.$html(a)
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
            if(selected_tool == "Pen")
            {
                if(drag)
                {
                    pixel_group.push(...positions.map(u=>builder.getPixel(u[0], u[1])))
                    positions = []
                }
                else
                {
                    pixel_group = [builder.getPixel(mouse.x, mouse.y)]
                }
            }
            else if(selected_tool == "Line")
            {
                if(drag)
                {
                    pixel_group = positions.map(u=>builder.getPixel(u[0], u[1]))
                }
                else
                {
                    pixel_group = [builder.getPixel(mouse.x, mouse.y)]
                }
            }
            else
            {

                pixel = builder.getPixel(mouse.x, mouse.y)
            }
        })

        

        builder.uniform_float.disable_lighting = 0
        gl.clearColor(0.5, 0.5, 0.5, 0.9);

        gl.enable(gl.POLYGON_OFFSET_FILL);
        gl.polygonOffset(1.0, 1.0);
        clear()


        selection = null


        if(selected_tool == "Pen" || selected_tool == "Line")
        {
            if(selected_mode == "Sculpt")
            {
                builder.attribute_matrix_4_float.color = voxel.get_highlight(pixel_group,data=>selection = data,null,controls.radius,circle, parseFloat(controls.feather))
            }
            else
            {
                builder.attribute_matrix_4_float.color = voxel.get_highlight(pixel_group,data=>selection = data,last,controls.radius,circle, parseFloat(controls.feather))

            }
        }
        else
        {
            if(selected_mode == "Sculpt")
            {
                builder.attribute_matrix_4_float.color = voxel.highlight_plane(pixel,data=>selection = data,selected_tool,contiguous)
            }
            else
            {
                builder.attribute_matrix_4_float.color = voxel.highlight_plane(pixel,data=>selection = data,selected_tool,contiguous,last)
            }
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
