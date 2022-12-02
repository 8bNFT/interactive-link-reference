<script>
    export let fields, parent, payload
    import { get_payload } from "src/fields";
    import ArrayFields from "./ArrayFields.svelte";
    import Input from "./Input.svelte";
    import ObjectFields from "./ObjectFields.svelte";

    let parsed_fields = fields
    payload = get_payload(parsed_fields)

    const find_root_payload = () => {
        if(!parent) return payload
        let current_parent = parent
        let current_payload = payload

        while(current_parent?.payload){
            current_payload = current_parent.payload
            current_parent = current_parent.parent
        }

        return current_payload
    }

    const filter_fields = () => {
        if(!fields.fields) return
        const new_fields = {}
        const parent_payload = find_root_payload()
        for(let [key, field] of Object.entries(fields.fields)){
            if(!field.include || field.include === true){
                new_fields[key] = field
                continue
            }

            if(!field.include(parent_payload)) continue
            new_fields[key] = field
        }

        if(parsed_fields.result_type === "object") payload = Object.fromEntries(Object.entries(payload).filter(([k]) => k in new_fields))

        parsed_fields = {
            ...fields,
            fields: new_fields
        }
    }

    $: payload, fields, filter_fields()
</script>

{#if parsed_fields.result_type === "object"}
    <ObjectFields bind:payload fields={parsed_fields} /> 
{:else if parsed_fields.result_type === "array"}
    <ArrayFields bind:payload fields={parsed_fields} />
{:else}
    {parsed_fields.label}
    <Input bind:value={payload} validator={parsed_fields.validator} />
    <br />
{/if}