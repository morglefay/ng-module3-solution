(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('foundItems', FoundItemsDirective);

function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      items: '<',
      onRemove: '&'
    },
    controller: FoundItemsDirectiveController,
    controllerAs: 'menuCtrl',
    bindToController: true
  };

  return ddo;
}


function FoundItemsDirectiveController() {
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var menu = this;

  menu.searchItem = function() {
    MenuSearchService.getMatchedMenuItems(menu.searchTerm)
      .then(function (foundItems){
        menu.found = foundItems;
      });
  }

  menu.removeItem = function (itemIndex) {
    MenuSearchService.removeItem(itemIndex);
  };

}


MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
  var service = this;
  var foundItems = [];

  service.getMatchedMenuItems = function (searchTerm) {
    var response = $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json")
    });

    return response.then(function (result) {
      // process result and only keep items that match
      foundItems = [];

      if (searchTerm != null && searchTerm.trim().length > 0) {              
      var allItems = result.data.menu_items;

        // return processed items
        for (var i = 0; i < allItems.length; i++) {
          if (allItems[i].description.toLowerCase().indexOf(searchTerm) >= 0) {
            foundItems.push(allItems[i]);
          }
        }
      }
      return foundItems;
    });
  };

  service.removeItem = function (itemIndex) {
    foundItems.splice(itemIndex, 1);
  };

}

})();
