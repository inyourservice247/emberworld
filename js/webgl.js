// ── WEBGL SKY RENDERER ──────────────────────────────────────

let gl, program, texture;
let yaw = 0, pitch = 10;
let targetYaw = 0, targetPitch = 10;
let fov = 90;
let animating = false;
let autoRotate = true;
let autoRotateTimer = null;

const vsSource = `
  attribute vec2 a_pos;
  varying vec2 v_uv;
  void main() { v_uv = a_pos; gl_Position = vec4(a_pos, 0, 1); }
`;

const fsSource = `
  precision mediump float;
  varying vec2 v_uv;
  uniform sampler2D u_tex;
  uniform float u_yaw, u_pitch, u_fov;
  uniform vec2 u_res;
  #define PI 3.14159265358979
  void main() {
    float aspect = u_res.x / u_res.y;
    float fovRad = u_fov * PI / 180.0;
    float f = 1.0 / tan(fovRad * 0.5);
    vec3 ray = normalize(vec3(v_uv.x / f * aspect, v_uv.y / f, -1.0));
    float cy = cos(u_yaw), sy = sin(u_yaw);
    float cp = cos(u_pitch), sp = sin(u_pitch);
    vec3 r = vec3(cy*ray.x + sy*ray.z, ray.y, -sy*ray.x + cy*ray.z);
    vec3 r2 = vec3(r.x, cp*r.y - sp*r.z, sp*r.y + cp*r.z);
    float lon = atan(r2.x, -r2.z);
    float lat = asin(clamp(r2.y, -1.0, 1.0));
    gl_FragColor = texture2D(u_tex, vec2(lon/(2.0*PI)+0.5, 1.0-(lat/PI+0.5)));
  }
`;

function initGL() {
  const canvas = document.getElementById('sky-canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) {
    document.body.innerHTML += '<div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);color:orange;font-size:18px;padding:20px;background:#000;z-index:9999">WebGL not supported on this device</div>';
    return;
  }

  function mkShader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }

  program = gl.createProgram();
  gl.attachShader(program, mkShader(gl.VERTEX_SHADER, vsSource));
  gl.attachShader(program, mkShader(gl.FRAGMENT_SHADER, fsSource));
  gl.linkProgram(program);
  gl.useProgram(program);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

  const loc = gl.getAttribLocation(program, 'a_pos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  // placeholder dark pixel while image loads
  texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([3,5,13,255]));

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onerror = function() {
    document.body.innerHTML += '<div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);color:red;font-size:16px;padding:20px;background:#000;z-index:9999;text-align:center">skybox.jpg failed to load.<br>Make sure it is in the repo root.</div>';
  };
  img.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    renderGL();
  };
  img.src = '/skybox.jpg';

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    renderGL();
  });
}

function renderGL() {
  if (!gl) return;
  const c = document.getElementById('sky-canvas');
  gl.viewport(0, 0, c.width, c.height);
  gl.uniform1f(gl.getUniformLocation(program, 'u_yaw'),   yaw   * Math.PI / 180);
  gl.uniform1f(gl.getUniformLocation(program, 'u_pitch'), pitch * Math.PI / 180);
  gl.uniform1f(gl.getUniformLocation(program, 'u_fov'),   fov);
  gl.uniform2f(gl.getUniformLocation(program, 'u_res'),   c.width, c.height);
  gl.uniform1i(gl.getUniformLocation(program, 'u_tex'),   0);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  updateStarPositions();
}

function animateGL() {
  if (!animating) return;
  if (autoRotate) targetYaw -= 0.03;
  yaw   += (targetYaw   - yaw)   * 0.12;
  pitch += (targetPitch - pitch) * 0.12;
  pitch = Math.max(-60, Math.min(60, pitch));
  renderGL();
  requestAnimationFrame(animateGL);
}

function stopAutoRotate() {
  autoRotate = false;
  clearTimeout(autoRotateTimer);
  autoRotateTimer = setTimeout(() => { autoRotate = true; }, 8000);
}
