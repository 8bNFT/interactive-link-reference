import { Link } from '@imtbl/imx-sdk';

export class LinkCodeGenerator{
    constructor(network) {
        this.network = network
        this.payload_store = {}
    }

    get url(){
        if(this.network === "mainnet") return "https://link.x.immutable.com"
        return "https://link.sandbox.x.immutable.com"
    }

    set network(network){
        this.network = network === "mainnet" ? network : "sandbox"
    }

    toggleNetwork(){
        this.network = this.network === "mainnet" ? "sandbox": "mainnet"
    }

    payload(payload){

    }

    code(method, payload){
        return `// Import Link from IMX SDK
import { Link } from '@imtbl/imx-sdk'

// Initialize Link
let link = new Link('${this.url}')

try{
    // Call the method
    let result = await link.${method}(${JSON.stringify(this.payload(payload), null, 4).replace(/\n(}|])/, "\n  $1")})
    // Print the result
    console.log(result)
}catch(error){
    // Catch and print out the error
    console.error(error)
}`
    }

    execute(method, payload){
        const link = new Link(this.url)

        try{
            return {
                status: "success",
                data: await link[method](this.payload(payload))
            }
        }catch(err){
            return {
                status: "error",
                data: err.message || JSON.stringify(err)
            }
        }
    }
}