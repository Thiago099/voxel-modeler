



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
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,

    // Back
    0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,

    // Top
    0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,

    // Bottom
    0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,

    // Right
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,

    // Left
    -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
  ];

const vertexPosition = [
    // Front face
    -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

    // Back face
    -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,

    // Top face
    -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

    // Right face
    1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,

    // Left face
    -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
];

const vertexIndexes = [
    0,
    1,
    2,
    0,
    2,
    3, // front
    4,
    5,
    6,
    4,
    6,
    7, // back
    8,
    9,
    10,
    8,
    10,
    11, // top
    12,
    13,
    14,
    12,
    14,
    15, // bottom
    16,
    17,
    18,
    16,
    18,
    19, // right
    20,
    21,
    22,
    20,
    22,
    23, // left
];

const wireframeIndexes = [
    //front
    0, 1,
    1, 2,
    2, 3,
    3, 0,
    //back
    4, 5,
    5, 6,
    6, 7,
    7, 4,
    //left
    8, 9,
    9, 10,
    10, 11,
    11, 8,
    //right
    12, 13,
    13, 14,
    14, 15,
    15, 12,
];
const directions = [
    [0,0,1],
    [0,0,-1],
    [0,1,0],
    [0,-1,0],
    [1,0,0],
    [-1,0,0],
]


function isTop(voxels,i,j)
{
    return voxels[i][0]+1 == voxels[j][0] && voxels[i][1] == voxels[j][1] && voxels[i][2] == voxels[j][2]
}
function isBottom(voxels,i,j)
{
    return voxels[i][0]-1 == voxels[j][0] && voxels[i][1] == voxels[j][1] && voxels[i][2] == voxels[j][2]
}
function isRight(voxels,i,j)
{
    return voxels[i][1]+1 == voxels[j][1] && voxels[i][0] == voxels[j][0] && voxels[i][2] == voxels[j][2]
}
function isLeft(voxels,i,j)
{
    return voxels[i][1]-1 == voxels[j][1] && voxels[i][0] == voxels[j][0] && voxels[i][2] == voxels[j][2]
}
function isFront(voxels,i,j)
{
    return voxels[i][2]+1 == voxels[j][2] && voxels[i][0] == voxels[j][0] && voxels[i][1] == voxels[j][1]
}
function isBack(voxels,i,j)
{
    return voxels[i][2]-1 == voxels[j][2] && voxels[i][0] == voxels[j][0] && voxels[i][1] == voxels[j][1]
}


