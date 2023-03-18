
import './tool-selection.css'

function ToolSelector(data,callback, initial)
{
    var result = []

    const selected = state({name: initial})

    for(const item of data)
    {
        const el = <button class={"button"+(selected.name == item.name?" button-selected":"")}>{item.name}</button>
        el.$on("click", () => {
            selected.name = item.name
            callback(item.name)
        })
        result.push(el)
    }

    return result
}

export { ToolSelector }