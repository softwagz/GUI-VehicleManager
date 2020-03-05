
// Menu Laterañ

$(document).ready(function () {
    $("#menu-toggle").click(function () {
        $("#wrapper").toggleClass("toggled");
    });
});
//Controlador

const ang = angular.module("App", ["ngRoute"]);

// Configurando Rutas

ang.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "./assets/Templates/home.html",
            controller: "homeController"

        })
        .when("/home", {
            templateUrl: "./assets/Templates/home.html",
            controller: "homeController"
        })
        .when("/conductores", {
            templateUrl: "./assets/Templates/conductores.html",
            controller: "conductoresController"
        })
        .when("/asignacion", {
            templateUrl: "./assets/Templates/asignacion.html"
        })
        .when("/vehiculos", {
            templateUrl: "./assets/Templates/vehiculos.html",
            controller: "vehiculosController"
        })
});

const jquery = $;


ang.controller('conductoresController', function ($scope, $http) {
    $scope.listConductores = [];
    $scope.search = '';
    $scope.newUser = {
        rut: '',
        nombre: '',
        apellido: '',
        usuario: '',
        clave: ''
    }

    $scope.conductorSelected = {
        id: '',
        rut: '',
        nombre: '',
        apellido: '',
        usuario: '',
        clave: ''
    }

    $scope.buscar = () => {
        $http({
            method: 'POST',
            url: 'http://localhost:4000/api/web/buscarUsuario',
            data: { rut: $scope.search }
        }).then(function successCallback(response) {
            if (response.data != -1) {
                console.log(response);
                alert('encontrado');
                $scope.listConductores.splice(0);
                $scope.listConductores.push(response.data);
            } else {
                alert('No ay coincidencias');
            }
        }, function errorCallback(response) {

            console.log("Error Countries", response);

        });
    }

    $scope.editarConductor = (conductor) => {
        console.log(conductor.nombre);
        $scope.conductorSelected = {
            id: conductor._id,
            rut: conductor.rut,
            nombre: conductor.nombre,
            apellido: conductor.apellido,
            usuario: conductor.usuario,
            clave: conductor.clave
        }
        console.log(conductor)
    }

    $scope.deleteConductor = (rut) => {
        $http({
            method: 'PUT',
            url: 'http://localhost:4000/api/web/borrarUsuario',
            data: {
                rut: rut,
                status: false
            }
        }).then(function successCallback(response) {

            console.log("Success", response);
            alert('Usuario Eliminado');
            $scope.load();

        }, function errorCallback(response) {

            console.log("Error Countries", response);

        });
    }
    $scope.guardarCambiosConductor = () => {
        $http({
            method: 'PUT',
            url: 'http://localhost:4000/api/web/modificarUsuario',
            data: $scope.conductorSelected
        }).then(function successCallback(response) {

            $scope.conductorSelected = response.data;
            console.log("Success", response);
            alert('Operacion Exitosa');
            $scope.load();

        }, function errorCallback(response) {

            console.log("Error Countries", response);

        });
    }

    $scope.agregarUsuario = () => {
        $http({
            method: 'POST',
            url: 'http://localhost:4000/api/web/agregarUsuario',
            data: $scope.newUser
        }).then(function successCallback(response) {
            $scope.load();
            console.log("Success", response);
            if (response.data == -1) {
                alert('El rut ya esta registrado');
            } else {
                alert('registro exitoso');
            }

        }, function errorCallback(response) {

            console.log("Error Countries", response);

        });


    }

    $scope.clear = () => {
        $scope.newUser = {
            rut: '',
            nombre: '',
            apellido: '',
            usuario: '',
            clave: ''
        }
    }
    $scope.load = () => {
        $http({
            method: 'GET',
            url: 'http://localhost:4000/api/web/listarUsuarios'
        }).then(function successCallback(response) {
            $scope.listConductores.splice(0);
            response.data.map((conductor) => {
                if (conductor['status'] == true) {
                    $scope.listConductores.push(conductor);
                }
            })

        }, function errorCallback(response) {

            console.log("Error Conductores", response);

        });
    }

    $scope.load();


});

