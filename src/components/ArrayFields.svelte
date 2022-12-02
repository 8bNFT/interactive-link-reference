<script>
    export let fields, payload, parent

    import { get_payload } from "src/fields";
    import Fields from "./Fields.svelte";

    payload = get_payload(fields)
    let current_fields = []

    const remove_field = index => {
        payload = [...payload.slice(0, index), ...payload.slice(index + 1)]
        current_fields = [...current_fields.slice(0, index), ...current_fields.slice(index + 1)] 
    }
</script>


{#each current_fields as field, index (index)}
    <br>
    <Fields parent={{parent, fields, payload}} bind:payload={payload[index]} fields={field} />
    <button on:click={() => remove_field(index)}>Remove</button>
{/each}
{#each Object.entries(fields.fields || {}) as [field, config]}
    <button on:click={() => current_fields = [...current_fields, config]}>Add {field}</button>
{/each}