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

        if (closeMode == 'click') {
          targetClass += ' leave_close_off ';
        }

        var arrowType = el_select.attr('data-ss-arrow-type');
        var arrowTypeClass = " font ";

        if (arrowType == 'image') {
          arrowTypeClass = ' image ';
        }

        targetClass += arrowTypeClass; // 감싼 영역 추가

        var selectWrap = "<div id=\"".concat(targetId, "\" class=\"ss_wrap ss_").concat(targetName, " ").concat(targetClass, " close\" data-ss-name=\"").concat(targetName, "\"></div>");
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
     * 선택 값 표시
     * @param targetName
     */
    setSelectText: function setSelectText(targetName) {
      var el_selectedTarget = $("select[name='".concat(targetName, "'] option:selected"));
      var targetText = el_selectedTarget.text();
      var el_selected_value = $(".ss_wrap.ss_".concat(targetName, " a.ss_selected_value"));
      el_selected_value.text(targetText).attr('title', targetText);
      var el_select = $("select[name='".concat(targetName, "']"));
      var arrowType = el_select.attr('data-ss-arrow-type');

      if (typeof arrowType == 'undefined' || arrowType == 'font' || arrowType == '') {
        var font_icon = "<i class=\"su-icon icon-su-arrow-down\"></i>";
        el_selected_value.append(font_icon);
      }
    },

    /**
     * select 선택된 속성 변경
     * @param targetName
     * @param targetValue
     */
    setSelectProp: function setSelectProp(targetName, targetValue) {
      var _this = this;

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

      _this.itemListClose(targetName);
    },

    /**
     * 목록 열기
     * @param targetName
     */
    itemListOpen: function itemListOpen(targetName) {
      $(".ss_wrap.ss_".concat(targetName)).removeClass('close').addClass('open');
      $(".ss_wrap.ss_".concat(targetName)).find('.su-icon.icon-su-arrow-down').removeClass('icon-su-arrow-down').addClass('icon-su-arrow-up');
    },

    /**
     * 목록 닫기
     * @param targetName
     */
    itemListClose: function itemListClose(targetName) {
      $(".ss_wrap.ss_".concat(targetName)).removeClass('open').addClass('close');
      $(".ss_wrap.ss_".concat(targetName)).find('.su-icon.icon-su-arrow-up').removeClass('icon-su-arrow-up').addClass('icon-su-arrow-down');
    },
    itemListShowType: function itemListShowType(targetName) {
      var el_target = $(".ss_wrap.ss_".concat(targetName));
      var select_h = el_target.outerHeight();
      var item_h = el_target.find(".ss_option_list").outerHeight();
      var select_top = el_target.find(".ss_selected_value").offset().top;
      var window_h = $(window).height();
      var scroll_t = $(window).scrollTop();
      var target_pos = select_top + select_h + item_h;
      var this_pos = window_h + scroll_t;

      if (target_pos > this_pos) {
        el_target.removeClass('list_down').addClass('list_up');
      } else {
        el_target.removeClass('list_up').addClass('list_down');
      }
    },

    /**
     * 필요 이벤트 실행
     */
    setEvent: function setEvent() {
      var _this = this;

      var targetSelector = _this.targetSelector;
      var el_ss_wrap = $(".ss_wrap");
      var el_ss_selected_value = $("a.ss_selected_value");
      var el_ss_option_list = $('.ss_wrap .ss_option_list > li');
      $(window).on('scroll', function () {
        $(targetSelector).each(function () {
          var targetElement = $(this);
          var targetName = targetElement.attr('name');

          _this.itemListShowType(targetName);
        });
      });
      $(targetSelector).each(function () {
        var targetElement = $(this);
        var targetName = targetElement.attr('name');

        _this.itemListShowType(targetName);
      });

      if (el_ss_wrap.is('.leave_close_off') == false) {
        el_ss_wrap.off('mouseleave');
        el_ss_wrap.on('mouseleave', function () {
          var in_this = $(this);
          var selected_name = in_this.attr('data-ss-name');

          _this.itemListClose(selected_name);
        });
      }
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
        var closeCheck = $(".ss_wrap.ss_".concat(selected_name)).is('.close');

        if (closeCheck == true) {
          _this.itemListOpen(selected_name);
        } else {
          _this.itemListClose(selected_name);
        }

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

