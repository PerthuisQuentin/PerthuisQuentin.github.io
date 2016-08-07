window.onload = function()
{
	ResizeCanvas();
	
	// Récupération du canvas et du context
	var canvas = document.getElementById('balls_canvas');
	if(!canvas) {
		alert("Impossible de récupérer le canvas");
		return;
	}

	var context = canvas.getContext('2d');
	if(!context) {
		alert("Impossible de récupérer le context du canvas");
		return;
	}

	// Définition d'un objet représentant une balle
	function Ball() {
		this.x = 0; this.y = 0;
		this.dir = 0;
		this.speed = 0;
		this.radius = 1;
		this.color = "#000000";
		
		// Initialisation des variables de la balle
		this.Init = function(x, y, dir, speed, radius, color) {
			this.x = x;
			this.y = y;
			this.dir = dir;
			this.speed = speed;
			this.radius = radius;
			this.color = color;
		};
		
		// Initialise avec des valeurs aléatoires
		this.InitRandom = function() {
			this.radius = Math.floor(Math.random() * (10 - 2)) + 2;
			this.x = Math.floor(Math.random() * (canvas.width - 2*this.radius)) + this.radius;
			this.y = Math.floor(Math.random() * (canvas.height - 2*this.radius)) + this.radius;
			this.dir = (Math.random() * 2 * Math.PI - Math.PI) * -1;
			this.speed = Math.floor(Math.random() * (10 - 2)) + 2;
			this.color = '#' + Math.floor(Math.random()*16777215).toString(16);
		};
		
		// Desinne la balle dans le canvas
		this.Draw = function(context) {
			// Dessine un cercle
			context.fillStyle = this.color;
			context.beginPath();
			context.arc(this.x, this.y, this.radius, 0, Math.PI*2);
			context.fill();
			context.closePath();
		};
		
		// Mets à jour les variables de la balle
		this.Update = function() {
			// Anticipation de la nouvelle position
			var newX = this.x + Math.cos(this.dir) * this.speed;
			var newY = this.y + Math.sin(this.dir) * this.speed;
			
			// Rebonds sur les bordures externes
			if ((newX > (canvas.width - this.radius)) || (newX < this.radius)) {
				if(this.dir > 0)
					this.dir = Math.PI - this.dir;
				else if(this.dir < 0)
					this.dir = -Math.PI - this.dir;
				else if(this.dir == 0) 
					this.dir = Math.PI;
				else if(this.dir == Math.PI)
					this.dir = 0;
			}
			else if ((newY > (canvas.height - this.radius)) || (newY < this.radius)) {
				this.dir = -this.dir;
			}
			
			// Mise à jour de la position
			this.x += Math.cos(this.dir) * this.speed;
			this.y += Math.sin(this.dir) * this.speed;
		};
	}
	
	//Tableau contenant toutes les balles
	var balls = [];
	
	// Récupération du slider
	var slider = document.getElementById('balls_slider');
	if(!slider) {
		alert("Impossible de récupérer le slider");
		return;
	}
	
	// Récupération de l'input
	var input = document.getElementById('balls_input');
	if(!input) {
		alert("Impossible de récupérer l'input");
		return;
	}
	
	// Change du nombre de balle
	function setBallAmount(amount) {
		var sliderValue = amount;
		
		if(balls.length < sliderValue) {
			var ballsNeeded = sliderValue - balls.length;
			for(var i = 0; i < ballsNeeded; i++) {
				var ball = new Ball();
				ball.InitRandom();
				balls.push(ball);
			}
		}
		else if(balls.length > sliderValue) {
			var ballsToRemove = balls.length - sliderValue;
			for(var i = 0; i < ballsToRemove; i++) {
				balls.pop();
			}
		}
	}
	
	// Evenement au changement de la valeur du slider
	slider.addEventListener("change", 
		function(e) {
			setBallAmount(e.srcElement.value);
			input.value = e.srcElement.value;
		}
	);
	
	// Evenement au changement de la valeur de l'input
	input.addEventListener("change",
		function(e) {
			setBallAmount(e.srcElement.value);
			slider.value = e.srcElement.value;
		}
	);
	
		
	// Initialisation des balles
	setBallAmount(1);
	
	// Boucle de rafraichissement du canvas
    Animate();

	// Fonction de rafraichissement du canvas
    function Animate()
    {
		// Clear du canvas
		context.clearRect(0, 0, canvas.width, canvas.height);
		
		// Mise à jour et affichage
		for(var b in balls) {
			balls[b].Update();
			balls[b].Draw(context);
		}
		
		requestAnimationFrame(Animate);
    } 
} 

window.onresize = ResizeCanvas;

// Redimensionne le canvas en fonction de la fenêtre
function ResizeCanvas() {
	var canvas = document.getElementById('balls_canvas');
	if(!canvas) {
		alert("Impossible de récupérer le canvas");
		return;
	}
	
	canvas.width = window.innerWidth * 0.9;
	canvas.height = window.innerHeight * 0.8;
}