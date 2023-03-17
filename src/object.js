



function id_2_color(id)
{
    return [
        ((id >>  0) & 0xFF) / 0xFF,
        ((id >>  8) & 0xFF) / 0xFF,
        ((id >> 16) & 0xFF) / 0xFF,
        1.0
    ]
}
function color_2_id(color)
{
    return (
        color[0] +
        (color[1] <<  8 ) +
        (color[2] << 16)
    ) - 1
}

const vertexNormals = [
    // Front
    [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0],

    // Back
    [0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0],

    // Top
    [0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0],

    // Bottom
    [0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0],

    // Right
    [1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0],

    // Left
    [-1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0],
  ];

const vertexPosition = [
    // Front face
    [-1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0],

    // Back face
    [-1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0],

    // Top face
    [-1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0],

    // Bottom face
    [-1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0],

    // Right face
    [1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0],

    // Left face
    [-1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0],
];

const vertexIndexes = [
    [0,
    1,
    2,
    0,
    2,
    3], // front
    [4,
    5,
    6,
    4,
    6,
    7], // back
    [8,
    9,
    10,
    8,
    10,
    11], // top
    [12,
    13,
    14,
    12,
    14,
    15], // bottom
    [16,
    17,
    18,
    16,
    18,
    19], // right
    [20,
    21,
    22,
    20,
    22,
    23], // left
];

const wireframeIndexes = [
    //front
    [0, 1,
    1, 2,
    2, 3,
    3, 0],
    //back
    [4, 5,
    5, 6,
    6, 7,
    7, 4],
    //top
    [8, 9,
    9, 10,
    10, 11,
    11, 8],
    //bottom
    [12, 13,
    13, 14,
    14, 15,
    15, 12],
    //right
    [16, 17,
    17, 18,
    18, 19,
    19, 16],
    //left
    [20, 21,
    21, 22,
    22, 23,
    23, 20],
];
const directions = [
    [0,0,1],
    [0,0,-1],
    [0,1,0],
    [0,-1,0],
    [1,0,0],
    [-1,0,0],
]

const baseColor = [
    1,1,1,1,
    1,1,1,1,
    1,1,1,1,
    1,1,1,1,
]


function isTop(va,vb)
{
    return va[0]+1 == vb[0] && va[1] == vb[1] && va[2] == vb[2]
}
function isBottom(va,vb)
{
    return va[0]-1 == vb[0] && va[1] == vb[1] && va[2] == vb[2]
}
function isRight(va,vb)
{
    return va[1]+1 == vb[1] && va[0] == vb[0] && va[2] == vb[2]
}
function isLeft(va,vb)
{
    return va[1]-1 == vb[1] && va[0] == vb[0] && va[2] == vb[2]
}
function isFront(va,vb)
{
    return va[2]+1 == vb[2] && va[0] == vb[0] && va[1] == vb[1]
}
function isBack(va,vb)
{
    return va[2]-1 == vb[2] && va[0] == vb[0] && va[1] == vb[1]
}

class Voxel
{
    constructor()
    {
        this.voxels = [
            [0,0,0],
        ]
    }
    build_geometry()
    {
        var chroma = [];
        var meta = [];
        var positions = []
        var index = []
        var normals = []
        var color = []
        var edge_index = []
        var distance = 0
        var id = 1
        for(var i = 0; i < this.voxels.length; i++)
        {
            var local_distance = 0
            var comp = 0

            var start = id-1;
            var colors = [];

            for(var j = 0; j < 6; j++)
            {
                if(this.faces[i][j] == 0) 
                {
                    comp += 4
                    continue
                }
                positions.push(...vertexPosition[j].map((x,k) => x + (this.voxels[i][k%3]*2) - this.center[k%3]))
                normals.push(...vertexNormals[j])
                edge_index.push(...wireframeIndexes[j].map(x => x + distance - comp))
                index.push(...vertexIndexes[j].map(x => x + distance - comp))
                color.push(...baseColor)
                local_distance += 4

                var current_id = id_2_color(id);
                for(var k = 0; k < 4; k++)
                {
                    colors.push(...current_id);
                }
                id++
            }
            distance += local_distance
            meta.push({start,end:id-1})
            chroma.push(...colors);
        }
        this.id = id
        this.distance = distance
        this.geometry_vertexes = positions
        this.geometry_indexes = index
        this.geometry_normals = normals
        this.geometry_color = color
        this.geometry_edge_index = edge_index
        this.pick_map = chroma;
        this.pick_meta = meta;
    }
    init()
    {
        this.build_boundary()
        this.build_center()
        this.build_faces()
        this.build_geometry()
    }
    add(...voxel)
    {
        this.voxels.push(...voxel)
        this.build_boundary()
        this.build_center()
        this.rebuild_faces(voxel)
        this.build_geometry()
    }
    subdivide()
    {
        //replace each voxel with 8 new voxels
        var new_voxels = []
        for(const voxel of this.voxels)
        {
            const delta_v = [voxel[0]*2,voxel[1]*2,voxel[2]*2]
            new_voxels.push(...[
                [delta_v[0],delta_v[1],delta_v[2]],
                [delta_v[0]+1,delta_v[1],delta_v[2]],
                [delta_v[0],delta_v[1]+1,delta_v[2]],
                [delta_v[0]+1,delta_v[1]+1,delta_v[2]],
                [delta_v[0],delta_v[1],delta_v[2]+1],
                [delta_v[0]+1,delta_v[1],delta_v[2]+1],
                [delta_v[0],delta_v[1]+1,delta_v[2]+1],
                [delta_v[0]+1,delta_v[1]+1,delta_v[2]+1],
            ])
        }
        this.voxels = new_voxels
        this.init()
    }
    remove(...delete_voxels)
    {

        for(const voxel of delete_voxels)
        {
            if(this.voxels.length <= 1) break
            for(var i = 0; i < this.voxels.length; i++)
            {
                if(this.voxels[i][0] == voxel[0] && this.voxels[i][1] == voxel[1] && this.voxels[i][2] == voxel[2])
                {
                    this.voxels.splice(i,1)
                    this.faces.splice(i,1)
                    break
                }
            }


        }
        this.build_boundary()
        this.build_center()
        this.rebuild_remove_faces(delete_voxels)
        this.build_geometry()
    }
  