class Voxel
{
    constructor()
    {
        this.voxels = [
            [0,0,0],
            [1,0,0],
            [1,1,0],
        ]
    }
    init()
    {
        this.build_faces()
        this.build_face_indices()
        this.build_pick_map()
        this.build_positions()
        this.build_compile()
    }
    build_compile()
    {
        var position_result = []
        var index_result = []
        var lazy_counter = 0
        for(const i in this.faces)
        {
            var counter = 0;
           for(const j in this.faces[i])
           {
            console.log(j)
                position_result.push(...vertexPosition.slice(j*12, j*12+12).map((x,k) => x + this.positions[i][k%3]))
                index_result.push(...vertexIndexes.slice(j*6, j*6+6).map(x => x+lazy_counter))
                counter += 6
            }
            lazy_counter += counter
        }
        console.log(position_result.length/12)
        this.position_compiled = position_result
        this.index_compiled = index_result
    }
    add(voxel)
    {
        const voxels = this.voxels
        const faces = this.faces
        this.voxels.push(voxel)
        const j = voxels.length-1
        const face = [1,1,1,1,1,1]
        this.faces.push(face)
        for(var i = 0; i < this.voxels.length-1; i++)
        {
            if(isTop(voxels,i,j))
            {
                faces[i][4] = 0;
                faces[j][5] = 0;
            }
            if(isBottom(voxels,i,j))
            {
                faces[i][5] = 0;
                faces[j][4] = 0;
            }
            
            if(isRight(voxels,i,j))
            {
                faces[i][2] = 0;
                faces[j][3] = 0;
            }
            if(isLeft(voxels,i,j))
            {
                faces[i][3] = 0;
                faces[j][2] = 0;
            }

            if(isFront(voxels,i,j))
            {
                faces[i][0] = 0;
                faces[j][1] = 0;
            }
            if(isBack(voxels,i,j))
            {
                faces[i][1] = 0;
                faces[j][0] = 0;
            }
        }
        var voxel_data = [];
        for(const index in face)
        {
            const item = face[index];
            if(item == 1)
            {
                voxel_data.push(...vertexIndexes.slice(index*6, index*6+6));
            }
        }
        // this.face_indices.push(voxel_data);
        this.build_face_indices()
        this.build_pick_map()
        this.build_positions()
    }
    remove(index)
    {
        if(this.voxels.length <= 1) return
        this.voxels = this.voxels.filter((_,i) => i != index)
        this.init()
    }
    get_highlight(data,index,setSelection)
    {
        const map = this.pick_map[index]
        const face = this.faces[index]
        var faceIndex = color_2_id(data)

        if(faceIndex >= map.start && faceIndex < map.end)
        {
            var transformedFaceIndex = faceIndex - map.start;
            var result = []
            var optimized_id = 0
            var direction_id = 0;
            for(var i = 0; i < face.length; i++)
            {
                if(optimized_id == transformedFaceIndex)
                {
                    setSelection({
                        voxel:this.voxels[index],
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
                if(face[i] == 1)
                {
                    optimized_id++
                }
                direction_id++
            }
            return result;
        }
        else
        {
            var result = []
            for(var i = 0; i < face.length; i++)
            {
                for(var j = 0; j < 4; j++)
                {
                    result.push(1,1,1,1)
                }
            }
            return result;
        }
    }
    build_faces()
    {
        const voxels = this.voxels
        const faces = new Array(voxels.length).fill(0).map(x => [1,1,1,1,1,1]);

        for(var i = 0; i < voxels.length; i++)
        for(var j = i+1; j < voxels.length; j++)
        {
            if(isTop(voxels,i,j))
            {
                faces[i][4] = 0;
                faces[j][5] = 0;
            }
            if(isBottom(voxels,i,j))
            {
                faces[i][5] = 0;
                faces[j][4] = 0;
            }
            
            if(isRight(voxels,i,j))
            {
                faces[i][2] = 0;
                faces[j][3] = 0;
            }
            if(isLeft(voxels,i,j))
            {
                faces[i][3] = 0;
                faces[j][2] = 0;
            }

            if(isFront(voxels,i,j))
            {
                faces[i][0] = 0;
                faces[j][1] = 0;
            }
            if(isBack(voxels,i,j))
            {
                faces[i][1] = 0;
                faces[j][0] = 0;
            }
        }
        this.faces = faces;
    }
    build_face_indices()
    {
        const faces = this.faces;
        var result = [];
        for(var face of faces)
        {
            var voxel_data = [];
            for(const index in face)
            {
                const item = face[index];
                if(item == 1)
                {
                    voxel_data.push(...vertexIndexes.slice(index*6, index*6+6));
                }
            }
            result.push(voxel_data);
        }
        this.face_indices = result;
    }
    build_positions()
    {
        const center = this.center;
        this.positions = this.voxels.map(x=>x.map((x,i)=>(x*2)-center[i]));;
    }
    build_pick_map()
    {
        const faces = this.faces;
        var result = [];
        var id = 1
        for(var face of faces)
        {
            var start = id-1;
            var colors = [];
            for(const index in face)
            {
                const item = face[index];
                if(item == 1)
                {
                    var current_id = id_2_color(id);
                    id++
                    for(var j = 0; j < 4; j++)
                    {
                        colors.push(...current_id);
                    }
                }
                else
                {
                    for(var j = 0; j < 4; j++)
                    {
                        colors.push(0,0,0,0);
                    }
                }
            }
            result.push({colors,start,end:id-1});
        }
        this.pick_map = result;
    }
    get center()
    {
        const boundary = this.boundary;
        return boundary[0].map((x, i) => x + boundary[1][i]);
    }
    get boundary()
    {
        const voxels = this.voxels;
        var min = voxels[0];
        var max = voxels[0];
    
        for(var i = 1; i < voxels.length; i++)
        {
            min = min.map((x, j) => Math.min(x, voxels[i][j]));
            max = max.map((x, j) => Math.max(x, voxels[i][j]));
        }
        return [min, max];
    }
}

export {Voxel,vertexPosition,vertexNormals,wireframeIndexes}