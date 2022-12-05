<script>
    export let field_config, payload, parent

    import { get_payload } from "src/fields";
    import Fields from "./Fields.svelte";
    import Label from "./Label.svelte";

    payload = get_payload(field_config)
</script>

<Label click={false} label={field_config.label} optional={field_config.optional}>
    {#each Object.entries(field_config.fields || {}) as [key, field] (key)}
        <Fields parent={{parent, payload}} bind:payload={payload[key]} field_config={field} />
    {/each}
</Label>