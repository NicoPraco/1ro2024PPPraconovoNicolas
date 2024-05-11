import { Persona } from './clases/persona.js';
import { Ciudadano } from './clases/ciudadano.js';
import { Extranjero } from './clases/extranjero.js';

function ObtenerTodosLosCiudadanos(arrayPersona) {
    return arrayPersona.filter((obj) => obj.hasOwnProperty('dni'));
}

function ObtenerTodosLosExtranjeros(arrayPersona) {
    return arrayPersona.filter((obj) => obj.hasOwnProperty('paisOrigen'));
}

export function AgregarALaTablaElementosNoExistentes(arrayPersona, ordenColumnas) {
    let tbodyElement = document.getElementById('table-content');
    let tablaIDs = new Set();

    // Obtener los IDs de las filas existentes en la tabla
    tbodyElement.querySelectorAll('tr').forEach((fila) => {
        let id = fila.getAttribute('data-id');
        if (id) {
            tablaIDs.add(id);
        }
    });

    // Iterar sobre las personas en el array
    arrayPersona.forEach((persona) => {
        // Verificar si el ID de la persona ya está en la tabla
        if (!tablaIDs.has(persona.id.toString())) {
            // Crear una nueva fila para la persona
            let fila = document.createElement('tr');
            fila.setAttribute('data-id', persona.id);

            // Iterar sobre las columnas y agregar los datos correspondientes
            ordenColumnas.forEach((propiedad) => {
                let celda = document.createElement('td');
                let valor = persona[propiedad];

                // Si el valor es indefinido, colocar un guión en la celda
                if (valor === undefined) {
                    valor = '-';
                }

                celda.textContent = valor;
                fila.appendChild(celda);
            });

            // Agregar la fila a la tabla
            tbodyElement.appendChild(fila);
        }
    });
}

export function ordenarTablaPorColumna(arrayPersona, ordenColumnas) {
    const headers = document.querySelectorAll('th');

    headers.forEach((header) => {
        header.addEventListener('click', () => {
            const columnIndex = Array.from(headers).indexOf(header);

            arrayPersona.sort((a, b) => {
                const valueA = a[ordenColumnas[columnIndex]];
                const valueB = b[ordenColumnas[columnIndex]];

                return typeof valueA === 'string' ? valueA.localeCompare(valueB) : valueA - valueB;
            });

            RenderizarTabla(arrayPersona, ordenColumnas);
        });
    });
}

export function RenderizarTabla(arrayPersona, ordenColumnas) {
    const tbodyElement = document.getElementById('table-content');
    tbodyElement.innerHTML = '';

    arrayPersona.forEach((persona) => {
        const fila = document.createElement('tr');

        ordenColumnas.forEach((columna) => {
            const celda = document.createElement('td');
            celda.textContent = persona[columna] || '-';
            fila.appendChild(celda);
        });

        tbodyElement.appendChild(fila);
    });
}

export function FiltrarTabla(arrayPersona, ordenColumnas) {
    const selectElement = document.getElementById('filter');

    selectElement.addEventListener('change', () => {
        const selectedValue = selectElement.value;
        let filteredArray = [];

        if (selectedValue === 'Ciudadanos') {
            filteredArray = ObtenerTodosLosCiudadanos(arrayPersona);
        } else if (selectedValue === 'Extranjeros') {
            filteredArray = ObtenerTodosLosExtranjeros(arrayPersona);
        } else {
            filteredArray = arrayPersona;
        }

        RenderizarTabla(filteredArray, ordenColumnas);
        addDoubleClickEventListeners();
    });
}

export function CalcularPromedio(arrayPersona) {
    const selectElement = document.getElementById('filter');
    const inputElement = document.getElementById('media-output');
    const btnElement = document.getElementById('btn-media');

    btnElement.addEventListener('click', () => {
        let selectedValue = selectElement.value;
        let filteredArray = [];

        if (selectedValue === 'Ciudadanos') {
            filteredArray = ObtenerTodosLosCiudadanos(arrayPersona);
        } else if (selectedValue === 'Extranjeros') {
            filteredArray = ObtenerTodosLosExtranjeros(arrayPersona);
        } else {
            filteredArray = arrayPersona;
        }

        let ageSum = 0;
        for (let persona of filteredArray) {
            let anioNacimiento = parseInt(persona.fechaNacimiento.toString().substring(0, 4));
            let anioActual = new Date().getFullYear();

            let age = anioActual - anioNacimiento;
            ageSum += age;
        }

        const media = (ageSum / filteredArray.length).toFixed(2);
        inputElement.value = media;
    });
}

