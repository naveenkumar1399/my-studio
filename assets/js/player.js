(function () {
  "use strict";

  var params = new URLSearchParams(window.location.search);
  var slug = params.get("course");

  var titleEl = document.getElementById("course-title");
  var subEl = document.getElementById("course-sub");
  var chipEl = document.getElementById("status-chip");
  var scormBadge = document.getElementById("course-scorm");
  var toolEl = document.getElementById("course-tool");
  var restartBtn = document.getElementById("restart-btn");
  var fullscreenBtn = document.getElementById("fullscreen-btn");
  var frameWrap = document.getElementById("frame-wrap");
  var frame = document.getElementById("sco-frame");
  var placeholder = document.getElementById("player-placeholder");
  var placeholderTitle = document.getElementById("placeholder-title");
  var placeholderText = document.getElementById("placeholder-text");
  var slugA = document.getElementById("slug-a");
  var slugB = document.getElementById("slug-b");

  var infoTitle = document.getElementById("info-title");
  var infoStandard = document.getElementById("info-standard");
  var infoTool = document.getElementById("info-tool");
  var infoPackage = document.getElementById("info-package");
  var infoStatus = document.getElementById("info-status");
  var infoScore = document.getElementById("info-score");

  var statusTimer = null;
  var activeApi = null;
  var activeVersion = "1.2";
  var currentCourse = null;

  function setSlugLabels(value) {
    if (slugA) slugA.textContent = value;
    if (slugB) slugB.textContent = value;
  }

  function statusLabel(raw) {
    switch (String(raw || "").toLowerCase()) {
      case "passed":
        return "Passed";
      case "completed":
        return "Completed";
      case "failed":
        return "Failed";
      case "incomplete":
        return "In progress";
      case "browsed":
        return "Browsed";
      case "not attempted":
        return "Not started";
      default:
        return raw || "Not started";
    }
  }

  function stateFor(raw) {
    var value = String(raw || "").toLowerCase();
    if (value === "completed" || value === "passed") return "completed";
    if (value === "failed") return "failed";
    if (value === "incomplete" || value === "browsed") return "running";
    return "idle";
  }

  function applyStatus(rawStatus, rawScore) {
    var label = statusLabel(rawStatus);
    var state = stateFor(rawStatus);

    if (chipEl) {
      chipEl.textContent = label;
      chipEl.setAttribute("data-state", state);
    }
    if (infoStatus) infoStatus.textContent = label;

    if (infoScore) {
      if (rawScore === null || rawScore === undefined || rawScore === "") {
        infoScore.textContent = "-";
      } else {
        infoScore.textContent = String(rawScore);
      }
    }
  }

  function readValue(name) {
    if (!activeApi) return "";
    try {
      if (activeVersion === "2004") {
        if (typeof activeApi.GetValue !== "function") return "";
        return activeApi.GetValue(name);
      }
      if (typeof activeApi.LMSGetValue !== "function") return "";
      return activeApi.LMSGetValue(name);
    } catch (error) {
      return "";
    }
  }

  function apiInitialized() {
    if (!activeApi || typeof activeApi.isInitialized !== "function") {
      return false;
    }
    try {
      return activeApi.isInitialized();
    } catch (error) {
      return false;
    }
  }

  function pollStatus() {
    var rawStatus;
    var rawScore;
    var maxScore;
    var scoreText;

    if (!apiInitialized()) {
      return;
    }

    if (activeVersion === "2004") {
      var completion = readValue("cmi.completion_status");
      var success = readValue("cmi.success_status");
      rawScore = readValue("cmi.score.raw");
      maxScore = readValue("cmi.score.max");

      if (success === "passed" || success === "failed") {
        rawStatus = success;
      } else if (completion === "completed") {
        rawStatus = "completed";
      } else if (completion === "incomplete") {
        rawStatus = "incomplete";
      } else if (!completion || completion === "not attempted" || completion === "unknown") {
        rawStatus = "not attempted";
      } else {
        rawStatus = completion;
      }
    } else {
      rawStatus = readValue("cmi.core.lesson_status");
      rawScore = readValue("cmi.core.score.raw");
      maxScore = readValue("cmi.core.score.max");
    }

    scoreText = rawScore;
    if (rawScore !== "" && maxScore !== "" && maxScore !== undefined) {
      scoreText = rawScore + " / " + maxScore;
    }

    applyStatus(rawStatus, scoreText);
  }

  function createApi(course) {
    var version = course && course.scormVersion ? String(course.scormVersion) : "1.2";
    activeVersion = version === "2004" ? "2004" : "1.2";
    activeApi = null;

    if (activeVersion === "2004") {
      if (typeof window.Scorm2004API !== "function") {
        return false;
      }
      try {
        window.API_1484_11 = new window.Scorm2004API({ autocommit: true, logLevel: 0 });
        activeApi = window.API_1484_11;
        return true;
      } catch (error) {
        return false;
      }
    }

    if (typeof window.Scorm12API !== "function") {
      return false;
    }
    try {
      window.API = new window.Scorm12API({ autocommit: true, logLevel: 0 });
      activeApi = window.API;
      return true;
    } catch (error) {
      return false;
    }
  }

  function launchCourse(course, cacheBust) {
    var apiReady = createApi(course);
    var launchUrl = course.launch;

    if (cacheBust) {
      launchUrl += (launchUrl.indexOf("?") > -1 ? "&" : "?") + "r=" + Date.now();
    }

    if (placeholder) placeholder.hidden = true;
    if (frameWrap) frameWrap.hidden = false;
    if (restartBtn) restartBtn.hidden = false;
    if (fullscreenBtn) fullscreenBtn.hidden = false;
    if (infoPackage) infoPackage.textContent = "Imported";

    frame.src = launchUrl;

    if (!apiReady) {
      if (infoPackage) infoPackage.textContent = "SCORM run-time unavailable";
      applyStatus("", "");
      return;
    }

    pollStatus();
    if (statusTimer) window.clearInterval(statusTimer);
    statusTimer = window.setInterval(pollStatus, 1200);
  }

  function showNotImported(course, reasonTitle, reasonText) {
    if (placeholderTitle && reasonTitle) placeholderTitle.textContent = reasonTitle;
    if (placeholderText && reasonText) placeholderText.textContent = reasonText;
    if (placeholder) placeholder.hidden = false;
    if (frameWrap) frameWrap.hidden = true;
    if (restartBtn) restartBtn.hidden = true;
    if (fullscreenBtn) fullscreenBtn.hidden = true;
    if (infoPackage) infoPackage.textContent = "Not imported";
    applyStatus("", "");
  }

  function fillDetails(course) {
    if (!course) return;
    document.title = course.title + " | Course Player";
    if (titleEl) titleEl.textContent = course.title;
    if (subEl) subEl.textContent = (course.scormVersion || "SCORM 1.2") + " package player";
    if (scormBadge) scormBadge.textContent = "SCORM " + (course.scormVersion || "1.2");
    if (toolEl) toolEl.textContent = course.authoringTool || "Course package";
    if (infoTitle) infoTitle.textContent = course.title;
    if (infoStandard) infoStandard.textContent = "SCORM " + (course.scormVersion || "1.2");
    if (infoTool) infoTool.textContent = course.authoringTool || "-";
    setSlugLabels(course.slug);
  }

  function init() {
    if (!slug) {
      showNotImported(
        null,
        "No course selected",
        "Open a course from the work samples section to load its SCORM 1.2 package here."
      );
      return;
    }

    setSlugLabels(slug);

    fetch("assets/scorm/courses.json", { cache: "no-store" })
      .then(function (response) {
        if (!response.ok) throw new Error("Unable to load course index");
        return response.json();
      })
      .then(function (data) {
        var courses = (data && data.courses) || [];
        var course = courses.filter(function (item) {
          return item.slug === slug;
        })[0];

        if (!course) {
          showNotImported(
            null,
            "Course not found",
            "The course '" + slug + "' is not registered in assets/scorm/courses.json."
          );
          return;
        }

        fillDetails(course);
        currentCourse = course;

        if (course.available && course.launch) {
          launchCourse(course);
        } else {
          showNotImported(course);
        }
      })
      .catch(function () {
        showNotImported(
          null,
          "Course index unavailable",
          "Could not load assets/scorm/courses.json. Open this page through a web server (or GitHub Pages), not directly from a file."
        );
      });
  }

  if (restartBtn) {
    restartBtn.addEventListener("click", function () {
      if (!currentCourse || !currentCourse.launch) return;
      if (statusTimer) window.clearInterval(statusTimer);
      applyStatus("", "");
      launchCourse(currentCourse, true);
    });
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener("click", function (event) {
      event.preventDefault();
      if (!frameWrap) return;
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else if (frameWrap.requestFullscreen) {
        frameWrap.requestFullscreen();
      }
    });
  }

  init();
})();
