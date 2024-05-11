import { Persona } from './persona.js';

export class Ciudadano extends Persona {
    constructor(nombre, apellido, fecha, dni) {
        super(nombre, apellido, fecha);

        if (this.#ValidarDatos(dni)) {
            this.dni = dni;
        } else {
            console.error('Ha ingresado un dato invalido en alguno de los campos.');
        }
    }

    #ValidarDatos(dni) {
        return this.#ValidarDni(dni);
    }

    #ValidarDni(dni) {
        return !isNaN(dni) && dni > 0;
    }

    // Metodos principales

    toString() {
        return `${this.id} ${this.nombre} ${this.apellido} ${this.edad} ${this.compras} ${this.telefono}`;
    }

    toJson() {
        return JSON.stringify((this.id, this.nombre, this.apellido, this.edad, this.compras, this.telefono));
    }

    static fromJson(jsonCliente) {
        return JSON.parse(jsonCliente);
    }
}