export function VisualizarTabla(ordenColumnas) {
    const checkboxElements = document.querySelectorAll('[type="checkbox"]');
    const tableElement = document.querySelector('table');

    checkboxElements.forEach((checkbox) => {
        checkbox.addEventListener('change', (event) => {
            const columnName = event.target.name;
            const columnVisible = event.target.checked;

            ordenColumnas[columnName] = columnVisible;

            tableElement.querySelectorAll('tr').forEach((row) => {
                Array.from(row.cells).forEach((cell, index) => {
                    // Obtén el nombre de la columna de la primera fila (encabezado de tabla)
                    const columnHeader = tableElement.rows[0].cells[index].textContent;
                    // Compara el nombre de la columna con el nombre de la columna actual
                    if (columnHeader === columnName) {
                        cell.style.display = columnVisible ? '' : 'none';
                    }
                });
            });
        });
    });
}

export function ManagerFormularioABM(arrayPersona, ordenColumnas) {
    const addBtn = document.getElementById('btn-table');
    const acceptButton = document.getElementById('abm-form-accept');
    const modifyButton = document.getElementById('abm-form-modify');
    const cancelButton = document.getElementById('abm-form-cancel');
    const deletebutton = document.getElementById('abm-form-delete');

    // Mostrar el formulario ABM al hacer doble clic en una fila de la tabla
    addDoubleClickEventListeners();

    //Logica para agregar una nueva persona
    addBtn.addEventListener('click', () => {
        MostrarFormularioABMConTodosLosCampos();

        acceptButton.style.display = '';
        modifyButton.style.display = 'none';
        deletebutton.style.display = 'none';

        document.getElementById('abm-form-type').addEventListener('change', habilitarCamposSegunTipoPersona);
        habilitarCamposSegunTipoPersona();
    });

    acceptButton.addEventListener('click', () => {
        VerificarAdd(arrayPersona, ordenColumnas);
    });

    // Lógica para Modificar a la Persona
    modifyButton.addEventListener('click', () => {
        VerificarModificacion();
    });

    //Logica para eliminar la persona
    deletebutton.addEventListener('click', function () {
        const id = document.getElementById('abm-form-id').value;

        OcultarFormularioABM();
        EliminarPersonaDeLaTabla(id);
    });

    cancelButton.addEventListener('click', () => {
        LimpiarFormularioABM();
        OcultarFormularioABM();
    });
}

function EliminarPersonaDeLaTabla(id) {
    const fila = buscarFilaPorID(id);
    if (fila) {
        fila.remove();
    }
}

function addDoubleClickEventListeners() {
    const tableRows = document.querySelectorAll('#table-content tr');

    tableRows.forEach((row) => {
        // Eliminar event listeners existentes antes de agregar uno nuevo
        row.removeEventListener('dblclick', doubleClickHandler);

        // Agregar nuevo event listener
        row.addEventListener('dblclick', doubleClickHandler);
    });
}

function doubleClickHandler() {
    MostrarFormularioABM();
    LlenarFormularioABMConDatos(this); // 'this' se refiere a la fila actual
}

function VerificarAdd(arrayPersona, ordenColumnas) {
    // Obtener los valores de los campos del formulario
    const id = document.getElementById('abm-form-id').value;

    if (id === '') {
        // Se está agregando una nueva persona
        const datosABM = ObtenerDatos();
        OcultarFormularioABM();

        AgregarPersona(arrayPersona, datosABM);
        AgregarALaTablaElementosNoExistentes(arrayPersona, ordenColumnas);
        addDoubleClickEventListeners();
    }
}

