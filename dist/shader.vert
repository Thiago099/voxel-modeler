attribute vec3 position;
attribute vec3 normal;
attribute vec4 color;

uniform mat4 projection_matrix;
uniform mat4 view_matrix;
uniform mat4 model_matrix;
uniform mat4 uNormalMatrix;
uniform float disable_lighting;
uniform vec3 transform;

varying highp vec4 vColor;
varying highp vec3 vLighting;

void main(void) { 

    gl_Position = projection_matrix*view_matrix*model_matrix*vec4(position+transform, 1.);
    vColor = color;

    if(disable_lighting == 1.0)
    {
        vLighting = vec3(1.0, 1.0, 1.0);
    }
    else
    {

        highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
        
        highp vec3 frontColor = vec3(1, 1, 1);
        highp vec3 backColor = vec3(.8, .8, .8);

        highp vec3 frontVector = normalize(vec3(0.85, 0.8, 0.75));
        highp vec3 backVector = normalize(vec3(-0.85, -0.8, -0.75));

        highp vec4 transformedNormal = uNormalMatrix * vec4(normal, 1.0);

        highp float directional = max(dot(transformedNormal.xyz, frontVector), 0.0);
        highp float directional2 = max(dot(transformedNormal.xyz, backVector), 0.0);

        vLighting =  ambientLight + (frontColor * directional) + (backColor * directional2);
    }
}