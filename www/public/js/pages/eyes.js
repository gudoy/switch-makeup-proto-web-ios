app.eyes =
{
	init: function()
	{
		this.nav();
			
		return this;
	},
	
	nav: function()
	{
		$(document)
			.on(app.vtap, '.productsCategory > header', function(e)
			{
				// Do not intercept right click
				if ( e.type === 'click' && e.which !== 1 ){ return; }
				
				if ( app.os === 'ios' && e.type === 'click' ){ return false; }
					
				e.preventDefault();
				e.stopImmediatePropagation();
				e.stopPropagation();
				
				var $a 		= $(this).siblings('.content').find('li').first().find('a'),
					pName 	= $a ? ($a.attr('href') || '').replace(/^.*product=/,'').replace(/(.*?)(\&.*?)$/,'$1') : null;
				
				if ( pName && app.products[pName] ){  window.location.href = $a.attr('href'); }
				
				return false;
			})
			.on(app.vtap, 'ul.productsList', function(e)
			{
				// Do not intercept right click
				if ( e.type === 'click' && e.which !== 1 ){ return; }
				
				if ( app.os === 'ios' && e.type === 'click' ){ return false; }
				
				var $t 		= $(e.target),
					$a 		= $t.closest('a'),
					pName 	= $a ? ($a.attr('href') || '').replace(/^.*product=/,'').replace(/(.*?)(\&.*?)$/,'$1') : null;
					
				e.preventDefault();
				e.stopImmediatePropagation();
				e.stopPropagation();

				if ( !app.products[pName] ){ app.trialAlert(); return false; }
				
				if ( pName && app.products[pName] ){  window.location.href = $a.attr('href'); }
				
				return false;
			});
		
		return this;
	}
}