function VerificarModificacion() {
    // Obtener los valores de los campos del formulario
    const id = document.getElementById('abm-form-id').value;

    if (id !== '') {
        // Se está modificando una persona existente
        const datosABM = ObtenerDatos();
        OcultarFormularioABM();
        ModificarPersona(id, datosABM);
        addDoubleClickEventListeners();
    }
}

function AgregarPersona(arrayPersona, datosABM) {
    var nuevaPersona;

    const tipo = document.getElementById('abm-form-type').value;

    // Agregar los valores específicos según el tipo de persona
    if (tipo === 'Ciudadano') {
        nuevaPersona = new Ciudadano(datosABM.nombre, datosABM.apellido, datosABM.fecha, datosABM.dni);
    } else {
        nuevaPersona = new Extranjero(datosABM.nombre, datosABM.apellido, datosABM.fecha, datosABM.pais);
    }

    AgregarPersonaA_LaLista(arrayPersona, nuevaPersona);
}

function ObtenerDatos() {
    const nombre = document.getElementById('abm-form-name').value;
    const apellido = document.getElementById('abm-form-surname').value;
    const fecha = parseInt(document.getElementById('abm-form-date').value);
    const tipo = document.getElementById('abm-form-type').value;
    let dni = parseInt(document.getElementById('abm-form-dni').value);
    let pais = document.getElementById('abm-form-country').value;

    // Si el tipo es Ciudadano, establecer los valores de Cliente como '-'
    if (tipo === 'Ciudadano') {
        pais = '-';
    }
    // Si el tipo es Cliente, establecer los valores de Empleado como '-'
    else if (tipo === 'Extranjero') {
        dni = '-';
    }

    return { nombre, apellido, fecha, tipo, dni, pais };
}

function ModificarPersona(id, datosABM) {
    const fila = buscarFilaPorID(id);

    if (fila) {
        // Utilizar los datos temporales para modificar la fila en la tabla
        fila.cells[1].textContent = datosABM.nombre;
        fila.cells[2].textContent = datosABM.apellido;
        fila.cells[3].textContent = datosABM.fecha;

        // Actualizar los valores específicos según el tipo de persona
        if (datosABM.tipo === 'Ciudadano') {
            fila.cells[4].textContent = datosABM.dni;
            fila.cells[5].textContent = '-';
        } else {
            fila.cells[4].textContent = '-';
            fila.cells[5].textContent = datosABM.pais;
        }
    }
}

function buscarFilaPorID(id) {
    const table = document.getElementById('table-content');
    const rows = table.querySelectorAll('tr');

    for (let i = 0; i < rows.length; i++) {
        const cell = rows[i].cells[0]; // Primera celda de la fila
        if (cell.textContent.trim() === id.toString()) {
            return rows[i]; // Se encontró la fila
        }
    }
    return null; // No se encontró la fila
}

function AgregarPersonaA_LaLista(arrayPersona, nuevaPersona) {
    arrayPersona.push(nuevaPersona);
}

function LlenarFormularioABMConDatos(row) {
    const cells = row.cells;
    const id = cells[0].textContent;
    const nombre = cells[1].textContent;
    const apellido = cells[2].textContent;
    const fecha = cells[3].textContent;
    const dni = cells[4].textContent || '';
    const pais = cells[5].textContent || '';

    const inputDniElement = document.getElementById('abm-form-dni');
    const inputPaisElement = document.getElementById('abm-form-country');

    const lblDniElement = document.getElementById('abm-form-lbl-dni');
    const lblPais = document.getElementById('abm-form-lbl-country');

    document.getElementById('abm-form-id').value = id;
    document.getElementById('abm-form-name').value = nombre;
    document.getElementById('abm-form-surname').value = apellido;
    document.getElementById('abm-form-date').value = fecha;

    const acceptButton = document.getElementById('abm-form-accept');
    const modifyButton = document.getElementById('abm-form-modify');
    const cancelButton = document.getElementById('abm-form-cancel');
    const deleteButton = document.getElementById('abm-form-delete');

    acceptButton.style.display = 'hidden';
    modifyButton.style.display = '';
    cancelButton.style.display = '';
    deleteButton.style.display = '';

    const tipoPersonaElement = document.getElementById('abm-form-type');
    for (let option of tipoPersonaElement.options) {
        option.disabled = true;
    }

    if (dni !== '-') {
        // Es un Ciudadano

        document.getElementById('abm-form-type').value = 'Ciudadano';
        tipoPersonaElement.querySelector('option[value="Ciudadano"]').disabled = false;

        lblDniElement.style.display = '';
        inputDniElement.style.display = '';

        inputPaisElement.style.display = 'none';
        lblPais.style.display = 'none';

        inputDniElement.value = dni;
    } else {
        // Es un Extranjero
        document.getElementById('abm-form-type').value = 'Extranjero';
        tipoPersonaElement.querySelector('option[value="Extranjero"]').disabled = false;

        inputDniElement.style.display = 'none';
        lblDniElement.style.display = 'none';

        inputPaisElement.style.display = '';
        lblPais.style.display = '';

        inputPaisElement.value = pais;
    }
}

