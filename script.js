import data from "./data.json" with { type: "json" };

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

  let curr_state_deg = []
  let $increment = false
  let angle = 60;

  $.fn.nav_icon_pos = function () {
    let length = $(this).children().length;
    let diameter = parseInt($(this).css("width"));
    let index = 0;
    $(this)
      .children()
      .each(function () {
        if(curr_state_deg[index] === undefined){
          angle = parseInt((angle + 360 / (2 * length)) % 180);
          curr_state_deg.push(angle)
        }
        else{
          if ($increment === true){
            angle = (curr_state_deg[index] + (180/length)) % 180;
            curr_state_deg[index] = angle;
          }
          else{
            angle = curr_state_deg[index];
          }
        }

        $(this).css(
          "transform",
          `rotate(${angle}deg) translateY(${
            diameter / 2 - 25
          }px) rotate(-${angle}deg)`
        );
        index = index + 1;
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
          $(".hamberger").attr("data-click-state", 1);
          $(this).siblings().removeClass("hidden_nav_icons");
          $("section").css("filter", "blur(0px)");
          $(".navbar")
            .children()
            .each(function () {
              $(this).css("transform", "translate(0,0)");
            });
          $(".hamberger").children().first().children().first().html("menu");
        },
      });
    });

  $(".hamberger").on({
    click: function () {
      if ($(this).attr("data-click-state") == 1) {
        // navigation on
        $(this).children().first().children().first().html("menu_open");
        $(".navbar").addClass("navbar_show");
        $("section").css("filter", "blur(3px)");
        $increment = false
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

  // https://stackoverflow.com/questions/10605197/detect-if-user-is-scrolling
  var $userHasScrolled = false
  $(".navbar").on({
    scroll: function (e) {
      if($userHasScrolled === false){
        $increment = true
        console.log("scroll happened")
        // var last_icon = $(this).children().last();
        // var to_display_off_ele = $(this).children().eq(4)
        // $(this).children().last().remove();
        // $(this).prepend(last_icon);
        $(this).nav_icon_pos();
        $userHasScrolled = true
      }
      else{
        setTimeout(() => {
          $userHasScrolled = false
        }, 100);
      }
    },
  });
});

