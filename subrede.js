// Calculadora de sub-redes IPv4
// Uso: node subrede.js 192.168.10.0/26

// Converte "192.168.10.0" em um número de 32 bits.
// Cada octeto ocupa 8 bits: o primeiro vai para os bits mais altos.
function ipParaNumero(ip) {
  const octetos = ip.split(".");

  if (octetos.length !== 4) {
    throw new Error(`IP inválido: "${ip}". Use o formato 192.168.10.0`);
  }

  let numero = 0;
  for (const texto of octetos) {
    const octeto = Number(texto);
    if (!/^\d+$/.test(texto) || octeto > 255) {
      throw new Error(`Octeto inválido: "${texto}". Cada parte vai de 0 a 255`);
    }
    // Desloca o que já existe 8 bits para a esquerda e soma o novo octeto.
    numero = numero * 256 + octeto;
  }
  return numero;
}

// Faz o caminho inverso: número de 32 bits -> "192.168.10.0".
function numeroParaIp(numero) {
  return [
    (numero >>> 24) & 255, // bits 31 a 24
    (numero >>> 16) & 255, // bits 23 a 16
    (numero >>> 8) & 255, // bits 15 a 8
    numero & 255, // bits 7 a 0
  ].join(".");
}

// Monta a máscara a partir do prefixo.
// /26 = 26 bits "1" seguidos de 6 bits "0" = 255.255.255.192
function mascaraDoPrefixo(prefixo) {
  if (prefixo === 0) return 0;
  // Começa com 32 bits "1" e empurra (32 - prefixo) zeros pela direita.
  // ">>> 0" mantém o número positivo (sem sinal).
  return (0xffffffff << (32 - prefixo)) >>> 0;
}

// Recebe "192.168.10.0/26" e devolve todas as informações da sub-rede.
function calcularSubrede(entrada) {
  const partes = String(entrada).trim().split("/");
  if (partes.length !== 2) {
    throw new Error(`Formato inválido: "${entrada}". Use IP/prefixo, ex.: 192.168.10.0/26`);
  }

  const [ipTexto, prefixoTexto] = partes;
  const prefixo = Number(prefixoTexto);
  if (!/^\d+$/.test(prefixoTexto) || prefixo > 32) {
    throw new Error(`Prefixo inválido: "/${prefixoTexto}". Use de /0 a /32`);
  }

  const ip = ipParaNumero(ipTexto);
  const mascara = mascaraDoPrefixo(prefixo);

  // Rede = IP E máscara (zera os bits de host).
  const rede = (ip & mascara) >>> 0;
  // Broadcast = rede OU máscara invertida (liga todos os bits de host).
  const broadcast = (rede | ~mascara) >>> 0;

  const totalEnderecos = 2 ** (32 - prefixo);

  // /31 e /32 são casos especiais: não reservam endereço de rede e broadcast.
  let primeiroHost, ultimoHost, hostsUteis;
  if (prefixo === 32) {
    primeiroHost = ultimoHost = rede;
    hostsUteis = 1;
  } else if (prefixo === 31) {
    primeiroHost = rede;
    ultimoHost = broadcast;
    hostsUteis = 2;
  } else {
    primeiroHost = rede + 1;
    ultimoHost = broadcast - 1;
    hostsUteis = totalEnderecos - 2;
  }

  return {
    rede: numeroParaIp(rede),
    broadcast: numeroParaIp(broadcast),
    mascara: numeroParaIp(mascara),
    prefixo,
    primeiroHost: numeroParaIp(primeiroHost),
    ultimoHost: numeroParaIp(ultimoHost),
    hostsUteis,
  };
}

// Parte que roda quando o arquivo é chamado pelo terminal.
// Quando os testes importam o arquivo, esta parte não roda.
if (require.main === module) {
  const entrada = process.argv[2];

  if (!entrada) {
    console.log("Uso: node subrede.js 192.168.10.0/26");
    process.exit(1);
  }

  try {
    const r = calcularSubrede(entrada);
    console.log(`Rede:          ${r.rede}/${r.prefixo}`);
    console.log(`Broadcast:     ${r.broadcast}`);
    console.log(`Máscara:       ${r.mascara}`);
    console.log(`Primeiro host: ${r.primeiroHost}`);
    console.log(`Último host:   ${r.ultimoHost}`);
    console.log(`Hosts úteis:   ${r.hostsUteis}`);
  } catch (erro) {
    console.error(`Erro: ${erro.message}`);
    process.exit(1);
  }
}

module.exports = { calcularSubrede, ipParaNumero, numeroParaIp, mascaraDoPrefixo };
