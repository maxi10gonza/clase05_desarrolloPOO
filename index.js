import readline from 'readline';
import { Titular, Cuenta, CuentaCorriente, CajaDeAhorro, Banco } from './bancoSimple.js ';

// CLI Implementation
class BancoCLI {
  constructor() {
    this.banco = new Banco("Banco Nacional");
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  // Utilidades de validación
  validarNumero(input, mensaje = "Debe ser un número válido") {
    const num = parseFloat(input);
    if (isNaN(num) || num < 0) {
      throw new Error(mensaje);
    }
    return num;
  }

  validarString(input, mensaje = "No puede estar vacío") {
    if (!input || input.trim().length === 0) {
      throw new Error(mensaje);
    }
    return input.trim();
  }

  validarEntero(input, mensaje = "Debe ser un número entero válido") {
    const num = parseInt(input);
    if (isNaN(num) || num < 0) {
      throw new Error(mensaje);
    }
    return num;
  }

  // Método para hacer preguntas de forma asíncrona
  question(prompt) {
    return new Promise((resolve) => {
      this.rl.question(prompt, resolve);
    });
  }

  // Mostrar menú principal
  mostrarMenu() {
    console.log("\n" + "=".repeat(50));
    console.log(`         ${this.banco.nombre} `);
    console.log("=".repeat(50));
    console.log("1. Crear cuenta corriente");
    console.log("2. Crear caja de ahorro");
    console.log("3. Consultar saldo");
    console.log("4. Depositar dinero");
    console.log("5. Extraer dinero");
    console.log("6. Transferir dinero");
    console.log("7. Listar cuentas");
    console.log("8. Salir");
    console.log("-".repeat(50));
  }

  // Crear cuenta corriente
  async crearCuentaCorriente() {
    try {
      console.log("\n--- Crear Cuenta Corriente ---");
      
      const numero = this.validarEntero(
        await this.question("Número de cuenta: "),
        "El número de cuenta debe ser un entero válido"
      );
      
      if (this.banco.buscarCuenta(numero)) {
        throw new Error("Ya existe una cuenta con ese número");
      }

      const nombre = this.validarString(
        await this.question("Nombre del titular: "),
        "El nombre no puede estar vacío"
      );
      
      const dni = this.validarString(
        await this.question("DNI del titular: "),
        "El DNI no puede estar vacío"
      );
      
      const saldoInicial = this.validarNumero(
        await this.question("Saldo inicial (0 por defecto): ") || "0",
        "El saldo inicial debe ser un número válido"
      );
      
      const sobregiro = this.validarNumero(
        await this.question("Límite de sobregiro: "),
        "El sobregiro debe ser un número válido"
      );

      const titular = new Titular(nombre, dni);
      const cuenta = new CuentaCorriente(numero, titular, saldoInicial, sobregiro);
      this.banco.agregarCuenta(cuenta);
      
      console.log("Cuenta corriente creada exitosamente!");
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }

  // Crear caja de ahorro
  async crearCajaDeAhorro() {
    try {
      console.log("\n--- Crear Caja de Ahorro ---");
      
      const numero = this.validarEntero(
        await this.question("Número de cuenta: "),
        "El número de cuenta debe ser un entero válido"
      );
      
      if (this.banco.buscarCuenta(numero)) {
        throw new Error("Ya existe una cuenta con ese número");
      }

      const nombre = this.validarString(
        await this.question("Nombre del titular: "),
        "El nombre no puede estar vacío"
      );
      
      const dni = this.validarString(
        await this.question("DNI del titular: "),
        "El DNI no puede estar vacío"
      );
      
      const saldoInicial = this.validarNumero(
        await this.question("Saldo inicial (0 por defecto): ") || "0",
        "El saldo inicial debe ser un número válido"
      );
      
      const limiteExtraccion = this.validarNumero(
        await this.question("Límite de extracción (10000 por defecto): ") || "10000",
        "El límite de extracción debe ser un número válido"
      );

      const titular = new Titular(nombre, dni);
      const cuenta = new CajaDeAhorro(numero, titular, saldoInicial, limiteExtraccion);
      this.banco.agregarCuenta(cuenta);
      
      console.log("Caja de ahorro creada exitosamente!");
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }

  // Consultar saldo
  async consultarSaldo() {
    try {
      console.log("\n--- Consultar Saldo ---");
      
      const numero = this.validarEntero(
        await this.question("Número de cuenta: "),
        "El número de cuenta debe ser un entero válido"
      );
      
      const cuenta = this.banco.buscarCuenta(numero);
      if (!cuenta) {
        throw new Error("Cuenta no encontrada");
      }

      console.log(`\nInformación de la cuenta ${numero}:`);
      console.log(`   Titular: ${cuenta.titular.nombre} (DNI: ${cuenta.titular.dni})`);
      console.log(`   Tipo: ${cuenta.constructor.name}`);
      console.log(`   Saldo actual: $${cuenta.getSaldo()}`);
      
      if (cuenta instanceof CuentaCorriente) {
        console.log(`   Sobregiro disponible: $${cuenta.sobregiro}`);
      } else if (cuenta instanceof CajaDeAhorro) {
        console.log(`   Límite de extracción: $${cuenta.limiteExtraccion}`);
      }
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }

  // Depositar dinero
  async depositar() {
    try {
      console.log("\n--- Depositar Dinero ---");
      
      const numero = this.validarEntero(
        await this.question("Número de cuenta: "),
        "El número de cuenta debe ser un entero válido"
      );
      
      const cuenta = this.banco.buscarCuenta(numero);
      if (!cuenta) {
        throw new Error("Cuenta no encontrada");
      }

      const monto = this.validarNumero(
        await this.question("Monto a depositar: "),
        "El monto debe ser un número válido mayor a 0"
      );

      if (monto <= 0) {
        throw new Error("El monto debe ser mayor a 0");
      }

      cuenta.depositar(monto);
      console.log("Depósito realizado exitosamente!");
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }

  // Extraer dinero
  async extraer() {
    try {
      console.log("\n--- Extraer Dinero ---");
      
      const numero = this.validarEntero(
        await this.question("Número de cuenta: "),
        "El número de cuenta debe ser un entero válido"
      );
      
      const cuenta = this.banco.buscarCuenta(numero);
      if (!cuenta) {
        throw new Error("Cuenta no encontrada");
      }

      const monto = this.validarNumero(
        await this.question("Monto a extraer: "),
        "El monto debe ser un número válido mayor a 0"
      );

      if (monto <= 0) {
        throw new Error("El monto debe ser mayor a 0");
      }

      cuenta.extraer(monto);
      console.log("Extracción realizada exitosamente!");
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }

  // Transferir dinero
  async transferir() {
    try {
      console.log("\n--- Transferir Dinero ---");
      
      const numOrigen = this.validarEntero(
        await this.question("Número de cuenta origen: "),
        "El número de cuenta origen debe ser un entero válido"
      );
      
      const numDestino = this.validarEntero(
        await this.question("Número de cuenta destino: "),
        "El número de cuenta destino debe ser un entero válido"
      );

      if (numOrigen === numDestino) {
        throw new Error("Las cuentas de origen y destino no pueden ser iguales");
      }

      const monto = this.validarNumero(
        await this.question("Monto a transferir: "),
        "El monto debe ser un número válido mayor a 0"
      );

      if (monto <= 0) {
        throw new Error("El monto debe ser mayor a 0");
      }

      this.banco.transferir(numOrigen, numDestino, monto);
      console.log("Transferencia realizada exitosamente!");
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }

  // Listar cuentas
  listarCuentas() {
    console.log("\n--- Lista de Cuentas ---");
    
    if (this.banco.cuentas.size === 0) {
      console.log("No hay cuentas registradas.");
      return;
    }

    console.log("\nCuentas existentes:");
    this.banco.cuentas.forEach((cuenta, numero) => {
      console.log(`\n   Cuenta ${numero}:`);
      console.log(`   • Titular: ${cuenta.titular.nombre} (DNI: ${cuenta.titular.dni})`);
      console.log(`   • Tipo: ${cuenta.constructor.name}`);
      console.log(`   • Saldo: $${cuenta.getSaldo()}`);
      
      if (cuenta instanceof CuentaCorriente) {
        console.log(`   • Sobregiro: $${cuenta.sobregiro}`);
      } else if (cuenta instanceof CajaDeAhorro) {
        console.log(`   • Límite extracción: $${cuenta.limiteExtraccion}`);
      }
    });
  }

  // Iniciar la aplicación
  async iniciar() {
    console.log("Bienvenido al Sistema Bancario CLI");
    
    while (true) {
      try {
        this.mostrarMenu();
        const opcion = await this.question("Seleccione una opción: ");

        switch (opcion) {
          case '1':
            await this.crearCuentaCorriente();
            break;
          case '2':
            await this.crearCajaDeAhorro();
            break;
          case '3':
            await this.consultarSaldo();
            break;
          case '4':
            await this.depositar();
            break;
          case '5':
            await this.extraer();
            break;
          case '6':
            await this.transferir();
            break;
          case '7':
            this.listarCuentas();
            break;
          case '8':
            console.log("¡Gracias por usar el Sistema Bancario!");
            this.rl.close();
            return;
          default:
            console.log("Opción inválida. Intente nuevamente.");
        }

        // Pausa antes de mostrar el menú nuevamente
        await this.question("\nPresione Enter para continuar...");
      } catch (error) {
        console.log(`Error inesperado: ${error.message}`);
      }
    }
  }
}

// Ejecutar la aplicación
const app = new BancoCLI();
app.iniciar().catch(console.error);