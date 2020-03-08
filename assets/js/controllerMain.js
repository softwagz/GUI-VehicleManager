//Controlador

const ang = angular.module("App", ["ngRoute"]);

// registro de rutas para ngRoute, y los nombres de los controladores

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
            templateUrl: "./assets/Templates/asignacion.html",
            controller: "asignacionController"
        })
        .when("/vehiculos", {
            templateUrl: "./assets/Templates/vehiculos.html",
            controller: "vehiculosController"
        })
});

const jquery = $;

//Definicion de los controladores
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
    //permite buscar un conductor, esta funcion no esta implementada aun
    $scope.buscar = (rut) => {
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
    //permite abrir el modal para modificar el conductor
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
    //elimina logicamente un conductor, para mantener la integridad del regsitro
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
    //guarda los cambios hechos para el conductor mostrado en el modal
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
    //permite registrar un nuevo conductor
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
    //limpia el formulario de registro
    $scope.clear = () => {
        $scope.newUser = {
            rut: '',
            nombre: '',
            apellido: '',
            usuario: '',
            clave: ''
        }
    }
    //carga todos los conductores
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
    $scope.vehiculosAsignados = [];
    $scope.vehiculosDisponibles = []
    //carga los vehiculos disponibles
    $scope.loadAsignados = () => {
        $http({
            method: 'GET',
            url: 'http://localhost:4000/api/web/vehiculosAsignados'
        }).then(function successCallback(response) {
            $scope.vehiculosAsignados.splice(0);
            $scope.vehiculosAsignados = response.data;


        }, function errorCallback(response) {

            console.log("Error", response);

        });
        console.log($scope.vehiculosAsignados);

    }
    //carga los vehiculos asignados, la fecha vacia para obtener todos a la fecha actual
    $scope.loadDisponibles = (fecha) => {
        $http({
            method: 'POST',
            url: 'http://localhost:4000/api/web/vehiculosDisponible',
            data: {
                fecha: fecha
            }
        }).then(function successCallback(response) {
            $scope.vehiculosDisponibles.splice(0);
            $scope.vehiculosDisponibles = response.data;
            console.log(response);


        }, function errorCallback(response) {

            console.log("Error", response);

        });
        console.log($scope.vehiculosDisponibles);
    }


    $scope.loadAsignados();
    $scope.loadDisponibles('');

});

