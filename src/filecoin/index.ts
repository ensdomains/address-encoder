// Ported from https://www.npmjs.com/package/@glif/filecoin-address to reduce file size

import { blake2b } from 'blakejs'
import { b32decode, b32encode, hex2a} from 'crypto-addr-codec';
import { decode as lebDecode, encode as lebEncode } from '../leb128/unsigned';
import { Address } from './address';

function validateChecksum (ingest:Buffer, expect:Buffer){
    const digest = getChecksum(ingest)
    return Buffer.compare(Buffer.from(digest), expect)
}

function getChecksum (ingest:Buffer):Buffer {
    return blake2b(ingest, null, 4)
}

function checkAddressString (address:string){
    if (!address){throw Error('No bytes to validate.')}
    if (address.length < 3){throw Error('Address is too short to validate.')}
    if (address[0] !== 'f' && address[0] !== 't') {
        throw Error('Unknown address network.')
    }

    switch (address[1]) {
        case '0': {
        if (address.length > 22){throw Error('Invalid ID address length.')}
        break
        }
        case '1': {
        if (address.length !== 41){throw Error('Invalid secp256k1 address length.')}
        break
        }
        case '2': {
        if (address.length !== 41){throw Error('Invalid Actor address length.')}
        break
        }
        case '3': {
        if (address.length !== 86){throw Error('Invalid BLS address length.')}
        break
        }
        default: {
            throw new Error('Invalid address protocol.')
        }
    }
}

function filDecode (address: string) {
    checkAddressString(address)
    const network = address[0]
    const protocol = parseInt(address[1], 10)
    const protocolByte = Buffer.from([protocol])
    const raw = address.slice(2)

    if (protocol === 0) {
      return filNewAddress(protocol, Buffer.from(lebEncode(raw)))
    }

    const payloadChecksum = Buffer.from(b32decode(raw.toUpperCase()))
    const { length } = payloadChecksum
    const payload = payloadChecksum.slice(0, length - 4)
    const checksum = payloadChecksum.slice(length - 4, length)
    if (validateChecksum(Buffer.concat([protocolByte, payload]), checksum)) {
        throw Error("Checksums don't match")
    }

    const addressObj = filNewAddress(protocol, payload)
    if (filEncode(network, addressObj) !== address){
        throw Error(`Did not encode this address properly: ${address}`)
    }
    return addressObj
}


function filEncode (network:string, address:Address) {
    if (!address || !address.str){throw Error('Invalid address')}
    let addressString = ''
    const payload = address.payload()
    const protocol = address.protocol()

    switch (protocol) {
        case 0: {
            const decoded = lebDecode(payload)
            addressString = network + String(protocol) + decoded
            break
        }
        default: {
            const protocolByte = Buffer.from([protocol])
            const toChecksum = Buffer.concat([protocolByte, payload])
            const checksum = getChecksum(toChecksum)
            const bytes = Buffer.concat([payload, Buffer.from(checksum)])
            const bytes2a = hex2a(bytes.toString('hex'));
            const bytes32encoded = b32encode(bytes2a).replace(/=/g, '').toLowerCase();
            addressString = String(network) + String(protocol) + bytes32encoded
            break
        }
    }
    return addressString
}

function filNewAddress (protocol:number, payload:Buffer): Address {
    const protocolByte = Buffer.from([protocol])
    const input = Buffer.concat([protocolByte, payload])
    return new Address(input)
}
  
export function filAddrEncoder(data: Buffer): string {
    const address = filNewAddress(data[0], data.slice(1))
    return filEncode('f', address).toString()
}
    
export function filAddrDecoder(data: string): Buffer {
    return filDecode(data).str
}    
