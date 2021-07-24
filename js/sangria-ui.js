"use strict";

/**
 * SangriaUI
 * @type {{UI_SELECT: {targetSelector: string, itemListShowType: SangriaUI.UI_SELECT.itemListShowType, create: (function(string=): boolean), setSelectText: SangriaUI.UI_SELECT.setSelectText, select_no: number, itemListOpen: SangriaUI.UI_SELECT.itemListOpen, itemListClose: SangriaUI.UI_SELECT.itemListClose, setSelectProp: SangriaUI.UI_SELECT.setSelectProp}, version: string, jQueryVersionConfirm: (function(int, int=, int=): boolean), jQueryEventCheck: SangriaUI.jQueryEventCheck}}
 */
var SangriaUI = {
  version: '1.0.0',

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
     * select 데이터를 기준으로 HTML 을 (재)생성
     * @param {string} [targetSelector]
     * @returns {boolean}
     */
    create: function create(targetSelector) {
      var _this = this;

      if ($(_this.targetSelector).length == 0) {
        return false;
      }

      var selectSelector = "select".concat(_this.targetSelector);

      if (typeof targetSelector == 'string' && targetSelector != '') {
        selectSelector = targetSelector;
      }

      $(selectSelector).each(function () {
        var el_select = $(this); // 고유 이름 생성

        var targetName = el_select.attr('data-ss-name');

        if (typeof targetName == 'undefined' || targetName == '') {
          targetName = "s_select_".concat(_this.select_no);
          el_select.attr('data-ss-name', targetName);
          _this.select_no++;
        }

        var targetId = el_select.attr('data-ss-id');
        targetId = typeof targetId == 'undefined' ? '' : targetId;
        var targetClass = el_select.attr('data-ss-class');
        targetClass = typeof targetClass == 'undefined' ? '' : targetClass;
        var closeMode = el_select.attr('data-ss-close-mode');
        var closeModeClass = '';

        if (closeMode == 'click') {
          closeModeClass = ' leave_close_off ';
        }

        targetClass += closeModeClass;
        var arrowType = el_select.attr('data-ss-arrow-type');
        var arrowTypeClass = " font ";

        if (arrowType == 'image') {
          arrowTypeClass = ' image ';
        }

        targetClass += arrowTypeClass;
        var disable = el_select.attr('disabled');

        if (disable == true || disable == 'disabled') {
          targetClass += ' disabled ';
        } // 존재하는건 삭제


        $(".ss_wrap[data-ss-name='".concat(targetName, "']")).remove();
        var attr_id = targetId != '' ? "id=\"".concat(targetId, "\"") : '';
        targetClass += 'ss_wrap close';
        targetClass = targetClass.trim();
        targetClass = targetClass.replace(/  /gi, ' '); // 신규 박스 추가

        var selectHtml = "<a href=\"#\" class=\"ss_selected_value\" title=\"\"></a>";
        var selectOptionHtml = "<ul class=\"ss_option_list\">";
        el_select.find('option').each(function () {
          var el_in_this = $(this);
          var in_this_value = el_in_this.val();
          var in_this_text = el_in_this.text();
          selectOptionHtml += "<li data-ss-value=\"".concat(in_this_value, "\" title=\"").concat(in_this_text, "\">").concat(in_this_text, "</li>");
        });
        selectOptionHtml += "</ul>";
        var selectWrapHtml = "<div ".concat(attr_id, " class=\"").concat(targetClass, "\" data-ss-name=\"").concat(targetName, "\">").concat(selectHtml).concat(selectOptionHtml, "</div>");
        el_select.before(selectWrapHtml);

        _this.setSelectText(targetName); // 현재 값 표시


        _this.itemListShowType(targetName); // 위치에 따라 위 아래 표시


        var el_ss_wrap = $(".ss_wrap[data-ss-name=\"".concat(targetName, "\"]"));
        var el_ss_option_list = el_ss_wrap.find(".ss_option_list > li");
        var el_select_option = el_select.find('option');
        var el_ss_selected_value = el_ss_wrap.find('.ss_selected_value'); // 닫기 기능 설정

        if (el_ss_wrap.is('.leave_close_off') == false) {
          el_ss_wrap.off('mouseleave');
          el_ss_wrap.on('mouseleave', function () {
            _this.itemListClose(targetName);
          });
        } // 옵션 클릭


        el_ss_option_list.off('click');
        el_ss_option_list.on('click', function (e) {
          var in_this = $(this);
          var selected_value = in_this.attr('data-ss-value');

          _this.setSelectProp(targetName, selected_value);

          _this.setSelectText(targetName);

          _this.itemListClose(targetName);

          el_select_option.trigger('click');
          e.preventDefault();
          return false;
        }); // select 클릭

        el_ss_selected_value.off('click');
        el_ss_selected_value.on('click', function (e) {
          try {
            if (disable == true || disable == 'disabled') {
              throw 'click stop';
            }

            var closeCheck = el_ss_wrap.is('.close');

            if (closeCheck == true) {
              _this.itemListOpen(targetName);
            } else {
              _this.itemListClose(targetName);
            }

            el_select.trigger('click');
          } catch (e) {}

          e.preventDefault();
          return false;
        });
      });
    },

    /**
     * 현재 선택 값 표시
     * @param {string} targetName
     */
    setSelectText: function setSelectText(targetName) {
      var el_ss_wrap = $(".ss_wrap[data-ss-name='".concat(targetName, "']"));
      var el_select = $("select[data-ss-name='".concat(targetName, "']"));
      var el_selectedTarget = el_select.find("option:selected");
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
    },

    /**
     * 옵션 인덱스 최소 최대
     * @param idx
     * @param max
     * @returns {number}
     */
    optionIdxCheck: function optionIdxCheck(idx, max) {
      if (idx < 0) {
        idx = 0;
      } else if (idx >= max) {
        idx = max - 1;
      }

      return idx;
    },

    /**
     * 목록 열기
     * @param {string} targetName
     */
    itemListOpen: function itemListOpen(targetName) {
      var _this = this;

      var el_ss_wrap = $(".ss_wrap[data-ss-name='".concat(targetName, "']"));
      el_ss_wrap.removeClass('close').addClass('open');
      el_ss_wrap.find('.su-icon.icon-su-arrow-down').removeClass('icon-su-arrow-down').addClass('icon-su-arrow-up');
      var option_idx = 0; // todo 현재 선택값 selected 및 idx 지정

      var el_selected = $("select[data-ss-name='".concat(targetName, "']"));
      var selected = el_selected.val();
      var el_select_option = el_selected.find('option'); // 전체 .selected 제거

      var el_li_list = el_ss_wrap.find('.ss_option_list li');
      el_li_list.removeClass('selected');
      var option_length = el_li_list.length; // 선택된것 selected

      el_li_list.each(function (idx, _element) {
        var el_this = $(_element);
        var ss_value = el_this.attr('data-ss-value'); // 선택된 값이면

        if (ss_value == selected) {
          option_idx = idx;
          el_this.addClass('selected');
        } else {
          return true;
        }
      }); // 키보드로 이동

      $("html > body").off('keydown');
      $("html > body").on('keydown', function (event) {
        if (event.keyCode === 38) {
          // 위
          option_idx--;
        } else if (event.keyCode === 40) {
          // 아래
          option_idx++;
        } else {
          return true;
        }

        option_idx = _this.optionIdxCheck(option_idx, option_length);
        el_li_list.removeClass('selected');
        el_li_list.eq(option_idx).addClass('selected');
        var selected_value = el_li_list.eq(option_idx).attr('data-ss-value');

        _this.setSelectProp(targetName, selected_value);

        _this.setSelectText(targetName);

        el_select_option.trigger('click');
      });
    },

    /**
     * 목록 닫기
     * @param {string} targetName
     */
    itemListClose: function itemListClose(targetName) {
      var el_ss_wrap = $(".ss_wrap[data-ss-name='".concat(targetName, "']"));
      el_ss_wrap.removeClass('open').addClass('close');
      el_ss_wrap.find('.su-icon.icon-su-arrow-up').removeClass('icon-su-arrow-up').addClass('icon-su-arrow-down'); // 키 다운 없애기

      $("html > body").off('keydown');
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
    }
  }
};

if (typeof jQuery == 'function') {
  jQuery(function ($) {
    SangriaUI.jQueryEventCheck();
    SangriaUI.UI_SELECT.create(); // 기본 실행

    var targetSelector = SangriaUI.UI_SELECT.targetSelector;
    $(targetSelector).each(function () {
      var targetElement = $(this);
      var targetName = targetElement.attr('data-ss-name');
      SangriaUI.UI_SELECT.itemListShowType(targetName);
    });
    $(window).on('scroll', function () {
      $(targetSelector).each(function () {
        var targetElement = $(this);
        var targetName = targetElement.attr('data-ss-name');
        SangriaUI.UI_SELECT.itemListShowType(targetName);
      });
    });
    $(document).on('mouseup', function (e) {
      var container = $('.ss_wrap');

      if (container.has(e.target).length === 0) {
        container.removeClass('open').addClass('close');
        container.find('.su-icon.icon-su-arrow-up').removeClass('icon-su-arrow-up').addClass('icon-su-arrow-down');
      }
    });
  });
}

;

