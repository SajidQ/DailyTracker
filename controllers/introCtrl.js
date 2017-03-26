
app.controller('introCtrl', function($scope,$location, $window, HandleAPIInteraction) {
  angular.element(document).ready(function () {
    HandleAPIInteraction.setButtons($('#authorize-button'), $('#signout-button'));
    HandleAPIInteraction.handleClientLoad();
  });
});
