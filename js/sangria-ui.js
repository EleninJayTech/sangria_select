let SangriaUI={
	UI_SELECT:{
		targetSelector:'.sangria-select',
		construct:function(){
			let _this = this;
			if( $(_this.targetSelector).length == 0 ){
				return false;
			}

			_this.makeHtml();
			_this.setEvent();
		},

		/**
		 * HTML 생성
		 */
		makeHtml:function(){
			let _this = this;

			$(`select${_this.targetSelector}`).each(function(){
				let el_select = $(this);
				let targetName = el_select.attr('name');
				targetName = (typeof targetName == 'undefined' ? '' : targetName);
				let targetId = el_select.attr('data-ss-id');
				targetId = (typeof targetId == 'undefined' ? '' : targetId);
				let targetClass = el_select.attr('data-ss-class');
				targetClass = (typeof targetClass == 'undefined' ? '' : targetClass);

				// 감싼 영역 추가
				let selectWrap = `<div id="${targetId}" class="ss_wrap ss_${targetName} ${targetClass} close"></div>`;
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
		 * @param targetName
		 */
		setSelectText:function(targetName){
			let el_selectedTarget = $(`select[name='${targetName}'] option:selected`);
			let targetText = el_selectedTarget.text();
			$(`.ss_wrap.ss_${targetName} a.ss_selected_value`).text(targetText).attr('title', targetText);
		},

		/**
		 * select 선택된 속성 변경
		 * @param targetName
		 * @param targetValue
		 */
		setSelectProp:function(targetName, targetValue){
			let el_selectedTarget = $(`select[name='${targetName}']`);
			el_selectedTarget.val(targetValue).prop({selected:true}).attr({selected:true});
			el_selectedTarget.trigger('change');
			$(`.ss_wrap.ss_${targetName}`).removeClass('open').addClass('close');
		},
		setSelectProp_old:function(targetName, targetValue){
			let el_selectedTarget = $(`select[name='${targetName}']`);
			el_selectedTarget.find(`option[value='${targetValue}']`).attr('selected', 'selected');
			el_selectedTarget.trigger('change');
			$(`.ss_wrap.ss_${targetName}`).removeClass('open').addClass('close');
		},

		/**
		 * 필요 이벤트 실행
		 */
		setEvent:function(){
			let _this = this;
			let el_ss_selected_value = $("a.ss_selected_value");
			let el_ss_option_list = $('.ss_wrap .ss_option_list > li');

			if( typeof jQuery().on == 'function' ){
				// 옵션 선택
				el_ss_option_list.off('click');
				el_ss_option_list.on('click', function(e){
					let in_this = $(this);
					let selected_name = in_this.attr('data-ss-name');
					let selected_value = in_this.attr('data-ss-value');
					_this.setSelectProp(selected_name, selected_value);

					_this.setSelectText(selected_name);
					e.preventDefault();
					return false;
				});

				el_ss_selected_value.off('click');
				el_ss_selected_value.on('click', function(e){
					let in_this = $(this);
					let selected_name = in_this.attr('data-ss-name');
					$(`.ss_wrap.ss_${selected_name}`).toggleClass('close').toggleClass('open');
					e.preventDefault();
					return false;
				});
			} else {
				// 옵션 선택
				el_ss_option_list.unbind('click');
				el_ss_option_list.bind('click', function(e){
					let in_this = $(this);
					let selected_name = in_this.attr('data-ss-name');
					let selected_value = in_this.attr('data-ss-value');
					_this.setSelectProp_old(selected_name, selected_value);

					_this.setSelectText(selected_name);
					e.preventDefault();
					return false;
				});

				el_ss_selected_value.unbind('click');
				el_ss_selected_value.bind('click', function(e){
					let in_this = $(this);
					let selected_name = in_this.attr('data-ss-name');
					$(`.ss_wrap.ss_${selected_name}`).toggleClass('close').toggleClass('open');
					e.preventDefault();
					return false;
				});
			}
		}
	}
};

if( typeof jQuery == 'function' ){
	jQuery(function($){
		SangriaUI.UI_SELECT.construct();
	});
};