ang.controller('homeController', function ($scope, $http) {
    $scope.listConductores = [];
    $scope.conductoresDisponibles = [];
    $scope.conductoresAsignados = []
    $scope.load = () => {
        $http({
            method: 'GET',
            url: 'http://localhost:4000/api/web/listarUsuarios'
        }).then(function successCallback(response) {
            $scope.listConductores.splice(0);
            response.data.map((conductor) => {
                if (conductor['status'] == true) {
                    $scope.listConductores.push(conductor);
                    console.log("Success", response);

                }
            });
            $scope.listConductores.map(
                (driver) => {
                    if (!driver['estadoAsignacion']) {
                        $scope.conductoresDisponibles.push(driver)
                    } else {
                        $scope.conductoresAsignados.push(driver);
                    }
                }
            );
            console.log($scope.conductoresAsignados, $scope.conductoresDisponibles);

        }, function errorCallback(response) {

            console.log("Error Countries", response);

        });


    }
    $scope.load();



});

ang.controller('vehiculosController', function ($scope, $http) {

    $scope.listVehiculos = [];
    $scope.vehiculosAsignados = [];
    $scope.vehiculosDisponibles = [];
    $scope.inspeccionSelected;
    $scope.bitacoraSelected = [];
    $scope.conductorRegistro;
    $scope.criterioSelected = [];

    $scope.verCriterio = [{
        nombreItem: "",
        value: ""
    }]

    $scope.newVehiculo = {
        patente: '',
        marca: '',
        modelo: '',
        tipoCombustible: '0',
        tipoVehiculo: '0'
    }
    $scope.detailStatus = false;
    $scope.statusVerCriterio = false;

    $scope.tipoVehiculos = [];
    $scope.tipoCombustible = [];

    $scope.value;
    $scope.value2;

    $scope.vehiculoSelected = {
        _id: '',
        patente: '',
        marca: '',
        modelo: '',
        tipoVehiculo: "",
        tipoCombustible: "",
        manutencion: false,
        status: true
    }

    $scope.load = () => {
        $http({
            method: 'GET',
            url: 'http://localhost:4000/api/web/listarvehiculos'
        }).then(function successCallback(response) {
            $scope.listVehiculos.splice(0);
            response.data.map((vehiculo) => {
                if (vehiculo['status']) {
                    $scope.listVehiculos.push(vehiculo);
                    console.log("Success", response);

                }
            });
        }, function errorCallback(response) {

            console.log("Error Countries", response);

        });


    }

    $scope.load();

    $scope.bitacoraVehiculo = (patente) => {
        $http({
            method: 'POST',
            url: 'http://localhost:4000/api/web/bitacoraVehiculo',
            data: {
                patente
            }
        }).then(function successCallback(response) {
            $scope.bitacoraSelected.splice(0);
            $scope.bitacoraSelected = response.data;
            console.log($scope.bitacoraSelected);
            $scope.consultarConductorRegistro($scope.bitacoraSelected.conductor);

        }, function errorCallback(response) {

            console.log("Error Countries", response);

        });
    }

    $scope.registrar = () => {
        console.log($scope.newVehiculo);
        $http({
            method: 'POST',
            url: 'http://localhost:4000/api/web/agregarVehiculo',
            data: $scope.newVehiculo

        }).then(function successCallback(response) {
            if (response.data != -1) {
                alert('Registro Exitoso');
                $scope.load();
                $scope.limpiar();
            } else {
                alert('La Patente ya esta registrada');
            }
        }, function errorCallback(response) {

            console.log("Error Countries", response);


        });
    }

    $scope.limpiar = () => {
        $scope.newVehiculo = {
            patente: '',
            marca: '',
            modelo: '',
            anno: ''
        }
    }

    $scope.eliminarVehiculo = (patente) => {
        console.log(patente);
        $http({
            method: 'PUT',
            url: 'http://localhost:4000/api/web/borrarVehiculo',
            data: { patente }

        }).then(function successCallback(response) {
            if (response.data != -1) {
                alert('Borrado Exitoso');
                $scope.load();
                $scope.limpiar();
            } else {
                alert('No se ha podido Eliminar la Patente');
            }
        }, function errorCallback(response) {

            console.log("Error Countries", response);


        });
    }

    $scope.editarVehiculo = (vehiculo) => {
        $scope.vehiculoSelected = vehiculo;
        console.log($scope.vehiculoSelected);
        jquery('#editTipoVehiculo').val($scope.vehiculoSelected.tipoVehiculo);
        jquery('#editTipoCombustible').val($scope.vehiculoSelected.tipoCombustible);

    }

    $scope.guardarModificacion = () => {

        $http({
            method: "PUT",
            url: 'http://localhost:4000/api/web/modificarVehiculo',
            data: $scope.vehiculoSelected
        }).then(function successCallback(response) {

            $scope.load();
            console.log("Success", response);
            if (response.data == -1) {
                alert('No se ha podido modificar');
            } else {
                alert('Modificacion Exitosa');
                $scope.vehiculoSelected = response.data;
            }

        }, function errorCallback(response) {

            console.log("Error Countries", response);

        });

    }

    $scope.cargarTipoVehiculo = () => {

        $http({
            method: 'GET',
            url: 'http://localhost:4000/api/web/listarTipoVehiculo'
        }).then(function successCallback(response) {
            $scope.tipoVehiculos.splice(0);
            $scope.tipoVehiculos = response.data;
            console.log(response.data);

        }, function errorCallback(response) {

            console.log("Error Countries", response);

        });

    }

    $scope.cargarTipoCombustible = () => {

        $http({
            method: 'GET',
            url: 'http://localhost:4000/api/web/listarTipoCombustible'
        }).then(function successCallback(response) {
            $scope.tipoCombustible.splice(0);
            $scope.tipoCombustible = response.data;
            console.log(response.data);

        }, function errorCallback(response) {

            console.log("Error Countries", response);

        });

    }

    $scope.cargarTipoCombustible();

    $scope.cargarTipoVehiculo();

    $scope.detailVehiculo = (vehiculo) => {

        $scope.detailStatus = true;
        $scope.bitacoraVehiculo(vehiculo.patente);

    }

    $scope.closeDetail = () => {

        $scope.detailStatus = false;

    }

    $scope.consultarConductorRegistro = (rut) => {
        $http({
            method: 'POST',
            url: 'http://localhost:4000/api/web/buscarUsuario',
            data: {
                rut
            }
        }).then(function successCallback(response) {
            $scope.conductorRegistro = response.data;
            console.log(response.data);

        }, function errorCallback(response) {

            console.log("Error Countries", response);

        });

    }

    $scope.verInspeccion = (registro) => {
        var fecha = registro.fechaRegistro;
        var patente = $scope.bitacoraSelected.patenteVehiculo;
        $http({
            method: 'POST',
            url: 'http://localhost:4000/api/web/detalleInspeccion',
            data: {
                fecha, patente
            }
        }).then(function successCallback(response) {

            $scope.inspeccionSelected = response.data;
            $scope.criterioSelected = $scope.inspeccionSelected.criterios;
            $scope.statusVerCriterio = true;
            if (response.data == -1) {
                $scope.verCriterio = [{
                    nombreItem: "",
                    value: ""
                }]
                alert('No se ha encontrado una inspeccion para este vehiculo');
                $scope.statusVerCriterio = false;

            }

        }, function errorCallback(response) {

            console.log("Error Countries", response);


        });
    }

    $scope.verCriterioInspeccion = function () {

        jquery('#selectCriterio').change(function () {
            $scope.criterioSelected.map((val) => {
                if (val['nombre'] == jquery(this).val()) {
                    $scope.verCriterio = val.items;
                }
                if (jquery(this).val() == "0") {
                    $scope.verCriterio = [{
                        nombreItem: "",
                        value: ""
                    }]
                }
            });
            console.log($scope.verCriterio);
        })

    }



    jquery('#selectTipoCombustible').change(function (e) {

        $scope.newVehiculo.tipoCombustible = jquery(this).val()
    });

    jquery('#selectTipoVehiculo').change(function (e) {

        $scope.newVehiculo.tipoVehiculo = jquery(this).val()
    });

    jquery('#editTipoVehiculo').change(function (e) {

        $scope.vehiculoSelected['tipoVehiculo'] = jquery(this).val();
        console.log($scope.vehiculoSelected);


    })

    jquery('#editTipoCombustible').change(function (e) {

        $scope.vehiculoSelected['tipoCombustible'] = jquery(this).val();
        console.log($scope.vehiculoSelected);

    })

});

