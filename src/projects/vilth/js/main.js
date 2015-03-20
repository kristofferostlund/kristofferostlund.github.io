$(function() {

  var navbar = $("#navbar");

  // Smooth Scroll
   $("a[href*=#]:not([href=#])").click(function () {
    if (location.pathname.replace(/^\//,"") == this.pathname.replace(/^\//, "") && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $("[name=" + this.hash.slice(1) + "]");
      if (target.length) {
        $("html,body").animate({
          scrollTop: target.offset().top - navbar.height()
        }, 300);
        return false;
      }
    }
  });




  var mainLogo = $("#main-logo"),
      userAgent = navigator.userAgent,
      isAndroid_4_1 = (userAgent.indexOf("Android 4.1") > -1);

  var aChildren = $("nav li").children(),
      aArray = [];
  for (var i = 0; i < aChildren.length; i++) {
    var aChild = aChildren[i];
    var ahref = $(aChild).attr('href');
    aArray.push(ahref);
  }

  $(window).scroll(function() {
    if (isAndroid_4_1) return;
    
    if ($(this).scrollTop() > 400) {
      // if (!isAndroid_4_1) {
        mainLogo.addClass("on");
      // }
    } else if ($(this).scrollTop() < 400) {
      // if (!isAndroid_4_1) {
        mainLogo.removeClass("on");
      // }
    }

    var windowPos = $(window).scrollTop();

    for (var i = 0; i < aArray.length; i++) {
      var theID = aArray[i];
      var divPos = $(theID).offset().top;
      var divHeight = $(theID).height();

      // var initialOffset = navbar.height() + ($(window).height() / 5);
      var initialOffset = navbar.height() + 2; // 2px extra for IE not to miss it
      var finalOffset = initialOffset;
      // if (i == 0) { initialOffset = navbar.height(); }
      var upperBoundry = divPos - initialOffset;
      var lowerBoundry = divPos + divHeight - finalOffset;


      if (windowPos >= upperBoundry && windowPos < lowerBoundry) {
        $("a[href='" + theID + "']").addClass("nav-active");
    } else {
      $("a[href='" + theID + "']").removeClass("nav-active");
      }
    }
  });
});