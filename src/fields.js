import { is_number, is_integer, is_valid_eth_address } from "./validators"

export const types = {
    ETH: "ETH",
    ERC20: "ERC20",
    ERC721: "ERC721"
}

const fields = {
    base: {
        ERC721: {
            tokenId: {
                label: "Token ID",
                validator: is_integer
            },
            tokenAddress: {
                label: "Token (Collection) Address",
                validator: is_valid_eth_address
            },
        },
        ERC20: {
            tokenAddress: {
                label: "Token Address",
                validator: is_valid_eth_address
            },
            symbol: {
                label: "Token Symbol"
            }
        },
        ETH: {}
    },
    additional: {
        amount: {
            label: "Amount",
            types: ["ETH", "ERC20"],
            validator: is_number
        },
        toAddress: {
            label: "Recipient",
            validator: is_valid_eth_address
        },
        currencyAddress: {
            label: "ERC20 Token Address",
            validator: is_valid_eth_address
        },
        orderIds: {
            label: "Order IDs (comma, separated)",
            type: "array",
            separator: ",",
            output: "string"
        }
    }
}

export const methods = {
    setup: {
        fields: {}
    },
    deposit: {
        types: Object.keys(types),
        fields: {
            base: true,
            additional: ["amount"],
            include_type: true
        }
    },
    prepareWithdrawal: {
        types: Object.keys(types),
        fields: {
            base: true,
            additional: ["amount"],
            include_type: true
        }
    },
    completeWithdrawal: {
        types: Object.keys(types),
        fields: {
            base: true,
            include_type: true
        }
    },
    transfer: {
        types: Object.keys(types),
        fields: {
            base: true,
            additional: ["amount", "toAddress"],
            include_type: true
        }
    },
    sell: {
        types: ["ERC721"],
        fields: {
            base: true,
            optional: ["amount", "currencyAddress"],
            force_fields: true
        }
    },
    buy: {
        fields: {
            additional: ["orderIds"]
        }
    }
}

export const extractInputs = (method, type = false)=>{
    const _f = methods[method]
    let _fields = []
    for(let [k, v] of Object.entries(_f.fields)){
        if(type && k === "base" && v){
            _fields.push(
                ...Object.entries(
                    fields.base[type]).map(
                        ([k1, v1]) => {
                            return { key: k1, options: v1}
                        }
                    )
            )
            continue
        }

        if(["additional", "optional"].includes(k)){
            for(let field of v){
                let f = {...fields.additional[field], optional: k === "optional" }
                if(!f.types){
                    _fields.push({key: field, options: f})
                    continue
                }
                if(_f.fields.force_fields){
                    _fields.push({key: field, options: f})
                    continue
                }
                if(!f.types.includes(type)) continue
                _fields.push({key: field, options: f})
            }
        }
    }

    return _fields
}

export const getFields = (method, type = false)=>{
    const _f = methods[method]
    if(!_f.types) return extractInputs(method)

    type = type || _f.types[0]
    return [{key: 'type', ignore: !_f.fields.include_type,  options: { label: "Token Type", type: "select", children: _f.types, selected: type }}, ...extractInputs(method, type)]
}