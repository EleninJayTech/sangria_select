"use strict";

/**
 * Custom Form UI
 * @author eleninjaytech@gmail.com
 * @type {{UI_SELECT: {targetSelector: string, itemListShowType: SangriaUI.UI_SELECT.itemListShowType, setSelectText: SangriaUI.UI_SELECT.setSelectText, setEvent: SangriaUI.UI_SELECT.setEvent, construct: (function(): boolean), select_no: number, itemListOpen: SangriaUI.UI_SELECT.itemListOpen, makeHtml: SangriaUI.UI_SELECT.makeHtml, itemListClose: SangriaUI.UI_SELECT.itemListClose, setSelectProp: SangriaUI.UI_SELECT.setSelectProp}, jQueryVersionConfirm: (function(int, int=, int=): boolean), jQueryEventCheck: SangriaUI.jQueryEventCheck}}
 */
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
    var jQueryVer_1 = parseInt(jQueryVersionArray[0]);
    var jQueryVer_2 = parseInt(jQueryVersionArray[1]);
    var jQueryVer_3 = parseInt(jQueryVersionArray[2]); // 첫번째 버전보다 작으면

    if (jQueryVer_1 < firstVersion) {
      confirmVersion = false;
    } // 같다면 두번째 버전 체크
    else if (jQueryVer_1 == firstVersion && jQueryVersionArray.length > 1 && typeof mainVersion == 'number') {
        if (jQueryVer_2 < mainVersion) {
          confirmVersion = false;
        } // 같다면 세번째 버전 체크
        else if (jQueryVer_2 == mainVersion && jQueryVersionArray.length > 2 && typeof subVersion == 'number') {
            if (jQueryVer_3 < subVersion) {
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
  jQueryEventCheck: function jQueryEventCheck() {
    if (typeof $.fn.on != 'function') {
      $.fn.on = $.fn.bind;
      $.fn.off = $.fn.unbind;
    }
  },

  /**
   * select box
   */
  UI_SELECT: {
    targetSelector: '.sangria-select',
    select_no: 0,

    /**
     * 생성자
     * @returns {boolean}
     */
    construct: function construct() {
      var _this = this;

      if ($(_this.targetSelector).length == 0) {
        return false;
      }

      _this.makeHtml();

      _this.setEvent();
    },

    /**
     * SELECT BOX HTML 생성
     */
    makeHtml: function makeHtml() {
      var _this = this;

      $("select".concat(_this.targetSelector)).each(function () {
        var el_select = $(this); // ss-name 입력되어 있으면 넘기기

        var attr_ss_name = el_select.attr('data-ss-name');

        if (typeof attr_ss_name !== 'undefined') {
          return true;
        }

        var targetName = "s_select_".concat(_this.select_no);
        el_select.attr('data-ss-name', targetName);
        _this.select_no++;
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

        var selectWrap = "<div id=\"".concat(targetId, "\" class=\"ss_wrap ").concat(targetClass, " close\" data-ss-name=\"").concat(targetName, "\"></div>");
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
     * @param {string} targetName
     */
    setSelectText: function setSelectText(targetName) {
      var el_ss_wrap = $(".ss_wrap[data-ss-name='".concat(targetName, "']"));
      var el_select = el_ss_wrap.find("select");
      var el_selectedTarget = el_ss_wrap.find("select option:selected");
      var el_selected_value = el_ss_wrap.find("a.ss_selected_value");
      var targetText = el_selectedTarget.text();
      el_selected_value.text(targetText).attr('title', targetText);
      var arrowType = el_select.attr('data-ss-arrow-type');

      if (typeof arrowType == 'undefined' || arrowType == 'font' || arrowType == '') {
        var font_icon = "<i class=\"su-icon icon-su-arrow-down\"></i>";
        el_selected_value.append(font_icon);
      }
    },

    /**
     * select 선택된 속성 변경
     * @param {string} targetName
     * @param targetValue
     */
    setSelectProp: function setSelectProp(targetName, targetValue) {
      var _this = this;

      var el_selectedTarget = $("select[data-ss-name='".concat(targetName, "']"));

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
     * @param {string} targetName
     */
    itemListOpen: function itemListOpen(targetName) {
      var el_ss_wrap = $(".ss_wrap[data-ss-name='".concat(targetName, "']"));
      el_ss_wrap.removeClass('close').addClass('open');
      el_ss_wrap.find('.su-icon.icon-su-arrow-down').removeClass('icon-su-arrow-down').addClass('icon-su-arrow-up');
    },

    /**
     * 목록 닫기
     * @param {string} targetName
     */
    itemListClose: function itemListClose(targetName) {
      var el_ss_wrap = $(".ss_wrap[data-ss-name='".concat(targetName, "']"));
      el_ss_wrap.removeClass('open').addClass('close');
      el_ss_wrap.find('.su-icon.icon-su-arrow-up').removeClass('icon-su-arrow-up').addClass('icon-su-arrow-down');
    },

    /**
     * 위치에 따라 옵션 목록이 위로 열리거나 아래로 열린다
     * @param {string} targetName
     */
    itemListShowType: function itemListShowType(targetName) {
      var el_target = $(".ss_wrap[data-ss-name='".concat(targetName, "']"));
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
     * 이벤트
     */
    setEvent: function setEvent() {
      var _this = this;

      var el_ss_wrap = $(".ss_wrap");
      var el_ss_selected_value = el_ss_wrap.find("a.ss_selected_value");
      var el_ss_option_list = el_ss_wrap.find('.ss_option_list > li'); // mouse out 할때 옵션 목록 닫기

      if (el_ss_wrap.is('.leave_close_off') == false) {
        el_ss_wrap.off('mouseleave');
        el_ss_wrap.on('mouseleave', function () {
          var in_this = $(this);
          var selected_name = in_this.attr('data-ss-name');

          _this.itemListClose(selected_name);
        });
      } // 옵션 클릭


      el_ss_option_list.off('click');
      el_ss_option_list.on('click', function (e) {
        var in_this = $(this);
        var selected_name = in_this.attr('data-ss-name');
        var selected_value = in_this.attr('data-ss-value');
        var el_ss_wrap = $(".ss_wrap[data-ss-name='".concat(selected_name, "']"));
        var el_select_option = el_ss_wrap.find('select option');

        _this.setSelectProp(selected_name, selected_value);

        _this.setSelectText(selected_name);

        el_select_option.trigger('click');
        e.preventDefault();
        return false;
      }); // select 클릭

      el_ss_selected_value.off('click');
      el_ss_selected_value.on('click', function (e) {
        var in_this = $(this);
        var selected_name = in_this.attr('data-ss-name');
        var el_ss_wrap = $(".ss_wrap[data-ss-name='".concat(selected_name, "']"));
        var el_select = el_ss_wrap.find("select");
        var closeCheck = el_ss_wrap.is('.close');

        if (closeCheck == true) {
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

if (typeof jQuery == 'function') {
  jQuery(function ($) {
    SangriaUI.jQueryEventCheck();
    SangriaUI.UI_SELECT.construct();
    var targetSelector = SangriaUI.UI_SELECT.targetSelector;
    $(window).on('scroll', function () {
      $(targetSelector).each(function () {
        var targetElement = $(this);
        var targetName = targetElement.attr('data-ss-name');
        SangriaUI.UI_SELECT.itemListShowType(targetName);
      });
    });
    $(targetSelector).each(function () {
      var targetElement = $(this);
      var targetName = targetElement.attr('data-ss-name');
      SangriaUI.UI_SELECT.itemListShowType(targetName);
    });
  });
}

;

