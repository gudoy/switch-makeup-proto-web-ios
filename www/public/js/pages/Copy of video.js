// Optims:
// pics 1280 (source dim) => 1024 (display dim)
//   

app.video =
{
	init: function()
	{		
		// Get the current video from url
		var productName = window.location.search.replace(/^.*product=/,'').replace(/(.*?)(\&.*?)$/,'$1') || 'falseLashButterfly';
		
		this.nav();
		
		// Init the look module
		this.getthelook.init(productName);
		
		return this;
	},
	
	nav: function()
	{
		var self = this;
		
		$('#lookResult')
			.on(app.vtap, function(e)
			{
				// Play or pause the video(s)
				e.preventDefault();
				
				self.getthelook.srcvid[ self.getthelook.srcvid.paused ? 'play' : 'pause' ]();
			});

		
		return this;
	},
	
	getthelook:
	{
		method: 'vid+frameset',  // '1frameset', '2framesets', 'json', 'vid+frameset'
		videosUrl: 'public/videos/',
		videos: {'falseLashButterfly': {'name':'daria-1024', 'framesCount':399}},
		//videos: {'falseLashButterfly': {'name':'daria', 'framesCount':100}},
		frames: {'before':[], 'after':[]},
		loadedCount: 0,
		targetFps: '25',
		
		untouchables: 'input, select, textarea',
		
		init: function(videoName)
		{
			var self = this;
			
			// Cache some elements for later use
			this.$c 			= $('#canvas');
			this.c				= this.$c[0];
			this.ctx 			= this.c.getContext('2d');
			this.$loading 		= $('#loading'); 			
			//this.$track 		= $('#switch-p1');
			
			this.$srcvid 		= $('#srcvid');
			this.srcvid 		= this.$srcvid[0];
			
			this.$handle 		= $('#switch-p2');
			this.handle 		= {w: this.$handle.width(), maxX: $('#preview').width() - this.$handle.width() - parseInt(this.$handle.css('left'), 10) - 20};
			 
			this.RAF 			= null; 					// Init a reference to the RequestAnimationFrame that will be used later
			this.video 			= this.videos[videoName]; 	// Set a shortcut property to the current video
			
			// Set video divider data
			this.$divider 		= $('#divider');
			//this.divider 		= {w:82, h: this.c.height, pos: this.c.width};
			this.divider 		= {w:82, h: this.c.height, pos: 1024};
			
			this.dividerImg 	= new Image();
			this.dividerImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKQAAANsCAMAAADiOPM3AAABuVBMVEX///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+cq/r8AAAAknRSTlMBAgMFBwgKCw0OEBETFBUXGBobHB4gIiMkJigqKywvMDI0NTg5Oz0/QUNFRklLTE5QU1VWWFpdX2FjZWdpa21vcnN1d3p8foCChIaJi42OkZOVl5mbnZ+hpKaoqayusLKztri6u76/wcPFxsnKzM7P0tPV1tna293e4eLj5ebo6ers7e/w8fLz9fb3+Pn6+/z9/p+l+KMAAAJSSURBVHgB7c4hAQAgAASxv/590VgiILYEa7VWq9Y39jiSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKS3yYvro5BGOZHrbIAAAAASUVORK5CYII=';
			this.dividerImg.width = 82;
			this.dividerImg.height = 438,
			this.dividerC 		= $('#dividerC')[0];
			this.dividerCtx 	= this.dividerC ? this.dividerC.getContext('2d') : null;
			
			this.frameNb 		= -1;
			this.loop 			= false;
			this.paused  		= false;
			this.startTime 		= null;
			this.prevTime 		= null;
			this.endTime 		= null;
			this.targetFps = 25;
			
			// Preload the video
			this.preload(this.videoName);

this.handleVid();

//window.setTimeout(function(){ self.srcvid.play(); }, 1000);
			
			// Listen to touch/mouse moves on the product elements 
			this.handleSwitch();
			//this.updateDivider(this.divider.pos);
			
			return this;
		},
		
		handleVid: function()
		{
			var self = this;
			
			//$('#mainContent').removeClass('loading');			
			//$('#loading').remove();

this.tmpCount = 0;

//alert(this.srcvid.readyState);
//if ( this.srcvid.readyState ) { self.$srcvid.css('-webkit-transform:translateX(0)') }

$(this.$srcvid).on('loadeddata', function()
{ 
//alert('loaded data');
	//self.srcvid.play();
	//self.$srcvid.css('-webkit-transform:translateX(0)')
	
})

//$(this.$srcvid).on('play', function(){ alert('play'); })
$(this.$srcvid).on('loadeddata', function()
{ 
//alert('loaded data');
	//self.srcvid.play();
	//self.$srcvid.css('-webkit-transform:translateX(0)')
	
})

$(this.$srcvid).on('canplaythrough', function()
{ 
	//self.srcvid.play();
	//self.$srcvid.css('-webkit-transform:translateX(0)')
	
})

/*
$(this.$srcvid).on('progress', function()
{ 
alert('progress');
	//self.srcvid.play();
	self.$srcvid.css('-webkit-transform:translateX(0)')
	
})*/

$(this.$srcvid).on('playing', function()
{
	//alert('playing');
	
	//self.RAF = window.setInterval(function(){ self.draw2(); }, 1000/self.targetFps)
	self.draw2();
})
//$(this.$srcvid).on('timeupdate', function(){ console.log('timeupdate'); })
$(this.$srcvid).on('ended', function()
{ 
	console.log('ended');
	self.stop();
console.log(self.tmpCount);
})
		},
		
		start: function()
		{
			// Render
			//this.draw();
			
			//this.srcvid.play();
			
			return this;
		},
		
		stop: function()
		{
			this.paused = true;
			window.clearInterval(this.RAF);
			return this; 
		},
		
		handleSwitch: function()
		{
			var self 		= this,
	            start 		= cur = prev = end =
	                        {
	                            x:null, y:null, 
	                            //time:null, 			// x position, y position, time  
	                            vdir:null, hdir:null, dir:null, 	// directions: vertical ('T' or 'B'), horizontal ('L' or 'R'), global ('H' or 'V'),
	                            xdelta:null, ydelta:null 			// x & y delta from the previous state:
	                        },
	            total 		= 
	                        {
	                            //time:null, 
	                            dir:null, 
	                            xdelta:null, ydelta:null, 
	                            //speed:null, velocity:null, acceleration:null
	                        };
			this.moving = false;
			
			$(document)
				.on(app.vmousedown, '#switch', function(e)
				{
//console.log('start')
	                // Get current state
	                cur  =
	                {
	                    x:e.touches ? e.touches[0].pageX : e.pageX, y:e.touches ? e.touches[0].pageY : e.pageY,  
	                    vdir:null, hdir:null, dir:null, 
	                    xdelta:0, ydelta:0
	                };
	                
					// And save it as the start & previous state
	            	prev = start = cur;
	            	
	            	self.moving = true;
	            	
	            	//e.preventDefault();
				})
				.on(app.vmousemove, '#switch', function(e)
				{
					if ( !self.moving ){ return; }
					
	                // Do not handle touch events when the target is a 'untouchable'
	                if ( $(e.target).is(self.untouchables) ){ e.stopPropagation(); return; }
					
	                // Get current state
	                var pos = {x: e.touches ? e.touches[0].pageX : e.pageX, y: e.touches ? e.touches[0].pageY : e.pageY};
	                
	                cur =
	                {
	                    x:pos.x, y:pos.y, 
	                    xdelta:Math.abs(prev.x - pos.x), ydelta:Math.abs(prev.y - pos.y),
	                    hdir:pos.x < prev.x ? 'L' : 'R', vdir:pos.y < prev.y ? 'T' : 'B',  dir:cur.xdelta >= cur.ydelta ? 'H' : 'V',
	                };
	                
	                // Set the current state as the final one
	                end = cur;
	                
	                // Compute final data
	                total = 
	                {
	                    xdelta:Math.abs(start.x - end.x), ydelta:Math.abs(start.y - end.y), 
	                    hdir:end.x < start.x ? 'L' : 'R', vdir:end.y < start.y ? 'T' : 'B', dir:total.xdelta >= total.ydelta ? 'H' : 'V'
	                }; 
	                
	                // Do not continue any longer
	                if ( total.xdelta < 3 ){ return; }
	
					var newX 	= total.hdir === 'L' && total.xdelta > 0 ? 0 : ( total.xdelta > self.handle.maxX ? self.handle.maxX : total.xdelta ),
						transX 	= 'translateX(' + newX + 'px)';
						
					// Update product handle postion
					self.$handle.css({'-webkit-transform':transX, 'transform':transX});
					
					// Update divider position
					//self.divider.pos = self.c.width / ( self.handle.maxX / newX );
					self.divider.pos = 1024 - (self.c.width / ( self.handle.maxX / newX ));
					 
					//self.updateDivider(self.divider.pos);
	
					//e.preventDefault();
				})
				//.on('mouseleave', '#switch', function(e){ self.moving = false; })
				//.on('mouseleave', '#switch', function(e){ $(this).trigger('') })
				//.on(app.vmouseup, '#switch', function(e)
				.on(app.vmouseup + ' mouseleave', '#switch', function(e)
				{
//console.log('end');
					
					self.moving = false;
					
	                // Set the current state as the final one
	                end = cur;
	                
	                // Compute final data
	                total = 
	                {
	                    xdelta:Math.abs(start.x - end.x), ydelta:Math.abs(start.y - end.y),
	                    //time:end.time - start.time,
	                    hdir:end.x < start.x ? 'L' : 'R', vdir:end.y < start.y ? 'T' : 'B', dir:total.xdelta >= total.ydelta ? 'H' : 'V'
	                };
	                //total.speed = ( total.dir === 'H' ? total.xdelta : total.ydelta ) / total.time;
	                
	                //e.preventDefault();
				})
		},
		
		updateDivider: function(positionX)
		{
			var transf = 'translateX(' + (positionX) + 'px)';
			this.$divider.css({'-webkit-transform':transf, 'transform':transf});
			
			return this;			
		},
		
		preload: function(videoName)
		{
			// For every frames of a video
			for(var i=-1, len = this.video.framesCount-1; i<len; i++)
			{
				// Get the frame filename(s)
				var nb 		= (i < 9 ? '000' : ( i < 99  ? '00' :  '0' )) + (i + 1 + ''),
					//src 	= this.videosUrl + this.video.name + '/dual/' + this.video.name + '_' + nb  + '.jpg';
					src1 	= this.videosUrl + this.video.name + '/before/before' + nb  + '.jpg';
					src2 	= this.videosUrl + this.video.name + '/after/after' + nb  + '.jpg';
					
				// Preload the pics	
				if 		( this.method === '2framesets' ){ this.preloadFrame(src1); this.preloadFrame(src2); }
				else if ( this.method === 'vid+frameset' ){ this.preloadFrame(src2); }
			}
			
			return this;
		},
		
		preloadFrame: function(url)
		{			
			var self 		= this,
				which 		= url.indexOf('before') !== -1 ? 'before' : 'after', 	// Is it a frame from 'before' or 'after' video 
				nb 			= parseInt( url.replace(/^(.*\/)(.*)$/,'$2').replace(/\D/g, ''), 10), 				// Get the frame nb
				img 		= new Image(), 											// Create an image element
				
				// When the image is loaded
				onComplete 	= function()
				{
					// Create a canvas from the image
					//var $tmpc 	= $('<canvas />').attr({width:self.c.width, height:self.c.height}).attr({width:self.c.width, height:self.c.height})
						//tmpC 	= $tmpc[0];
						//tmpCtx 	= tmpC.getContext('2d');
						
					// Draw the image on the canvas 
					//tmpCtx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, self.c.width, self.c.height);
					
					// Store it
					//if 		( self.method === '2framesets' )	{ self.frames[which][nb] = img; }
					//if 		( self.method === '2framesets' )	{ self.frames[which][nb] = tmpC; }
					if 		( self.method === 'vid+frameset' )	{ self.frames[which][nb] = img; }
					
					// Update loading status
					self.isLoaded();
					
					// Delete the temp img
					//delete $tmpc;
					//delete tmpCtx;
					//delete tmpC;
					//delete tmpCtx;
				};
	
			// Set the image properties
			img.src 	= url;
			img.onload 	= function() { onComplete(); }
		},
		
		isLoaded: function()
		{
			// Get currently loaded frames count
			if ( this.method === '2framesets' )
			{
				var loadedFrames 	= this.frames.before.length + this.frames.after.length
					toBeLoaded 		= this.video.framesCount*2; 
			}
			else if ( this.method === 'vid+frameset' )
			{
				var loadedFrames 	= this.frames.after.length
					toBeLoaded 		= this.video.framesCount; 
			}
			
			// When all frames are ready
			if ( loadedFrames === toBeLoaded )
			{
				// Remove the loading markers
				this.$loading.remove();
				$('#mainContent').removeClass('loading');
				
				this.start();
			}
			else
			{				
				// Get the loading percentage
				var prct = (100 / (toBeLoaded / loadedFrames));
				
//console.log(loadedFrames);
//console.log(toBeLoaded);
				
				// Above 99%, we will display '100%'
				prct = prct >= 99 ? 100 : prct >> 0;
				
				// Update the progress bar & text
				this.$loading.find('.progress-value').attr('value', prct);
				this.$loading.find('.progress-text').text(prct + '%');
			}
			
			return this;
		},
		
		clear: function()
		{
			// Clear the canvas
			this.ctx.clearRect(0,0,this.c.width,this.c.height);
	
			return this;
		},
		
		draw: function()
		{
			var self = this;

			// Do not continue any longer if the video has been marked as paused
			if ( this.paused ){ return this; }
			
			//this.RAF = requestAnimationFrame(function(t){ self.draw(t); });
			this.RAF = window.setTimeout(function(){ self.draw(); }, 1000/this.targetFps);
			//this.RAF = window.setTimeout(function(){ self.draw(); }, 1);
			//this.RAF = window.setInterval(function(){ self.drawNext(); }, 1000/this.targetFps);
			
			this.drawNext();
			
			return this;			
		},
		
		drawFrame: function(number)
		{
//console.log(number);
			var self 	= this,
				//source 	= {w: 1024, h:550},
				source 	= {w: 1024, h:440},
				scaling = source.w / this.c.width,
				divSrcX = this.divider.pos * scaling
				//scaling =  1,
				p1 		= {x:0, y:0, w:this.divider.pos * scaling, h:source.h},
				p2 		= {x:divSrcX, y:0, w:(source.w - divSrcX), h:source.h},
				curTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
	
//console.log(this.frames.before[number]);
//console.log(this.divider.pos);
//console.log(scaling);
//console.log(p1);
//console.log(p2);
			// On the first launch, get the start time
			if ( this.startTime === null )			{ this.startTime = curTime; }
			
			var tdelta = this.prevFrameTime ? curTime - this.prevFrameTime : 0;
//console.log('delta: ' + tdelta);
			
			// If less than the expected times between 2 frames has passed by 
			if ( tdelta !== 0 && tdelta < 1000/this.targetFps )
			{
				this.frameNb--;
				return;
			}
			
			// Clear the canvas
			this.clear();
			
			if ( this.method === '2framesets' )
			{
				// 
				//this.ctx.drawImage(this.frames.before[number], p1.x, p1.x, p1.w, p1.h, 0, 0, this.divider.pos, this.c.height);
				//this.ctx.drawImage(this.frames.after[number], p2.x, p2.y, p2.w, p2.h, this.divider.pos, 0, this.c.width - this.divider.pos, this.c.height);
				
				//this.ctx.drawImage(this.frames.before[number], p1.x, p1.x);
				//this.ctx.drawImage(this.frames.after[number], p2.x, p2.y);	
				
				// Draw from images
				this.ctx.drawImage(this.frames.before[number], 0, 0);
				//this.ctx.drawImage(this.frames.after[number], p2.x, p2.y, p2.w, p2.h, this.divider.pos, 0, this.c.width - this.divider.pos, this.c.height);
				
				// Draw from canvas
				//this.ctx.drawImage(this.frames.before[number], 0, 0);
			}
			
			this.prevFrameTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
			
			// On the last frame
			if ( this.frameNb === this.video.framesCount - 1 )
			{ 
				this.endTime = this.prevFrameTime; 
//console.log('end time:' + this.endTime);
//console.log('play time:' + (this.endTime - this.startTime));
			}
		},
		
		draw2: function()
		{
			var self = this;
			
			//if ( this.srcvid.paused ){ return this; }
			//if ( this.srcvid.paused ){ self.stop(); return this; }
			
			//this.RAF = requestAnimationFrame(function(){ self.draw2(); });
			this.RAF = window.setTimeout(function(){ self.draw2(); }, 1000/this.targetFps);
			
			this.tmpCount++;
			
			// Clear the current canvas content
			this.clear();
			
			var imgNb = Math.round(this.srcvid.currentTime*1000 / 40);
			
			// Draw the proper 'after' frame
			this.ctx.drawImage(this.frames.after[imgNb], this.divider.pos, 0, 1024 - this.divider.pos, 440, this.divider.pos, 2, this.c.width - this.divider.pos, 436);
			
			// Draw the divider
			self.updateDivider(self.divider.pos);
			/*
			if ( this.dividerCtx )
			{
				this.dividerCtx.clearRect(0, 0, this.dividerC.width, this.dividerC.height);
				this.ctx.drawImage(this.dividerImg, this.divider.pos, 2, 81, 436);
			}*/
		},
		
		drawNext: function()
		{
//console.log('drawNext');
			
			this.frameNb++;
			 
			// Allow looping 
			if ( this.frameNb >= this.video.framesCount )
			{
this.paused = true;
				 
				if ( this.loop ){ this.frameNb = 0; } else { return; } 
			}
			
			this.drawFrame(this.frameNb);
			
			return this;
		}
	}
}