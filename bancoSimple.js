export class Titular {
  constructor(nombre, dni) {
    this.nombre = nombre;
    this.dni = dni;
  }
}

export class Cuenta {
  #saldo;

  constructor(numero, titular, saldoInicial = 0) {
    this.numero = numero;
    this.titular = titular;
    this.#saldo = saldoInicial;
  }

  depositar(monto) {
    if (monto > 0) {
      this.#saldo += monto;
      console.log(`Se depositaron $${monto}. Saldo actual: $${this.#saldo}`);
    } else {
      throw new Error("Monto inválido");
    }
  }

  // Método polimórfico: cada subclase lo implementa a su manera
  extraer(monto) {
    throw new Error("Método extraer() debe ser implementado en subclases");
  }

  
  getSaldo() {
    return this.#saldo;
  }

  modificarSaldo(monto) {
    this.#saldo += monto;
  }
}

export class CuentaCorriente extends Cuenta {
  constructor(numero, titular, saldoInicial, sobregiro) {
    super(numero, titular, saldoInicial);
    this.sobregiro = sobregiro;
  }

  extraer(monto) {
    if (this.getSaldo() - monto >= -this.sobregiro) {
      this.modificarSaldo(-monto);
      console.log(`Se extrajo $${monto} de la cuenta corriente.`);
    } else {
      throw new Error("Saldo insuficiente (límite de descubierto alcanzado)");
    }
  }
}

export class CajaDeAhorro extends Cuenta {
  constructor(numero, titular, saldoInicial, limiteExtraccion = 10000) {
    super(numero, titular, saldoInicial);
    this.limiteExtraccion = limiteExtraccion;
  }

  extraer(monto) {
    if (monto > this.limiteExtraccion) {
      throw new Error("Supera el límite por extracción");
    }
    if (this.getSaldo() >= monto) {
      this.modificarSaldo(-monto);
      console.log(`Se extrajo $${monto} directamente de la caja de ahorro.`);
    } else {
      throw new Error("Saldo insuficiente");
    }
  }
}

export class Banco {
  constructor(nombre) {
    this.nombre = nombre;
    this.cuentas = new Map();
  }

  agregarCuenta(cuenta) {
    this.cuentas.set(cuenta.numero, cuenta);
  }

  buscarCuenta(numero) {
    return this.cuentas.get(numero);
  }

  transferir(numOrigen, numDestino, monto) {
    const origen = this.buscarCuenta(numOrigen);
    const destino = this.buscarCuenta(numDestino);
    if (!origen || !destino) throw new Error("Cuenta no encontrada");

    origen.extraer(monto);
    destino.depositar(monto);
  }
}
