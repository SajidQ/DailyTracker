app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });


                var temp = $(this).parent().parent().parent().find('.input-row').last();
                temp[0].focus();

                event.preventDefault();
            }
        });
    };
});
