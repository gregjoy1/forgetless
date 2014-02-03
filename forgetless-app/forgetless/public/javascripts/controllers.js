forgetlessApp.controller('ContentViewPointController', function($scope) {

    $scope.stepClass = 'step-zero';

    $scope.nextStep = function(step) {
        switch(step) {
            case 1:
                $scope.stepClass = 'step-one';
                break;
            case 0:
            default:
                $scope.stepClass = 'step-zero';
                break;
        }
    };

    $scope.getStep = function() {
        switch($scope.stepClass) {
            case 'step-one':
                return 1;
                break;
            case 'step-zero':
            default:
                return 0;
                break;
        }
    };

});

forgetlessApp.controller('ContentController', function($scope, $stateParams, $state, $location) {

    $scope.routeSteps = function() {
        if($stateParams.categoryId !== undefined && $stateParams.categoryId != '') {
            $scope.nextStep(1);
        } else {
            $scope.nextStep(0);
        }
        console.log($stateParams);
    };

    $scope.$on('$locationChangeSuccess', function() {
        $scope.actualLocation = $location.path();
    });

    $scope.$watch(function () {return $location.path()}, function () {
        $scope.routeSteps();
    });

    $scope.routeSteps();

    $scope.selectedCategoryIndex = 0;
    $scope.selectedCategoryId = 0;
    $scope.selectedListId = 0;
    $scope.selectedItemId = 0;
    $scope.selectedListIndex = 0;
    $scope.selectedItemIndex = 0;

    /*
    * -------------------------------------------
    * Creating test model...
    * -------------------------------------------
    */

    $scope.categories = [];

    for(var catInc = 0; catInc <  5; catInc++) {

        $scope.categories.push({
            id: catInc,
            title: 'category ' + catInc,
            selected: (catInc == 0),
            lists: []
        });

        for(var listInc = 0; listInc <  10; listInc++) {

            $scope.categories[catInc].lists.push({
                id: listInc,
                title: 'list: ' + catInc + ' : ' + listInc,
                selected: false,
                items: []
            });

            for(var itemInc = 0; itemInc <  10; itemInc++) {

                $scope.categories[catInc].lists[listInc].items.push({
                    id: itemInc,
                    title: 'item: ' + catInc + ' : ' + listInc + ' : ' + itemInc,
                    content: 'im a content-der ' + itemInc,
                    selected: false
                });

            }

        }

    }

    /*
     * -------------------------------------------
     */

    $scope.selectedCategoryId = ($scope.categories[0].id != undefined ? $scope.categories[0].id : null);
    $scope.selectedListId = ($scope.categories[0].lists[0] != undefined ? $scope.categories[0].lists[0] : null);
    $scope.selectedItemId = ($scope.categories[0].lists[0].items[0] != undefined ? $scope.categories[0].lists[0].items[0] : null);


    $scope.selectCategory = function(id) {

        // Falls back on first index if fail
        $scope.selectedCategoryIndex = 0;

        // Resets selections
        for(var inc = 0; inc < $scope.categories.length; inc++) {
            if($scope.categories[inc].id == id) {
                $scope.categories[inc].selected = true;
                $scope.selectedCategoryIndex = inc;
                $scope.selectedCategoryId = id;
                $state.go('app.category', {categoryId: id});
            } else {
                $scope.categories[inc].selected = false;
            }
        }
    };

});

forgetlessApp.controller('LoginController', function($scope) {
    $scope.error = false;
    $scope.errorDescription = '';

    $scope.emailInput = '';
    $scope.passwordInput = '';
    $scope.login = function() {
        console.log('logged in with ' + $scope.emailInput + ' ' + $scope.passwordInput);
    };
});
