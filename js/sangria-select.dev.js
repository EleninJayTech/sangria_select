/**
 * @type {{version: string, jQueryVersionConfirm: (function(int, int=, int=): boolean), jQueryEventCheck: Sangria_SELECT.jQueryEventCheck, targetSelector: string, select_no: number, create: Sangria_SELECT.create, setSelectText: Sangria_SELECT.setSelectText, setSelectProp: Sangria_SELECT.setSelectProp, optionIdxCheck: (function(*, *): *), itemListOpen: Sangria_SELECT.itemListOpen, itemListClose: Sangria_SELECT.itemListClose, itemListShowType: Sangria_SELECT.itemListShowType}}
 */
let Sangria_SELECT={
	version:'1.0.0',

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

	targetSelector:'.sangria-select',
	select_no:0,

	/**
	 * select 데이터를 기준으로 HTML 을 (재)생성
	 * @param {string} [targetSelector]
	 * @returns {boolean}
	 */
	create:function(targetSelector){
		let _this = this;
		if( $(_this.targetSelector).length == 0 ){
			return false;
		}

		let selectSelector = `select${_this.targetSelector}`;
		if( typeof targetSelector == 'string' && targetSelector != '' ){
			selectSelector = targetSelector;
		}
		$(selectSelector).each(function(){
			let el_select = $(this);

			// 고유 이름 생성
			let targetName = el_select.attr('data-ss-name');
			if( typeof targetName == 'undefined' || targetName == '' ){
				targetName = `s_select_${_this.select_no}`;
				el_select.attr('data-ss-name', targetName);
				_this.select_no++;
			}

			let targetId = el_select.attr('data-ss-id');
			targetId = (typeof targetId == 'undefined' ? '' : targetId);

			let targetClass = el_select.attr('data-ss-class');
			targetClass = (typeof targetClass == 'undefined' ? '' : targetClass);

			let closeMode = el_select.attr('data-ss-close-mode');
			let closeModeClass = '';
			if( closeMode == 'click' ){
				closeModeClass = ' leave_close_off ';
			}
			targetClass += closeModeClass;

			let arrowType = el_select.attr('data-ss-arrow-type');
			let arrowTypeClass = " font ";
			if( arrowType == 'image' ){
				arrowTypeClass = ' image '
			}
			targetClass += arrowTypeClass;

			let disable = el_select.attr('disabled');
			if( disable == true || disable == 'disabled' ){
				targetClass += ' disabled ';
			}

			// 존재하는건 삭제
			$(`.ss_wrap[data-ss-name='${targetName}']`).remove();

			let attr_id = (targetId != '' ? `id="${targetId}"` : '');
			targetClass += 'ss_wrap close';
			targetClass = targetClass.trim();
			targetClass = targetClass.replace(/  /gi, ' ');

			// 신규 박스 추가
			let selectHtml = `<a href="#" class="ss_selected_value" title=""></a>`;
			let selectOptionHtml = `<ul class="ss_option_list">`;
			el_select.find('option').each(function(){
				let el_in_this = $(this);
				let in_this_value = el_in_this.val();
				let in_this_text = el_in_this.text();
				selectOptionHtml += `<li data-ss-value="${in_this_value}" title="${in_this_text}">${in_this_text}</li>`;
			});
			selectOptionHtml += `</ul>`;
			let selectWrapHtml = `<div ${attr_id} class="${targetClass}" data-ss-name="${targetName}">${selectHtml}${selectOptionHtml}</div>`;
			el_select.before(selectWrapHtml);

			_this.setSelectText(targetName); // 현재 값 표시
			_this.itemListShowType(targetName); // 위치에 따라 위 아래 표시

			let el_ss_wrap = $(`.ss_wrap[data-ss-name="${targetName}"]`);
			let el_ss_option_list = el_ss_wrap.find(`.ss_option_list > li`);
			let el_select_option = el_select.find('option');
			let el_ss_selected_value = el_ss_wrap.find('.ss_selected_value');

			// 닫기 기능 설정
			if( el_ss_wrap.is('.leave_close_off') == false ){
				el_ss_wrap.off('mouseleave');
				el_ss_wrap.on('mouseleave', function(){
					_this.itemListClose(targetName);
				});
			}

			// 옵션 클릭
			el_ss_option_list.off('click');
			el_ss_option_list.on('click', function(e){
				let in_this = $(this);
				let selected_value = in_this.attr('data-ss-value');

				_this.setSelectProp(targetName, selected_value);
				_this.setSelectText(targetName);
				_this.itemListClose(targetName);

				el_select_option.trigger('click');
				e.preventDefault();
				return false;
			});

			// select 클릭
			el_ss_selected_value.off('click');
			el_ss_selected_value.on('click', function(e){
				try{
					if( disable == true || disable == 'disabled' ){
						throw 'click stop';
					}

					let closeCheck = el_ss_wrap.is('.close');
					if( closeCheck == true ){
						_this.itemListOpen(targetName);
					} else {
						_this.itemListClose(targetName);
					}

					el_select.trigger('click');
				} catch (e){

				}

				e.preventDefault();
				return false;
			});
		});
	},

	/**
	 * 현재 선택 값 표시
	 * @param {string} targetName
	 */
	setSelectText:function(targetName){
		let el_ss_wrap = $(`.ss_wrap[data-ss-name='${targetName}']`);
		let el_select = $(`select[data-ss-name='${targetName}']`);
		let el_selectedTarget = el_select.find(`option:selected`);
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

		if( Sangria_SELECT.jQueryVersionConfirm(1,6) ){
			el_selectedTarget.val(targetValue).prop({selected:true}).attr({selected:true});
		} else {
			el_selectedTarget.find(`option[value='${targetValue}']`).attr('selected', 'selected');
		}

		el_selectedTarget.trigger('change');
	},

	/**
	 * 옵션 인덱스 최소 최대
	 * @param idx
	 * @param max
	 * @returns {number}
	 */
	optionIdxCheck:function(idx, max){
		if(idx < 0){
			idx = 0;
		} else if(idx >= max){
			idx = max - 1;
		}
		return idx;
	},

	/**
	 * 목록 열기
	 * @param {string} targetName
	 */
	itemListOpen:function(targetName){
		let _this = this;
		let el_ss_wrap = $(`.ss_wrap[data-ss-name='${targetName}']`);
		el_ss_wrap.removeClass('close').addClass('open');
		el_ss_wrap.find('.su-icon.icon-su-arrow-down').removeClass('icon-su-arrow-down').addClass('icon-su-arrow-up');

		let option_idx = 0;

		// todo 현재 선택값 selected 및 idx 지정
		let el_selected = $(`select[data-ss-name='${targetName}']`);
		let selected = el_selected.val();
		let el_select_option = el_selected.find('option');

		// 전체 .selected 제거
		let el_li_list = el_ss_wrap.find('.ss_option_list li');
		el_li_list.removeClass('selected');
		let option_length = el_li_list.length;

		// 선택된것 selected
		el_li_list.each(function(idx, _element){
			let el_this = $(_element);
			let ss_value = el_this.attr('data-ss-value');
			// 선택된 값이면
			if( ss_value == selected ){
				option_idx = idx;
				el_this.addClass('selected');
			} else {
				return true;
			}
		});

		// 키보드로 이동
		$("html > body").off('keydown');
		$("html > body").on('keydown', function(event){
			if(event.keyCode === 38){ // 위
				option_idx--;
			} else if(event.keyCode === 40){ // 아래
				option_idx++;
			} else {
				return true;
			}

			option_idx = _this.optionIdxCheck(option_idx, option_length);
			el_li_list.removeClass('selected');
			el_li_list.eq(option_idx).addClass('selected');

			let selected_value = el_li_list.eq(option_idx).attr('data-ss-value');
			_this.setSelectProp(targetName, selected_value);
			_this.setSelectText(targetName);

			el_select_option.trigger('click');
		});
	},

	/**
	 * 목록 닫기
	 * @param {string} targetName
	 */
	itemListClose:function(targetName){
		let el_ss_wrap = $(`.ss_wrap[data-ss-name='${targetName}']`);
		el_ss_wrap.removeClass('open').addClass('close');
		el_ss_wrap.find('.su-icon.icon-su-arrow-up').removeClass('icon-su-arrow-up').addClass('icon-su-arrow-down');

		// 키 다운 없애기
		$("html > body").off('keydown');
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
	}
};

if( typeof jQuery == 'function' ){
	jQuery(function($){
		Sangria_SELECT.jQueryEventCheck();
		Sangria_SELECT.create();

		// 기본 실행
		let targetSelector = Sangria_SELECT.targetSelector;
		$(targetSelector).each(function(){
			let targetElement = $(this);
			let targetName = targetElement.attr('data-ss-name');
			Sangria_SELECT.itemListShowType(targetName);
		});
		$(window).on('scroll', function(){
			$(targetSelector).each(function(){
				let targetElement = $(this);
				let targetName = targetElement.attr('data-ss-name');
				Sangria_SELECT.itemListShowType(targetName);
			});
		});

		$(document).on('mouseup', function (e){
			let container = $('.ss_wrap');
			if( typeof $.fn.has == 'function' && container.has(e.target).length === 0){
				container.removeClass('open').addClass('close');
				container.find('.su-icon.icon-su-arrow-up').removeClass('icon-su-arrow-up').addClass('icon-su-arrow-down');
			}
		});
	});
};