ang.controller('vehiculosController', function ($scope, $http) {

    $scope.listVehiculos = [];
    $scope.listAsignados = [];
    $scope.listDisponible = [];

    $scope.inspeccionSelected;
    $scope.bitacoraSelected;
    $scope.conductorRegistro;
    $scope.criterioSelected = [];

    $scope.listSelected = 0;

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
    //carga todos los vehiculos
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
    //carga los vehiculos asignados
    $scope.loadAsignados = () => {
        $http({
            method: 'GET',
            url: 'http://localhost:4000/api/web/vehiculosAsignados'
        }).then(function successCallback(response) {
            $scope.listAsignados.splice(0);
            $scope.listAsignados = response.data;
            console.log('asignados ', $scope.listAsignados);
        }, function errorCallback(response) {

            console.log("Error", response);

        });
    }
    $scope.loadAsignados();

    //carga los vehiculos disponibles
    $scope.loadDisponibles = (fecha) => {
        $http({
            method: 'POST',
            url: 'http://localhost:4000/api/web/vehiculosDisponible',
            data: {
                fecha: fecha
            }
        }).then(function successCallback(response) {
            $scope.listDisponible.splice(0);
            $scope.listDisponible = response.data;
            console.log('disponibles ', $scope.listDisponible);
        }, function errorCallback(response) {

            console.log("Error", response);

        });
    }

    $scope.loadDisponibles('');

    //consulta a la base de datos para obtener la bitacora del vehiculo y su respectivos detalles
    $scope.bitacoraVehiculo = (patente) => {
        $http({
            method: 'POST',
            url: 'http://localhost:4000/api/web/bitacoraVehiculo',
            data: {
                patente
            }
        }).then(function successCallback(response) {
            $scope.bitacoraSelected = response.data;
            $scope.consultarConductorRegistro($scope.bitacoraSelected.conductor);

        }, function errorCallback(response) {

            console.log("Error", response);

        });
    }

    //registra un nuevo vehiculo
    $scope.registrar = () => {
        $http({
            method: 'POST',
            url: 'http://localhost:4000/api/web/agregarVehiculo',
            data: $scope.newVehiculo

        }).then(function successCallback(response) {
            if (response.data != -1) {
                alert('Registro Exitoso');
                $scope.load();
                $scope.limpiar();
                $scope.loadDisponibles('');
                $scope.loadAsignados();
            } else {
                alert('La Patente ya esta registrada');
            }
        }, function errorCallback(response) {

            console.log("Error ", response);


        });
    }

    //limpia los campos del formulario de registro
    $scope.limpiar = () => {
        $scope.newVehiculo = {
            patente: '',
            marca: '',
            modelo: '',
            anno: ''
        }
    }

    //permite eliminar el vehiculo, solo logicamente. para mantener la integridad del registro
    $scope.eliminarVehiculo = (patente) => {
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

            console.log("Error", response);


        });
    }

    //permite abrir el modal y envia los datos del vehiculo a este.
    $scope.editarVehiculo = (vehiculo) => {
        $scope.vehiculoSelected = vehiculo;
        jquery('#editTipoVehiculo').val($scope.vehiculoSelected.tipoVehiculo);
        jquery('#editTipoCombustible').val($scope.vehiculoSelected.tipoCombustible);

    }

    //guarda los cambios hechos en el modal a el vehiculo
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

            console.log("Error", response);

        });

    }
    //consulta la base de datos para ver los tipos de vehiculos disponibles
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

    //consulta la base de datos para ver los tipo de combustibles disponibles
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

    //permite cargar la bitacora del vehiculo
    $scope.detailVehiculo = (vehiculo) => {

        $scope.detailStatus = true;
        $scope.bitacoraVehiculo(vehiculo.patente);

    }

    //atributo que me permite alternar entre la vista de detalles
    $scope.closeDetail = () => {

        $scope.detailStatus = false;

    }

    //permite cargar los datos del ultimo conductor registrado en la bitacora
    $scope.consultarConductorRegistro = (rut) => {
        $http({
            method: 'POST',
            url: 'http://localhost:4000/api/web/buscarUsuario',
            data: {
                rut
            }
        }).then(function successCallback(response) {
            $scope.conductorRegistro = response.data;

        }, function errorCallback(response) {

            console.log("Error", response);

        });

    }

    //realiza una consulta para encontrar la inspeccion asosiada a ese registro
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

            console.log("Error", response);


        });
    }

    //permite alternar la vista para el criterio seleccionado
    $scope.verCriterioInspeccion = (val) => {

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

    //carga la lista de vehiculos asignados y disponibles
    $scope.verASignadosDisponibles = (val) => {

        $scope.listSelected = val;

    }


    //permite saber que tipo de combustible se eligio
    jquery('#selectTipoCombustible').change(function (e) {

        $scope.newVehiculo.tipoCombustible = jquery(this).val()
    });

    //permite saber que tipo de vehiculo se eligio
    jquery('#selectTipoVehiculo').change(function (e) {

        $scope.newVehiculo.tipoVehiculo = jquery(this).val()
    });

    //permite modificar el tipo de vehiculo
    jquery('#editTipoVehiculo').change(function (e) {

        $scope.vehiculoSelected['tipoVehiculo'] = jquery(this).val();
        console.log($scope.vehiculoSelected);


    })

    //permite modificar el tipo de combustible
    jquery('#editTipoCombustible').change(function (e) {

        $scope.vehiculoSelected['tipoCombustible'] = jquery(this).val();
        console.log($scope.vehiculoSelected);

    })

});

