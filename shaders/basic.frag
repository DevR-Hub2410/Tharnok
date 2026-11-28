#version 300 es

precision mediump float;

in vec4 vColor;
in vec2 vTexCoords;
in vec3 vNormal;

uniform sampler2D uTexture;
uniform bool useTexture;

out vec4 fragColor;

void main()
{
    vec4 baseColor = vColor;
    if(useTexture) {
        baseColor *= texture(uTexture, vTexCoords);
    }

    vec3 lightDirection = normalize(vec3(-0.4, 0.8, 0.3));
    float difusse = max(dot(normalize(vNormal), lightDirection), 0.0);
    float ambient = 0.35;
    float lighting = ambient + difusse * 0.65;

    fragColor = vec4(baseColor.rgb * lighting, baseColor.a);
}