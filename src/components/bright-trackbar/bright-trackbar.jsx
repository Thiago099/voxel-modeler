import './bright-trackbar.css'
function BrightTrackbar({callback, start})
{
    const data = state({absolute_value: 0, relative_value: 0,min_color:"0,0,0",max_color:"255,255,255",min_limit_percent:0,max_limit_percent:100})
        
    var r=0,g=0,b = 0,min_limit=0,max_limit=255



    if(!callback) callback = (x) => {}

    var caret = ref()
    var result = 
    <div>
        <div class="trackbar-container" style={`--color-from:${data.min_color};--color-to:${data.max_color};--min-limit:${data.min_limit_percent}%;--max-limit:${data.max_limit_percent}%`}>
            <div class="trackbar-bright-data" ></div>
            <div class="trackbar-thumb" ref={caret} style={`left:${data.absolute_value}px`}></div>
            {/* <div class="trackbar">
            </div> */}
        </div>
    </div>

    result.$onUpdate(()=>{
    var rect = result.__element.getBoundingClientRect()

    var color = start()
    r = color[0]
    g = color[1]
    b = color[2]

    var min =  Math.min(r,g,b)
    var max =Math.max(r,g,b)

    var dist = max - min
    var avg = (r + g + b) / 3
    
    var mavg = 255-(max - avg)

    data.min_color = [r - min, g - min, b - min].join(",")
    data.max_color = [r + (255-max), g + (255-max), b + (255-max)].join(",")


    data.relative_value = avg
    data.absolute_value = rect.width * avg / 255

    var relative_min_limit = (avg-min)
    var relative_max_limit = 255-(max - avg)

    min_limit = rect.width * relative_min_limit / 255
    max_limit = rect.width * relative_max_limit / 255
    data.min_limit_percent = relative_min_limit / 255 * 100
    data.max_limit_percent = relative_max_limit / 255 * 100
})


    var drag = false
    var px

    function  move(mouse) {
        var old = data.relative_value
        var pr = r - old
        var pg = g - old
        var pb = b - old
        var position =  mouse - px
        var rect = result.__element.getBoundingClientRect()
        if (position < min_limit) position = min_limit
        if (position > max_limit) position = max_limit
        data.absolute_value = position
        data.relative_value = data.absolute_value / rect.width * 255
        r = data.relative_value + pr
        g = data.relative_value + pg
        b = data.relative_value + pb
        console.log(r,g,b)
        callback([r,g,b])
    }
    document.addEventListener("mousemove", (e) => {
        if (drag) {
            move(e.clientX)
        }
    })
    caret.$on("mousedown", (e) => {
        e.stopPropagation()
        drag = true
        px = e.clientX - data.absolute_value
    })
    result.$on("mousedown", (e) => {
        var rect = result.__element.getBoundingClientRect()
        px = rect.left
        move(e.clientX)
        drag = true
    })
    document.addEventListener("mouseup", (e) => {
        drag = false
    })
        
    return result
}
export default BrightTrackbar