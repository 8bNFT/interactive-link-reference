import { is_number, is_integer, is_valid_eth_address } from "./validators"

export const types = {
    ETH: "ETH",
    ERC20: "ERC20",
    ERC721: "ERC721"
}

const methodFields = {
    fiatToCrypto: {
        cryptoCurrencies: {
            label: "Available currencies",
            type: "checkbox",
            options: [
                { label: "ETH", value: "ETH" },
                { label: "USDC", value: "USDC" },
                { label: "IMX (mainnet only)", value: "IMX" },
                { label: "GODS (mainnet only)", value: "GODS" }
            ]
        }
    },
    cryptoToFiat: {
        cryptoCurrencies: {
            label: "Available currencies",
            type: "checkbox",
            options: [
                { label: "ETH", value: "ETH" }
            ]
        }
    }
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
        },
        orderId: {
            label: "Order ID",
            validator: is_integer
        },
        providerPreference: {
            label: "Provider Preference",
            type: "select",
            options: [
                { label: "Default", value: undefined },
                { label: "None", value: "none" },
                { label: "Metamask", value: "metamask" },
                { label: "Magic.link", value: "magic_link" },
                { label: "WalletConnect", value: "wallet_connect" },
                { label: "GameStop", value: "gamestop" }
            ]
        },
        message: {
            label: "Message to sign",
        },
        description: {
            label: "Description"
        }
    }
}

export const methods = {
    setup: {
        fields: {
            optional: ["providerPreference"]
        }
    },
    deposit: {
        types: Object.keys(types),
        fields: {
            base: true,
            additional: ["amount"],
            include_type: true
        }
    },
    fiatToCrypto: {
        fields: {
            optional: ["cryptoCurrencies"]
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
    cryptoToFiat: {
        fields: {
            optional: ["cryptoCurrencies"]
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
    cancel: {
        fields: {
            additional: ["orderId"]
        }
    },
    buy: {
        fields: {
            additional: ["orderIds"]
        }
    },
    history: {
        fields: {}
    },
    sign: {
        fields: {
            additional: ["message", "description"]
        }
    },
    getPublicKey: {
        fields: {}
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
                let f = {...(methodFields[method] && methodFields[method][field] || fields.additional[field]), optional: k === "optional" }
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