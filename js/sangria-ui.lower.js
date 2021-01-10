"use strict";

SangriaUI = {
  UI_SELECT: {
    targetSelector: '.sangria-select',
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
        var targetId = el_select.attr('data-ss-id');
        targetId = typeof targetId == 'undefined' ? '' : targetId;
        var targetClass = el_select.attr('data-ss-class');
        targetClass = typeof targetClass == 'undefined' ? '' : targetClass; // 감싼 영역 추가

        var selectWrap = "<div id=\"".concat(targetId, "\" class=\"ss_wrap ss_").concat(targetName, " ").concat(targetClass, "\"></div>");
        el_select.wrap(selectWrap);
        var selectHtml = '';
        selectHtml += "<a href=\"#\" class=\"ss_selected_value\"></a>";
        selectHtml += "<ul class=\"ss_option_list close\">";
        el_select.find('option').each(function () {
          var el_in_this = $(this);
          var in_this_value = el_in_this.val();
          var in_this_text = el_in_this.text();
          selectHtml += "<li data-ss-name=\"".concat(targetName, "\" data-ss-value=\"").concat(in_this_value, "\">").concat(in_this_text, "</li>");
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
      $(".ss_wrap.ss_".concat(targetName, " a.ss_selected_value")).text(targetText);
    },

    /**
     * select 선택된 속성 변경
     * @param targetName
     * @param targetValue
     */
    setSelectProp: function setSelectProp(targetName, targetValue) {
      var el_selectedTarget = $("select[name='".concat(targetName, "']"));
      el_selectedTarget.val(targetValue).prop({
        selected: true
      }).attr({
        selected: true
      });
      el_selectedTarget.trigger('change');
      $(".ss_wrap.ss_".concat(targetName, " .ss_option_list")).removeClass('open').addClass('close');
    },
    setSelectProp_old: function setSelectProp_old(targetName, targetValue) {
      var el_selectedTarget = $("select[name='".concat(targetName, "']"));
      el_selectedTarget.find("option[value='".concat(targetValue, "']")).attr('selected', 'selected');
      el_selectedTarget.trigger('change');
      $(".ss_wrap.ss_".concat(targetName, " .ss_option_list")).removeClass('open').addClass('close');
    },

    /**
     * 필요 이벤트 실행
     */
    setEvent: function setEvent() {
      var _this = this;

      var el_ss_selected_value = $("a.ss_selected_value");
      var el_ss_option_list = $('.ss_wrap .ss_option_list > li');

      if (typeof jQuery().on == 'function') {
        // 옵션 선택
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
        el_ss_selected_value.off('click');
        el_ss_selected_value.on('click', function (e) {
          $(this).next('.ss_option_list').toggleClass('close').toggleClass('open');
          e.preventDefault();
          return false;
        });
      } else {
        // 옵션 선택
        el_ss_option_list.unbind('click');
        el_ss_option_list.bind('click', function (e) {
          var in_this = $(this);
          var selected_name = in_this.attr('data-ss-name');
          var selected_value = in_this.attr('data-ss-value');

          _this.setSelectProp_old(selected_name, selected_value);

          _this.setSelectText(selected_name);

          e.preventDefault();
          return false;
        });
        el_ss_selected_value.unbind('click');
        el_ss_selected_value.bind('click', function (e) {
          $(this).next('.ss_option_list').toggleClass('close').toggleClass('open');
          e.preventDefault();
          return false;
        });
      }
    }
  }
};

if (typeof jQuery == 'function') {
  jQuery(function ($) {
    SangriaUI.UI_SELECT.construct();
  });
}

;

