// http://blog.millermedeiros.com/html5-video-issues-on-the-ipad-and-how-to-solve-them/
// http://blog.millermedeiros.com/unsolved-html5-video-issues-on-ios/
// http://www.w3.org/2010/05/video/mediaevents.html
// http://www.w3.org/TR/html5/embedded-content-0.html#mediaevents
// http://stackoverflow.com/questions/7884653/how-do-i-manually-loop-an-html5-video-in-ios-4-3-5
// http://www.html5rocks.com/en/tutorials/canvas/performance/
app.video =
{
	init: function()
	{
		//
		this.handleProduct();
		
		// 
		this.nav();
		
		// Init the look module
		this.getthelook.init(this.productName);
		
		return this;
	},
	
	nav: function()
	{
		var self 		= this,
			$preview 	= $('#preview'),
			$ecommerce 	= $('#ecommerce');
		
		$(document)
			.on(app.vtap, '#lookResult', function(e)
			{
				e.preventDefault();
				e.stopImmediatePropagation();
				e.stopPropagation();
				
				// Play or pause the video(s)
				self.getthelook.srcvid[ self.getthelook.srcvid.paused ? 'play' : 'pause' ]();
				
				return false;
			});

		//$(document).on(app.vtap, '#backAction', function(e){});
		
		$(document)
			.on(app.vtap, '#ecommerce header', function(e)
			{
				e.preventDefault();
				e.stopImmediatePropagation();
				e.stopPropagation();
				
				if ( !$ecommerce.hasClass('active') )
				{
					$ecommerce.addClass('active');
					$preview.addClass('inactive');
				}
				else
				{
					$ecommerce.removeClass('active');
					$preview.removeClass('inactive');
				}
				
				return false;
			})
			.on(app.vtap, '#ecommerce', function(e)
			{
				e.preventDefault();
				e.stopImmediatePropagation();
				e.stopPropagation();
				
				//window.location.href = app.product.shopUrl;
				
				return false;
			});
		
		return this;
	},
	
	handleProduct: function()
	{		
		var self 		= this,
			productKey 	= window.location.search.replace(/^.*product=/,'').replace(/(.*?)(\&.*?)$/,'$1') || 'falseLashButterfly', // Get the current video from url
			$video 		= $('#srcvid'),
			$preview 	= $('#preview');
			
		if ( !productKey ) { return this; }
		
		// Store a shortcut to the current product
		this.product = app.products[productKey];
		
		// Update video sources
		$video
			.attr({
				'width': 1024,
				'height': 440,
				'id': 'srcvid',
				'preload': 'auto',
				'autoplay': true,
				//'loop': false,
				'webkit-playsinline': 'webkit-playsinline',
				'poster': 'public/videos/' + self.product.video.fileName + '.jpg'
			})
			.find('source').attr('src', function(i,val){ return (val || '').replace(/^(.*)?(\..*)$/,'public/videos/' + self.product.video.fileName + '$2'); });
			
			
		// Required for webkit to load the changed video 
		$video[0].load();
		//$video[0].play();
		
		// Update product preview contents
		$preview.attr('class', 'preview ' + productKey);
		$preview.find('.name').text(this.product.name);
		$preview.find('.switch-p1').attr('src', 'public/products/' + productKey + '/' + productKey + '-p1.png');
		$preview.find('.switch-p2').attr('src', 'public/products/' + productKey + '/' + productKey + '-p2.png');
		$preview.find('.hint').text(this.product.hint || '');
		
		return this;
	},
	
	getthelook:
	{
		method: 'vid+frameset',  // '1frameset', '2framesets', 'json', 'vid+frameset'
		framesUrl: 'public/videos/',
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
			//this.video 			= this.videos[videoName]; 	// Set a shortcut property to the current video
			//this.video 			= this.videos[videoName]; 	// Set a shortcut property to the current video
			this.video 			= app.video.product.video; 	// Set a shortcut property to the current video
			this.video.framesName = app.video.product.key;
			
			// Set video divider data
			this.$divider 		= $('#divider');
			//this.divider 		= {w:82, h: this.c.height, pos: this.c.width};
			this.divider 		= {w:82, h: this.c.height, pos: 0};
			
			/*
			this.dividerImg 	= new Image();
			this.dividerImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKQAAANsCAMAAADiOPM3AAABuVBMVEX///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+cq/r8AAAAknRSTlMBAgMFBwgKCw0OEBETFBUXGBobHB4gIiMkJigqKywvMDI0NTg5Oz0/QUNFRklLTE5QU1VWWFpdX2FjZWdpa21vcnN1d3p8foCChIaJi42OkZOVl5mbnZ+hpKaoqayusLKztri6u76/wcPFxsnKzM7P0tPV1tna293e4eLj5ebo6ers7e/w8fLz9fb3+Pn6+/z9/p+l+KMAAAJSSURBVHgB7c4hAQAgAASxv/590VgiILYEa7VWq9Y39jiSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKS3yYvro5BGOZHrbIAAAAASUVORK5CYII=';
			this.dividerImg.width = 82;
			this.dividerImg.height = 438,
			this.dividerC 		= $('#dividerC')[0];
			this.dividerCtx 	= this.dividerC ? this.dividerC.getContext('2d') : null;
			*/
			
			this.frameNb 		= -1;
			this.prevFrameNb 	= -1;
			this.paused  		= false;
			this.startTime 		= null;
			this.prevTime 		= null;
			this.endTime 		= null;
			this.targetFps = 25;
			
this.fixedTime = 0;
			
			// Preload the video frame
			this.preload(this.videoName);

			// Init the video
			this.handleVid();
			
			// Listen to touch/mouse moves on the product elements 
			this.handleSwitch();
			//this.updateDivider(this.divider.pos);
			
			return this;
		},
		
		handleVid: function()
		{
			var self = this;

			//if ( app.os === 'ios' ){  }

			$(this.$srcvid)
				.on('loadeddata', function()
				{
					//self.srcvid.play();
				})
				.on('playing', function()
				{
					$('#playAction').addClass('hidden');
					
					// 
					if ( self.srcvid.currentSrc.indexOf('none') !== -1 ){ return; }
					
					// 
					self.draw();
				})
				//.on('timeupdate', function(){ console.log('timeupdate'); })
				.on('ended', function()
				{
//console.log('video ended')
					self.stop(); 
					self.startTime = self.endTime = self.prevTime = null;
					self.srcvid.currentTime = 0.1;
					self.srcvid.play();
				})
				
			//this.srcvid.play();
				
			return this;
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
		
	    getXtranslateOffset: function($el)
	    {
	        //var transf = $el.css('-webkit-transform') || $el.css('transform');
	        var transf = $el[0].style.webkitTransform;
//console.log(transf);
//console.log('transf: ' + ( transf ? transf.replace(/\D/g, '') : 0 ));
	        //return (transf && transf.match(/translate3d.*/)) ? parseInt(transf.split('(')[1], 10) : 0;
	        return  ( transf ? parseInt(transf.replace(/\D/g, ''), 10) : 0 );
	    },
		
		handleSwitch: function()
		{
			var self 		= this,
	            start 		= cur = prev = end =
	                        { x:null, y:null, vdir:null, hdir:null, dir:null, xdelta:null, ydelta:null },
	            total 		= { dir:null, xdelta:null, ydelta:null };
			this.moving = false;
			
			
			var pgX 	= $('#video')[0].offsetLeft,
				ini 	= {x: pgX + parseInt($('#switch-p2').css('left') || 0, 10)};
				ratio 	= $('#preview').width(),
				iniX 	= null;
//console.log('pg x: ' + pgX);
//console.log('ini x: ' + ini.x);
			
			$(document)
				.on(app.vmousedown, '#switch', function(e)
				{
	                // Get current state
	                cur  =
	                {
	                    x:e.touches ? e.touches[0].pageX : e.pageX, y:e.touches ? e.touches[0].pageY : e.pageY,  
	                    vdir:null, hdir:null, dir:null, xdelta:0, ydelta:0
	                };
	                
					// And save it as the start & previous state
	            	prev = start = cur;
	            	
	            	self.moving = true;
	            	
	            	iniX = self.getXtranslateOffset(self.$handle);
//console.log('iniX: ' + iniX);
//setTimeout(function(){ alert('iniX: ' + iniX); }, 300);
	            	
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
	
					var //newX 	= total.hdir === 'L' && total.xdelta > 0 ? 0 : ( total.xdelta > self.handle.maxX ? self.handle.maxX : total.xdelta ),
						//newX 	= total.hdir === 'L' && total.xdelta > 0 ? 0 + iniX : ( total.xdelta + iniX > self.handle.maxX ? self.handle.maxX : iniX + total.xdelta ),
						newX 	= total.hdir === 'L' 
							? ( iniX - total.xdelta < 0 ? 0 : iniX - total.xdelta ) 
							: ( total.xdelta + iniX > self.handle.maxX ? self.handle.maxX : iniX + total.xdelta ),
						//newX 	= (cur.x - pgX) - ini.x,
						transX 	= 'translateX(' + newX + 'px)';
					
//var orig = cur.x - 	
//console.log(newX);
						
					// Update product handle postion
					self.$handle.css({'-webkit-transform':transX, 'transform':transX});
					
					// Update divider position
					self.divider.pos = (self.c.width / ( self.handle.maxX / newX ));
					//self.divider.pos = 1024 - (self.c.width / ( self.handle.maxX / newX ));
					 
					//self.updateDivider(self.divider.pos);
	
					//e.preventDefault();
				})
				//.on('mouseleave', '#switch', function(e){ self.moving = false; })
				//.on('mouseleave', '#switch', function(e){ $(this).trigger('') })
				//.on(app.vmouseup, '#switch', function(e)
				.on(app.vmouseup + ' mouseleave', '#switch', function(e)
				{
					self.moving = false;
					
	                // Set the current state as the final one
	                end = cur;
	                
	                // Compute final data
	                total = 
	                {
	                    xdelta:Math.abs(start.x - end.x), ydelta:Math.abs(start.y - end.y),
	                    hdir:end.x < start.x ? 'L' : 'R', vdir:end.y < start.y ? 'T' : 'B', dir:total.xdelta >= total.ydelta ? 'H' : 'V'
	                };
	                
	                //e.preventDefault();
				})
		},
		
		updateDivider: function(positionX)
		{
			var transf = 'translateX(' + (positionX - 80) + 'px)';
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
					//src1 	= this.videosUrl + this.video.name + '/before/before' + nb  + '.jpg';
					//src2 	= this.videosUrl + this.video.name + '/after/after' + nb  + '.jpg';
					//src1 	= this.framesUrl + this.video.framesName + '/before/before' + nb  + '.jpg';
					src2 	= this.framesUrl + this.video.framesName + '/after/after' + nb  + '.jpg';
					
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
			
			//if ( this.srcvid.paused ){ return this; }
			//if ( this.srcvid.paused ){ self.stop(); return this; }
			
			//this.RAF = requestAnimationFrame(function(){ self.draw(); });
			this.RAF = window.setTimeout(function(){ self.draw(); }, 1000/this.targetFps);
			
			var vidTime = this.srcvid.currentTime,
				curTime = Date.now();
			
			// On iOS, the currentTime is not always correctly updated
			// if the currentTime is 0, assume we are in this case and thus, try to get the current time
			if ( this.startTime && vidTime === 0 )
			{ 
				vidTime = curTime - this.startTime; 
this.fixedTime++; 
//if( !this.fixedTime < 5 ){ alert('fixed vid time:' + vidTime); } 
			}
			
			// Store the video startTime
			if ( !this.startTime ){ this.startTime = curTime - vidTime; }
			
			var imgNb = Math.round(vidTime*1000 / 40);
			
			// Prevent frame nb from exceeding the current video frames count
			if ( imgNb > this.video.framesCount-1  ){ imgNb = framesCount-1; }
			
			// Do no continue any longer if the frame number is the same than the previous drawing
			//if ( imgNb === this.prevFrameNb ){ return; }
			if ( imgNb === this.prevFrameNb )
			{
//alert('skipped frame: ' + imgNb + ', currentTime: ' + vidTime ); 
			}
			
			// Store the drawn frame number (for later use)
			this.prevFrameNb = imgNb;
			
			// Clear the current canvas content
			this.clear();
			
			// Draw the proper 'after' frame
			//this.ctx.drawImage(this.frames.after[imgNb], this.divider.pos, 0, 1024 - this.divider.pos, 440, this.divider.pos, 2, this.c.width - this.divider.pos, 436);
			try
			{
				this.ctx.drawImage(this.frames.after[imgNb], 0, 0, this.divider.pos, 440, 0, 2, this.divider.pos, 436);	
			}
			catch(e)
			{
//alert(e.message + ' on ' + imgNb);
			}
			
			
			// Draw the divider
			self.updateDivider(self.divider.pos);
			/*
			if ( this.dividerCtx )
			{
				this.dividerCtx.clearRect(0, 0, this.dividerC.width, this.dividerC.height);
				this.ctx.drawImage(this.dividerImg, this.divider.pos, 2, 81, 436);
			}*/
		}
	}
}