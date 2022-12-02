import { is_number, is_integer, is_valid_eth_address } from "./validators"

export const types = {
    ETH: "ETH",
    ERC20: "ERC20",
    ERC721: "ERC721"
}

const common_fields = {
    type: {
        label: "Token type",
        type: "select",
        options: Object.keys(types).map(v => ({ label: v, value: v }))
    }
}

const type_fields = {
    tokenId: {
        label: "Token ID",
        include: ({ type }) => types.ERC721 === type,
        validator: is_integer
    },
    tokenAddress: {
        label: "Token (Collection) Address",
        include: ({ type }) => [types.ERC721, types.ERC20].includes(type),
        validator: is_valid_eth_address
    },
    symbol: {
        label: "Token Symbol",
        include: ({ type }) => types.ERC20 === type,
    },
    amount: {
        label: "Amount",
        include: ({ type }) => [types.ETH, types.ERC20].includes(type),
        validator: is_number
    }
}

const fields = {
    sell: {
        result_type: "object",
        fields: {
            type: common_fields.type,
            ...type_fields,
        }
    },
    buy: {
        result_type: "object",
        fields: {
            orderIds: {
                result_type: "array",
                fields: {
                    orderId: {
                        label: "Order ID",
                        validator: is_integer
                    },
                    fee: {
                        result_type: "object",
                        fields: {
                            amount: {
                                ...type_fields.amount,
                                include: true
                            },
                            receiver: {
                                ...type_fields.amount,
                                include: true,
                                label: "Receiver"
                            }
                        }
                    }
                }
            }
        }
    }
}

export const get_fields = key => fields[key]

export const get_payload = ({ result_type }) => {
    if(!result_type) return ""
    if(result_type === "object") return {}
    if(result_type === "array") return []
    return ""
}