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
		 *
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

				// 존재하는건 삭제
				$(`.ss_wrap[data-ss-name='${targetName}']`).remove();

				let attr_id = (targetId != '' ? `id="${targetId}"` : '');
				targetClass += 'ss_wrap close';
				targetClass = targetClass.trim();
				targetClass = targetClass.replaceAll('  ', ' ');

				// 신규 박스 추가
				let selectWrapHtml = `<div ${attr_id} class="${targetClass}" data-ss-name="${targetName}"></div>`;
				el_select.before(selectWrapHtml);
			});
		},
	}
};

if( typeof jQuery == 'function' ){
	jQuery(function($){
		SangriaUI.UI_SELECT.create();
	});
};