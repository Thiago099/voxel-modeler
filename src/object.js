
import { useMap,join_array } from "./bin/get_voxel_shape";


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
    1,1,1,
]


function getTop(va,mapb)
{
    var pos = join_array([va[0]+1,va[1],va[2]])
    return mapb(pos)
}
function getBottom(va,mapb)
{
    var pos = join_array([va[0]-1,va[1],va[2]])
    return mapb(pos)
}
function getRight(va,mapb)
{
    var pos = join_array([va[0],va[1]+1,va[2]])
    return mapb(pos)
}
function getLeft(va,mapb)
{
    var pos = join_array([va[0],va[1]-1,va[2]])
    return mapb(pos)
}
function getFront(va,mapb)
{
    var pos = join_array([va[0],va[1],va[2]+1])
    return mapb(pos)
}
function getBack(va,mapb)
{
    var pos = join_array([va[0],va[1],va[2]-1])
    return mapb(pos)
}

const subdivideFaceIndex = [
    [
      0,
      1,
      0,
      1,
      0,
      1
    ],
    [
      0,
      1,
      0,
      1,
      1,
      0
    ],
    [
      0,
      1,
      1,
      0,
      0,
      1
    ],
    [
      0,
      1,
      1,
      0,
      1,
      0
    ],
    [
      1,
      0,
      0,
      1,
      0,
      1
    ],
    [
      1,
      0,
      0,
      1,
      1,
      0
    ],
    [
      1,
      0,
      1,
      0,
      0,
      1
    ],
    [
      1,
      0,
      1,
      0,
      1,
      0
    ]
  ]

  var relevant_index = [2,2,1,1,0,0]