    get_plane_color(ids,selected_direction)
    {
        var result = []
        for(const index in this.pick_meta)
        {
            const face = this.faces[index]
            var direction_id = 0
            for(var i = 0; i < face.length; i++)
            {
                if(face[i] == 0)
                {
                    direction_id += 1
                    continue
                }
                if(ids.includes(index))
                {
                    if(direction_id == selected_direction)
                    {
                        for(var j = 0; j < 4; j++)
                        {
                            result.push(1,0.6,0.6,1)
                        }
                    }
                    else
                    {
                        for(var j = 0; j < 4; j++)
                        {
                            result.push(1,0.9,0.9,1)
                        }
                    }
                }
                else
                {
                    for(var j = 0; j < 4; j++)
                    {
                        result.push(1,1,1,1)
                    }
                }
                direction_id += 1
            }
        }
        return result
    }
    get_plane(voxel, direction)
    {
        var result = []
        for(const id in this.voxels)
        {
            const item = this.voxels[id]
            // if is not the same
            var match = true
            for(const index in direction)
            {
                if(direction[index] != 0)
                {
                    if(voxel[index] != item[index])
                    {
                        match = false
                        break
                    }
                }
            }
            if(match)
            {
                var new_position = this.voxels[id].map((x,i) => x + direction[i])
                if(!this.voxels.some(x => x[0] == new_position[0] && x[1] == new_position[1] && x[2] == new_position[2]))
                result.push(id)
            }
        }
        return result
    }
    get_contiguous(ids,voxel,direction)
    {
        var result = []
        const voxels = this.voxels
        const visited = new Set();
        function loop(voxel)
        {
            for(const id of ids)
            {
                const item = voxels[id]
                // if is not the same
                var match = true
                for(const index in direction)
                {
                    if(direction[index] != 0)
                    {
                        if(voxel[index] != item[index])
                        {
                            match = false
                            break
                        }
                    }
                    else
                    {
                        if(Math.abs(voxel[index] - item[index]) > 1)
                        {
                            match = false
                            break
                        }
                    }
                }
                if(match)
                {
                    var new_position = voxels[id].map((x,i) => x + direction[i])
                    var new_pid = `${new_position[0]},${new_position[1]},${new_position[2]}`
                    if(!visited.has(new_pid))
                    {
                        visited.add(new_pid)
                        result.push(id)
                        loop(voxels[id])
                    }
                }
            }
        }
        loop(voxel)
        return result
    }
    get_vertical_line(voxel, direction, type)
    {
        var result = []
        for(const id in this.voxels)
        {
            const item = this.voxels[id]
            // if is not the same
            var match = true
            var dir = -1
            for(const index in direction)
            {
                if(direction[index] != 0)
                {
                    dir = index
                    if(voxel[index] != item[index])
                    {
                        match = false
                        break
                    }
                }
            }


            if(dir == 0)
            {

                for(const index in direction)
                {
                    if(direction[index] == 0)
                    {
                        if(voxel[index] != item[index] && index == 2 )
                        {
                            match = false
                            break
                        }
                    }
                }
            }
            else if(dir == 2)
            {
                for(const index in direction)
                {
                    if(direction[index] == 0)
                    {
                        if(voxel[index] != item[index] && index == 0 )
                        {
                            match = false
                            break
                        }
                    }
                }
            }
            else if(dir == 1)
            {
                for(const index in direction)
                {
                    if(direction[index] == 0)
                    {
                        if(voxel[index] != item[index] && index == 0 )
                        {
                            match = false
                            break
                        }
                    }
                }
            }
            else
            {
                match = false
            }
                

            if(match)
            {
                var new_position = this.voxels[id].map((x,i) => x + direction[i])
                if(!this.voxels.some(x => x[0] == new_position[0] && x[1] == new_position[1] && x[2] == new_position[2]))
                result.push(id)
            }
        }
        return result
    }
    get_horizontal_line(voxel, direction, type)
    {
        var result = []
        for(const id in this.voxels)
        {
            const item = this.voxels[id]
            // if is not the same
            var match = true
            var dir = -1
            for(const index in direction)
            {
                if(direction[index] != 0)
                {
                    dir = index
                    if(voxel[index] != item[index])
                    {
                        match = false
                        break
                    }

                }
                else
                {
                    if(voxel[index] != item[index] && index == 1)
                    {
                        match = false
                        break
                    }
                }
            }
            if(dir == 1)
            {
                for(const index in direction)
                {
                    if(direction[index] == 0)
                    {
                        if(voxel[index] != item[index] && index == 2 )
                        {
                            match = false
                            break
                        }
                    }
                }
            }
            if(match)
            {
                var new_position = this.voxels[id].map((x,i) => x + direction[i])
                if(!this.voxels.some(x => x[0] == new_position[0] && x[1] == new_position[1] && x[2] == new_position[2]))
                result.push(id)
            }
        }
        return result
    }
    highlight_plane(data,setSelection,type,contiguous)
    {
        var faceIndex = color_2_id(data)
        var result = []
        var id = 0
        for(const index in this.pick_meta)
        {
            const face = this.faces[index]
            const map = this.pick_meta[index]
            if(faceIndex >= map.start && faceIndex < map.end)
            {
                var direction_id = 0
                for(var i = 0; i < face.length; i++)
                {
                    if(face[i] == 0)
                    {
                        direction_id += 1
                        continue
                    }

                    if(faceIndex == id)
                    {


                        var ids;
                        switch(type)
                        {
                            case "Plane":
                                ids = this.get_plane(this.voxels[index],directions[direction_id])
                                break
                            case "Horizontal line":
                                ids = this.get_horizontal_line(this.voxels[index],directions[direction_id])
                                break
                            case "Vertical line":
                                ids = this.get_vertical_line(this.voxels[index],directions[direction_id])
                                break
                        }
                        if(contiguous)
                        {
                            ids = this.get_contiguous(ids,this.voxels[index],directions[direction_id])
                        }

                        setSelection({
                            voxel:ids.map(x=>this.voxels[x]),
                            direction:directions[direction_id],
                            index:index,
                        })

                        return this.get_plane_color(ids,direction_id)
                    }
                    direction_id += 1
                    id += 1
                }
            }
            else
            {
                for(var i = 0; i < face.length; i++)
                {
                    if(face[i] == 0)
                    {
                        continue
                    }

                    for(var j = 0; j < 4; j++)
                    {
                        result.push(1,1,1,1)
                    }
                    id += 1
                }
            }

        }
        return result;
    }

