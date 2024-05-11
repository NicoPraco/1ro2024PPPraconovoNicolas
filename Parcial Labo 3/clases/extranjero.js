import { Persona } from './persona.js';

export class Extranjero extends Persona {
    constructor(nombre, apellido, fecha, paisOrigen) {
        super(nombre, apellido, fecha);
        if (this.#ValidarDatos(paisOrigen)) {
            this.paisOrigen = paisOrigen;
        } else {
            console.error('Ha ingresado un dato invalido en alguno de los campos.');
        }
    }

    #ValidarDatos(paisOrigen) {
        return this.#ValidarPaisOrigen(paisOrigen);
    }

    #ValidarPaisOrigen(paisOrigen) {
        return typeof paisOrigen === 'string';
    }

    // Metodos principales

    toString() {
        return `${this.id} ${this.nombre} ${this.apellido} ${this.edad} ${this.sueldo} ${this.ventas}`;
    }

    toJson() {
        return JSON.stringify((this.id, this.nombre, this.apellido, this.edad, this.sueldo, this.ventas));
    }

    static fromJson(jsonEmpleado) {
        return JSON.parse(jsonEmpleado);
    }
}
