

function ActionButton(text,callback)
{

    var result = <button class={"button"}>{text}</button>
    result.$on("click", () => {
        callback()
    })

    return result
}

export { ActionButton }