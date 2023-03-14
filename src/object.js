



function GetCubeIdMap()
{
    var colors = [];
    const faces = 6
    
    for(var i = 0; i < faces; i++)
    {
        var id = id_2_color(i+1);
        for(var j = 0; j < 4; j++)
        {
            colors.push(...id);
        }
    }
    return colors;
}

function GetCubeSelectionColor(data)
{
    var displayColors = new Float32Array(8*12); // assuming 24 faces
    displayColors.fill(1); // set all faces to white

    const faceIndex = color_2_id(data)

    if (faceIndex >= 0) {
        // set selected face to red
        displayColors.set([
            1.0, 0.6, 0.6, 1.0,
            1.0, 0.6, 0.6, 1.0,
            1.0, 0.6, 0.6, 1.0,
            1.0, 0.6, 0.8, 1.0,
        ], faceIndex*16);
    }
    return displayColors;
}

function id_2_color(id)
{
    return [
        ((id >>  0) & 0xFF) / 0xFF,
        ((id >>  8) & 0xFF) / 0xFF,
        ((id >> 16) & 0xFF) / 0xFF,
        ((id >> 24) & 0xFF) / 0xFF,
    ]
}
function color_2_id(color)
{
    return (
        color[0] +
        (color[1] <<  8 ) +
        (color[2] << 16) +
        (color[3] << 24)
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


const voxels = [
    [0,0,0],
    [0,1,0]
]

const faces = getFaces(voxels);
function getFaces(voxels)
{
    const faces = new Array(voxels.length).fill(0).map(x => [1,1,1,1,1,1]);

    for(var i = 0; i < voxels.length; i++)
    for(var j = i+1; j < voxels.length; j++)
    {
        if(voxels[i][0]+1 == voxels[j][0])
        {
            faces[i][4] = 0;
            faces[j][5] = 0;
        }
        if(voxels[i][0]-1 == voxels[j][0])
        {
            faces[i][5] = 0;
            faces[j][4] = 0;
        }

        if(voxels[i][2]+1 == voxels[j][2])
        {
            faces[i][0] = 0;
            faces[j][1] = 0;
        }
        if(voxels[i][2]-1 == voxels[j][2])
        {
            faces[i][1] = 0;
            faces[j][0] = 0;
        }

        if(voxels[i][1]+1 == voxels[j][1])
        {
            faces[i][2] = 0;
            faces[j][3] = 0;
        }
        if(voxels[i][1]-1 == voxels[j][1])
        {
            faces[i][3] = 0;
            faces[j][2] = 0;
        }
    }
    return faces;
}

function getFaceIndexes(faces,vertexIndexes)
{
    var result = [];
    for(var face of faces)
    {
        var voxel_data = [];
        for(const index in face)
        {
            const item = face[index];
            console.log(item);
            if(item == 1)
            {
                voxel_data.push(...vertexIndexes.slice(index*6, index*6+6));
            }
        }
        result.push(voxel_data);
    }
    return result;
    
}

const faceIndexes = getFaceIndexes(faces,vertexIndexes);

console.log(faceIndexes);


export {vertexPosition, GetCubeSelectionColor, GetCubeIdMap, vertexIndexes, wireframeIndexes,  vertexNormals,voxels, faceIndexes}
