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
     *
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

        targetClass += arrowTypeClass; // 존재하는건 삭제

        $(".ss_wrap[data-ss-name='".concat(targetName, "']")).remove();
        var attr_id = targetId != '' ? "id=\"".concat(targetId, "\"") : '';
        targetClass += 'ss_wrap close';
        targetClass = targetClass.trim();
        targetClass = targetClass.replaceAll('  ', ' '); // 신규 박스 추가

        var selectWrapHtml = "<div ".concat(attr_id, " class=\"").concat(targetClass, "\" data-ss-name=\"").concat(targetName, "\"></div>");
        el_select.before(selectWrapHtml);
      });
    }
  }
};

if (typeof jQuery == 'function') {
  jQuery(function ($) {
    SangriaUI.UI_SELECT.create();
  });
}

;

