You can click to add and remove voxels, with a variety of tools, that you can also use to color their faces.

Once you are done you can save a editable .vox file or a obj file with a texture

## patch notes:

vram leek fixed
added feather to the brushes

![image](https://user-images.githubusercontent.com/66787043/227627193-07205c31-20b1-4c93-8e15-442b071af9cc.png)

[gh pages preview](https://thiago099.github.io/voxel-modeler/)

example of geometry generated by this program

![image](https://user-images.githubusercontent.com/66787043/227626184-2ed1fa57-94ad-4b20-b97a-e259adba2c00.png)


# Here are some controls:

# General

- Ctrl + z to undo
- Ctrl + y to redo
- Ctrl + x to subdivide
## Camera:
- Ctrl + Left click and drag to rotate
- Ctrl + Right click and drag to pan
- Scroll to zoom
## Object:

## Pen
- Click and drag to paint, in either sculpt and paint mode

### Sculpt mode
- Left click to add a voxels from the highlighted faces
- Right click to remove a voxel from the highlighted faces

### Paint mode
- Left click to color the highlighted face, the foreground color
- Right click to color the highlighted face, the background color
- Middle click to set the foreground color to the highlighted faces color

### Tool options
- Radius affect the range of the pen and line
- Feather affect the smoothness of the pen in paint mode
- The circle button refers to the shape of the pen, if it is a circle or a square
- Contiguous say that only connected voxels will be affected by the (plane, horizontal and vertical lines)


[source code](https://github.com/Thiago099/voxel-modeler/)
