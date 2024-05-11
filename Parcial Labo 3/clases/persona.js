export class Persona {
    static lastID = 0;
    static personasID = {};

    constructor(nombre, apellido, fechaDeNacimiento) {
        if (this.#ValidarDatos(nombre, apellido, fechaDeNacimiento)) {
            this.id = Persona.nextID();
            this.nombre = nombre;
            this.apellido = apellido;
            this.fechaNacimiento = fechaDeNacimiento;
        } else {
            console.error('Ha ingresado un dato invalido en alguno de los campos.');
        }
    }

    static nextID() {
        let nextID = ++Persona.lastID;

        // Verificar si el próximo ID ya está en uso
        while (Persona.personasID[nextID]) {
            nextID++;
        }

        return nextID;
    }

    #ValidarDatos(nombre, apellido, fechaDeNacimiento) {
        return this.#ValidarNombre(nombre) && this.#ValidarApellido(apellido) && this.#ValidarFecha(fechaDeNacimiento);
    }

    #ValidarNombre(nombre) {
        return typeof nombre === 'string';
    }

    #ValidarApellido(apellido) {
        return typeof apellido === 'string';
    }

    #ValidarFecha(fechaDeNacimiento) {
        return typeof fechaDeNacimiento === 'number';
    }

    // Metodos principales

    toString() {
        return `${this.id} ${this.nombre} ${this.apellido} ${this.edad}`;
    }

    toJson() {
        return JSON.stringify((this.id, this.nombre, this.apellido, this.edad));
    }

    static fromJson(jsonType) {
        const personas = JSON.parse(jsonType);
        let maxID = 0;

        personas.forEach((persona) => {
            if (persona.id > maxID) {
                maxID = persona.id;
            }

            this.personasID[persona.id] = true;
        });

        this.lastID = maxID;

        return personas;
    }
}
