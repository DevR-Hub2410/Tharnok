#version 300 es

layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec4 aColor;
layout(location = 2) in vec2 aTexCoord;
layout(location = 3) in vec3 aNormal;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

out vec4 vColor;
out vec2 vTexCoords;
out vec3 vNormal;

void main()
{
    vColor = aColor;
    vTexCoords = aTexCoord;
    vNormal = normalize(mat3(transpose(inverse(uModel))) * aNormal);
    gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);
}