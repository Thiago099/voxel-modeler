import {getGeometry,weld} from './get_voxel_shape'

const directions = [
    [0,0,1],
    [0,0,-1],
    [0,1,0],
    [0,-1,0],
    [1,0,0],
    [-1,0,0],
]
const relevant =[2,2,1,1,0,0]
const pad = [1,0,1,0,1,0]

function get_bounds(points)
{
    var min_x = points[0][0]
    var max_x = points[0][0]
    var min_y = points[0][1]
    var max_y = points[0][1]
    for(var i = 1; i < points.length; i++)
    {
        var point = points[i]
        if(point[0] < min_x)
        {
            min_x = point[0]
        }
        if(point[0] > max_x)
        {
            max_x = point[0]
        }
        if(point[1] < min_y)
        {
            min_y = point[1]
        }
        if(point[1] > max_y)
        {
            max_y = point[1]
        }
    }
    return [min_x,min_y,max_x,max_y]
}

function voxel2mesh(voxel)
{
    var points = voxel.voxels
    var faces = voxel.faces
    var colors = voxel.color
    var layers = {}
    for(var i=0;i<faces.length;i++)
    {
        var direction_id = 0
        for(var j = 0; j < faces[i].length; j++)
        {
            if(faces[i][j] == 0)
            {
                direction_id += 1
                continue
            }
            var id = `${points[i][relevant[direction_id]]},${direction_id}`
            if(layers[id] == undefined)
            {
                layers[id] = {
                    direction:direction_id,
                    relevant:relevant[direction_id],
                    position:points[i][relevant[direction_id]]+pad[direction_id],
                    data:[],
                    colors:[]
                }
            }
            layers[id].data.push(points[i].filter((_,index)=>index!=relevant[direction_id]))
            layers[id].colors.push(colors[i][direction_id])
            direction_id += 1
        }
    }
    for(var i in layers)
    {
        layers[i].geometry = getGeometry(layers[i].data)
    }

    var uv_position = []
    var uv_index = []

    var result_position = []
    var result_index = []
    var normal = []
    var uv_color = []
    var offset = 0

    var x = 0
    var height = 0


    for(var i in layers)
    {
        var layer = layers[i]

        var reverse = false
        if(layer.direction == 4 || layer.direction == 5)
        {
            reverse = true
        }

        var [min_x,min_y,max_x,max_y] = get_bounds(layer.data)
        x -= min_x;


        for(var index in layer.data)
        {
            var color = layer.colors[index]
            var position = layer.data[index]

            if(reverse)
            {
                uv_color.push({
                    color,
                    position:[position[1]+x,position[0]-min_x+1],
                })
            }
            else
            {
                uv_color.push({
                    color,
                    position:[position[0]+x,position[1]-min_y+1],
                })
            }
        }

        for(var index in layer.geometry)
        {
            var result = layer.geometry[index]
            for(var j =0;j<result.positions.length;j+=2)
            {
                var current = [result.positions[j],result.positions[j+1]]
                current.splice(layer.relevant,0,layer.position)
                result_position.push(current)
                if(reverse)
                {
                    uv_position.push([result.positions[j+1]+x,result.positions[j]-min_x])
                }
                else
                {
                    uv_position.push([result.positions[j]+x,result.positions[j+1]-min_y])
                }
            }
            for(var j =0;j<result.indices.length;j+=3)
            {
                normal.push(layer.direction+1)
                var face = [result.indices[j]+offset,result.indices[j+1]+offset,result.indices[j+2]+offset]
                // fix the orientation
                if(layer.direction == 1)
                {
                    var temp = face[0]
                    face[0] = face[1]
                    face[1] = temp
                }
                if(layer.direction == 2)
                {
                    var temp = face[0]
                    face[0] = face[2]
                    face[2] = temp
                }
                if(layer.direction == 5)
                {
                    var temp = face[1]
                    face[1] = face[2]
                    face[2] = temp
                }
                uv_index.push(face.map(x=>x+1))
                result_index.push(face)
            }
            offset += result.positions.length / 2
            
        }
        x += max_x - min_x + 1
        if(max_y - min_y + 1 > height)
        {
            height = max_y - min_y + 1
        }
    }
    console.log(x, height)
    uv_position = uv_position.map(y=>[y[0]/x,y[1]/height])


    for(var i in uv_color)
    {
        uv_color[i].position = [uv_color[i].position[0],height-uv_color[i].position[1]]
    }

    var [vert,index] = weld(result_index,result_position)
    return {vert,index,normal,uv_position,uv_index,uv_color,width:x,height}
}

export {voxel2mesh}