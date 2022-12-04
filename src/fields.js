import { is_number, is_integer, is_valid_eth_address, is_positive_integer } from "./validators"

export const types = {
    ETH: "ETH",
    ERC20: "ERC20",
    ERC721: "ERC721"
}

/**
 * 
 * Default field_type: primitive value (Input.svelte -> text <input>) [object, array]
 * Default result_type: primitive value ("" -> empty string) [constant, select, multiselect, checkbox]
 * 
 */

const field = (obj, overwrite = {}) => ({...obj, ...overwrite})

const common_fields = {
    all_types: {
        label: "Token type",
        field_type: "select",
        options: Object.keys(types).map(v => ({ label: v, value: v }))
    },
    currency_type: {
        label:"Currency type",
        field_type: "select",
        options: [
            { label: "ETH", value: "ETH" },
            { label: "ERC20", value: "ERC20" }
        ]
    },
    toAddress: {
        label: "Recipient",
        validator: is_valid_eth_address
    },
    fees: {
        max: 5,
        optional: true,
        result_type: "array",
        label: "Fees",
        fields: {
            fee: {
                result_type: "object",
                fields: {
                    recipient: {
                        label: "Fee recipient",
                        validator: is_valid_eth_address
                    },
                    percentage: {
                        label: "Fee percentage",
                        validator: is_number
                    }
                }
            }
        }
    }
}

const type_fields = {
    tokenId: {
        label: "Token ID",
        include: ({ type }, { type: current_type } = {}) => types.ERC721 === (current_type || type),
        validator: is_positive_integer
    },
    tokenAddress: {
        label: "Token Address",
        include: ({ type }, { type: current_type } = {}) => [types.ERC721, types.ERC20].includes(current_type || type),
        validator: is_valid_eth_address
    },
    symbol: {
        label: "Token Symbol",
        include: ({ type }, { type: current_type } = {}) => types.ERC20 === (current_type || type),
    },
    amount: {
        label: "Amount",
        include: ({ type }, { type: current_type } = {}) => [types.ETH, types.ERC20].includes(current_type || type),
        validator: is_positive_integer
    }
}

const fields = {
    setup: {
        setup: {
            fields: {
                providerPreference: {
                    optional: true,
                    label: "Provider",
                    field_type: "select",
                    options: [
                        { label: "Default", value: undefined },
                        { label: "None", value: "none" },
                        { label: "Metamask", value: "metamask" },
                        { label: "Magic.link", value: "magic_link" },
                        { label: "WalletConnect", value: "wallet_connect" },
                        { label: "GameStop", value: "gamestop" }
                    ]
                }
            }
        }
    },
    onramp: {
        deposit: {
            fields: {
                type: {
                    ...common_fields.all_types,
                    optional: true,
                    options: [
                        { label: "Any token", value: undefined },
                        ...common_fields.all_types.options,
                    ],
                },
                ...type_fields,
                amount: field(type_fields.amount, { optional: true })
            }
        },
        fiatToCrypto: {
            fields: {
                cryptoCurrencies: {
                    field_type: "multiselect",
                    optional: true,
                    label: "Currencies",
                    options: [
                        { label: "ETH", value: "ETH" },
                        { label: "USDC", value: "USDC" },
                        { label: "IMX (mainnet only)", value: "IMX" },
                        { label: "GODS (mainnet only)", value: "GODS" }
                    ]
                }
            }
        }
    },
    offramp: {
        prepareWithdrawal: {
            fields: {
                type: common_fields.all_types,
                ...type_fields
            }
        },
        completeWithdrawal: {
            fields: {
                type: common_fields.all_types,
                ...(Object.fromEntries(Object.entries(type_fields).filter(([k]) => k !== "amount")))
            }
        },
        cryptoToFiat: {
            fields: {
                cryptoCurrencies: {
                    field_type: "multiselect",
                    optional: true,
                    label: "Currencies",
                    options: [
                        { label: "ETH", value: "ETH" },
                    ]
                }
            }
        }
    },
    orders: {
        sell: {
            fields: {
                currency_type: field(common_fields.currency_type, { ignore: true }),
                amount: field(type_fields.amount, { include: true, optional: true}),
                type: {
                    value: "ERC721",
                    ignore: true,
                    field_type: "constant"
                },
                currencyAddress: {
                    label: "ERC20 address",
                    include: ({ currency_type }) => currency_type === types.ERC20,
                    validator: is_valid_eth_address
                },
                ...type_fields,
                fees: common_fields.fees
            }
        },
        cancel: {
            fields: {
                orderId: {
                    label: "Order ID",
                    validator: is_positive_integer
                }
            }
        },
        buy: {
            fields: {
                orderIds: {
                    label: "Order IDs",
                    result_type: "array",
                    fields: {
                        orderId: {
                            label: "Order ID",
                            validator: is_integer
                        }
                    }
                },
                fees: common_fields.fees
            }
        }
    },
    offers: {
        makeOffer: {
            networks: [], // alternative to disabled: true, allows method to be selected, but can't be called
            fields: {
                type: {
                    field_type: "constant",
                    value: "ERC721"
                },
                ...type_fields,
                amount: field(type_fields.amount, { include: true }),
                currencyAddress: {
                    label: "ERC20 address",
                    validator: is_valid_eth_address
                }   
            }
        },
        cancelOffer: {
            networks: [], // alternative to disabled: true, allows method to be selected, but can't be called
            fields: {
                orderId: {
                    label: "Order ID"
                }
            }
        },
        acceptOffer: {
            networks: [], // alternative to disabled: true, allows method to be selected, but can't be called
            fields: {
                orderId: {
                    label: "Order ID"
                }
            }
        }
    },
    primarySale: {
        nftCheckoutPrimary: {
            fields: {
                sellerWalletAddress: common_fields.toAddress,
                contractAddress: field(type_fields.tokenAddress, { include: true }),
                offerId: {
                    label: "Offer ID"
                }
            }
        }
    },
    transfer: {
        transfer: {
            result_type: "array",
            label: "Tokens",
            fields: {
                token: {
                    result_type: "object",
                    fields: {
                        toAddress: common_fields.toAddress,
                        type: common_fields.all_types,
                        ...type_fields
                    }
                }
            }
        },
        batchNftTransfer: {
            result_type: "array",
            label: "NFTs",
            fields: {
                token: {
                    result_type: "object",
                    fields: {
                        toAddress: common_fields.toAddress,
                        type: {
                            label: "Token type",
                            value: "ERC721",
                            field_type: "constant"
                        },
                        ...type_fields
                    }
                }
            }
        }
    },
    transactions: {
        history: {}
    },
    wallet: {
        sign: {
            fields: {
                message: {
                    label: "Message to sign"
                },
                description: {
                    label: "Description"
                }
            }
        },
        getPublicKey: {},
    }
}

const all_fields = Object.values(fields).reduce((dict, v) => ({...dict, ...v}), {})

export const get_fields = key => ({result_type: "object", ...all_fields[key]})
export const get_method_groups = () => Object.entries(fields)
export const get_all_methods = () => all_fields

export const get_payload = ({ result_type, field_type }) => {
    if(!result_type && !field_type) return ""
    if(result_type === "object") return {}
    if(result_type === "array") return []
    if(field_type === "multiselect") return []
    if(field_type === "checkbox") return false
    return ""
}