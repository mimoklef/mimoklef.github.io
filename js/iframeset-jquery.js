$(function () {

  function bindIframeScrollWatcher() {
    var frame = $("#iframeview")[0];
    if (!frame || !frame.contentWindow) {
      return;
    }

    try {
      var frameWindow = frame.contentWindow;
      var onScroll = function () {
        var y = frameWindow.scrollY || frameWindow.pageYOffset || 0;
        $('body').toggleClass('navbar-away', y > 20);
      };

      if (frameWindow.__navbarAwayHandler) {
        frameWindow.removeEventListener('scroll', frameWindow.__navbarAwayHandler);
      }

      frameWindow.__navbarAwayHandler = onScroll;
      frameWindow.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    } catch (e) {
      $('body').removeClass('navbar-away');
    }
  }

  if (inIframe()) {
    $("#notframe").remove()

  } else {
    $("#inframe").remove()

    $("a").on('click', function (event) {
      var url = $(this).attr('href');
      if (!($(this).attr('target') == "_blank")) {

        event.preventDefault();
        if ($(this).attr('Maction') == "switchlang") {
          window.switchlangnavbar(event)
          window.frames[0].switchlang(event);
        } else {
          $("#iframeview").attr("src", url);
        }
      }
    });

    $("#iframeview").on('load', function () {
      document.title = $("#iframeview")[0].contentDocument.title;
      let url = $("#iframeview")[0].contentWindow.location.href;
      var pieces = url.split("/");
      link = pieces[pieces.length - 1];
      history.replaceState(null, document.title, url);
      manageNavBar(link);
      bindIframeScrollWatcher();
    });
  }
})

function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

function manageNavBar(url) {
  if (url === "") {
    $('.gotohome').each(function () {
      var $this = $(this);
      $this.parent().addClass("active");
    });
    $('.gotoproject').each(function () {
      var $this = $(this);
      $this.parent().removeClass("active");
    });
    $('.gotocontact').each(function () {
      var $this = $(this);
      $this.parent().removeClass("active");
    });
  } else
    if (url === "contact") {
      $('.gotohome').each(function () {
        var $this = $(this);
        $this.parent().removeClass("active");
        console.log("contact")
      });
      $('.gotoproject').each(function () {
        var $this = $(this);
        $this.parent().removeClass("active");
        console.log("contact")
      });
      $('.gotocontact').each(function () {
        var $this = $(this);
        $this.parent().addClass("active");
      });
    } else
    if (url === "projets") {
      $('.gotohome').each(function () {
        var $this = $(this);
        $this.parent().removeClass("active");
        console.log("contact")
      });
      $('.gotocontact').each(function () {
        var $this = $(this);
        $this.parent().removeClass("active");
      });
      $('.gotoproject').each(function () {
        var $this = $(this);
        $this.parent().addClass("active");
      });}
     else {
      $('.gotohome').each(function () {
        var $this = $(this);
        $this.parent().removeClass("active");
      });
      $('.gotocontact').each(function () {
        var $this = $(this);
        $this.parent().removeClass("active");
      });
      $('.gotoproject').each(function () {
        var $this = $(this);
        $this.parent().removeClass("active");
      });
    }
}