forgetlessApp.directive('handleCategory', function() {

    return {
        templateUrl: '/partials/category_item_view.html',
        controller: function($scope, $element) {
            var element = $element[0];
            var categoryHeader = element.querySelector('.content-item');
            var optionsContainer = categoryHeader.querySelector('.options-container');
            var toggleOptionsButton = optionsContainer.querySelector('.show-options-button');
            var deleteEditOptionContainer = optionsContainer.querySelector('.main');
            var deleteConfirmOptionsContainer = categoryHeader.querySelector('.delete-confirm');
            var confirmOptionsContainer = categoryHeader.querySelector('.delete-confirm');

            $scope.mainOptionClassParam = {
                'hide-option': false
            };

            $scope.optionsContainerClassParam = {
                'hide-options': true
            };

            angular.element(optionsContainer).on('click', function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
            });

            angular.element(toggleOptionsButton).on('click', function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();

                $scope.$apply(function() {
//                    $scope.mainOptionClassParam['hide-option'] = !$scope.mainOptionClassParam['hide-option'];
                    $scope.optionsContainerClassParam['hide-options'] = !$scope.optionsContainerClassParam['hide-options'];
                });
            });

        }
    };


});

forgetlessApp.directive('handleList', function() {

    return {
        templateUrl: '/partials/list_item_view.html',
        controller: function($scope, $element, $state) {
            var element = $element[0];
            var listHeader = element.querySelector('.content-item');
            var itemsContainer = element.querySelector('.items-container');

            angular.element(listHeader).on('click', function() {

                $scope.$apply(function() {
                    $scope.list.selected = !$scope.list.selected;
                });

                var params = {
                    categoryId: $scope.selectedCategoryId
                };

                var stateName = 'app.category';

                if($scope.list.selected) {
                    params.listId = $scope.list.id;
                    stateName += '.list';
                }

                $state.go(stateName, params);

            });
        }
    };

});

forgetlessApp.directive('handleItem', function() {

    return {
        templateUrl: '/partials/item_view.html',
        controller: function($scope, $element, $state) {
            var element = $element[0];
            var itemHeader = element.querySelector('.content-item');
            var itemDetails = element.querySelector('.item-detail');
            var itemsContainer = element.querySelector('.items-container');

            angular.element(itemHeader).on('click', function() {

                $scope.$apply(function() {
                    $scope.item.selected = !$scope.item.selected;
                });

                 var params = {
                     categoryId: $scope.selectedCategoryId,
                     listId: $scope.list.id
                 };

                 var stateName = 'app.category.list';

                 if($scope.item.selected) {
                     params.itemId = $scope.item.id;
                     stateName += '.item';
                 }

                 $state.go(stateName, params);

            });

        }
    };

});

forgetlessApp.directive('syncHeight', function($window) {
    return function(scope, element) {

        var window = angular.element($window);

        var applyResize = function() {

            // Work out header height
            var header = document.getElementById('header-outer-container');
            var headerHeight = parseInt($window.getComputedStyle(header, null).getPropertyValue('height'));
            headerHeight = headerHeight || 60;

            element.css({
                'height': ($window.innerHeight - headerHeight) + 'px'
            });
        };

        window.on('resize', applyResize);

        $window.scrollTop = 0;
        applyResize();
    }
});