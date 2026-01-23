console.log("core.js");

// page deliver time shit vibecoded IDGAFFFF
window.addEventListener("load", function () {
    var footer = document.getElementById("footer");
    if (!footer || !performance || !performance.timing) {
        return;
    }

    var t = performance.timing;

    function updateTime() {
        if (t.loadEventEnd > 0) {
            var loadTime = t.loadEventEnd - t.navigationStart;
            footer.innerHTML +=
                "<br>CustoDesk was brought to you in " + loadTime + " ms.";
        } else {
            setTimeout(updateTime, 50);
        }
    }

    updateTime();
});