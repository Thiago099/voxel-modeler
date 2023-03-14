class attributeBuilder
{
    constructor(gl, program, canvas)
    {
        this.gl = gl;
        this.program = program;
        this.canvas = canvas;

        this.attribute_matrix_4_mat_float = varProxy((name, value) => {
            var location = gl.getUniformLocation(this.program, name)
            gl.uniformMatrix4fv(location, false, value)
        })
        this.uniform_float = varProxy((name, value) => {
            var location = gl.getUniformLocation(this.program, name)
            gl.uniform1f(location, value)
        })
        this.uniform_4_float = varProxy((name, value) => {
            var location = gl.getUniformLocation(this.program, name)
            gl.uniform4f(location, value[0], value[1], value[2], value[3])
        })
        this.uniform_3_float = varProxy((name, value) => {
            var location = gl.getUniformLocation(this.program, name)
            gl.uniform3f(location, value[0], value[1], value[2])
        })


        this.attribute_matrix_3_float = varProxy((name, value) => {
            var vertex_buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(value), gl.STATIC_DRAW);
        
            var attribute = gl.getAttribLocation(this.program, name);
            gl.vertexAttribPointer(attribute, 3, gl.FLOAT, false,0,0);
            gl.enableVertexAttribArray(attribute);
        })

        this.attribute_matrix_4_float = varProxy((name, value) => {
            var vertex_buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(value), gl.STATIC_DRAW);
        
            var attribute = gl.getAttribLocation(this.program, name);
            gl.vertexAttribPointer(attribute, 4, gl.FLOAT, false,0,0);
            gl.enableVertexAttribArray(attribute);
        })
    }
    set face(faces)
    {
        this.faces = faces;
    }

    buffer(callback)
    {
        const gl = this.gl;
        const canvas = this.canvas;
        // Create a framebuffer object
        const framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);


        //
        var depthBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, canvas.width, canvas.height);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);


        // Create a texture object to attach to the framebuffer
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        

        callback();

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        return texture;

    }
    

    getPixel(x,y)
    {
        const gl = this.gl;
        const data = new Uint8Array(4);
        gl.readPixels(
            x,            // x
            y,            // y
            1,                  // width
            1,                  // height
            gl.RGBA,             // format
            gl.UNSIGNED_BYTE,   // type
            data);              // typed array to hold result
        return data;
    }
    drawSolid(faces)
    {
        const gl = this.gl;
        if(!faces)
        {
            if(this.faces == undefined)
                throw "No faces defined";
            else
                faces = this.faces;
        }

        var index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(faces), gl.STATIC_DRAW);

        gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE)
        gl.drawElements(gl.TRIANGLES, faces.length, gl.UNSIGNED_SHORT, 0);
    }
    drawLines(faces)
    {
        const gl = this.gl;
        if(!faces)
        {
            if(this.faces == undefined)
                throw "No faces defined";
            else
                faces = this.faces;
        }

        var index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(faces), gl.STATIC_DRAW);

        gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE)
        gl.drawElements(gl.LINES, faces.length, gl.UNSIGNED_SHORT, 0);
    }
}

function varProxy(callback)
{
    return new Proxy({}, {
        set: function(target, name, value) {
            callback(name,value)
            return true;
        }
    });
}

function webgl(canvas, vertCode, fragCode)
{
    const gl = canvas.getContext('webgl2', {antialias: true});
    const program = gl.createProgram();

    const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragCode);
    gl.compileShader(fragShader);
    gl.attachShader(program, fragShader);

    const vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertCode);
    gl.compileShader(vertShader);
    gl.attachShader(program, vertShader);

    gl.linkProgram(program);
    gl.useProgram(program);

    return [gl, new attributeBuilder(gl, program, canvas)];
}


export {webgl}