ang.controller('asignacionController', function ($scope, $http) {

    $scope.patentesDisponibles = [];
    $scope.usuariosDisponibles = [];
    $scope.patenteSelected = {
        _id: "",
        patente: "",
        marca: "",
        modelo: "",
        tipoVehiculo: "",
        tipoCombustible: "",
        manutencion: true,
        status: true
    };

    $scope.conductorSelected = {
        _id: "",
        rut: "",
        nombre: "",
        apellido: "",
        usuario: "",
        clave: "",
        estadoAsignacion: false,
        patenteAsignada: "",
        status: true
    };
    $scope.bitacoraSelected;

    $scope.patente;
    $scope.rut;
    //carga los vehiculos disponibles
    $scope.loadDisponibles = (fecha) => {
        $http({
            method: 'POST',
            url: 'http://localhost:4000/api/web/vehiculosDisponible',
            data: {
                fecha: fecha
            }
        }).then(function successCallback(response) {
            $scope.patentesDisponibles.splice(0);
            $scope.patentesDisponibles = response.data;
            console.log('disponibles ', response);


        }, function errorCallback(response) {

            console.log("Error", response);

        });
    }

    $scope.loadDisponibles('');
    //carga los usuarios disponibles
    $scope.loadUsuarios = () => {
        $http({
            method: 'GET',
            url: 'http://localhost:4000/api/web/listarUsuarios'
        }).then(function successCallback(response) {
            $scope.usuariosDisponibles.splice(0);
            response.data.map((user) => {
                if (!user['estadoAsignacion']) {
                    $scope.usuariosDisponibles.push(user);
                    console.log($scope.usuariosDisponibles)
                }
            })
            console.log(response);


        }, function errorCallback(response) {

            console.log("Error", response);

        });
    }
    $scope.loadUsuarios();


    $scope.update = () => {
        //Funcion vacia para indicarle a Angularjs que refresque los cambios

    }

    //obtengo la bitacora del vehiculo, a su mismo tiempo contiene el registro de movimiento
    $scope.obtenerBitacora = (patente) => {

        $http({
            method: 'POST',
            url: 'http://localhost:4000/api/web/bitacoraVehiculo',
            data: {
                patente: patente
            }
        }).then(function successCallback(response) {
            $scope.bitacoraSelected = response.data;
            console.log($scope.bitacoraSelected);


        }, function errorCallback(response) {

            console.log("Error", response);

        });


        //agregamos una inspeccion

    }

    //crea el registro cuando es llamada en actualizar bitacora
    $scope.crearInspeccion = (fechaRegistro, patente) => {

        $http({
            method: 'POST',
            url: 'http://localhost:4000/api/web/crearInspeccion',
            data:{
                fechaRegistro,
                patente
            }
        }).then(function successCallback(response) {
            
            console.log('Inspeccion Creada',response);


        }, function errorCallback(response) {

            console.log("Error", response);

        });
    }
    $scope.limpiar = ()=>{
        $scope.patenteSelected = {
            _id: "",
            patente: "",
            marca: "",
            modelo: "",
            tipoVehiculo: "",
            tipoCombustible: "",
            manutencion: true,
            status: true
        };
        jquery('#selectConductor').val('0');
        jquery('#selectPatente').val('0');


    }

    //asigna el vehiculo, el conductor y crea el registro de inspeccion
    $scope.actualizarBitacora = () => {
        console.log('bitacora Selected', $scope.bitacoraSelected);

        $scope.bitacoraSelected['inspeccion'] = false;
        $scope.bitacoraSelected['asignado'] = true;
        $scope.bitacoraSelected['conductor'] = $scope.conductorSelected['rut'];
        var fecha = new Date();
        var dia = fecha.getDate() <= 9 ? '0' + fecha.getDate() : fecha.getDate();
        var mes = (fecha.getMonth() + 1) <= 9 ? '0' + (fecha.getMonth() + 1) : (fecha.getMonth() + 1);
        var fechaInicio = fecha.getFullYear() + '-' + mes + '-' + dia;
        var fechaFinalizacion = jquery('#fechaFinal').val();
        $scope.bitacoraSelected['fechaFinal']=fechaFinalizacion;
        var newRegistro = {
            rutConductor: $scope.conductorSelected['rut'],
            nombreConductor: $scope.conductorSelected['nombre'],
            apellidoConductor: $scope.conductorSelected['apellido'],
            fechaRegistro: fechaInicio,
            fechaAsignacion: { desde: fechaInicio, hasta: fechaFinalizacion }
        }


        $scope.bitacoraSelected['registro'].push(newRegistro);
        $scope.crearInspeccion(fechaInicio,$scope.bitacoraSelected['patenteVehiculo']);
        //Realizando metodo POST

        $http({
            method: 'POST',
            url: 'http://localhost:4000/api/web/asignarVehiculo',
            data:$scope.bitacoraSelected
        }).then(function successCallback(response) {
             console.log(response.data);
             $scope.loadUsuarios();
             $scope.loadDisponibles('');
             alert('Asignacion Exitosa');
             $scope.limpiar()



        }, function errorCallback(response) {

            console.log("Error", response);

        });

        console.log('nueva Bitacora', $scope.bitacoraSelected)
        console.log('registro', newRegistro);
    }

    //funcion que permite indicar que conductor he seleccionado
    jquery('#selectConductor').change(function () {
        $scope.rut = jquery(this).val();
        $scope.usuariosDisponibles.map((conductor) => {
            if (conductor['rut'] == $scope.rut) {
                $scope.conductorSelected = conductor;
            }
        });

    });

    //funcion que permite indicar que patente he elegido
    jquery('#selectPatente').change(function () {

        $scope.patente = jquery(this).val();
        $scope.patentesDisponibles.map((vehiculo) => {
            if (vehiculo['patente'] == $scope.patente) {
                
                $scope.patenteSelected = vehiculo;
                console.log($scope.patenteSelected);
                $scope.obtenerBitacora(vehiculo['patente']);

            }

        });

    });

})



//funcion responsable del menu lateral

$(document).ready(function () {
    $("#menu-toggle").click(function () {
        $("#wrapper").toggleClass("toggled");
    });

});

