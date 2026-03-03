const canvas = document.getElementById('dotCanvas');
const ctx = canvas.getContext('2d');

let dots = [];
let stars = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createDots();
    createStars();
}

function createDots() {
    dots = []; 
    for (let i = 0; i < 150; i++) {
        dots.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,

            radius: Math.random() * 4 + 2,

            dx: (Math.random() - 0.5) * 0.75,
            dy: (Math.random() - 0.5) * 0.75,

            color: "#ffffff"
        });
    }
}

function drawStar(x, y, outerRadius, innerRadius, points) {
    let angle = Math.PI / points;

    ctx.beginPath();
    for (let i = 0; i < 2 * points; i++) {
        let radius = i % 2 === 0 ? outerRadius : innerRadius;
        let currentAngle = i * angle;

        let sx = x + Math.cos(currentAngle) * radius;
        let sy = y + Math.sin(currentAngle) * radius;

        if (i === 0) {
            ctx.moveTo(sx, sy);
        } else {
            ctx.lineTo(sx, sy);
        }
    }
    ctx.closePath();
    ctx.fill();
}

function createStars() {
    stars = [];

    for (let i = 0; i < 100; i++) {
        
        let speed = Math.random() * 0.5 + 0.2;
        let angle = Math.random() * 2 * Math.PI;

        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            dx: Math.cos(angle) * speed,
            dy: Math.sin(angle) * speed,
            size: Math.random() * 2,
            brightness: Math.random(),
            twinkleSpeed: Math.random() * 0.02 + 0.01,
        });
    }
}

let mouseX = -100;
let mouseY = -100;

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
});

function drawBackground() {
    let gradient = ctx.createRadialGradient
    (canvas.width / 2, canvas.height / 2, 50, canvas.width / 2, canvas.height / 2, canvas.width);
    let color3 =  "rgb(49, 0, 71)";
    let color2 = "rgb(102, 0, 148)";
    let color1 = "rgb(130, 0, 175)";

    gradient.addColorStop(0, color3);
    gradient.addColorStop(0.5, color2);
    gradient.addColorStop(1, color1);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawStars() {
    stars.forEach(star => {
        star.x += star.dx;
        star.y += star.dy;

        if(star.x < 0) {
            star.x = canvas.width;
        }
        if(star.x > canvas.width) {
            star.x = 0;
        }

        if(star.y < 0) {
            star.y = canvas.height;
        }
        if(star.y > canvas.height) {
            star.y = 0;
        }

        star.brightness += star.twinkleSpeed;
        if(star.brightness > 1 || star.brightness < 0) {
            star.twinkleSpeed *= -1;
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
        drawStar(star.x, star.y, star.size * 3, star.size * 1.5, 5);
    })
}

function drawLines() {
    for(let i = 0; i < dots.length; i++) {
        for(let j = i + 1; j < dots.length; j++) {

            let dist = Math.sqrt((dots[i].x - dots[j].x) ** 2 + (dots[i].y - dots[j].y) ** 2);

            if(dist<80) {
                let alpha = 1-(dist/100);
                let hue = 290-(dist/2);

                ctx.strokeStyle = `hsla(${hue}, 100%, 40%, ${alpha})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(dots[i].x, dots[i].y);
                ctx.lineTo(dots[j].x, dots[j].y);
                ctx.stroke();
            }
        }
    }
}

function animateDots() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    drawStars();
    
    dots.forEach(dot => {
        let distance = Math.sqrt((dot.x - mouseX) ** 2 + (dot.y - mouseY) **2);

        if(distance < 60) {
            let angle = Math.atan2(dot.y - mouseY, dot.x - mouseX);
            dot.x += Math.cos(angle) * 5;
            dot.y += Math.sin(angle) * 5;
        } else {
            dot.x += dot.dx;
            dot.y += dot.dy;
        }

        if(dot.x < 0 || dot.x > canvas.width) {
            dot.dx *= -1;
        }
        if(dot.y < 0 || dot.y > canvas.height) {
            dot.dy *= -1;
        }

        ctx.fillStyle = dot.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = dot.color;
        drawStar(dot.x, dot.y, dot.radius * 1, dot.radius * 0.5, 5);
        ctx.shadowBlur = 0;
    });

    drawLines();

    requestAnimationFrame(animateDots);
}

window.onload = () => {
    resizeCanvas();
    animateDots();
    console.log("Canvas initialized and animation started.");
};

window.addEventListener('resize', resizeCanvas);


const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
    });
}, {
    threshold: 0.3
});

const titleCard = document.querySelector(".title-card");
const projectCard1 = document.querySelector(".project-card-1");
const projectCard2 = document.querySelector(".project-card-2");
const projectCard3 = document.querySelector(".project-card-3");
observer.observe(titleCard)
observer.observe(projectCard1);
observer.observe(projectCard2);
observer.observe(projectCard3);