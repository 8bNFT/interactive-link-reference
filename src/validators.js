export const is_valid_eth_address = (_address) => {
    let address = _address.toLowerCase().trim()

    if (/^(0x)?[0-9a-f]{40}$/.test(address)) return {}

    return {
        error: "Must be a valid ETH address"
    }
}

export const is_integer = (_n) => {
    let n = parseFloat(_n)
    if(isNaN(n)) return { error: "Must be a number" }
    if(!Number.isInteger(n) || String(n) !== _n) return { error: "Must be an integer" }
    return {}
}

export const is_number = (_n)=>{
    let n = parseFloat(_n)
    if(isNaN(n)) return { error: "Must be a number" }
    if (!/^\d*(\.\d+)?$/.test(_n)) return { error: "Must be a number" }
    return {
        sanitized: String(n)
    }
}