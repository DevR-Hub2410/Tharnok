#version 300 es

layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec4 aColor;
layout(location = 2) in vec2 aTexCoord;

out vec4 vColor;
out vec2 vTexCoords;

void main()
{
    vColor = aColor;
    vTexCoords = aTexCoord;
    gl_Position = vec4(aPosition, 1.0);
}