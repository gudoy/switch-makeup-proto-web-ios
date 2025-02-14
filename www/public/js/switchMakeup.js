var app = $.extend(app || {}, 
{
	init: function()
	{
		this.isPhoneGap = false;
		
		
		// Prepage page (sniff browser, platform, os ..., handle orientation, ...)
		this.prepare();
		
		this.routes();
		
		// Init navigation
		this.nav();
		
		this.trialMsg = "Switch Makeup - Trial Version.\n";
		
		// Cache the current page & it's id
		this.$page = $('body').children('.page.current');
		this.pgid = this.$page.data('controller') || this.$page.attr('id') || '';
		
		// 
		if ( typeof this[this.pgid] !== 'undefined' && this[this.pgid].init !== 'function' 
			//&& (typeof this[this.pgid].inited === 'undefined' || !this[this.pgid].inited) 
		)
		{					
			this[this.pgid].init.apply(this[this.pgid]); 
			this[this.pgid].inited = true;
		}
		
		$('html').removeClass('loading');
		
		return this;
	},
	
	routes: function()
	{
		
		//this._URL 						= this.isPhoneGap ? 'file://' : 'http://labs.diginja.com/public/labs/switchTheLook/';
		//this._URL_HOME 					= this._URL + '/home';
	},
	
	trialAlert: function()
	{
		//alert(app.trialMsg);
		
		$('#trialAlert').removeClass('hidden');
		
		return this;
	},
	
	nav: function()
	{
		var $trialAlert = $('#trialAlert');
		
		$(document)
			.on(app.vtap, '#mainNav', function(e)
			{
				// Do not intercept right click
				if ( e.type === 'click' && e.which !== 1 ){ return; }
				
				if ( app.os === 'ios' && e.type === 'click' ){ return false; }
				
				var $t 		= $(e.target),
					$li 	= $t.closest('li');

				if ( !$li.length || !$li.is('#eyesItem') ){ e.preventDefault(); e.stopImmediatePropagation(); e.stopPropagation(); app.trialAlert(); return false; }
				
				e.preventDefault();
				e.stopImmediatePropagation();
				e.stopPropagation();
				
				window.location.href = $li.find('a').attr('href');
				
				return false;
			});
			
		$(document)
			.on(app.vtap, '#branding > #logo', function(e)
			{
				// Do not intercept right click
				if ( e.type === 'click' && e.which !== 1 ){ return; }
				
				e.preventDefault();
				
				app.changePage($(this).attr('href'), {transition:'fadeout fadein'})
			})
			.on(app.vtap, '#backButton', function(e)
			{
				// Do not intercept right click
				if ( e.type === 'click' && e.which !== 1 ){ return; }
				
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();
				
				app.changePage($(this).attr('href'), {transition:'fadeout fadein'})
			})
			.on(app.vtap, '#dismissTrialAlertAction', function(e)
			{
				// Do not intercept right click
				if ( e.type === 'click' && e.which !== 1 ){ return; }
				
				if ( app.os === 'ios' && e.type === 'click' ){ return false; }
				
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();
				
				$trialAlert.addClass('hidden');
				
				return false;
			})
			.on(app.vtap, '#trialAlert', function(e)
			{				
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();
				
				return false;
			});	
		
		
		return this;
	}
});

app.products = {
	// Model 1
	'falseLashButterfly': 		{'key':'falseLashButterfly', 'name':'False Lash Butterfly', 'video':{'fileName': 'Model1-BEFORE', 'framesCount': 399}, 'hint': 'Unlock the Butterfly mascara to watch the look', 'shopURL': 'http://www.redacted.example/maquillage/yeux/mascara/faux-cils-papillon.aspx?varcode=1200634'},
	'colorRicheOmbrePopBleu': 	{'key':'colorRicheOmbrePopBleu', 'name':'Color Riche Ombre Pop', 'video':{'fileName': 'Model1-BEFORE', 'framesCount': 399}, 'hint': 'Unlock the Color Riche eye shadow to watch the look" en lettres capitales', 'shopURL': 'http://www.redacted.example/'},
	'colorRicheOmbrePopOrange': {'key':'colorRicheOmbrePopOrange', 'name':'Color Riche Ombre Pop', 'video':{'fileName': 'Model1-BEFORE', 'framesCount': 399}, 'hint': 'Unlock the Color Riche eye shadow to watch the look" en lettres capitales', 'shopURL': 'http://www.redacted.example/'},
	//'megaVolumeMissManga': 		{'key':'megaVolumeMissManga', 'name':'Mega Volume Miss Manga', 'video':{'fileName': 'Model1-BEFORE', 'framesCount': 399}, 'hint': '', 'shopURL': 'http://www.redacted.example/'},
	
	// Model 2
	'superLinerPerfectSlim': 	{'key':'superLinerPerfectSlim', 'name':'Super Liner Perfect Slim', 'video':{'fileName': 'Model2-BEFORE', 'framesCount': 399}, 'hint': 'Unlock the Perfect Slim to watch the look', 'shopURL': 'http://www.redacted.example/'},
	'superLinerGetMatic': 		{'key':'superLinerGetMatic', 'name':'Super Liner Gel Matic', 'video':{'fileName': 'Model2-BEFORE', 'framesCount': 399}, 'hint': 'Unlock the Gel Matic to watch the look', 'shopURL': 'http://www.redacted.example/'},
	'superLinerBrowArtist': 	{'key':'superLinerBrowArtist', 'name':'Super Liner Brow Artist', 'video':{'fileName': 'Model2-BEFORE', 'framesCount': 399}, 'hint': 'Unlock the Brow Artist to watch the look', 'shopURL': 'http://www.redacted.example/'},
	'superLinerBlackbuster': 	{'key':'superLinerBlackbuster', 'name':'Super Liner Blackbuster', 'video':{'fileName': 'Model2-BEFORE', 'framesCount': 399}, 'hint': 'Unlock the Blackbuster to watch the look', 'shopURL': 'http://www.redacted.example/'}
};