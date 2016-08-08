window.onload = function()
{
	ResizeCanvas();
	
	// Récupération du canvas et du context
	var canvas = document.getElementById('balls-canvas');
	if(!canvas) {
		alert("Impossible de récupérer le canvas");
		return;
	}

	var context = canvas.getContext('2d');
	if(!context) {
		alert("Impossible de récupérer le context du canvas");
		return;
	}
	
	var duplicationCheck = document.getElementById('mode-duplication');
	if(!duplicationCheck) {
		alert("Impossible de récupérer le checkbox de duplication");
		return;
	}
	
	var duplicationMode = false;
	
	duplicationCheck.addEventListener("change",
		function(e) {
			duplicationMode = e.target.checked;
		}
	);
	
	//Tableau contenant toutes les balles
	var balls = [];
	var newBalls = [];
	var ballsToDelete = [];
	var nextId = 0;
	
	// Définition d'un objet représentant une balle
	function Ball() {
		this.id = nextId++;
		this.original = true;
		this.x = 0; this.y = 0;
		this.dir = 0;
		this.speed = 0;
		this.radius = 1;
		this.color = "#000000";
		
		// Initialisation des variables de la balle
		this.Init = function(x, y, dir, speed, radius, color, original) {
			this.x = x;
			this.y = y;
			this.dir = dir;
			this.speed = speed;
			this.radius = radius;
			this.color = color;
			this.original = original
		};
		
		// Initialise avec des valeurs aléatoires
		this.InitRandom = function() {
			this.radius = Math.floor(Math.random() * (30 - 4)) + 4;
			this.x = Math.floor(Math.random() * (canvas.width - 2*this.radius)) + this.radius;
			this.y = Math.floor(Math.random() * (canvas.height - 2*this.radius)) + this.radius;
			this.dir = (Math.random() * 2 * Math.PI - Math.PI) * -1;
			this.speed = Math.floor(Math.random() * (10 - 2)) + 2;
			this.color = '#' + Math.floor(Math.random()*16777215).toString(16);
			this.original = true;
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
				if(duplicationMode) this.ReboundDuplication();
					
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
				if(duplicationMode) this.ReboundDuplication();
				this.dir = -this.dir;
			}
			
			// Mise à jour de la position
			this.x += Math.cos(this.dir) * this.speed;
			this.y += Math.sin(this.dir) * this.speed;
		};
		
		// Dupplique la balle
		this.ReboundDuplication= function() {
			var newRadius = this.radius / 2;
			if(newRadius < 0.5) {
				ballsToDelete.push(this.id);
				if(this.original) {
					var newBall = new Ball();
					newBall.InitRandom();
					newBalls.push(newBall);
				}
				return;
			}
			
			this.radius = newRadius;
			
			var duplicata = new Ball();
			var newDir;
			if(this.dir > 0) newDir = this.dir - Math.PI;
			else if(this.dir < 0) newDir = this.dir + Math.PI;
			else newDir = 0;
			
			duplicata.Init(this.x, this.y, newDir, this.speed, this.radius, this.color, false);
			newBalls.push(duplicata);
		};
	}
	
	// Récupération du slider
	var slider = document.getElementById('balls-slider');
	if(!slider) {
		alert("Impossible de récupérer le slider");
		return;
	}
	
	// Récupération de l'input
	var input = document.getElementById('balls-input');
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
				newBalls.push(ball);
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
			setBallAmount(e.target.value);
			input.value = e.target.value;
		}
	);
	
	// Evenement au changement de la valeur de l'input
	input.addEventListener("change",
		function(e) {
			var v = Math.round(e.target.value);
			v = v>200?200:v;
			v = v<0?0:v;
			
			e.target.value = v;
			setBallAmount(v);
			slider.value = v;
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
			
			if(ballsToDelete.indexOf(balls[b].id) === -1)
				newBalls.push(balls[b]);
		}
		
		balls = newBalls;
		newBalls = [];
		ballsToDelete = [];
		
		requestAnimationFrame(Animate);
    } 
} 

window.onresize = ResizeCanvas;

// Redimensionne le canvas en fonction de la fenêtre
function ResizeCanvas() {
	var canvas = document.getElementById('balls-canvas');
	if(!canvas) {
		alert("Impossible de récupérer le canvas");
		return;
	}
	
	canvas.width = window.innerWidth * 0.9;
	canvas.height = window.innerHeight * 0.8;
}