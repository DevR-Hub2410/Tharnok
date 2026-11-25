#version 300 es

precision mediump float;

in vec4 vColor;
in vec2 vTexCoords;

uniform sampler2D uTexture;
uniform bool useTexture;

out vec4 fragColor;

void main()
{
    if(useTexture) {
        fragColor = vColor * texture(uTexture, vTexCoords);
    }else {
        fragColor = vColor;
    }
}