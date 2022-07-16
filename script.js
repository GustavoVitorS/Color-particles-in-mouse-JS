/*Make changes to make the colors the way you want*/

window.onload = function () {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");

  //Make the canvas occupy the full page
  var W = window.innerWidth, H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;

  var particles = [];
  var mouse = {};

  //Lets create some particles now
  var particle_count = 70;
  for (var i = 0; i < particle_count; i++) {
    particles.push(new particle());
  }

  //finally some mouse tracking
  canvas.addEventListener('mousemove', track_mouse, false);

  function track_mouse(e) {
    //since the canvas = full page the position of the mouse 
    //relative to the document will suffice
    mouse.x = e.pageX;
    mouse.y = e.pageY;
  }

  function particle() {
    this.speed = { x: -4.6 + Math.random() * 6, y: -25 + Math.random() * 20 };
    //location = mouse coordinates
    //Now the flame follows the mouse coordinates
    if (mouse.x && mouse.y) {
      this.location = { x: mouse.x, y: mouse.y };
    }
    else {
      this.location = { x: W / 4, y: H / 4 };
    }
    this.radius = 10 + Math.random() * 40;
    this.life = 20 + Math.random() * 20;
    this.remaining_life = this.life;
    //colors
    this.r = Math.round(Math.random() * 555);
    this.g = Math.round(Math.random() * 555);
    this.b = Math.round(Math.random() * 555);
  }

  function draw() {
    //Painting the canvas black
    //Time for lighting magic
    //particles are painted with "lighter"
    //In the next frame the background is painted normally without blending to the 
    //previous frame
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      ctx.beginPath();
      //changing opacity according to the life.
      //opacity goes to 0 at the end of life of a particle
      p.opacity = Math.round(p.remaining_life / p.life * 200) / 200
      //a gradient instead of white fill
      var gradient = ctx.createRadialGradient(p.location.x, p.location.y, 0, p.location.x, p.location.y, p.radius);
      gradient.addColorStop(0, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", " + p.opacity + ")");
      gradient.addColorStop(0.5, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", " + p.opacity + ")");
      gradient.addColorStop(1, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", 0)");
      ctx.fillStyle = gradient;
      ctx.arc(p.location.x, p.location.y, p.radius, Math.PI * 2, false);
      ctx.fill();

      //lets move the particles
      p.remaining_life--;
      p.radius--;
      p.location.x += p.speed.x;
      p.location.y += p.speed.y;

      //regenerate particles
      if (p.remaining_life < 1 || p.radius < 1) {
        //a brand new particle replacing the dead one
        particles[i] = new particle();
      }
    }
  }

  setInterval(draw, 20);
}