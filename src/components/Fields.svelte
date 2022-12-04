<script>
    export let field_config, parent, payload
    import { get_payload } from "src/fields";
    import ArrayFields from "./ArrayFields.svelte";
    import Checkbox from "./Checkbox.svelte";
    import Constant from "./Constant.svelte";
    import Input from "./Input.svelte";
    import MultiSelect from "./MultiSelect.svelte";
    import ObjectFields from "./ObjectFields.svelte";
    import Select from "./Select.svelte";

    let parsed_field = field_config
    payload = get_payload(parsed_field)

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
        if(!field_config.fields || !payload) return
        const new_fields = {}
        const parent_payload = find_root_payload()

        for(let [key, field] of Object.entries(field_config.fields)){
            if(!field.include || field.include === true){
                new_fields[key] = field
                continue
            }

            if(!field.include(parent_payload, payload)) continue
            new_fields[key] = field
        }

        if(parsed_field.result_type === "object"){
            const new_payload = Object.fromEntries(Object.entries(payload).filter(([k]) => k in new_fields))
            if(JSON.stringify(new_payload) !== JSON.stringify(payload)) payload = new_payload
        }

        parsed_field = {
            ...field_config,
            fields: new_fields
        }
    }

    $: payload, field_config, filter_fields()
</script>

{#if parsed_field.result_type === "object"}
    <ObjectFields bind:payload field_config={parsed_field} /> 
{:else if parsed_field.result_type === "array"}
    <ArrayFields bind:payload field_config={parsed_field} />
{:else}
    {#if parsed_field.field_type === "multiselect"}
        <MultiSelect bind:payload field={parsed_field} />
    {:else if parsed_field.field_type === "checkbox"}
        <Checkbox bind:value={payload} field={parsed_field} />
    {:else if parsed_field.field_type === "select"}
        <Select bind:value={payload} field={parsed_field} />
    {:else if parsed_field.field_type === "constant"}
        <Constant bind:value={payload} field={parsed_field} />
    {:else}
        <Input bind:value={payload} field={parsed_field} />
    {/if}
{/if}