function MostrarFormularioABMConTodosLosCampos() {
    const header = document.getElementById('header-div');
    const dataform = document.getElementById('form-data');
    const abmForm = document.getElementById('abm-form');

    const IdInputElement = document.getElementById('abm-form-name');
    const nombreInputElement = document.getElementById('abm-form-surname');
    const apellidoInputElement = document.getElementById('abm-form-date');
    const fechaInputElement = document.getElementById('abm-form-type');
    const dniInputElement = document.getElementById('abm-form-dni');
    const paisInputElement = document.getElementById('abm-form-country');

    const lblDniElement = document.getElementById('abm-form-lbl-dni');
    const lblPaisElement = document.getElementById('abm-form-lbl-country');

    const tipoPersonaElement = document.getElementById('abm-form-type');

    header.classList.add('hidden');
    dataform.classList.add('hidden');
    abmForm.classList.remove('hidden');

    IdInputElement.style.display = '';
    nombreInputElement.style.display = '';
    apellidoInputElement.style.display = '';
    fechaInputElement.style.display = '';
    dniInputElement.style.display = '';
    paisInputElement.style.display = '';

    lblDniElement.style.display = '';
    lblPaisElement.style.display = '';

    for (let option of tipoPersonaElement.options) {
        option.disabled = false;
    }
}

function MostrarFormularioABM() {
    const header = document.getElementById('header-div');
    const dataform = document.getElementById('form-data');
    const abmForm = document.getElementById('abm-form');
    const tipoPersonaElement = document.getElementById('abm-form-type');

    header.classList.add('hidden');
    dataform.classList.add('hidden');
    abmForm.classList.remove('hidden');

    for (let option of tipoPersonaElement.options) {
        option.disabled = false;
    }
}

function OcultarFormularioABM() {
    const header = document.getElementById('header-div');
    const dataform = document.getElementById('form-data');
    const abmForm = document.getElementById('abm-form');

    header.classList.remove('hidden');
    dataform.classList.remove('hidden');
    abmForm.classList.add('hidden');

    LimpiarFormularioABM();
}

function habilitarCamposSegunTipoPersona() {
    const tipo = document.getElementById('abm-form-type').value;
    const dniInput = document.getElementById('abm-form-dni');
    const countryInput = document.getElementById('abm-form-country');

    // Deshabilitar todos los campos
    dniInput.disabled = true;
    countryInput.disabled = true;

    // Habilitar los campos específicos según el tipo de persona seleccionado
    if (tipo === 'Ciudadano') {
        dniInput.disabled = false;
    } else {
        countryInput.disabled = false;
    }
}

function LimpiarFormularioABM() {
    // Restablecer los valores del formulario ABM
    document.getElementById('abm-form-id').value = '';
    document.getElementById('abm-form-name').value = '';
    document.getElementById('abm-form-surname').value = '';
    document.getElementById('abm-form-date').value = '';
    document.getElementById('abm-form-dni').value = '';
    document.getElementById('abm-form-country').value = '';

    document.getElementById('abm-form-id').style.display = '';
    document.getElementById('abm-form-name').style.display = '';
    document.getElementById('abm-form-surname').style.display = '';
    document.getElementById('abm-form-date').style.display = '';
    document.getElementById('abm-form-dni').style.display = '';
    document.getElementById('abm-form-country').style.display = '';
}
