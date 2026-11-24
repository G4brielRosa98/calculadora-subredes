# Calculadora de sub-redes IPv4

Programa de linha de comando em Node.js que recebe um endereço no formato `IP/prefixo` e mostra rede, broadcast, máscara, primeiro e último host e quantidade de hosts úteis.

As contas são feitas com operações de bits, sem bibliotecas prontas de IP.

## Como rodar

Precisa do [Node.js](https://nodejs.org) 18 ou mais novo.

```
git clone https://github.com/G4brielRosa98/calculadora-subredes.git
cd calculadora-subredes
node subrede.js 192.168.10.0/26
```

Saída:

```
Rede:          192.168.10.0/26
Broadcast:     192.168.10.63
Máscara:       255.255.255.192
Primeiro host: 192.168.10.1
Último host:   192.168.10.62
Hosts úteis:   62
```

## Exemplos

| Entrada | Rede | Broadcast | Máscara | Hosts úteis |
| :---- | :---- | :---- | :---- | :---- |
| 192.168.10.0/26 | 192.168.10.0 | 192.168.10.63 | 255.255.255.192 | 62 |
| 172.16.5.10/24 | 172.16.5.0 | 172.16.5.255 | 255.255.255.0 | 254 |
| 10.20.30.77/20 | 10.20.16.0 | 10.20.31.255 | 255.255.240.0 | 4094 |
| 192.168.1.4/30 | 192.168.1.4 | 192.168.1.7 | 255.255.255.252 | 2 |

## Como funciona

1. O IP é transformado em um número de 32 bits (cada octeto ocupa 8 bits).
2. A máscara é montada com `prefixo` bits "1" seguidos de bits "0".
3. **Rede** = IP **E** máscara. **Broadcast** = rede **OU** máscara invertida.
4. Primeiro host = rede + 1; último host = broadcast − 1; hosts úteis = 2^(32 − prefixo) − 2.
5. `/31` (enlace ponto a ponto) e `/32` (um único host) são tratados como casos especiais.

## Testes

```
npm test
```

São 7 testes automáticos com o executor de testes do próprio Node (`node:test`), incluindo entradas inválidas.

## O que aprendi

- Representar um IPv4 como número e manipular bits em JavaScript (`&`, `|`, `~`, `<<`, `>>>`).
- Tratar erros de entrada com mensagens claras.
- Escrever testes automáticos.

## Próximos passos

- Dividir uma rede em sub-redes menores (ex.: uma /24 em quatro /26).
- Aceitar a máscara em formato decimal (`192.168.10.0 255.255.255.192`).
- Suporte a IPv6.