    get_highlight(data,setSelection)
    {
        var faceIndex = color_2_id(data)
        var result = []
        var id = 0
        for(const index in this.pick_meta)
        {
            const face = this.faces[index]
            const map = this.pick_meta[index]
            if(faceIndex >= map.start && faceIndex < map.end)
            {
                var direction_id = 0
                for(var i = 0; i < face.length; i++)
                {
                    if(face[i] == 0)
                    {
                        direction_id += 1
                        continue
                    }

                    if(faceIndex == id)
                    {

                        setSelection({
                            voxel:[this.voxels[index]],
                            direction:directions[direction_id],
                            index:index,
                        })

                        for(var j = 0; j < 4; j++)
                        {
                            result.push(1,0.6,0.6,1)
                        }
                    }
                    else
                    {
                        for(var j = 0; j < 4; j++)
                        {
                            result.push(1,0.9,0.9,1)
                        }
                    }

                    direction_id += 1
                    id += 1
                }
            }
            else
            {
                for(var i = 0; i < face.length; i++)
                {
                    if(face[i] == 0)
                    {
                        continue
                    }

                    for(var j = 0; j < 4; j++)
                    {
                        result.push(1,1,1,1)
                    }
                    id += 1
                }
            }

        }
        return result;
        
    }
    rebuild_faces(voxels)
    {
        const faces = new Array(voxels.length).fill(0).map(x => [1,1,1,1,1,1]);
        for(var i = 0; i < voxels.length; i++)
        for(var j = 0; j < this.voxels.length; j++)
        {
            if(isTop(voxels[i],this.voxels[j]))
            {
                faces[i][4] = 0;
                this.faces[j][5] = 0;
            }
            if(isBottom(voxels[i],this.voxels[j]))
            {
                faces[i][5] = 0;
                this.faces[j][4] = 0;
            }
            
            if(isRight(voxels[i],this.voxels[j]))
            {
                faces[i][2] = 0;
                this.faces[j][3] = 0;
            }
            if(isLeft(voxels[i],this.voxels[j]))
            {
                faces[i][3] = 0;
                this.faces[j][2] = 0;
            }

            if(isFront(voxels[i],this.voxels[j]))
            {
                faces[i][0] = 0;
                this.faces[j][1] = 0;
            }
            if(isBack(voxels[i],this.voxels[j]))
            {
                faces[i][1] = 0;
                this.faces[j][0] = 0;
            }
        }
        for(var i = 0; i < voxels.length; i++)
        for(var j = i+1; i < voxels.length; i++)
        {
            if(j >= voxels.length)break
            if(isTop(voxels[i],voxels[j]))
            {
                faces[i][4] = 0;
                faces[j][5] = 0;
            }
            if(isBottom(voxels[i],voxels[j]))
            {
                faces[i][5] = 0;
                faces[j][4] = 0;
            }
            
            if(isRight(voxels[i],voxels[j]))
            {
                faces[i][2] = 0;
                faces[j][3] = 0;
            }
            if(isLeft(voxels[i],voxels[j]))
            {
                faces[i][3] = 0;
                faces[j][2] = 0;
            }

            if(isFront(voxels[i],voxels[j]))
            {
                faces[i][0] = 0;
                faces[j][1] = 0;
            }
            if(isBack(voxels[i],voxels[j]))
            {
                faces[i][1] = 0;
                faces[j][0] = 0;
            }
        }
        this.faces.push(...faces)
    }

