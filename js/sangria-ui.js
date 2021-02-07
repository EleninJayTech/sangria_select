/**
 * Custom Form UI
 * @author eleninjaytech@gmail.com
 * @type {{UI_SELECT: {targetSelector: string, itemListShowType: SangriaUI.UI_SELECT.itemListShowType, setSelectText: SangriaUI.UI_SELECT.setSelectText, setEvent: SangriaUI.UI_SELECT.setEvent, construct: (function(): boolean), select_no: number, itemListOpen: SangriaUI.UI_SELECT.itemListOpen, makeHtml: SangriaUI.UI_SELECT.makeHtml, itemListClose: SangriaUI.UI_SELECT.itemListClose, setSelectProp: SangriaUI.UI_SELECT.setSelectProp}, jQueryVersionConfirm: (function(int, int=, int=): boolean), jQueryEventCheck: SangriaUI.jQueryEventCheck}}
 */
let SangriaUI={
	/**
	 * jQuery 버전 검증
	 * @param {int} firstVersion
	 * @param {int} [mainVersion]
	 * @param {int} [subVersion]
	 * @returns {boolean}
	 */
	jQueryVersionConfirm:function(firstVersion, mainVersion, subVersion){
		let jQueryVersionArray = $.fn.jquery.split('.');
		let confirmVersion = true;

		let jQueryVer_1 = parseInt(jQueryVersionArray[0]);
		let jQueryVer_2 = parseInt(jQueryVersionArray[1]);
		let jQueryVer_3 = parseInt(jQueryVersionArray[2]);

		// 첫번째 버전보다 작으면
		if( jQueryVer_1 < firstVersion ){
			confirmVersion = false;
		}
		// 같다면 두번째 버전 체크
		else if (
			jQueryVer_1 == firstVersion
			&& jQueryVersionArray.length > 1
			&& typeof mainVersion == 'number'
		){
			if( jQueryVer_2 < mainVersion ){
				confirmVersion = false;
			}
			// 같다면 세번째 버전 체크
			else if(
				jQueryVer_2 == mainVersion
				&& jQueryVersionArray.length > 2
				&& typeof subVersion == 'number'
			){
				if( jQueryVer_3 < subVersion ){
					confirmVersion = false;
				}
			}
		}

		console.log(confirmVersion);
		return confirmVersion;
	},

	/**
	 * jQuery 이벤트 체크
	 */
	jQueryEventCheck:function(){
		if( typeof $.fn.on != 'function' ){
			$.fn.on = $.fn.bind;
			$.fn.off = $.fn.unbind;
		}
	},

	/**
	 * select box
	 */
	UI_SELECT:{
		targetSelector:'.sangria-select',
		select_no:0,

		/**
		 * 생성자
		 * @returns {boolean}
		 */
		construct:function(){
			let _this = this;
			if( $(_this.targetSelector).length == 0 ){
				return false;
			}

			_this.makeHtml();
			_this.setEvent();
		},

		/**
		 * SELECT BOX HTML 생성
		 */
		makeHtml:function(){
			let _this = this;

			$(`select${_this.targetSelector}`).each(function(){
				let el_select = $(this);

				// ss-name 입력되어 있으면 넘기기
				let attr_ss_name = el_select.attr('data-ss-name');
				if( typeof attr_ss_name !== 'undefined' ){
					return true;
				}

				let targetName = `s_select_${_this.select_no}`;
				el_select.attr('data-ss-name', targetName);
				_this.select_no++;

				let targetId = el_select.attr('data-ss-id');
				targetId = (typeof targetId == 'undefined' ? '' : targetId);

				let targetClass = el_select.attr('data-ss-class');
				targetClass = (typeof targetClass == 'undefined' ? '' : targetClass);

				let closeMode = el_select.attr('data-ss-close-mode');
				if( closeMode == 'click' ){
					targetClass += ' leave_close_off ';
				}

				let arrowType = el_select.attr('data-ss-arrow-type');
				let arrowTypeClass = " font ";
				if( arrowType == 'image' ){
					arrowTypeClass = ' image '
				}
				targetClass += arrowTypeClass;

				// 감싼 영역 추가
				let selectWrap = `<div id="${targetId}" class="ss_wrap ${targetClass} close" data-ss-name="${targetName}"></div>`;
				el_select.wrap(selectWrap);

				let selectHtml = '';
				selectHtml += `<a href="#" class="ss_selected_value" title="" data-ss-name="${targetName}"></a>`;
				selectHtml += `<ul class="ss_option_list" data-ss-name="${targetName}">`;
					el_select.find('option').each(function(){
						let el_in_this = $(this);
						let in_this_value = el_in_this.val();
						let in_this_text = el_in_this.text();
						selectHtml += `<li data-ss-name="${targetName}" data-ss-value="${in_this_value}" title="${in_this_text}">${in_this_text}</li>`;
					});
				selectHtml += `</ul>`;

				el_select.parent('.ss_wrap').append(selectHtml);
				_this.setSelectText(targetName);
			});
		},

		/**
		 * 선택 값 표시
		 * @param {string} targetName
		 */
		setSelectText:function(targetName){
			let el_ss_wrap = $(`.ss_wrap[data-ss-name='${targetName}']`);
			let el_select = el_ss_wrap.find(`select`);
			let el_selectedTarget = el_ss_wrap.find(`select option:selected`);
			let el_selected_value = el_ss_wrap.find(`a.ss_selected_value`);

			let targetText = el_selectedTarget.text();
			el_selected_value.text(targetText).attr('title', targetText);

			let arrowType = el_select.attr('data-ss-arrow-type');
			if( typeof arrowType == 'undefined' || arrowType == 'font' || arrowType == '' ){
				let font_icon = "<i class=\"su-icon icon-su-arrow-down\"></i>";
				el_selected_value.append(font_icon);
			}
		},

		/**
		 * select 선택된 속성 변경
		 * @param {string} targetName
		 * @param targetValue
		 */
		setSelectProp:function(targetName, targetValue){
			let _this = this;
			let el_selectedTarget = $(`select[data-ss-name='${targetName}']`);

			if( SangriaUI.jQueryVersionConfirm(1,6) ){
				el_selectedTarget.val(targetValue).prop({selected:true}).attr({selected:true});
			} else {
				el_selectedTarget.find(`option[value='${targetValue}']`).attr('selected', 'selected');
			}

			el_selectedTarget.trigger('change');
			_this.itemListClose(targetName);
		},

		/**
		 * 목록 열기
		 * @param {string} targetName
		 */
		itemListOpen:function(targetName){
			let el_ss_wrap = $(`.ss_wrap[data-ss-name='${targetName}']`);
			el_ss_wrap.removeClass('close').addClass('open');
			el_ss_wrap.find('.su-icon.icon-su-arrow-down').removeClass('icon-su-arrow-down').addClass('icon-su-arrow-up');
		},

		/**
		 * 목록 닫기
		 * @param {string} targetName
		 */
		itemListClose:function(targetName){
			let el_ss_wrap = $(`.ss_wrap[data-ss-name='${targetName}']`);
			el_ss_wrap.removeClass('open').addClass('close');
			el_ss_wrap.find('.su-icon.icon-su-arrow-up').removeClass('icon-su-arrow-up').addClass('icon-su-arrow-down');
		},

		/**
		 * 위치에 따라 옵션 목록이 위로 열리거나 아래로 열린다
		 * @param {string} targetName
		 */
		itemListShowType:function(targetName){
			let el_target = $(`.ss_wrap[data-ss-name='${targetName}']`);
			let select_h = el_target.outerHeight();
			let item_h = el_target.find(".ss_option_list").outerHeight();
			let select_top = el_target.find(".ss_selected_value").offset().top;
			let window_h = $(window).height();
			let scroll_t = $(window).scrollTop();

			let target_pos = select_top + select_h + item_h;
			let this_pos = window_h + scroll_t;
			if( target_pos > this_pos ){
				el_target.removeClass('list_down').addClass('list_up');
			} else {
				el_target.removeClass('list_up').addClass('list_down');
			}
		},

		/**
		 * 이벤트
		 */
		setEvent:function(){
			let _this = this;
			let el_ss_wrap = $(".ss_wrap");
			let el_ss_selected_value = el_ss_wrap.find("a.ss_selected_value");
			let el_ss_option_list = el_ss_wrap.find('.ss_option_list > li');

			// mouse out 할때 옵션 목록 닫기
			if( el_ss_wrap.is('.leave_close_off') == false ){
				el_ss_wrap.off('mouseleave');
				el_ss_wrap.on('mouseleave', function(){
					let in_this = $(this);
					let selected_name = in_this.attr('data-ss-name');
					_this.itemListClose(selected_name);
				});
			}

			// 옵션 클릭
			el_ss_option_list.off('click');
			el_ss_option_list.on('click', function(e){
				let in_this = $(this);
				let selected_name = in_this.attr('data-ss-name');
				let selected_value = in_this.attr('data-ss-value');
				let el_ss_wrap = $(`.ss_wrap[data-ss-name='${selected_name}']`);
				let el_select_option = el_ss_wrap.find('select option');

				_this.setSelectProp(selected_name, selected_value);
				_this.setSelectText(selected_name);

				el_select_option.trigger('click');
				e.preventDefault();
				return false;
			});

			// select 클릭
			el_ss_selected_value.off('click');
			el_ss_selected_value.on('click', function(e){
				let in_this = $(this);
				let selected_name = in_this.attr('data-ss-name');
				let el_ss_wrap = $(`.ss_wrap[data-ss-name='${selected_name}']`);
				let el_select = el_ss_wrap.find(`select`);

				let closeCheck = el_ss_wrap.is('.close');
				if( closeCheck == true ){
					_this.itemListOpen(selected_name);
				} else {
					_this.itemListClose(selected_name);
				}

				el_select.trigger('click');
				e.preventDefault();
				return false;
			});
		}
	}
};

if( typeof jQuery == 'function' ){
	jQuery(function($){
		SangriaUI.jQueryEventCheck();
		SangriaUI.UI_SELECT.construct();

		let targetSelector = SangriaUI.UI_SELECT.targetSelector;
		$(window).on('scroll', function(){
			$(targetSelector).each(function(){
				let targetElement = $(this);
				let targetName = targetElement.attr('data-ss-name');
				SangriaUI.UI_SELECT.itemListShowType(targetName);
			});
		});

		$(targetSelector).each(function(){
			let targetElement = $(this);
			let targetName = targetElement.attr('data-ss-name');
			SangriaUI.UI_SELECT.itemListShowType(targetName);
		});
	});
};