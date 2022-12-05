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

export const is_positive_integer = (_n) => {
    const n = new BigNumber(_n)

    if(n.isNaN()) return { error: "Must be a number" }
    if(!n.isInteger()) return { error: "Must be an integer" }
    if(n.isLessThanOrEqualTo(new BigNumber(0))) return { error: "Must be a positive number" }
    
    return {
        sanitized: n.toString()
    }
}

export const is_positive_number = (_n) => {
    const n = new BigNumber(_n)

    if(n.isNaN()) return { error: "Must be a number" }
    if(n.isLessThanOrEqualTo(new BigNumber(0))) return { error: "Must be a positive number" }
    
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

export const is_lt = (_n, _compare) => {
    const n = new BigNumber(_n)
    const compare = new BigNumber(_compare)

    if(n.isNaN()) return { error: "Must be a number" }
    if(n.isGreaterThan(compare)) return { error: "Must be less than " + compare.toString() }

    return {
        sanitized: n.toString()
    }   
}

export const is_gt = (_n, _compare) => {
    const n = new BigNumber(_n)
    const compare = new BigNumber(_compare)

    if(n.isNaN()) return { error: "Must be a number" }
    if(n.isLessThan(compare)) return { error: "Must be greater than " + compare.toString() }

    return {
        sanitized: n.toString()
    }   
}