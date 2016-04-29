'use strict';
(function() {

var service = angular.module('sca-product-odi', [ ]);
service.directive('scaProductNifti', ['appconf', 'serverconf', 'toaster', 'Upload', 'resources',
function(appconf, serverconf, toaster, Upload, resources) {
    console.log("product/odi.js");
}]);

//end of IIFE (immediately-invoked function expression)
})();

