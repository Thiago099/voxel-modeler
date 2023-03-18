import './color-selection.css'
import AlphaTrackBar from '../alpha-trackbar/alpha-trackbar'
import RGBTrackBar from '../rgb-trackbar/rgb-trackbar'
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
                <div class="background color-item" style={`background-color:rgb(${br},${bg},${bb})`}></div>
                <div class="foreground color-item" style={`background-color:rgb(${r},${g},${b})`}></div>
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
            <div class="color-history-item"></div>
        </div>
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