forgetlessApp.directive('handleCategory', function() {

    return {
        templateUrl: '/partials/category_item_view.html',
        controller: function($scope, $element, $window) {
            var element = $element[0];
            var categoryHeader = element.querySelector('.content-item');
            var titleContainer = categoryHeader.querySelector('.title-container');
            var optionsContainer = categoryHeader.querySelector('.options-container');
            var optionsGroup = categoryHeader.querySelector('.options-group');

            var showOptionsButton = optionsContainer.querySelector('.show-options-button');

            var mainOptionContainer = optionsContainer.querySelector('.main');
            var editButton = mainOptionContainer.querySelector('.edit-icon');
            var deleteButton = mainOptionContainer.querySelector('.delete-icon');

            var deleteConfirmOptionsContainer = categoryHeader.querySelector('.delete-confirm');
            var deleteYesButton = deleteConfirmOptionsContainer.querySelector('.delete-yes-icon');
            var deleteNoButton = deleteConfirmOptionsContainer.querySelector('.delete-no-icon');

            var confirmOptionsContainer = categoryHeader.querySelector('.confirm');
            var confirmYesButton = confirmOptionsContainer.querySelector('.confirm-yes-icon');
            var confirmNoButton = confirmOptionsContainer.querySelector('.confirm-no-icon');

            $scope.mainOptionClassParam = {
                'hide-option': false
            };

            $scope.titleContainerStyleParam = {
                'max-width': '80%'
            };

            $scope.confirmOptionClassParam = {
                'hide-option': true
            };

            $scope.deleteOptionClassParam = {
                'hide-option': true
            };

            $scope.optionsContainerClassParam = {
                'hide-options': true
            };

            angular.element(optionsContainer).on('click', function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
            });

            angular.element(showOptionsButton).on('click', function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();

                var selected = $scope.optionsContainerClassParam['hide-options'];
                var optionsContainerWidth = parseInt($window.getComputedStyle(optionsGroup, null).getPropertyValue('width'));
                var categoryHeaderWidth = parseInt($window.getComputedStyle(categoryHeader, null).getPropertyValue('width'));

                if(!selected &&
                    optionsContainerWidth != undefined &&
                    categoryHeaderWidth != undefined) {
                    maxWidth = '80%';
                } else {
                    maxWidth = (categoryHeaderWidth - optionsContainerWidth) + 'px';
                }

                $scope.$apply(function() {

                    $scope.titleContainerStyleParam['max-width'] = maxWidth;

                    $scope.optionsContainerClassParam['hide-options'] = !selected;
                });
            });

            angular.element(editButton).on('click', function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();

                $scope.$apply(function() {
                    $scope.mainOptionClassParam['hide-option'] = true;
                    $scope.confirmOptionClassParam['hide-option'] = false;
                    $scope.deleteOptionClassParam['hide-option'] = true;
                });
            });

            angular.element(deleteYesButton).on('click', function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
            });

            angular.element(deleteNoButton).on('click', function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();

                $scope.$apply(function() {
                    $scope.mainOptionClassParam['hide-option'] = false;
                    $scope.confirmOptionClassParam['hide-option'] = true;
                    $scope.deleteOptionClassParam['hide-option'] = true;
                });
            });

            angular.element(deleteButton).on('click', function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();

                $scope.$apply(function() {
                    $scope.mainOptionClassParam['hide-option'] = true;
                    $scope.deleteOptionClassParam['hide-option'] = false;
                    $scope.confirmOptionClassParam['hide-option'] = true;
                });
            });

            angular.element(confirmYesButton).on('click', function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
            });

            angular.element(confirmNoButton).on('click', function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();

                $scope.$apply(function() {
                    $scope.mainOptionClassParam['hide-option'] = false;
                    $scope.deleteOptionClassParam['hide-option'] = true;
                    $scope.confirmOptionClassParam['hide-option'] = true;
                });
            });

        }
    };

});

