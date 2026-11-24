// Testes automáticos. Rode com: npm test
const { test } = require("node:test");
const assert = require("node:assert");
const { calcularSubrede, ipParaNumero, numeroParaIp } = require("./subrede");

test("calcula uma /26", () => {
  assert.deepStrictEqual(calcularSubrede("192.168.10.0/26"), {
    rede: "192.168.10.0",
    broadcast: "192.168.10.63",
    mascara: "255.255.255.192",
    prefixo: 26,
    primeiroHost: "192.168.10.1",
    ultimoHost: "192.168.10.62",
    hostsUteis: 62,
  });
});

test("acha a rede mesmo quando o IP está no meio da faixa", () => {
  const r = calcularSubrede("10.20.30.77/20");
  assert.strictEqual(r.rede, "10.20.16.0");
  assert.strictEqual(r.broadcast, "10.20.31.255");
  assert.strictEqual(r.mascara, "255.255.240.0");
  assert.strictEqual(r.hostsUteis, 4094);
});

test("calcula uma /24 comum", () => {
  const r = calcularSubrede("172.16.5.10/24");
  assert.strictEqual(r.rede, "172.16.5.0");
  assert.strictEqual(r.broadcast, "172.16.5.255");
  assert.strictEqual(r.hostsUteis, 254);
});

test("trata /30, /31 e /32", () => {
  assert.strictEqual(calcularSubrede("192.168.1.4/30").hostsUteis, 2);
  assert.strictEqual(calcularSubrede("192.168.1.4/31").hostsUteis, 2);
  const r32 = calcularSubrede("192.168.1.9/32");
  assert.strictEqual(r32.primeiroHost, "192.168.1.9");
  assert.strictEqual(r32.hostsUteis, 1);
});

test("calcula /0", () => {
  const r = calcularSubrede("8.8.8.8/0");
  assert.strictEqual(r.rede, "0.0.0.0");
  assert.strictEqual(r.broadcast, "255.255.255.255");
});

test("converte IP para número e volta", () => {
  assert.strictEqual(ipParaNumero("192.168.10.1"), 3232238081);
  assert.strictEqual(numeroParaIp(3232238081), "192.168.10.1");
});

test("recusa entradas inválidas", () => {
  assert.throws(() => calcularSubrede("192.168.10.0"), /Formato inválido/);
  assert.throws(() => calcularSubrede("192.168.10.0/33"), /Prefixo inválido/);
  assert.throws(() => calcularSubrede("192.168.300.0/24"), /Octeto inválido/);
  assert.throws(() => calcularSubrede("192.168.10/24"), /IP inválido/);
});
