function Save(name, obj)
{
    var data = JSON.stringify(obj)
    var blob = new Blob([data], {type: "application/json"});
    var url  = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.download    = name;
    a.href        = url;
    a.textContent = "Download";
    a.click();
    a.remove()
}
function SaveText(name, data)
{
    var blob = new Blob([data], {type: "plain/text"});
    var url  = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.download    = name;
    a.href        = url;
    a.textContent = "Download";
    a.click();
    a.remove()
}
async function Load(extension, callback)
{
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = "."+extension;
    input.onchange = e => {
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
            var contents = e.target.result;
            callback(JSON.parse(contents))
        }
        reader.readAsText(file);
    }
    input.click();
    input.remove()
}

export {Save, Load, SaveText}