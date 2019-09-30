var currentSections = 0;
var MenuSettings = {};
var Sections = new Array();

var MenuCreatorHandler = 
{
	init: function() 
	{
		$(document).on("click", "#sections_add", function(event) { MenuCreatorHandler.addSection(); });
		$(document).on("click", ".section-list-overview li span", function(event) { 
			var col_id = $(this).parent().attr('col-id');
			var element = $('.section-column[col-id="'+ col_id +'"]');
			MenuCreatorHandler.forceRemoveSection(element); 
		});
		$(document).on("click", ".icontent a", function(event) { MenuCreatorHandler.removeItem($(this)); event.preventDefault(); });
		$(document).on("click", "#menu_create", function(event) { MenuCreatorHandler.createMenu(); });
		$(document).on("click", ".item-toolbox", function(event) { MenuCreatorHandler.toggleToolbox($(this)); });
		$(document).on("input", "input[name='label-item']", function(event) { MenuCreatorHandler.updateItemLabel($(this)); });
		$(document).on("input", "input[name='css-label']", function(event) { MenuCreatorHandler.updateItemCssLabel($(this)); });
		$(document).on("input", "inpu>t[name='extra-label']", function(event) { MenuCreatorHandler.updateItemExtraLabel($(this)); });
		$(document).on("input", "input[name='url-label']", function(event) { MenuCreatorHandler.updateItemUrlLabel($(this)); });
		$(document).on("click", "#articleSearch", function(event) {
			$("#art-search").toggle();
			event.preventDefault();
		});

		$(document).on("click", "a.delete-menu", function(event) {
			event.preventDefault();
			var href = $(this).attr('href');
			alertify.confirm('Menu delete', 'Are your sure you wanna delete menu?', function()
			{
				window.location.href = href;
				alertify.success('Ok');
			},
			function() { 
				alertify.error('Cancel');
			});
		});

		$(document).on("click", "#sectionSearch", function(event) {
			$("#sec-search").toggle();
			event.preventDefault();
		});
		
		$(document).on("click", "#go-search-articles", function(event) { MenuCreatorHandler.searchArticles(); });
		
		$(document).on("click", "#go-section-search", function(event) {
			var search = $("#section-search-input").val();
			alert(1);
			event.preventDefault();
		});

		$(document).on("change", "#show_section_editor", function(event) {
			if($(this).is(":checked")) {
				$(".section-list-overview").slideDown();
			}
			else {
				$(".section-list-overview").slideUp();
			}
			event.preventDefault();
		});
	},

	addSection: function() 
	{
		if(MenuCreatorHandler.isEmptySectionExists() == false)
		{
			var guid = MenuCreatorHandler.guid();
			$("#workdesktop").append('<div class="section-column" col-id="'+ guid +'"><div class="dd"><ol class="dd-list main-section-item-list"></ol></div></div>');
			MenuCreatorHandler.regenerateSectionsIds();
			var left = $('#workdesktop').width();
			$('#workdesktop').scrollLeft(left);

			var section_items = MenuCreatorHandler.countColumnItems(guid);
			MenuCreatorHandler.addSectionToMinimap(guid, section_items, '');
		}
		else 
		{
			alertify.alert('Alert', 'You already have empty section. Fill it before you create new one.');
		}
	},

	addSectionToMinimap: function(guid, item_num, extra) 
	{
		$(".section-list-overview").append('<li col-id="'+ guid +'">Column [<b>'+ item_num +'</b> items] <input extra_col_id="'+ guid +'" value="'+ extra +'" class="column_extra" placeholder="Extra param" type="text" /> <span><img src="/vudu/images/ico/delete.png" width="16" height="16" border="0" alt="Delete"></span></li>');
		$(".section-list-overview li").on("mouseover", function() {
			var col_id = $(this).attr('col-id');
			$(".section-column[col-id='"+ col_id +"']").css({'background-color' : '#ffb3b3'});
		});
		$(".section-list-overview li").on("mouseout", function() {
			var col_id = $(this).attr('col-id');
			$(".section-column[col-id='"+ col_id +"']").css({'background-color' : 'white'});
		});
	},

	removeSectionFromMinimap: function(guid) 
	{
		$(".section-list-overview li[col-id='"+ guid +"']").remove();
	},

	renderMinimap: function() 
	{
		$('.section-column').each(function(i, li) {
			var guid = $(this).attr('col-id');
			var section_items = MenuCreatorHandler.countColumnItems(guid);
			MenuCreatorHandler.addSectionToMinimap(guid, section_items, '');
		});
	},

	isEmptySectionExists: function() 
	{
		var exists = false;
		$('.section-column').each(function(event) {
			if(!$(this).find('li').length) {
				exists = true;
				return false;
			}
		});
		return exists;
	},

	removeSection: function(section) 
	{
		if(!section.find('li').length) {
			var id = section.attr('col-id');
			MenuCreatorHandler.removeSectionFromMinimap(id);
			section.remove();
			MenuCreatorHandler.regenerateSectionsIds();
		}
	},

	forceRemoveSection: function(section) 
	{
		alertify.confirm('Column delete', 'Are your sure you wanna delete menu column?', function()
		{
			var id = section.attr('col-id');
			MenuCreatorHandler.removeSectionFromMinimap(id);
			section.remove();
			MenuCreatorHandler.regenerateSectionsIds();
			alertify.success('Ok');
		},
		function() { 
			alertify.error('Cancel');
		});
	},

	removeItem: function(item) 
	{
		alertify.confirm('Item delete', 'Are your sure you wanna delete menu item?', function()
		{
			var liEl = item.parent().parent();
			var item_id = liEl.attr('uniq-id');
			liEl.remove();

			$(".menu_status").removeClass('error');
			$(".menu_status").removeClass('success');
			$('.section-column').each(function(event) {
				var section_id = $(this).attr('col-id');
				MenuCreatorHandler.updateMinimap(section_id);
			});
			alertify.success('Ok! Item deleted. You need to save changes');
		},
		function() { 
			alertify.error('Cancel');
		});
	},

	createMenu: function() 
	{
		var 
			menuName = $("#menu_name").val(),
			menuDesc = $("#menu_desc").val(),
			errors = 0,
			mode = $("#menu_create").attr('mode'),
			action = 'create_menu',
			menu_id = $("#workdesktop").attr('data-menu-id');

		$(".menu_status").removeClass('error');
		$(".menu_status").removeClass('success');

		if(menuName.length == 0) {
			alertify.alert('Error!', 'Please insert menu name!');
			++ errors;
		}	

		if(errors == 0) {
			MenuCreatorHandler.serializeMenu();
			MenuSettings['menu_name'] = menuName;
			MenuSettings['menu_desc'] = menuDesc;
			MenuSettings['menu_structure'] = Sections;
		}

		var finishMessage = 'Menu successfuly created!';
		if(mode == 'update') 
		{
			MenuSettings['id'] = menu_id;
			action = 'menu_update';
			finishMessage = 'Menu successfuly updated!';
		}

		var menu = JSON.stringify(MenuSettings, null, 2);
		

		$.post(
			vuduOptions.SIDURL + "&action=ajax&ajax_action="+action+"&view_type=inline", 
			{'menu' : menu}
		).success(function(html_list) {
			
			alertify.notify(finishMessage, 'success', 5);

		}).fail(function (data) {
			alertify.alert('Error!', 'Došlo je do problema :(\...pokušajte kasnije...');
		});	
	},

	toggleToolbox: function(item) 
	{
		item.parent().find('.icontent:first').slideToggle();
	},

	updateItemLabel: function(item) 
	{
		var currentValue = item.val();
		var itemType = item.parent().parent().attr('item-type');
		var typeSign = '<span class="sign">[' + itemType.charAt(0).toUpperCase() + ']</span>';
		var updateDiv = item.parent().parent().find('div.dd-handle:first');
		updateDiv.html(typeSign + ' ' + currentValue);

		var liElement = item.parent().parent();
		var item_id = liElement.attr('uniq-id');
	},

	updateItemCssLabel: function(item) 
	{
		var cssLabel = item.val();

		var liElement = item.parent().parent();
		var item_id = liElement.attr('uniq-id');
	},

	updateItemExtraLabel: function(item) 
	{
		var extraParam = item.val();

		var liElement = item.parent().parent();
		var item_id = liElement.attr('uniq-id');
	},

	updateItemUrlLabel: function(item) 
	{
		var urlParam = item.val();

		var liElement = item.parent().parent();
		var item_id = liElement.attr('item-id');
	},

	afterDropSectionFixName: function(name) 
	{
		var len = name.length;
		var offset = 0;
		for(var i = 0; i < len; ++ i) {
			if
			(
				name[i].charCodeAt(0) != 160 && name[i].charCodeAt(0) != 32 && name[i].charCodeAt(0) != 2  &&
				name[i].charCodeAt(0) != 124 && name[i].charCodeAt(0) != 3  && name[i].charCodeAt(0) != 45 &&
				name[i].charCodeAt(0) != 4 	 && name[i].charCodeAt(0) != 39 && name[i].charCodeAt(0) != 0
			) {
				offset = i;
				break;
			}
		}

		return name.substring(offset, len);
	},

	draggableInit: function() 
	{
		$(".section-column").droppable({ 
			accept: "li.dd-source-item",
			activeClass: "ui-state-default",
			hoverClass: "ui-state-hover",
			drop:function(event, ui)
			{
				var 
					item_label = MenuCreatorHandler.afterDropSectionFixName(ui.draggable.context.innerText),
					item_id = ui.draggable.context.attributes[1].nodeValue,
					item_type = ui.draggable.context.attributes[2].nodeValue,
					newElement = $("#copy-element").html(),
					uniqID = MenuCreatorHandler.guid(),
					section_id = $(this).attr('col-id'),
					typeSign = '<span class="sign">[' + item_type.charAt(0).toUpperCase() + ']</span>',
					label = typeSign + ' ' + item_label;

				$(this).find('ol.main-section-item-list').append(newElement);
				$(this).find("li[item-id='']").attr('uniq-ID', uniqID);
				$(this).find("li[uniq-ID='"+uniqID+"']").attr('item-id', item_id);
				$(this).find("li[uniq-ID='"+uniqID+"']").attr('item-type', item_type);
				$(this).find('li[uniq-ID="'+uniqID+'"] .dd-handle').html(label);
				$(this).find('li[uniq-ID="'+uniqID+'"] .item-toolbox').css({'visibility' : 'visible'});

				if(item_type == 'custom')
				{
					$(this).find('li[uniq-ID="'+uniqID+'"] input[name="label-item"]').val(item_label);
				}

				$('.dd').nestable({maxDepth: 7});
				MenuCreatorHandler.updateMinimap(section_id);
			}
		});
		
		$(".menu_insert_list li.dd-source-item").draggable({
			connectToSortable: ".section-column",
			helper: "clone",
			start: function(event, ui) {
				$(ui.helper).addClass('movingItem');
				$('.injector').show();
			},
			stop: function(event, ui) {
				$(ui.helper).removeClass('movingItem');
				$('.injector').hide();
			}
		});
	},

	updateMinimap: function(section_id) 
	{
		var item_num = MenuCreatorHandler.countColumnItems(section_id);
		$('.section-list-overview li[col-id="'+ section_id +'"] b').html(item_num);
	},

	countColumnItems: function(section_id) 
	{
		return $('.section-column[col-id="'+section_id+'"] li').length;
	},

	regenerateSectionsIds: function() 
	{
		currentSections = 0;
		$('.section-column').each(function(event) {
			var section_id = $(this).attr('col-id');
			MenuCreatorHandler.updateMinimap(section_id);
			++ currentSections;
		});

		if(currentSections == 0) 
		{
			$(".if_section_exists").addClass('false');
			$(".overlay-menu").show();
			$("#menu_create").attr("disabled", true);
			$("#menu_create").addClass("dcmenu");

			$("input[type='checkbox']").each(function(event) {
				$(this).attr('checked', false);
			});
		}
		else 
		{
			$(".if_section_exists").removeClass('false');
			$(".overlay-menu").hide();
			$("#menu_create").attr("disabled", false);
			$("#menu_create").removeClass("dcmenu");
		}
		MenuCreatorHandler.draggableInit();
		$(".menu_status").removeClass('error');
		$(".menu_status").removeClass('success');
	},

	activateDraging: function() 
	{
		MenuCreatorHandler.draggableInit();
		$('.dd').nestable({maxDepth: 7});
	},

	serializeMenu: function() 
	{
		var sectionCounter = 0;
		$('.main-section-item-list').each(function(i, li) {

			var sectionExtraParam = $(li).parent().parent().attr('col-id');
			sectionExtraParam = $('input[extra_col_id="'+ sectionExtraParam +'"]').val();

			Sections[sectionCounter] = new Array();
			Sections[sectionCounter]['extra'] = sectionExtraParam;

			var itemCounter = 0;
			$(li).find("li").each(function(ii, li2) {

				var 
					uniq = $(li2).attr('uniq-id'),
					elementLevel = $(li2).find('.icontent'),
					parentElement = $(li2).parent().parent().attr('uniq-id'),
					db_id = $(li2).attr('item-id'),
					item_type = $(li2).attr('item-type'),
					hasChild = false;

				if($(li2).find('ol.dd-list:first').length > 0) {
					hasChild = true;
				}

				Sections[sectionCounter][itemCounter] = {
					'id' : uniq,
					'item_db_id' : db_id,
					'item_type' : item_type,
					'label' : elementLevel.find('input[name="label-item"]').val(),
					'css' : elementLevel.find('input[name="css-label"]').val(),
					'href' : elementLevel.find('input[name="url-label"]').val(),
					'extra' : elementLevel.find('input[name="extra-label"]').val(),
					'has_child' : hasChild,
					'parent' : parentElement
				};
				++ itemCounter;
			});
			++ sectionCounter;
		});
	},

	guid: function() 
	{
		function s4() 
		{
			return Math.floor(Math.random() * 50000) + 1;
		}
		return s4() + s4() + Math.floor(Date.now() / 1000);
	},

	searchArticles: function() 
	{
		var article_name = $("#article-name").val();
		var article_id = $("#article-id").val();
		$.ajax({
			method: 'POST',
			url: vuduOptions.SIDURL + "&action=ajax&ajax_action=searchArticles&view_type=inline",
			data: {
				'key_words_search' : article_name,
				'search_article_id' : article_id
			},
		}).success(function(html_list) {

			$(".menu_insert_list.articles").html(html_list);
			MenuCreatorHandler.draggableInit();

		}).fail(function (data) {
			alert('Došlo je do problema :(\...pokušajte kasnije...');
		});
	}
};

$(document).ready(function() {
	MenuCreatorHandler.init();
});