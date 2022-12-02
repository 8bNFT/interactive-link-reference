<script>
    export let fields, payload, parent

    import { get_payload } from "src/fields";
    import Fields from "./Fields.svelte";

    payload = get_payload(fields)
</script>


{#each Object.entries(fields.fields || {}) as [key, fields]}
    <Fields parent={{parent, fields, payload}} bind:payload={payload[key]} fields={fields} />
{/each}