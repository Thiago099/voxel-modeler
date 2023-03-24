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


function voxel2mesh(voxel)
{
    var points = voxel.voxels
    var faces = voxel.faces
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
                layers[id] = {direction:direction_id,relevant:relevant[direction_id],position:points[i][relevant[direction_id]]+pad[direction_id],data:[]}
            }
            layers[id].data.push(points[i].filter((_,index)=>index!=relevant[direction_id]))
            direction_id += 1
        }
    }
    for(var i in layers)
    {
        layers[i].data = getGeometry(layers[i].data)
    }

    var uv_position = []
    var uv_index = []

    var result_position = []
    var result_index = []
    var normal = []
    var offset = 0
    for(var i in layers)
    {
        var layer = layers[i]
        for(var result of layer.data)
        {

            for(var j =0;j<result.positions.length;j+=2)
            {
                var current = [result.positions[j],result.positions[j+1]]
                current.splice(layer.relevant,0,layer.position)
                result_position.push(current)
                uv_position.push([result.positions[j],result.positions[j+1]])
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
    }
    var [vert,index] = weld(result_index,result_position)
    return {vert,index,normal,uv_position,uv_index}
}

export {voxel2mesh}