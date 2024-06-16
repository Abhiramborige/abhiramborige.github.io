import data from "./data.json" assert { type: "json" };

console.log(data);

const project_card = (row) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `
    <div class="card hidden">
      <div class="card_pt1">
        <div class="card_pt1_title">
          <a href=${row.project_link}><h2>${row.project_name}</h2></a>
        </div>
        <p>${row.description}</p>
      </div>
      <div class="card_pt2">
        <div class="card_pt2_percentage">
          <div
            class="card_pt2_percentage_circle"
            style=${
              row.percent_complete <= 50
                ? `"background-image: linear-gradient(${
                    (row.percent_complete * 360) / 100 + 90
                  }deg, transparent 50%, #6D8289 50%),
              linear-gradient(90deg, #6D8289 50%, transparent 50%);
              background-color: #eb4c4c;"`
                : `"background-image: linear-gradient(${
                    (row.percent_complete * 360) / 100 - 90
                  }deg, transparent 50%, #1684f8 50%), 
            linear-gradient(90deg, #6D8289 50%, transparent 50%)"`
            }
          >
            <div class="card_pt2_percentage_circle_in">
                <span>${row.percent_complete}</span>
                %
            </div>
          </div>
        </div>
      </div>
      

      <div class="card_pt1_profiles">
        <div class="card_pt1_date">
          <p>Start Date</p>
          <span>
          ${months[new Date(row.start_date).getMonth()]},${" "}
          ${new Date(row.start_date).getDate()} ${new Date(row.start_date).getFullYear()}
          </span>
        </div>
        <div class="card_pt1_date">
          <p>End Date</p>
          <span>
          ${months[new Date(row.end_date).getMonth()]},${" "}
          ${new Date(row.end_date).getDate()} ${new Date(row.end_date).getFullYear()}
          </span>
        </div>
        <div class="card_pt1_date" style="flex-basis:50%">
          <p>Stack used: </p>
          <span>
              ${row.tech_used.map((element) => {
                return " "+element;
              })}
          </span>
        </div>
      </div>

    </div>
  `;
};

const badge = (row) => {
  return `
  <div class="badge">
      <h3>${row.school}</h3>
      <span>${row.degree}</span>
      <span>Grade Point: </span><p>${row.score}</p>
      <p>${row.period}</p>
    </div>
  `;
};

// https://stackoverflow.com/questions/1533910/randomize-a-sequence-of-div-elements-with-jquery
$.fn.randomize = function (selector) {
  (selector ? this.find(selector) : this).parent().each(function () {
    $(this)
      .children(selector)
      .sort(function () {
        return Math.random() - 0.5;
      })
      .detach()
      .appendTo(this);
  });
  return this;
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    } else {
      entry.target.classList.remove("show");
    }
  });
});

$(document).ready(function () {
  var all_projects = "";
  $.each(data.projects, (index, row) => {
    all_projects += project_card(row);
  });
  $(".projects").append(all_projects);
  $(".projects").randomize("div.card");

  var all_schools = "";
  $.each(data.education, (index, row) => {
    all_schools += badge(row);
  });
  $(".education").append(all_schools);

  $(".card").each(function (index, card) {
    observer.observe(card);
  });

  $.fn.nav_icon_pos = function () {
    let angle = 60;
    let length = $(this).children().length;
    let diameter = parseInt($(this).css("width"));
    console.log(length, diameter / 2);
    $(this)
      .children()
      .each(function () {
        angle = parseInt((angle + 360 / (2 * length)) % 180);
        $(this).css(
          "transform",
          `rotate(${angle}deg) translateY(${
            diameter / 2 - 25
          }px) rotate(-${angle}deg)`
        );
      });
    return this;
  };

  $(".navbar")
    .children()
    .each(function () {
      $(this).on({
        mouseenter: function () {
          $(this).siblings().addClass("hidden_nav_icons");
          if ($(window).width() >= 900) {
            $(this).prevAll().css("transform", "translateY(100%)");
            $(this).nextAll().css("transform", "translateY(-100%)");
          } else {
            $(this).prevAll().css("transform", "translateX(100%)");
            $(this).nextAll().css("transform", "translateX(-100%)");
          }
          $(this)
            .children()
            .css("font-size", "+=3")
            .after(`<div>${$(this).attr("href").substring(1)}</div>`);
        },
        mouseleave: function () {
          $(this).siblings().removeClass("hidden_nav_icons");
          $(this).children().last().remove();
          if ($(".hamberger").attr("data-click-state") == 0) {
            $(".navbar").nav_icon_pos();
          } else {
            $(this).prevAll().css("transform", "translate(0,0)");
            $(this).nextAll().css("transform", "translate(0,0)");
            $(this).children().css("font-size", "-=3");
          }
        },
        click: function () {
          $(".navbar").removeClass("navbar_show");
          $(this).siblings().removeClass("hidden_nav_icons");
          $(this).children().last().remove();
          var last_icon = $(this);
          $(this).remove();
          $(".navbar").prepend(last_icon);
          $(".navbar").nav_icon_pos();
          $("section").css("filter", "blur(0px)");
          $(".hamberger").attr("data-click-state", 1);
          $(".hamberger").children().first().children().first().html("menu");
        },
      });
    });

  $(".hamberger").on({
    click: function () {
      if ($(this).attr("data-click-state") == 1) {
        $(this).children().first().children().first().html("menu_open");
        $(".navbar").addClass("navbar_show");
        $("section").css("filter", "blur(3px)");
        $(".navbar").nav_icon_pos();
        $(this).attr("data-click-state", 0);
      } else {
        $(this).children().first().children().first().html("menu");
        $(".navbar").removeClass("navbar_show");
        $("section").css("filter", "blur(0px)");
        $(this).attr("data-click-state", 1);
        $(".navbar")
          .children()
          .each(function () {
            $(this).css("transform", "translate(0,0)");
          });
      }
    },
  });

  $(".navbar").on({
    scroll: function () {
      console.log($(this));
      var last_icon = $(this).children().last();
      $(this).children().last().remove();
      $(this).prepend(last_icon);
      $(this).nav_icon_pos();
    },
  });
});




$.fn.wheel = function(event) {
  var delta = 0;
  if (event.wheelDelta) {(delta = event.wheelDelta / 120);}
  else if (event.detail) {(delta = -event.detail / 3);}
  handle(delta);
  if (event.preventDefault) {(event.preventDefault());}
  event.returnValue = false;
}

function handle(delta) {
  var time = 1000;
  var distance = 300;
  $('html, body').stop().animate({
      scrollTop: $(window).scrollTop() - (distance * delta)
  }, time );
}

if (window.addEventListener) {
  window.addEventListener('DOMMouseScroll', wheel, false);
}
window.onmousewheel = document.onmousewheel = wheel;