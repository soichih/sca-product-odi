'use strict';
    
(function() {

//https://github.com/danialfarid/ng-file-upload
var service = angular.module('sca-product-nifti', [ ]);
service.directive('scaProductNifti', ['appconf', 'toaster', 
function(appconf, toaster) {
    return {
        restrict: 'E',
        scope: {
            files: '=',
        }, 
        templateUrl: 'bower_components/sca-product-nifti/ui/nifti.html',
        link: function(scope, element) {
        }
    };
}]);

service.filter('bytes', function() {
    return function(bytes, precision) {
        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
        if (typeof precision === 'undefined') precision = 1;
        var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
            number = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
    }
});
    
//end of IIFE (immediately-invoked function expression)
})();

