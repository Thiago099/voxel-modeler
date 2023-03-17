

function ToggleButton(text,callback)
{

    const selected = state({value: false})
    var result = <button class={"button"+(selected.value?" button-selected":"")}>{text}</button>
    result.$on("click", () => {
        selected.value = !selected.value
        callback(selected.value)
    })

    return result
}

export { ToggleButton }