forgetlessApp.directive('handleList', function() {

    return {
        templateUrl: '/partials/list_item_view.html',
        controller: function($scope, $element, $state, $window) {
            var element = $element[0];
            var listHeader = element.querySelector('.content-item');
            var itemsContainer = element.querySelector('.items-container');

            var titleContainer = listHeader.querySelector('.title-container');
            var optionsContainer = listHeader.querySelector('.options-container');
            var optionsGroup = listHeader.querySelector('.options-group');

            var showOptionsButton = optionsContainer.querySelector('.show-options-button');

            var mainOptionContainer = optionsContainer.querySelector('.main');
            var editButton = mainOptionContainer.querySelector('.edit-icon');
            var deleteButton = mainOptionContainer.querySelector('.delete-icon');

            var deleteConfirmOptionsContainer = listHeader.querySelector('.delete-confirm');
            var deleteYesButton = deleteConfirmOptionsContainer.querySelector('.delete-yes-icon');
            var deleteNoButton = deleteConfirmOptionsContainer.querySelector('.delete-no-icon');

            var confirmOptionsContainer = listHeader.querySelector('.confirm');
            var confirmYesButton = confirmOptionsContainer.querySelector('.confirm-yes-icon');
            var confirmNoButton = confirmOptionsContainer.querySelector('.confirm-no-icon');

            $scope.mainOptionClassParam = {
                'hide-option': false
            };

            $scope.titleContainerStyleParam = {
                'max-width': '80%'
            };

            $scope.confirmOptionClassParam = {
                'hide-option': true
            };

            $scope.deleteOptionClassParam = {
                'hide-option': true
            };

            $scope.optionsContainerClassParam = {
                'hide-options': true
            };

            angular.element(optionsContainer).on('click', function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
            });

            angular.element(showOptionsButton).on('click', function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();

                var selected = $scope.optionsContainerClassParam['hide-options'];
                var optionsContainerWidth = parseInt($window.getComputedStyle(optionsGroup, null).getPropertyValue('width'));
                var categoryHeaderWidth = parseInt($window.getComputedStyle(listHeader, null).getPropertyValue('width'));

                if(!selected &&
                    optionsContainerWidth != undefined &&
                    categoryHeaderWidth != undefined) {
                    maxWidth = '80%';
                } else {
                    maxWidth = (categoryHeaderWidth - optionsContainerWidth) + 'px';
                }

                $scope.$apply(function() {

                    $scope.titleContainerStyleParam['max-width'] = maxWidth;

                    $scope.optionsContainerClassParam['hide-options'] = !selected;
                });
            });

            angular.element(editButton).on('click', function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();

                $scope.$apply(function() {
                    $scope.mainOptionClassParam['hide-option'] = true;
                    $scope.confirmOptionClassParam['hide-option'] = false;
                    $scope.deleteOptionClassParam['hide-option'] = true;
                });
            });

            angular.element(deleteYesButton).on('click', function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
            });

            angular.element(deleteNoButton).on('click', function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();

                $scope.$apply(function() {
                    $scope.mainOptionClassParam['hide-option'] = false;
                    $scope.confirmOptionClassParam['hide-option'] = true;
                    $scope.deleteOptionClassParam['hide-option'] = true;
                });
            });

            angular.element(deleteButton).on('click', function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();

                $scope.$apply(function() {
                    $scope.mainOptionClassParam['hide-option'] = true;
                    $scope.deleteOptionClassParam['hide-option'] = false;
                    $scope.confirmOptionClassParam['hide-option'] = true;
                });
            });

            angular.element(confirmYesButton).on('click', function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
            });

            angular.element(confirmNoButton).on('click', function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();

                $scope.$apply(function() {
                    $scope.mainOptionClassParam['hide-option'] = false;
                    $scope.deleteOptionClassParam['hide-option'] = true;
                    $scope.confirmOptionClassParam['hide-option'] = true;
                });
            });

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
        controller: function($scope, $element, $state, $window) {
            var element = $element[0];
            var itemHeader = element.querySelector('.content-item');
            var itemDetails = element.querySelector('.item-detail');
            var itemsContainer = element.querySelector('.items-container');

            var titleContainer = itemHeader.querySelector('.title-container');
            var optionsContainer = itemHeader.querySelector('.options-container');
            var optionsGroup = itemHeader.querySelector('.options-group');

            var showOptionsButton = optionsContainer.querySelector('.show-options-button');

            var mainOptionContainer = optionsContainer.querySelector('.main');
            var editButton = mainOptionContainer.querySelector('.edit-icon');
            var deleteButton = mainOptionContainer.querySelector('.delete-icon');

            var deleteConfirmOptionsContainer = itemHeader.querySelector('.delete-confirm');
            var deleteYesButton = deleteConfirmOptionsContainer.querySelector('.delete-yes-icon');
            var deleteNoButton = deleteConfirmOptionsContainer.querySelector('.delete-no-icon');

            var confirmOptionsContainer = itemHeader.querySelector('.confirm');
            var confirmYesButton = confirmOptionsContainer.querySelector('.confirm-yes-icon');
            var confirmNoButton = confirmOptionsContainer.querySelector('.confirm-no-icon');

            $scope.mainOptionClassParam = {
                'hide-option': false
            };

            $scope.titleContainerStyleParam = {
                'max-width': '80%'
            };

            $scope.confirmOptionClassParam = {
                'hide-option': true
            };

            $scope.deleteOptionClassParam = {
                'hide-option': true
            };

            $scope.optionsContainerClassParam = {
                'hide-options': true
            };

            angular.element(optionsContainer).on('click', function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
            });

            angular.element(showOptionsButton).on('click', function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();

                var selected = $scope.optionsContainerClassParam['hide-options'];
                var optionsContainerWidth = parseInt($window.getComputedStyle(optionsGroup, null).getPropertyValue('width'));
                var categoryHeaderWidth = parseInt($window.getComputedStyle(itemHeader, null).getPropertyValue('width'));

                if(!selected &&
                    optionsContainerWidth != undefined &&
                    categoryHeaderWidth != undefined) {
                    maxWidth = '80%';
                } else {
                    maxWidth = (categoryHeaderWidth - optionsContainerWidth) + 'px';
                }

                $scope.$apply(function() {

                    $scope.titleContainerStyleParam['max-width'] = maxWidth;

                    $scope.optionsContainerClassParam['hide-options'] = !selected;
                });
            });

            angular.element(editButton).on('click', function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();

                $scope.$apply(function() {
                    $scope.mainOptionClassParam['hide-option'] = true;
                    $scope.confirmOptionClassParam['hide-option'] = false;
                    $scope.deleteOptionClassParam['hide-option'] = true;
                });
            });

            angular.element(deleteYesButton).on('click', function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
            });

            angular.element(deleteNoButton).on('click', function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();

                $scope.$apply(function() {
                    $scope.mainOptionClassParam['hide-option'] = false;
                    $scope.confirmOptionClassParam['hide-option'] = true;
                    $scope.deleteOptionClassParam['hide-option'] = true;
                });
            });

            angular.element(deleteButton).on('click', function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();

                $scope.$apply(function() {
                    $scope.mainOptionClassParam['hide-option'] = true;
                    $scope.deleteOptionClassParam['hide-option'] = false;
                    $scope.confirmOptionClassParam['hide-option'] = true;
                });
            });

            angular.element(confirmYesButton).on('click', function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
            });

            angular.element(confirmNoButton).on('click', function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();

                $scope.$apply(function() {
                    $scope.mainOptionClassParam['hide-option'] = false;
                    $scope.deleteOptionClassParam['hide-option'] = true;
                    $scope.confirmOptionClassParam['hide-option'] = true;
                });
            });

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

            headerHeight = (headerHeight != undefined ? headerHeight : 60);

            element.css({
                'height': ($window.innerHeight - headerHeight) + 'px'
            });

        };

        window.on('resize', applyResize);

        $window.scrollTop = 0;
        applyResize();
    }
});