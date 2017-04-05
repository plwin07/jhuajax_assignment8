(function() {
  'use strict';

  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
  .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
  .directive('foundItems', FoundItemsDirective);

  function FoundItemsDirective() {
    var ddo = {
      templateUrl: 'foundItemsList.html',
      scope: {
        items: '<',
        onRemove: '&'
      },
    }
    return ddo;
  };

  NarrowItDownController.$inject = ['MenuSearchService']
  function NarrowItDownController(MenuSearchService) {
    var narrowList = this;

    narrowList.searchTerm = "";
    narrowList.items = "";
    narrowList.searchMessage = "";
    narrowList.searchList = function(searchTerm) {
      var promise = MenuSearchService.getMatchedMenuItems(searchTerm);
      narrowList.searchTerm = "";
      if (searchTerm.length == 0) {
        narrowList.searchMessage = "No items matching description were found.";
        narrowList.items = "";
      } else {
        promise.then(function (response) {
            narrowList.items = response;
            narrowList.searchTerm = "";
            narrowList.searchMessage = "";
            if (narrowList.items.length == 0) {
              narrowList.searchMessage = "No items matching description were found.";
            }
          })
          .catch(function (error) {
            console.log(error);
          })
      }

    };
    narrowList.removeItem = function(itemIndex) {
      narrowList.items.splice(itemIndex,1);
    }
  }

  MenuSearchService.$inject = ['$http', 'ApiBasePath'];
  function MenuSearchService($http, ApiBasePath) {
    var service = this;

    service.getMatchedMenuItems = function(searchTerm) {
      return $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json")
      }).then(function (result) {
        var found = [];
        var items = result.data.menu_items;
        for (var i=0; i < items.length; i++) {
          if (items[i].description.indexOf(searchTerm) != -1) {
            found.push(items[i]);
          }
        }

        return found;
      });
    }

  }
})();
