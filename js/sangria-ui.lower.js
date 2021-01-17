"use strict";

var SangriaUI = {
  /**
   * jQuery 버전 검증
   * @param {int} firstVersion
   * @param {int} [mainVersion]
   * @param {int} [subVersion]
   * @returns {boolean}
   */
  jQueryVersionConfirm: function jQueryVersionConfirm(firstVersion, mainVersion, subVersion) {
    var jQueryVersionArray = $.fn.jquery.split('.');
    var confirmVersion = true;

    if (parseInt(jQueryVersionArray[0]) < firstVersion) {
      confirmVersion = false;
    }

    if (jQueryVersionArray.length > 1 && typeof mainVersion == 'number') {
      if (parseInt(jQueryVersionArray[1]) < mainVersion) {
        confirmVersion = false;
      }
    }

    if (jQueryVersionArray.length > 2 && typeof subVersion == 'number') {
      if (parseInt(jQueryVersionArray[2]) < subVersion) {
        confirmVersion = false;
      }
    }

    return confirmVersion;
  },

  /**
   * jQuery 이벤트 체크
   */
  jQueryEventCheck: function jQueryEventCheck() {
    if (typeof $.fn.on != 'function') {
      $.fn.on = $.fn.bind;
      $.fn.off = $.fn.unbind;
    }
  },
  UI_SELECT: {
    targetSelector: '.sangria-select',
    targetNameList: [],
    closeMode: 'default',
    // default, leave, item_leave, focus_out
    closeDefault: [],
    closeLeave: [],
    closeItemLeave: [],
    closeFocusOut: [],
    construct: function construct() {
      var _this = this;

      if ($(_this.targetSelector).length == 0) {
        return false;
      }

      _this.makeHtml();

      _this.setEvent();
    },

    /**
     * HTML 생성
     */
    makeHtml: function makeHtml() {
      var _this = this;

      $("select".concat(_this.targetSelector)).each(function () {
        var el_select = $(this);
        var targetName = el_select.attr('name');
        targetName = typeof targetName == 'undefined' ? '' : targetName;

        _this.targetNameList.push(targetName);

        var targetId = el_select.attr('data-ss-id');
        targetId = typeof targetId == 'undefined' ? '' : targetId;
        var targetClass = el_select.attr('data-ss-class');
        targetClass = typeof targetClass == 'undefined' ? '' : targetClass;
        var closeMode = el_select.attr('data-ss-close-mode');

        _this.addCloseModeNameList(targetName, closeMode); // 감싼 영역 추가


        var selectWrap = "<div id=\"".concat(targetId, "\" class=\"ss_wrap ss_").concat(targetName, " ").concat(targetClass, " close\"></div>");
        el_select.wrap(selectWrap);
        var selectHtml = '';
        selectHtml += "<a href=\"#\" class=\"ss_selected_value\" title=\"\" data-ss-name=\"".concat(targetName, "\"></a>");
        selectHtml += "<ul class=\"ss_option_list\" data-ss-name=\"".concat(targetName, "\">");
        el_select.find('option').each(function () {
          var el_in_this = $(this);
          var in_this_value = el_in_this.val();
          var in_this_text = el_in_this.text();
          selectHtml += "<li data-ss-name=\"".concat(targetName, "\" data-ss-value=\"").concat(in_this_value, "\" title=\"").concat(in_this_text, "\">").concat(in_this_text, "</li>");
        });
        selectHtml += "</ul>";
        el_select.parent('.ss_wrap').append(selectHtml);

        _this.setSelectText(targetName);
      });
    },

    /**
     * 닫기 모드 설정 목록 추가
     * add name for close mode
     */
    addCloseModeNameList: function addCloseModeNameList(targetName, closeMode) {
      if (!targetName || !closeMode) {
        return true;
      }

      var _this = this;

      switch (closeMode) {
        case 'default':
          _this.closeDefault.push(targetName);

          break;

        case 'leave':
          _this.closeLeave.push(targetName);

          break;

        case 'item_leave':
          _this.closeItemLeave.push(targetName);

          break;

        case 'focus_out':
          _this.closeFocusOut.push(targetName);

          break;
      }
    },

    /**
     * 선택 값 표시
     * @param targetName
     */
    setSelectText: function setSelectText(targetName) {
      var el_selectedTarget = $("select[name='".concat(targetName, "'] option:selected"));
      var targetText = el_selectedTarget.text();
      $(".ss_wrap.ss_".concat(targetName, " a.ss_selected_value")).text(targetText).attr('title', targetText);
    },

    /**
     * select 선택된 속성 변경
     * @param targetName
     * @param targetValue
     */
    setSelectProp: function setSelectProp(targetName, targetValue) {
      var el_selectedTarget = $("select[name='".concat(targetName, "']"));

      if (SangriaUI.jQueryVersionConfirm(1, 6)) {
        el_selectedTarget.val(targetValue).prop({
          selected: true
        }).attr({
          selected: true
        });
      } else {
        el_selectedTarget.find("option[value='".concat(targetValue, "']")).attr('selected', 'selected');
      }

      el_selectedTarget.trigger('change');
      $(".ss_wrap.ss_".concat(targetName)).removeClass('open').addClass('close');
    },

    /**
     * 목록 열기
     * @param targetName
     */
    itemListOpen: function itemListOpen(targetName) {
      $(".ss_wrap.ss_".concat(targetName)).removeClass('close').addClass('open');
    },

    /**
     * 목록 닫기
     * @param targetName
     */
    itemListClose: function itemListClose(targetName) {
      $(".ss_wrap.ss_".concat(targetName)).removeClass('open').addClass('close');
    },

    /**
     * 필요 이벤트 실행
     */
    setEvent: function setEvent() {
      var _this = this;

      var el_ss_selected_value = $("a.ss_selected_value");
      var el_ss_option_list = $('.ss_wrap .ss_option_list > li');
      /**
       * option 클릭 이벤트
       */

      el_ss_option_list.off('click');
      el_ss_option_list.on('click', function (e) {
        var in_this = $(this);
        var selected_name = in_this.attr('data-ss-name');
        var selected_value = in_this.attr('data-ss-value');

        _this.setSelectProp(selected_name, selected_value);

        _this.setSelectText(selected_name);

        e.preventDefault();
        return false;
      });
      /**
       * select 클릭 이벤트
       */

      el_ss_selected_value.off('click');
      el_ss_selected_value.on('click', function (e) {
        var in_this = $(this);
        var selected_name = in_this.attr('data-ss-name');
        $(".ss_wrap.ss_".concat(selected_name)).toggleClass('close').toggleClass('open');
        e.preventDefault();
        return false;
      });
    }
  }
};

if (typeof jQuery == 'function') {
  jQuery(function ($) {
    SangriaUI.jQueryEventCheck();
    SangriaUI.UI_SELECT.construct();
  });
}

;

