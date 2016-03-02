(function() {
    angular
        .module('stayGanu', [
            'ionic',
            'ngResource',
            'uiGmapgoogle-maps',
            'ngCordova'
        ])
        .run(Init)
        .config(RoutesConfig)
        .config(GoogleMapsConfig)
        .factory('Homestay', Homestay)

        .controller('homestayCtrl', homestayCtrl)
        .controller('homestayDetailCtrl', homestayDetailCtrl)
        .controller('createHomestayCtrl', createHomestayCtrl)

    function Init($ionicPlatform) {
        $ionicPlatform.ready(function() {
            if(window.cordova && window.cordova.plugins.Keyboard) {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                // Don't remove this line unless you know what you are doing. It stops the viewport
                // from snapping when text inputs are focused. Ionic handles this internally for
                // a much nicer keyboard experience.
                cordova.plugins.Keyboard.disableScroll(true);
            } if(window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    }

    function RoutesConfig($urlRouterProvider, $stateProvider) {
        $stateProvider
            .state('homestay', {
                url: '/homestay',
                views: {
                    'homestay-tab': {
                        templateUrl: 'templates/homestayList.html',
                        controller: homestayCtrl,
                        controllerAs: 'homestay'
                    }
                }
            })
                .state('homestay.detail', {
                    url: '/:homestay_id',
                    views: {
                        'homestay-tab@': {
                            templateUrl: 'templates/homestayDetail.html',
                            controller: homestayDetailCtrl,
                            controllerAs: 'hs'
                        }
                    }
                })

            .state('create', {
                url: '/create',
                cache: false, 
                views: {
                    'create-tab': {
                        templateUrl: 'templates/createHomestay.html',
                        controller: 'createHomestayCtrl',
                        controllerAs: 'create'
                    }
                }
            })
    }

    function GoogleMapsConfig(uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyBCrg8Lg8-Pc4-PAaQhiQ9oqIJV_Qnmt2U',
            libraries: 'places'
        })
    }

    function Homestay($resource) {
        return $resource('http://stayganu.hiro.my/api/homestay/:id', { id: '@id' }, {
            getList: { method: 'GET', isArray: true },
            getOne: { method: 'GET', isArray: false },
            create: { method: 'POST', isArray: false }
        })
    }

    function homestayCtrl(Homestay) {
        var vm = this
        vm.homestays = Homestay.query()
    }

    function homestayDetailCtrl(Homestay, $stateParams, uiGmapGoogleMapApi) {
        var vm = this
        vm.homestay = Homestay.getOne({ id: $stateParams.homestay_id },
            function success(response) {
                vm.data = response
                uiGmapGoogleMapApi.then(function(maps) {
                    var position = {
                        latitude: vm.data.lat,
                        longitude: vm.data.lang
                    }
                    var p2 = {}

                    angular.copy(position, p2)

                    vm.map = {
                        center: position,
                        zoom: 16,
                    }

                    vm.marker = {
                        id: 0,
                        coords: p2
                    }

                })
            })
    }

    function createHomestayCtrl(Homestay, $state, $cordovaCamera) {
        var vm = this

        vm.submit = function() {

            console.log(vm.title)

            if (vm.form.$valid) {
                // Hantar ke atas

                vm.loading = true

                var formObject = {
                    id: 'new',
                    name: vm.title,
                    descriptions: vm.description
                }

                Homestay.create(formObject, success, error)

                function success(response){
                    vm.loading = false
                    $state.go('homestay')

                }

                function error(response) {
                    $state.go('homestay')
                    vm.loading = false
                }


            } else {
                // Reject
                console.log('Form is not valid')
            }
        }
    }

})()