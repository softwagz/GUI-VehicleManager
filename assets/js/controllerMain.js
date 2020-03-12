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

    $scope.formRegisterValidator = false;
    $scope.formEditValidator = false;

    //permite buscar un conductor, esta funcion no esta implementada aun
    $scope.buscar = (rut) => {
        $http({
            method: 'POST',
            url: 'http://localhost:4000/api/web/buscarUsuario',
            data: { rut: $scope.search }
        }).then(function successCallback(response) {
            if (response.data != -1) {
                alert('encontrado');
                $scope.listConductores.splice(0);
                $scope.listConductores.push(response.data);
            } else {
                alert('No ay coincidencias');
            }
        }, function errorCallback(response) {

            console.log("Error", response);

        });
    }
    //permite abrir el modal para modificar el conductor
    $scope.editarConductor = (conductor) => {
        $scope.conductorSelected = {
            id: conductor._id,
            rut: conductor.rut,
            nombre: conductor.nombre,
            apellido: conductor.apellido,
            usuario: conductor.usuario,
            clave: conductor.clave
        }
    }
    //elimina logicamente un conductor, para mantener la integridad del regsitro
    $scope.deleteConductor = (rut) => {
        Swal.fire({
            title: '¿Esta Seguro?',
            text: "Se eliminara este conductor",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, ¡Eliminar!'
        }).then((result) => {
            if (result.value) {
                $http({
                    method: 'PUT',
                    url: 'http://localhost:4000/api/web/borrarUsuario',
                    data: {
                        rut: rut
                    }
                }).then(function successCallback(response) {
                    if (response.data != -1) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Eliminacion Exitosa',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        $scope.load();
                    } else {

                        Swal.fire({
                            icon: 'warning',
                            title: 'Conductor Asignado',
                            text: 'Debe Terminar la Asignacion Primero',
                            showConfirmButton: true
                        })
                    }

                }, function errorCallback(response) {

                    console.log("Error", response);

                });


            }
        })
    }

    $scope.reactivarConductor = (rut) => {
        $http({
            method: 'PUT',
            url: 'http://localhost:4000/api/web/reactivarUsuario',
            data: {
                rut: rut
            }
        }).then(function successCallback(response) {
            Swal.fire({
                icon: 'success',
                title: 'El conductor ha sido Activado',
                showConfirmButton: false,
                timer: 1500
            })
            $scope.load();
        }, function errorCallback(response) {
            console.log("Error", response);
        });
    }
    //guarda los cambios hechos para el conductor mostrado en el modal
    $scope.guardarCambiosConductor = () => {
        const { nombre, apellido, usuario, clave } = $scope.conductorSelected;
        if (nombre && apellido && usuario && clave) {
            $http({
                method: 'PUT',
                url: 'http://localhost:4000/api/web/modificarUsuario',
                data: $scope.conductorSelected
            }).then(function successCallback(response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Se han guardado los Cambios',
                    showConfirmButton: false,
                    timer: 1500
                })
                $scope.conductorSelected = response.data;
                $scope.load();
                $scope.clear();

            }, function errorCallback(response) {

                console.log("Error", response);

            });


        } else {
            Swal.fire({
                icon: 'warning',
                title: 'No dejes campos vacios',
                showConfirmButton: false,
                timer: 1500
            })
        }
    }
    //permite registrar un nuevo conductor
    $scope.agregarUsuario = () => {
        const { rut, nombre, apellido, usuario, clave } = $scope.newUser;
        if (rut && nombre && apellido && usuario && clave) {
            $http({
                method: 'POST',
                url: 'http://localhost:4000/api/web/agregarUsuario',
                data: $scope.newUser
            }).then(function successCallback(response) {
                $scope.load();
                console.log("Success", response);
                if (response.data == -1) {

                    Swal.fire({
                        title: 'RUT Eliminado',
                        text: "Este RUT habia sido eliminado, desea volver a activar este usuario",
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Si, ¡Activar!'
                    }).then((result) => {
                        if (result.value) {
                            $scope.reactivarConductor(rut);
                            $scope.load();
                            Swal.fire({
                                icon: 'success',
                                title: 'Eliminacion Exitosa',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            $scope.clear()
                        }
                    })

                } else if (response.data == -2) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Rut ya asignado a un conductor',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
                else {
                    $scope.clear();
                    Swal.fire({
                        icon: 'success',
                        title: 'Conductor Registrado Exitosamente',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }

            }, function errorCallback(response) {

                console.log("Error", response);

            });
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'No dejes Campos en Blanco',
                showConfirmButton: false,
                timer: 1500
            })
        }


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

            console.log("Error", response);

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
            $scope.vehiculosAsignados = response.data;


        }, function errorCallback(response) {

            console.log("Error", response);

        });
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

        }, function errorCallback(response) {

            console.log("Error", response);

        });
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
        manutencion: false, //este valor se reemplaza luego por el seleccionado
        status: true
    }

    $scope.fechaRegistroSelected = "";
    $scope.rutRegistroSelected = "";
    $scope.fechaFinalRegistroSelected = "";

    //Prueba de xslx generator

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
                }

            });
        }, function errorCallback(response) {

            console.log("Error", response);

        });


    }
    $scope.load();
    //carga los vehiculos asignados
    $scope.loadAsignados = () => {
        $http({
            method: 'GET',
            url: 'http://localhost:4000/api/web/vehiculosAsignados'
        }).then(function successCallback(response) {
            $scope.listAsignados = response.data;
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
            $scope.listDisponible = response.data;
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
        var err = [];
        const { patente, marca, modelo, tipoVehiculo, tipoCombustible } = $scope.newVehiculo;
        if (patente && marca && modelo) {
            if (tipoCombustible == '0') {
                err.push({ error: 'Debes Seleccionar el tipo de Combustible' });
            }
            if (tipoVehiculo == '0') {
                err.push({ error: 'Debes Seleccionar el tipo de Vehiculo' });
            }
            if (err.length > 0) {
                err.forEach((error) => {
                    Swal.fire({
                        icon: 'warning',
                        title: error['error'],
                        showConfirmButton: false,
                        timer: 1300
                    })
                })
            } else {
                $http({
                    method: 'POST',
                    url: 'http://localhost:4000/api/web/agregarVehiculo',
                    data: $scope.newVehiculo

                }).then(function successCallback(response) {
                    if (response.data == -1) {

                        Swal.fire({
                            icon: 'warning',
                            title: 'Ya existe un vehiculo con esta patente',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    } else if (response.data == -2) {

                        Swal.fire({
                            title: '¡Este patente fue Eliminada!',
                            text: "¿Desea volver a activarla?",
                            icon: 'question',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Si!'
                        }).then((result) => {
                            if (result.value) {
                                $scope.reactivar($scope.newVehiculo.patente);
                                Swal.fire(
                                    'Exito!',
                                    'Disponible de nuevo en la lista de Vehiculos.',
                                    'success'
                                )
                            }
                        })

                    } else {

                        Swal.fire({
                            icon: 'success',
                            title: 'Registro Exitoso',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        $scope.load();
                        $scope.loadDisponibles('');
                        $scope.loadAsignados();
                        $scope.limpiar();
                    }
                }, function errorCallback(response) {

                    console.log("Error ", response);


                });
            }
        } else {

            Swal.fire({
                icon: 'warning',
                title: 'No debjes campos vacios',
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    //limpia los campos del formulario de registro
    $scope.limpiar = () => {

        $scope.newVehiculo.patente = "";
        $scope.newVehiculo.marca = "";
        $scope.newVehiculo.modelo = "";
        $scope.newVehiculo.tipoVehiculo = "0";
        $scope.newVehiculo.tipoCombustible = "0";

    }

    //permite eliminar el vehiculo, solo logicamente. para mantener la integridad del registro
    $scope.eliminarVehiculo = (patente) => {

        Swal.fire({
            title: 'Se eliminara este vehiculo',
            text: "¿Esta seguro que desea continuar?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, ¡Eliminar!'
        }).then((result) => {
            if (result.value) {
                $http({
                    method: 'PUT',
                    url: 'http://localhost:4000/api/web/borrarVehiculo',
                    data: { patente }

                }).then(function successCallback(response) {
                    if (response.data != -1) {
                        $scope.load();
                        $scope.limpiar();
                    } else {
                        Swal.fire(
                            '¡Disculpe!',
                            'Este Vehiculo esta asignado, debe finalizar primero la asignacion',
                            'error'
                        )
                    }
                }, function errorCallback(response) {

                    console.log("Error", response);


                });

                Swal.fire(
                    '¡Eliminado!',
                    'Satisfactoriamente',
                    'success'
                )
            }
        })






    }

    //permite abrir el modal y envia los datos del vehiculo a este.
    $scope.editarVehiculo = (vehiculo) => {
        $scope.vehiculoSelected = vehiculo;
        jquery('#editTipoVehiculo').val($scope.vehiculoSelected.tipoVehiculo);
        jquery('#editTipoCombustible').val($scope.vehiculoSelected.tipoCombustible);


    }

    //guarda los cambios hechos en el modal a el vehiculo
    $scope.guardarModificacion = () => {

        const { marca, modelo, tipoVehiculo, tipoCombustible } = $scope.vehiculoSelected;

        if (marca && modelo && tipoVehiculo && tipoCombustible) {
            $http({
                method: "PUT",
                url: 'http://localhost:4000/api/web/modificarVehiculo',
                data: $scope.vehiculoSelected
            }).then(function successCallback(response) {
                $scope.load();
                $scope.loadAsignados();
                $scope.loadDisponibles('');
                if (response.data == -1) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No se ha podido Modificar',
                        showConfirmButton: false,
                        timer: 1500
                    })
                } else {
                    Swal.fire({
                        icon: 'success',
                        title: 'Vehiculo Modificado Satisfactoriamente',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    $scope.vehiculoSelected = response.data;
                }

            }, function errorCallback(response) {

                console.log("Error", response);

            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'No dejes campos Vacios',
                showConfirmButton: false,
                timer: 1500
            })
        }

    }
    //consulta la base de datos para ver los tipos de vehiculos disponibles
    $scope.cargarTipoVehiculo = () => {

        $http({
            method: 'GET',
            url: 'http://localhost:4000/api/web/listarTipoVehiculo'
        }).then(function successCallback(response) {
            $scope.tipoVehiculos = response.data;

        }, function errorCallback(response) {

            console.log("Error", response);

        });

    }

    //consulta la base de datos para ver los tipo de combustibles disponibles
    $scope.cargarTipoCombustible = () => {

        $http({
            method: 'GET',
            url: 'http://localhost:4000/api/web/listarTipoCombustible'
        }).then(function successCallback(response) {
            $scope.tipoCombustible = response.data;

        }, function errorCallback(response) {

            console.log("Error Countries", response);

        });

    }

    $scope.cargarTipoCombustible();

    $scope.cargarTipoVehiculo();

    //permite cargar la bitacora del vehiculo
    $scope.detailVehiculo = (vehiculo) => {

        $scope.detailStatus = true;
        $scope.statusVerCriterio = false;
        $scope.bitacoraVehiculo(vehiculo.patente);

    }

    //atributo que permite alternar entre la vista de detalles
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

        $scope.fechaRegistroSelected = fecha;
        $scope.rutRegistroSelected = registro.rutConductor;
        $scope.fechaFinalRegistroSelected = registro.fechaAsignacion['hasta'];


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
                Swal.fire({
                    icon: 'error',
                    title: 'No se ha podido encontrar la inspeccion de este Registro',
                    showConfirmButton: false,
                    timer: 1500
                })
                $scope.statusVerCriterio = false;

            }

        }, function errorCallback(response) {

            console.log("Error", response);


        });
    }

    $scope.descargarInforme = () => {
        var patente = $scope.bitacoraSelected.patenteVehiculo;
        var fecha = $scope.fechaRegistroSelected;
        var rut = $scope.rutRegistroSelected;
        $http({
            method: 'GET',
            url: 'http://localhost:4000/api/excel/getInforme/' + patente + '/' + fecha + '/' + rut,
        })

    }

    //permite alternar la vista para el criterio seleccionado
    $scope.verCriterioInspeccion = () => {

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
        })

    }

    //carga la lista de vehiculos asignados y disponibles
    $scope.verASignadosDisponibles = (val) => {

        $scope.listSelected = val;

    }

    $scope.reactivar = (patente) => {
        $http({
            method: 'PUT',
            url: 'http://localhost:4000/api/web/reactivar',
            data: {
                patente: patente
            }
        }).then(function successCallback(response) {
            $scope.load();
            $scope.loadAsignados();
            $scope.loadDisponibles('');
            $scope.limpiar();
        }, function errorCallback(response) {

            console.log("Error", response);

        });

    }

    $scope.finalizarAsignacion = (patente) => {


        $http({
            method: 'POST',
            url: 'http://localhost:4000/api/app/finalizarAsignacion',
            data: {
                patente
            }
        }).then(function successCallback(response) {
            if (response.data != -1) {
                Swal.fire({
                    icon: "success",
                    title: "Exito",
                    text: "Asignacion Finalizada, se ha actualizado el registro"
                });
                $scope.loadAsignados();
                $scope.loadDisponibles();
                $scope.load();
            }
            else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se ha podido finalizar la Asignacion"
                })
            }
        }, function errorCallback(response) {

            console.log("Error", response);

        });
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
    })

    //permite modificar el tipo de combustible
    jquery('#editTipoCombustible').change(function (e) {
        $scope.vehiculoSelected['tipoCombustible'] = jquery(this).val();
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
            $scope.patentesDisponibles = response.data;


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
                }
            })

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
            data: {
                fechaRegistro,
                patente
            }
        }).then(function successCallback(response) {


        }, function errorCallback(response) {

            console.log("Error", response);

        });
    }
    $scope.limpiar = () => {
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
        if (jquery('#selectConductor').val() != "0" && jquery('#selectPatente').val() != "0") {

            console.log('bitacora Selected', $scope.bitacoraSelected);
            $scope.bitacoraSelected['inspeccion'] = false;
            $scope.bitacoraSelected['asignado'] = true;
            $scope.bitacoraSelected['conductor'] = $scope.conductorSelected['rut'];
            var fecha = new Date();
            var dia = fecha.getDate() <= 9 ? '0' + fecha.getDate() : fecha.getDate();
            var mes = (fecha.getMonth() + 1) <= 9 ? '0' + (fecha.getMonth() + 1) : (fecha.getMonth() + 1);
            var fechaInicio = fecha.getFullYear() + '-' + mes + '-' + dia;
            var fechaFinalizacion = jquery('#fechaFinal').val();
            $scope.bitacoraSelected['fechaFinal'] = fechaFinalizacion;
            var newRegistro = {
                rutConductor: $scope.conductorSelected['rut'],
                nombreConductor: $scope.conductorSelected['nombre'],
                apellidoConductor: $scope.conductorSelected['apellido'],
                fechaRegistro: fechaInicio,
                fechaAsignacion: { desde: fechaInicio, hasta: fechaFinalizacion }
            }
            $scope.bitacoraSelected['registro'].push(newRegistro);
            $scope.crearInspeccion(fechaInicio, $scope.bitacoraSelected['patenteVehiculo']);
            //Realizando metodo POST
            $http({
                method: 'POST',
                url: 'http://localhost:4000/api/web/asignarVehiculo',
                data: $scope.bitacoraSelected
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.loadUsuarios();
                $scope.loadDisponibles('');
                Swal.fire({
                    icon: 'success',
                    title: 'Exito',
                    text: 'Vehiculo Asignado Correctamente, se ha creado un nuevo registro, el conductor debe llenar los detalles de la inspeccion',
                    showConfirmButton: true
                })
                $scope.limpiar()



            }, function errorCallback(response) {

                console.log("Error", response);

            });
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Seleccion no Valida',
                text: ' Por Favor Selecciona un Conductor y una Patente de la lista',
                showConfirmButton: true
            })

        }
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
                $scope.obtenerBitacora(vehiculo['patente']);

            }

        });

    });

})



//funcion responsable del menu lateral

$(document).ready(function () {
    $("#menu-toggle").click(function () {
        $("#wrapper").toggleClass("toggled");
        $('#iconMenu').toggleClass("fa-arrow-right");
    });

});