    rebuild_remove_faces(voxels)
    {
        for(var i = 0; i < voxels.length; i++)
        for(var j = 0; j < this.voxels.length; j++)
        {
            if(isTop(voxels[i],this.voxels[j]))
            {
                this.faces[i][4] = 1;
                this.faces[j][5] = 1;
            }
            if(isBottom(voxels[i],this.voxels[j]))
            {
                this.faces[i][5] = 1;
                this.faces[j][4] = 1;
            }
            
            if(isRight(voxels[i],this.voxels[j]))
            {
                this.faces[i][2] = 1;
                this.faces[j][3] = 1;
            }
            if(isLeft(voxels[i],this.voxels[j]))
            {
                this.faces[i][3] = 1;
                this.faces[j][2] = 1;
            }

            if(isFront(voxels[i],this.voxels[j]))
            {
                this.faces[i][0] = 1;
                this.faces[j][1] = 1;
            }
            if(isBack(voxels[i],this.voxels[j]))
            {
                this.faces[i][1] = 1;
                this.faces[j][0] = 1;
            }
        }
    }
        
    build_faces()
    {
        const voxels = this.voxels
        const faces = new Array(voxels.length).fill(0).map(x => [1,1,1,1,1,1]);

        for(var i = 0; i < voxels.length; i++)
        for(var j = i+1; j < voxels.length; j++)
        {
            if(isTop(voxels[i],voxels[j]))
            {
                faces[i][4] = 0;
                faces[j][5] = 0;
            }
            if(isBottom(voxels[i],voxels[j]))
            {
                faces[i][5] = 0;
                faces[j][4] = 0;
            }
            
            if(isRight(voxels[i],voxels[j]))
            {
                faces[i][2] = 0;
                faces[j][3] = 0;
            }
            if(isLeft(voxels[i],voxels[j]))
            {
                faces[i][3] = 0;
                faces[j][2] = 0;
            }

            if(isFront(voxels[i],voxels[j]))
            {
                faces[i][0] = 0;
                faces[j][1] = 0;
            }
            if(isBack(voxels[i],voxels[j]))
            {
                faces[i][1] = 0;
                faces[j][0] = 0;
            }
        }
        this.faces = faces;
    }
    build_center()
    {
        const boundary = this.boundary;
        this.center = boundary[0].map((x, i) => x + boundary[1][i]);;
    }
    build_boundary()
    {
        const voxels = this.voxels;
        var min = voxels[0];
        var max = voxels[0];
    
        for(var i = 1; i < voxels.length; i++)
        {
            min = min.map((x, j) => Math.min(x, voxels[i][j]));
            max = max.map((x, j) => Math.max(x, voxels[i][j]));
        }
        this.boundary = [min, max];
    }
}

export {Voxel,vertexPosition,vertexNormals,wireframeIndexes}