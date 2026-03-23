$(function () {

  function navigateIframe(url) {
    if (!url) {
      return;
    }

    $('body').removeClass('iframe-entering');
    $("#iframeview").attr("src", url);
  }

  function bindIframeScrollWatcher() {
    var frame = $("#iframeview")[0];
    if (!frame || !frame.contentWindow) {
      return;
    }

    try {
      var frameWindow = frame.contentWindow;
      var frameDocument = frameWindow.document;
      var onScroll = function () {
        var scroller = frameDocument && frameDocument.scrollingElement
          ? frameDocument.scrollingElement
          : null;
        var y = frameWindow.scrollY || frameWindow.pageYOffset || (scroller ? scroller.scrollTop : 0) || 0;
        $('body').toggleClass('navbar-away', y > 20);
      };

      if (frameWindow.__navbarAwayHandler) {
        frameWindow.removeEventListener('scroll', frameWindow.__navbarAwayHandler);
      }

      if (frameWindow.__navbarAwayDocHandler && frameDocument) {
        frameDocument.removeEventListener('scroll', frameWindow.__navbarAwayDocHandler, true);
      }

      frameWindow.__navbarAwayHandler = onScroll;
      frameWindow.__navbarAwayDocHandler = onScroll;
      frameWindow.addEventListener('scroll', onScroll, { passive: true });

      if (frameDocument) {
        frameDocument.addEventListener('scroll', onScroll, { passive: true, capture: true });
      }

      onScroll();
    } catch (e) {
      $('body').removeClass('navbar-away');
    }
  }

  function syncIframeShellState(animateEntry) {
    var frame = $("#iframeview")[0];
    if (!frame || !frame.contentWindow || !frame.contentDocument) {
      return;
    }

    try {
      var href = frame.contentWindow.location.href || '';
      var cleanHref = href.split('#')[0].split('?')[0];
      var parts = cleanHref.split('/');
      var link = parts[parts.length - 1] || '';

      if (frame.contentDocument.title) {
        document.title = frame.contentDocument.title;
      }

      history.replaceState(null, document.title, href);
      manageNavBar(link);
      bindIframeScrollWatcher();

      if (animateEntry) {
        $('body').addClass('iframe-entering');
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            $('body').removeClass('iframe-entering');
          });
        });
      }
    } catch (e) {
      return;
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
          navigateIframe(url);
        }
      }
    });

    $("#iframeview").on('load', function () {
      syncIframeShellState(true);
    });

    // Some browsers/pages can complete the first iframe load before this handler is attached.
    syncIframeShellState(false);
    setTimeout(function () { syncIframeShellState(false); }, 150);
    setTimeout(function () { syncIframeShellState(false); }, 350);
    setTimeout(function () { syncIframeShellState(false); }, 700);
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