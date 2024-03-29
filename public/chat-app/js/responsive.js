
$(document).ready(function () {
    function adjustLayout() {
        if ($(window).width() <= 600) {
            $(".contact").on('click', function () {
                $("#sidepanel").css({ display: "none" });
                $(".content").css({ display: "block" });
            });
            $(document).on('click', '.backIcon', function () {
                console.log('hello');
                $("#sidepanel").css({ display: "block" });
                $(".content").css({ display: "none" });
            });
        } 
    }

  
    adjustLayout();

   
   
});