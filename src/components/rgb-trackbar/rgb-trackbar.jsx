import './rgb-trackbar.css'
function RGBTrackBar({callback, start, colorFrom,colorTo})
{
    if(!callback) callback = (x) => {}
    const data = state({absolute_value: 0, relative_value: 0})
    var caret = ref()
    var result = 
    <div class="trackbar-container" style={`--color-from:${colorFrom()};--color-to:${colorTo()};`}>
        <div class="trackbar-data" ></div>
        <div class="trackbar-thumb" ref={caret} style={`left:${data.absolute_value}px`}></div>
        {/* <div class="trackbar">
        </div> */}
    </div>

    result.$onMounted(()=>{
        var rect = result.__element.getBoundingClientRect()
        data.relative_value = start()
        data.absolute_value = rect.width * start() / 255
        callback(data.relative_value)
    })
    result.$onUpdate(()=>{
        var rect = result.__element.getBoundingClientRect()
        data.relative_value = start()
        data.absolute_value = rect.width * start() / 255
    })

    var drag = false
    var px

    function  move(mouse) {
        var position =  mouse - px
        var rect = result.__element.getBoundingClientRect()
        if (position < 0) position = 0
        if (position > rect.width) position = rect.width
        data.absolute_value = position
        data.relative_value = data.absolute_value / rect.width * 255
        callback(data.relative_value)
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
export default RGBTrackBar