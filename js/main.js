(function ($) {
  "use strict";

  // Spinner
  var spinner = function () {
    setTimeout(function () {
      if ($("#spinner").length > 0) {
        $("#spinner").removeClass("show");
      }
    }, 1);
  };
  spinner();

  // Initialize WOW.js only if it exists
  if (typeof WOW !== "undefined") {
    new WOW().init();
  }

  // Sticky Navbar
  $(window).scroll(function () {
    if ($(this).scrollTop() > 45) {
      $(".navbar").addClass("sticky-top shadow-sm");
    } else {
      $(".navbar").removeClass("sticky-top shadow-sm");
    }
  });

  // Dropdown on mouse hover
  const $dropdown = $(".dropdown");
  const $dropdownToggle = $(".dropdown-toggle");
  const $dropdownMenu = $(".dropdown-menu");
  const showClass = "show";

  $(window).on("load resize", function () {
    if (this.matchMedia("(min-width: 992px)").matches) {
      $dropdown.hover(
        function () {
          const $this = $(this);
          $this.addClass(showClass);
          $this.find($dropdownToggle).attr("aria-expanded", "true");
          $this.find($dropdownMenu).addClass(showClass);
        },
        function () {
          const $this = $(this);
          $this.removeClass(showClass);
          $this.find($dropdownToggle).attr("aria-expanded", "false");
          $this.find($dropdownMenu).removeClass(showClass);
        }
      );
    } else {
      $dropdown.off("mouseenter mouseleave");
    }
  });

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $(".back-to-top").fadeIn("slow");
    } else {
      $(".back-to-top").fadeOut("slow");
    }
  });
  $(".back-to-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
    return false;
  });

  // Initialize Owl Carousel only if it exists
  if ($.fn.owlCarousel) {
    $(".testimonial-carousel").owlCarousel({
      autoplay: true,
      smartSpeed: 1000,
      center: true,
      margin: 24,
      dots: true,
      loop: true,
      nav: false,
      responsive: {
        0: {
          items: 1,
        },
        768: {
          items: 2,
        },
        992: {
          items: 3,
        },
      },
    });
  }

  // Initialize CounterUp if it exists
  if ($.fn.counterUp) {
    $('[data-toggle="counter-up"]').counterUp({
      delay: 10,
      time: 2000,
    });
  }

  // Counter Animation
  const counter = document.querySelectorAll(".counter");
  const speed = 200;

  const runCounter = () => {
    counter.forEach((counter) => {
      const animate = () => {
        const value = +counter.getAttribute("data-target");
        const data = +counter.innerText;
        const time = value / speed;

        if (data < value) {
          counter.innerText = Math.ceil(data + time);
          setTimeout(animate, 1);
        } else {
          counter.innerText = value;
        }
      };
      animate();
    });
  };

  // Intersection Observer for Counter Animation
  const observerOptions = {
    threshold: 0.5,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.classList.contains("counted")) {
        entry.target.classList.add("counted");
        runCounter();
      }
    });
  }, observerOptions);

  const statsSection = document.querySelector(".stats-box");
  if (statsSection) {
    observer.observe(statsSection.closest(".container-xxl"));
  }

  // Smooth scroll for anchor links
  $('a[href^="#"]').on("click", function (e) {
    e.preventDefault();
    const target = $(this.getAttribute("href"));
    if (target.length) {
      $("html, body")
        .stop()
        .animate(
          {
            scrollTop: target.offset().top - 100,
          },
          1000
        );
    }
  });

  // Add parallax effect to hero section (subtle upward movement)
  $(window).on("scroll", function () {
    const scrolled = $(window).scrollTop();
    if (scrolled < 600) {
      // Only apply when hero is visible
      $(".hero-header").css(
        "transform",
        "translateY(" + scrolled * -0.3 + "px)"
      );
    }
  });

  // Add hover effect to service cards
  $(".service-item")
    .on("mouseenter", function () {
      $(this).find("i").addClass("animated tada");
    })
    .on("mouseleave", function () {
      $(this).find("i").removeClass("animated tada");
    });

  // Add stagger animation to elements on scroll
  const staggerObserverOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("fadeInUp");
        }, index * 100);
        staggerObserver.unobserve(entry.target);
      }
    });
  }, staggerObserverOptions);

  // Observe elements
  document
    .querySelectorAll(".service-item, .stats-box, .accordion-item")
    .forEach((el) => {
      staggerObserver.observe(el);
    });
})(jQuery);
