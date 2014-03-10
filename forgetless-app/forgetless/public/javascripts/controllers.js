forgetlessApp.controller('ContentViewPointController', function($scope, $state, stackService) {

    stackService.checkIfLoggedIn(function(success) {
        if(!success) {
            $state.go('login');
        }
    });

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

forgetlessApp.controller('ContentController', function($scope, $stateParams, $state, $location, $window, stackService) {

    $scope.routeSteps = function() {
        if($stateParams.categoryId !== undefined && $stateParams.categoryId != '') {
            $scope.nextStep(1);
        } else {
            $scope.nextStep(0);
        }
//        console.log($stateParams);
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

    /* Adding new category functionality */
    $scope.newCategory = false;
    $scope.newCategoryTitle = '';

    $scope.cancelNewCategory = function() {
        $scope.newCategory = false;
        $scope.newCategoryTitle = '';
    };

    $scope.openNewCategoryPrompt = function() {
        $scope.newCategory = true;
        $scope.newCategoryTitle = '';
    };

    $scope.addNewCategory = function() {
        stackService.insertCategory({title: $scope.newCategoryTitle}, $scope.updateStack);
        $scope.cancelNewCategory();
    };
    /* ----------------------------------- */

    /* Adding new list functionality */
    $scope.newList = false;
    $scope.newListTitle = '';

    $scope.cancelNewList = function() {
        $scope.newList = false;
        $scope.newListTitle = '';
    };

    $scope.openNewListPrompt = function() {
        $scope.newList = true;
        $scope.newListTitle = '';
    };

    $scope.addNewList = function() {
        stackService.insertList(
            $scope.selectedCategoryId,
            {
                title: $scope.newListTitle
            },
            $scope.updateStack
        );
        $scope.cancelNewList();
    };
    /* ----------------------------------- */

    /*
    * For adding new item functionality, refer to handle-list directive
    */

    // TODO maximum cludge
    var firstTime = true;

    $scope.updateStack = function() {
        stackService.getStack(function(stack) {
            console.log('%cUpdate Stack DUMP', 'color:blue;', stack);
            $scope.categories = stack;

            // TODO check this out, its killing the adding new lists and stuff
            if(stack.length > 0 && firstTime) {

                $scope.selectedCategoryId = ($scope.categories[0].id != undefined ? $scope.categories[0].id : null);
                $scope.selectedListId = ($scope.categories[0].lists[0] != undefined ? $scope.categories[0].lists[0] : null);
                if($scope.selectedListId != null) {
                    $scope.selectedItemId = ($scope.categories[0].lists[0].items[0] != undefined ? $scope.categories[0].lists[0].items[0] : null);
                } else {
                    $scope.selectedItemId = null;
                }

                firstTime = false;

            }
        });
    };

    $scope.updateStack();

    /*
     * -------------------------------------------
     */


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

forgetlessApp.controller('LoginController', function($scope, $state, stackService) {
    $scope.showStatus = false;
    $scope.error = true;
    $scope.statusText = '';

    $scope.emailInput = '';
    $scope.passwordInput = '';
    $scope.login = function() {

        var applyScope = function() {
            stackService.login(
                $scope.emailInput,
                $scope.passwordInput,
                function(success, userModel) {
                    if(success) {
                        $state.go('app');
                    } else {
                        $scope.showStatus = true;
                        $scope.error = true;
                        $scope.statusText = 'Incorrect login.';
                    }
                }
            );
        };

        if($scope.$$phase || $scope.$root.$$phase) {
            applyScope();
        } else {
            $scope.$apply(applyScope());
        }
    };

    stackService.checkIfLoggedIn(function(success) {
        if(success) {
            $state.go('app');
        } else {
            $state.go('login');
        }
    });

});

forgetlessApp.controller('RootController', function($scope, $state, stackService) {
    stackService.checkIfLoggedIn(function(success) {
        if(success) {
            $state.go('app');
        } else {
            $state.go('login');
        }
    });
});