import './color-selection.css'
import AlphaTrackBar from '../alpha-trackbar/alpha-trackbar'
import RGBTrackBar from '../rgb-trackbar/rgb-trackbar'
import { Save, Load } from '../../bin/persistence'
function ColorPicker({set,get})
{
    var r = 0
    var g = 0
    var b = 0
    var a = 255


    var br = 255
    var bg = 255
    var bb = 255
    var ba = 255

    const colors = ref()

    var color_list = []

    function load_colors()
    {
        colors.$html("")
        Load("col",new_color=>{
            for(var i = 0; i < new_color.length; i++)
            {
                add_color(new_color[i][0],new_color[i][1],new_color[i][2],new_color[i][3])
            }
        })   
    }
    function save_colors()
    {
        Save("color_list.col",color_list)
    }

    function add_color(cr,cg,cb,ca)
    {
        color_list.push([cr,cg,cb,ca])
        var element = 
        <div class="color-history-item" style={`background-color:rgba(${cr},${cg},${cb},${ca/255})`}>
        </div>

        var click = false

        element.$on("mousedown",e=>{
            click = true
            if(e.button == 1)
            {
                e.preventDefault()
            }
            return false
        })
        element.$on("contextmenu",e=>{
            e.preventDefault()
            return false
        })
        document.addEventListener("mouseup", (e) => {
            setTimeout(() => {
                click = false
            }, 100);
        })
        element.$on("mouseup", (e) => {
            if(!click) return
            if(e.button == 0)
            {
                r = cr
                g = cg
                b = cb
                a = ca
                send()
                if(result) result.$update()
            }
            else if(e.button == 2)
            {
                br = cr
                bg = cg
                bb = cb
                ba = ca
                send("background")
                if(result) result.$update()
            }
            else{
                element.$remove()
            }
        })
                

        element.$parent(colors)
    }



    var result = 
    <div>
        <div style="display:flex;flex-direction:row">
            <div style="width:100%;padding:10px">
            <RGBTrackBar start={r} colorFrom={`0,${g},${b}`} colorTo={`255,${g},${b}`} callback={x=>updateR(x)}/>
            <RGBTrackBar start={g} colorFrom={`${r},0,${b}`} colorTo={`${r},255,${b}`} callback={x=>updateG(x)}/>
            <RGBTrackBar start={b} colorFrom={`${r},${g},0`} colorTo={`${r},${g},255`} callback={x=>updateB(x)}/>
            </div>
        </div>
        <div class="row">
        <div class="color-area">
            <div class="color-container">
                <div class="background color-item">
                    <div class="backdrop"></div>
                    <div class="color" style={`background-color:rgb(${br},${bg},${bb},${ba/255})`}></div>
                </div>
                <div class="foreground color-item">
                    <div class="backdrop"></div>
                    <div class="color" style={`background-color:rgb(${r},${g},${b},${a/255})`}></div>
                </div>
                {/* <input type="color" value="#ff0000" on:change={x=>foreground=color2array(x.target.value)} />
                <input type="color" value="#ffffff" on:change={x=>background=color2array(x.target.value)} /> */}
            </div>
            <div class="hover-icon-container" style="margin-left:5px" on:click={swap}>
                <i class="fa-solid fa-arrows-rotate hover-icon"></i>
            </div>
        </div>
        <div class="alpha-area"  style="margin-top:-10px">
            <AlphaTrackBar start={a} color={`${r},${g},${b};`} callback={x=>updateA(x)}/>
            <AlphaTrackBar start={ba} color={`${br},${bg},${bb};`} callback={x=>updateBA(x)}/>

        </div>
        </div>
        <div class="color-history-container" >
            <div style="display:inline-block"ref={colors}>
            </div>
            <div class="color-history-item" style={`background-color:rgba(${r},${g},${b},${a/255})`} on:click={()=>add_color(r,g,b,a)}>
                <i class="fa fa-plus"></i>
            </div>
            <div class="color-history-item" style={`background-color:rgb(${br},${bg},${bb},${ba/255})`} on:click={()=>add_color(br,bg,bb,ba)}>
            <i class="fa fa-plus"></i>
            </div>
        </div>
        <button class="button" on:click={()=>save_colors()}>Save colors</button>
        <button class="button" on:click={()=>load_colors()}>Load colors</button>

    </div>
    function send(changed="foreground") {
        get(changed,{r,g,b,a},{r:br,g:bg,b:bb,a:ba})
    }
    set(receive())
    function receive()
    {
        return (foreground,background) =>{
            if(foreground != null)
            {
                r = foreground.r
                g = foreground.g
                b = foreground.b
                a = foreground.a
            }
            if(background != null)
            {
                
                br = background.r
                bg = background.g
                bb = background.b
                ba = background.a
            }
            if(result) result.$update()
        }
    }

    function updateR(v)
    {
        r = v
        if(result) result.$update()
        send()
    }
    function updateG(v)
    {
        g = v
        if(result) result.$update()
        send()
    }
    function updateB(v)
    {
        b = v
        if(result) result.$update()
        send()
    }
    function updateA(v)
    {
        a = v
        if(result) result.$update()
        send()
    }
    function updateBA(v)
    {
        ba = v
        if(result) result.$update()
        send("background")
    }
    

    function swap()
    {
        var temp = br
        br = r
        r = temp

        temp = bg
        bg = g
        g = temp

        temp = bb
        bb = b
        b = temp

        temp = ba
        ba = a
        a = temp

        if(result) result.$update()

        send()
    }
    send()
    return result
}

export default ColorPicker