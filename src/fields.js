import { is_valid_eth_address, is_positive_integer, is_positive_number, is_lt } from "./validators"

const types = {
    ETH: "ETH",
    ERC20: "ERC20",
    ERC721: "ERC721"
}

const PLACEHOLDERS = {
    order: "129523",
    offer: "offer_1234",
    recipient: "0xc8c3d38A5DB18272D99BfD376aA74F6a070B433F",
    currency: "0xb3dfd3dfb829b394f2467f4396f39ece7818d876",
    symbol: "FCT",
    collection: "0x69b96d84d35171120940fdcf211b18292ae10e9c",
    amount: "0.0258",
    percentage: "2.25",
    token_id: "19",
    message_to_sign: "I want to log into Tools. ID: #982832902",
    message_description: "Sign this message to authenticate on Tools."
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
        validator: is_valid_eth_address,
        placeholder: PLACEHOLDERS.recipient
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
                        validator: is_valid_eth_address,
                        placeholder: PLACEHOLDERS.recipient
                    },
                    percentage: {
                        label: "Fee percentage",
                        validator: v => {
                            const { error } = is_positive_number(v)
                            if(error) return { error }
                            const { error: more_than_100, sanitized } = is_lt(v, "100")
                            if(more_than_100) return { error: more_than_100 }

                            return {
                                sanitized
                            }
                        },
                        placeholder: PLACEHOLDERS.percentage
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
        validator: is_positive_integer,
        placeholder: PLACEHOLDERS.token_id
    },
    tokenAddress: {
        label: "Token Address",
        include: ({ type }, { type: current_type } = {}) => [types.ERC721, types.ERC20].includes(current_type || type),
        validator: is_valid_eth_address,
        placeholder: PLACEHOLDERS.collection
    },
    symbol: {
        label: "Token Symbol",
        include: ({ type }, { type: current_type } = {}) => types.ERC20 === (current_type || type),
        placeholder: PLACEHOLDERS.symbol
    },
    amount: {
        label: "Amount",
        include: ({ type }, { type: current_type } = {}) => [types.ETH, types.ERC20].includes(current_type || type),
        validator: is_positive_number,
        placeholder: PLACEHOLDERS.amount
    }
}

const fields = {
    initialize: {
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
                tokenId: field(type_fields.tokenId, { include: true }),
                tokenAddress: field(type_fields.tokenAddress, { include: true }),
                currency_type: field(common_fields.currency_type, { include: true, ignore: true }),
                currencyAddress: {
                    label: "ERC20 address",
                    include: ({ currency_type }) => currency_type === types.ERC20,
                    validator: is_valid_eth_address,
                    placeholder: PLACEHOLDERS.currency
                },
                amount: field(type_fields.amount, { include: true, optional: true }),
                fees: common_fields.fees
            }
        },
        cancel: {
            fields: {
                orderId: {
                    label: "Order ID",
                    validator: is_positive_integer,
                    placeholder: PLACEHOLDERS.order
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
                            validator: is_positive_integer,
                            placeholder: PLACEHOLDERS.order
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
                    validator: is_valid_eth_address,
                    optional: true,
                    placeholder: PLACEHOLDERS.currency
                }   
            }
        },
        cancelOffer: {
            networks: [], // alternative to disabled: true, allows method to be selected, but can't be called
            fields: {
                orderId: {
                    label: "Order ID",
                    placeholder: PLACEHOLDERS.order
                }
            }
        },
        acceptOffer: {
            networks: [], // alternative to disabled: true, allows method to be selected, but can't be called
            fields: {
                orderId: {
                    label: "Order ID",
                    placeholder: PLACEHOLDERS.order
                }
            }
        }
    },
    nftCheckout: {
        nftCheckoutPrimary: {
            fields: {
                sellerWalletAddress: common_fields.toAddress,
                contractAddress: field(type_fields.tokenAddress, { include: true }),
                offerId: {
                    label: "Offer ID",
                    placeholder: PLACEHOLDERS.offer
                }
            }
        }
    },
    transfers: {
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
                    label: "Message to sign",
                    placeholder: PLACEHOLDERS.message_to_sign
                },
                description: {
                    label: "Description",
                    placeholder: PLACEHOLDERS.message_description
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