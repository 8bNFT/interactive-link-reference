import { Link } from '@imtbl/imx-sdk';
import { get_fields } from './fields';

export class LinkCodeGenerator{
    constructor(network) {
        this._network = network

        this.payload = {}
        this.method = ""
        this.optional = []
    }

    get url(){
        if(this.network === "mainnet") return "https://link.x.immutable.com"
        return "https://link.sandbox.x.immutable.com"
    }

    get network(){
        return this._network
    }

    set network(network){
        this._network = network === "mainnet" ? network : "sandbox"
    }

    toggle_network(){
        this.network = this.network === "mainnet" ? "sandbox": "mainnet"
        return this.network
    }

    update_payload(method, payload = {}){
        const _payload = Array.isArray(payload) ? [] : {}
        this.method = method
        this.fields = get_fields(this.method)?.fields || {}
        this.optional = Object.entries(this.fields).map(([key, value]) => value.optional ? key : null)
        this.missing = []
        for(let [key, value] of Object.entries(payload)){
            if(this.fields[key]?.ignore === true) continue
            if(value === "VALUE_NOT_SET" || (Array.isArray(value) && value.filter(v => v !== "VALUE_NOT_SET").length === 0) || (typeof v === "object" && Object.keys(v).length === 0)){
                if(this.optional.includes(key)) continue
                this.missing.push(key)
                continue
            }
            _payload[key] = value
        }
        this.payload = _payload
    }

    code(){
        return `// Import Link from IMX SDK
import { Link } from '@imtbl/imx-sdk'

// Initialize Link
let link = new Link('${this.url}')

try{
    // Call the method
    let result = await link.${this.method}(${JSON.stringify(this.payload, null, 6).replace(/\n(}|])/, "\n  $1").replace(/[^\{](\})$/, "   $1")})
    // Print the result
    console.log(result)
}catch(error){
    // Catch and print out the error
    console.error(error)
}`
    }

    async execute(){
        const method = this.method
        const missing = [...this.missing]
        const link = new Link(this.url)

        if(missing.length){
            return {
                status: "error",
                data: "Required fields missing: " + missing.join(", "),
                method
            }
        }

        try{
            return {
                status: "success",
                data: await link[method](this.payload),
                method
            }
        }catch(err){
            return {
                status: "error",
                data: err.message || JSON.stringify(err),
                method
            }
        }
    }
}