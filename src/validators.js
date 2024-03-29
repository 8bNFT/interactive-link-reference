import BigNumber from "bignumber.js"
BigNumber.config({ EXPONENTIAL_AT: 1e+9 })

export const is_valid_eth_address = (_address) => {
    let address = _address.toLowerCase().trim()

    if (/^(0x)?[0-9a-f]{40}$/.test(address)) return {}

    return {
        error: "Must be a valid ETH address"
    }
}

export const is_integer = (_n) => {
    const n = new BigNumber(_n)

    if(n.isNaN()) return { error: "Must be a number" }
    if(!n.isInteger()) return { error: "Must be an integer" }
    
    return {
        sanitized: n.toString()
    }
}

export const is_number = (_n)=>{
    const n = new BigNumber(_n)
    if(n.isNaN()) return { error: "Must be a number" }

    return {
        sanitized: n.toString()
    }
}