class Voxel
{
    constructor()
    {
        this.voxels = [
            [0,0,0],
        ]
        this.color = []
        this.init_colors(this.voxels)
    }
    init_colors(voxels)
    {
        var color = []
        for(var i = 0; i < voxels.length; i++)
        {
            var current_color = []
            color.push(current_color)
            for(var j = 0; j < 6; j++)
            {
                current_color.push([...baseColor])
            }
        }
        this.color.push(...color)
    }
    build_geometry()
    {
        var chroma = [];
        var meta = [];
        var positions = []
        var index = []
        var normals = []
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
    build()
    {
        this.build_boundary()
        this.build_center()
        this.build_geometry()
    }
    add(...voxel)
    {
        this.voxels.push(...voxel)
        this.init_colors(voxel)
        this.init()
    }
    subdivide()
    {
        //replace each voxel with 8 new voxels
        var new_voxels = []
        var new_faces = []
        var new_color = []
        for(const index in this.voxels)
        {
            const voxel = this.voxels[index]
            const face = this.faces[index]
            const delta_v = [voxel[0]*2,voxel[1]*2,voxel[2]*2]

            for(var j = 0; j < 8; j++)
            {
                var current_color = []
                new_color.push(current_color)
                for(var i = 0; i < 6; i++)
                {
                    current_color.push([...this.color[index][i]])
                }
            }
            
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

            for(var i in subdivideFaceIndex)
            {
                var new_face = Array(6).fill(0)
                for(var j in subdivideFaceIndex[i])
                {
                    if(subdivideFaceIndex[i][j] == 1 && face[j] == 1)
                    {
                        new_face[j] = 1
                    }
                }
                new_faces.push(new_face)
            }
        }
        
        this.voxels = new_voxels
        this.faces = new_faces
        this.color = new_color
        this.build_boundary()
        this.build_center()
        this.build_geometry()

    }
    remove(...delete_voxels)
    {

        for(const voxel of delete_voxels)
        {
            if(this.voxels.length == 1)
            {
                delete_voxels.splice(delete_voxels.indexOf(voxel),1)
                continue
            }
            for(var i = 0; i < this.voxels.length; i++)
            {
                if(this.voxels[i][0] == voxel[0] && this.voxels[i][1] == voxel[1] && this.voxels[i][2] == voxel[2])
                {
                    this.voxels.splice(i,1)
                    this.faces.splice(i,1)
                    this.color.splice(i,1)
                    break
                }
            }
        }
        this.init()
    }
    get_plane_color(ids,selected_direction, color=null)
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
                    if(color != null)
                    {
                        var rest_color = this.color[index][i]
                    }
                    else
                    {
                        var rest_color = this.color[index][i]//.map(x => Math.abs(1-x* 0.3) )
                    }

                    if(direction_id == selected_direction)
                    {
                        if(color != null)
                        {
                            var face_color = this.color[index][i].map((x,i) => (x * (1 - color[3]))+(color[i]*color[3] ))
                        }
                        else
                        {
                            var face_color = this.color[index][i].map(x => Math.abs(1-x* 0.5) )
                        }
                        for(var j = 0; j < 4; j++)
                        {
                            result.push(...face_color,1)
                        }
                    }
                    else
                    {
                        for(var j = 0; j < 4; j++)
                        {
                            result.push(...rest_color,1)
                        }
                    }
                }
                else
                {
                    for(var j = 0; j < 4; j++)
                    {
                        result.push(...this.color[index][i],1)
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
    highlight_plane(data,setSelection,type,contiguous, color=null)
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

                        var selected_face_colors = []

                        for(const id of ids)
                        {
                            selected_face_colors.push(this.color[id][direction_id])
                        }

                        setSelection({
                            voxel:ids.map(x=>this.voxels[x]),
                            direction:directions[direction_id],
                            color:selected_face_colors,
                            mouse_color:this.color[index][i],
                            index:index,
                        })

                        return this.get_plane_color(ids,direction_id, color)
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
                    id += 1
                }
            }

        }
        var result = []
        for(const index in this.pick_meta)
        {
            const face = this.faces[index]
            for(var i = 0; i < face.length; i++)
            {
                if(face[i] == 0)
                {
                    continue
                }
                for(var j = 0; j < 4; j++)
                {
                    result.push(...this.color[index][i],1)
                }
            }
        }
        return result
    }

    printPointsWithinCircle(radius,position) {
        if(radius < 1) return [[[position[0],position[1]],1]]
        const center = { x: position[0], y: position[1] }; // set center of the circle to (0,0)
        
        var result = []
        
        for (let x = center.x - radius; x <= center.x + radius; x++) {
          for (let y = center.y - radius; y <= center.y + radius; y++) {
            const distance = Math.sqrt((x - center.x)**2 + (y - center.y)**2);
            if (distance <= radius) {
                result.push([[x,y],1-(distance / radius)])
            }
          }
        }

        return result
    }

    printPointsWithinSquare(radius,position) {
        if(radius < 1) return [[[position[0],position[1]],1]]
        radius = Math.round(radius / 2)
        const center = { x: position[0], y: position[1] }; // set center of the circle to (0,0)
        
        var result = []
        
        for (let x = center.x - radius; x <= center.x + radius; x++) {
          for (let y = center.y - radius; y <= center.y + radius; y++) {
            var distance = Math.max(Math.abs(x - center.x) + Math.abs(y - center.y),1)
            result.push([[x,y],1-(distance / radius / 2)])
          }
        }

        return result
    }
      
      

    
    get_highlight(data,setSelection, color=null, radius,circle,feather)
    {
        const [get_voxel_at] = useMap(this.voxels)

        const selection_map = {}

        var indexes = new Set(data.map(u=>color_2_id(u)))

        var aindex = Array.from(indexes)
        var result = []
        var id = 0
        var selections = []

        var highlight = new Set()

        for(const index in this.pick_meta)
        {
            const face = this.faces[index]
            const map = this.pick_meta[index]
            if(aindex.some(x => x >= map.start && x < map.end))
            {
                var direction_id = 0
                for(var i = 0; i < face.length; i++)
                {
                    if(face[i] == 0)
                    {
                        direction_id += 1
                        continue
                    }
                    if(indexes.has(id))
                    {
                        var v = [...this.voxels[index]]
                        v.splice(relevant_index[direction_id],1)

                        if(circle)
                        {
                            var cirlce = this.printPointsWithinCircle(radius-1,v)
                        }
                        else
                        {
                            var cirlce = this.printPointsWithinSquare(radius,v)
                        }


                        for(const data of cirlce)
                        {
                            var [ point, distance ] = data
                            var voxel = [...point]
                            voxel.splice(relevant_index[direction_id],0,this.voxels[index][relevant_index[direction_id]])

                            var cv = get_voxel_at(voxel)
                            var cvid = `${cv},${i}`
                            if(highlight.has(cvid))
                            {
                                selection_map[cvid].distance = Math.max(selection_map[cvid].distance,distance)
                                continue
                            }
                            if(cv == null) continue

                            highlight.add(cvid)

                            var selection = {
                                voxel:[this.voxels[cv]],
                                direction:directions[direction_id],
                                color:[this.color[cv][i]],
                                distance:distance,
                                mouse_color:this.color[cv][i],
                                index:index,
                            }

                            selection_map[cvid] = selection

                            selections.push(selection)
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
                    id+=1
                }
            }

        }

        for(const index in this.faces)
        {
            var face = this.faces[index]
            for(var i = 0; i < face.length; i++)
            {
                if(face[i] == 0)
                {
                    continue
                }

                for(var j = 0; j < 4; j++)
                {
                    if(highlight.has(`${index},${i}`))
                    {
                        const item = selection_map[`${index},${i}`]
                        if(color)
                        {

     
                            var face_color = this.color[index][i].map((x,i) => {
                                var k = feather
                                if(k > 0)
                                {
                                    var d = item.distance / k
                                }
                                else
                                {
                                    var d = 1
                                }

                                var k_color =  (x * (1 - color[3]*d))+(color[i]*color[3]*d )

                                return k_color
                            })
                        }
                        else
                        {
                            var face_color = this.color[index][i].map(x => Math.abs(1-x* 0.5) )
                        }
                        result.push(...face_color,1)
                    }
                    else
                    {
                        result.push(...this.color[index][i],1)
                    }
                }
                id += 1
            }

        }


        setSelection(selections)
        return result;

        
        
    }
        
    build_faces()
    {
        const voxels = this.voxels
        const faces = new Array(voxels.length).fill(0).map(x => [1,1,1,1,1,1]);
        const [get_voxel_at] = useMap(this.voxels)

        for(var i = 0; i < voxels.length; i++)
        // for(var j = i+1; j < voxels.length; j++)
        {
            var top = getTop(voxels[i],get_voxel_at)

            if(top)
            {
                faces[i][4] = 0;
                faces[top][5] = 0;
            }
            
            var bottom = getBottom(voxels[i],get_voxel_at)

            if(bottom)
            {
                faces[i][5] = 0;
                faces[bottom][4] = 0;
            }
            var right = getRight(voxels[i],get_voxel_at)

            if(right)
            {
                faces[i][2] = 0;
                faces[right][3] = 0;
            }
            var left = getLeft(voxels[i],get_voxel_at)

            if(left)
            {
                faces[i][3] = 0;
                faces[left][2] = 0;
            }
            var front = getFront(voxels[i],get_voxel_at)

            if(front)
            {
                faces[i][0] = 0;
                faces[front][1] = 0;
            }            
            var back = getBack(voxels[i],get_voxel_at)
            if(back)
            {
                faces[i][1] = 0;
                faces[back][0] = 0;
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